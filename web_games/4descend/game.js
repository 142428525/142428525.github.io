"use strict";



//global def forward

const PIECE_STAT =
{
    EMPTY: 0,
    SIDE_A: 1,
    SIDE_B: 2
};
Object.freeze(PIECE_STAT);



//class def

let LCheck = class LogicalCheck
{
    constructor(x, y)
    {
        index_bound_secure(x, y);
        
        this.x = x;
        this.y = y;
        this.has_mana_plant = false;
        this.piece_stat = PIECE_STAT.EMPTY;
    }
    
    get_r_check()
    {
        return r_check_access(this.x, this.y);
    }
};

class BoardMap
{
    constructor(size)
    {
        this._map = new Array();
        for (let i = 0; i < size; i++)
        {
            this._map[i] = new Array();
            for (let j = 0; j < size; j++)
            {
                this._map[i][j] = new LCheck(j, i);
            }
        }
    }
    
    access(x, y)
    {
        index_bound_secure(x, y);
        return this._map[y][x];
    }
}

class PlayerStat
{
    constructor(hp_max, side)
    {
        this.hp_max = hp_max;
        this.hp = hp_max;
        this.side = side;
        this.side_name = this.side === PIECE_STAT.SIDE_A ? "side-A" : "side-B";
        this.timer_cnt = 0;
        this.timer = null;
    }

    get_r_color()
    {
        return document.getElementById(this.side_name + " color");
    }
    
    get_r_hp()
    {
        return document.getElementById(this.side_name + " HP");
    }
    
    get_r_timer()
    {
        return document.getElementById(this.side_name + " timer");
    }
    
    get_r_descend()
    {
        return document.getElementById(this.side_name + " descend");
    }
    
    start_timer()
    {
        r_stat_enable(this.get_r_timer());
        
        let tmp = this;
        this.timer = setInterval(() =>
        {
            let sec = tmp.timer_cnt % 60;
            let min = Math.floor(tmp.timer_cnt / 60);
            
            tmp.get_r_timer().innerHTML = `${min >= 10 ? min : "0" + min}:${sec >= 10 ? sec : "0" + sec}`;
            tmp.timer_cnt++;
        }, 1000);
    }
    
    stop_timer()
    {
        clearInterval(this.timer);
        this.timer = null;
        this.timer_cnt = 0;
        this.get_r_timer().innerHTML = "00:00";
        
        r_stat_disable(this.get_r_timer());
    }
    
    damage(x)
    {
        //
        if (x > 0) {
            console.log(`${this.side_name} with damage: ${x}`)
        }
        //

        this.hp -= x;
        if (this.hp <= 0) {
            this.hp = 0;
            this.get_r_hp().innerHTML = "◇".repeat(this.hp_max) + `&nbsp;&nbsp;0/${this.hp_max}`;

            alert(this.side_name + " failed!");
            window.location.replace(window.location.href.replace("play.html", "index.html"));
        }

        this.get_r_hp().innerHTML = "◆".repeat(this.hp) + "◇".repeat(this.hp_max - this.hp) + `&nbsp;&nbsp;${this.hp}/${this.hp_max}`;
    }
}

class DescendInfo
{
    constructor(dsubject, dpieces)
    {
        this.subject = dsubject;
        this.pieces = dpieces;
        this.is_interrupted = false;
    }

    get_damage()
    {
        let mana_plant_cnt = 0;
        for (const l_check of this.pieces) {
            if (l_check.has_mana_plant) {
                mana_plant_cnt++;
            }
        }
        return this.pieces.length - (this.is_interrupted ? 1 : 0) + mana_plant_cnt;
    }
}

class Queue
{
    constructor() {
        this._data = new Array();
    }
    
    push(a) {
        this._data.push(a);
    }
    
    pop(a) {
        return this._data.shift(a);
    }
    
    head() {
        return this._data[0];
    }
    
    tail() {
        return this._data.at(-1);
    }
    
    clear() {
        this._data = new Array();
    }
    
    is_empty() {
        return this._data.length === 0;
    }
}

class Players
{
    constructor(hp_max)
    {
        this._players = [new PlayerStat(hp_max, PIECE_STAT.SIDE_A), new PlayerStat(hp_max, PIECE_STAT.SIDE_B)];
        this._descend_queue = new Queue();
        
        for (let player of this._players)
        {
            player.damage(0); //for init
        }
    }
    
    access(pstat)
    {
        return pstat === PIECE_STAT.SIDE_A ? this._players[0] : this._players[1];
    }
    
    access_inv(pstat)
    {
        return pstat === PIECE_STAT.SIDE_A ? this._players[1] : this._players[0];
    }
    
    invoke_descend(dsubject, dpieces)
    {
        let is_attacking = this._descend_queue.is_empty();
        this._descend_queue.push(new DescendInfo(dsubject, dpieces));
        this.access(dsubject).get_r_descend().innerHTML = is_attacking ? "攻" : "守";

        if (!is_attacking) {
            let tmp = this;
            setTimeout(() => { tmp.finish_descend(dsubject); }, 500);
        }
    }

    can_interrupt_descend(l_check)
    {
        return !this._descend_queue.is_empty() && this._descend_queue.head().pieces.includes(l_check);
    }
    
    interrupt_descend(dsubject)
    {
        this._descend_queue.tail().is_interrupted = true;
        this.access_inv(dsubject).get_r_descend().innerHTML = "断";

        let tmp = this;
        setTimeout(() => { tmp.finish_descend(dsubject); }, 500);
    }
    
    finish_descend(dsubject)
    {
        if (this._descend_queue.is_empty()) {
            return;
        }

        //damage logic
        let result = 0;
        let attack_damage = this._descend_queue.head().get_damage();
        if (this._descend_queue.head() !== this._descend_queue.tail()) {
            let defend_damage = this._descend_queue.tail().get_damage();
            result = attack_damage - defend_damage;
        }
        else
        {
            result = attack_damage;
        }
        
        if (result >= 0) {
            this.access(dsubject).damage(result);
        }
        else
        {
            this.access_inv(dsubject).damage(Math.abs(result));
        }

        for (const info of [this._descend_queue.head(), this._descend_queue.tail()]) {
            for (const l_check of info.pieces) {
                r_check_undraw(l_check.get_r_check());

                l_check.has_mana_plant = false;
                r_check_unplant(l_check.get_r_check());
            }
        }
        this._descend_queue.clear();
        this.access(dsubject).get_r_descend().innerHTML = "否";
        this.access_inv(dsubject).get_r_descend().innerHTML = "否";

        let plant_x = getRandomIntInclusive(0, SIZE);
        let plant_y = getRandomIntInclusive(0, SIZE);
        MAP.access(plant_x, plant_y).has_mana_plant = true;
        r_check_plant(r_check_access(plant_x, plant_y));
    }
}



//global def

const size_str = getQueryString("size");
const hp_max_str = getQueryString("hp_max");
const SIZE = parseInt(size_str === null || size_str === "" ? "9" : size_str);
const HP_MAX = parseInt(hp_max_str === null || hp_max_str === "" ? "6" : hp_max_str);
if (HP_MAX <= 0) {
    alert("shabi guna");
    window.location.replace(window.location.href.replace("play.html", "index.html"));
}

const MAP = new BoardMap(SIZE);

const BOARD = document.getElementById("board");

const PLAYERS = new Players(HP_MAX);

let current_emplacer = flip_coin(PIECE_STAT.SIDE_A, PIECE_STAT.SIDE_B); //choose the first emplacer's side
const BLACK = current_emplacer;
const WHITE = BLACK === PIECE_STAT.SIDE_A ? PIECE_STAT.SIDE_B : PIECE_STAT.SIDE_A;



//main body starts from here

BOARD.style.gridTemplateColumns = "auto ".repeat(SIZE).trim();

for (let i = 0; i < SIZE * SIZE; i++)
{
    let check = document.createElement("div"); //check指棋盘格
    reset_class(check, "grid-item");
    BOARD.appendChild(check);
    
    let x = i % SIZE;
    let y = Math.floor(i / SIZE);
    check.id = get_r_check_id(x, y);
    
    let contents = document.createElement("div");
    reset_class(contents, "check-contents");
    check.appendChild(contents);
    contents.id = get_check_content_id(check, "container");
    
    function add_content(name)
    {
        let content = document.createElement("div");
        reset_class(content, "check-content");
        contents.appendChild(content);
        content.id = get_check_content_id(check, name);
    }
    
    //contents start from here
    add_content("mana_plant");
    add_content("highlight");
    add_content("piece");
    //contents end by here
    
    check.onclick = function () {
        check_click_callback(this, MAP.access(x, y));
    };
    check.onmouseover = function () {
        if (MAP.access(x, y).piece_stat != PIECE_STAT.EMPTY) { return; }
        r_check_focus(this);
    };
    check.onmouseout = function () {
        if (MAP.access(x, y).piece_stat != PIECE_STAT.EMPTY) { return; }
        r_check_unfocus(this);
    };
    
    //
    
    //
}

PLAYERS.access(BLACK).start_timer();
PLAYERS.access(BLACK).get_r_color().innerHTML = "先手执黑";
PLAYERS.access(WHITE).stop_timer();
PLAYERS.access(WHITE).get_r_color().innerHTML = "后手执白";



//

//



function resize_callback() {
    //
    //log(document.getElementById("side-A").clientWidth);
    //
    
    let elems = document.getElementsByClassName("delegated-size");
    let width_min = 0;
    for (const sub_elem of elems[0].children[0].children) { //取一个样本
        width_min = Math.max(width_min, sub_elem.clientWidth);
    }
    for (const elem of elems) {
        elem.style.minWidth = `calc(${width_min}px + 4 * var(--whitespace))`;
    }

    let ud = document.getElementById("side-A").offsetLeft == document.getElementById("side-B").offsetLeft;
    let lr = document.getElementById("side-A").offsetTop == document.getElementById("side-B").offsetTop;

    for (let elem of elems) {
        //这个style设置内联样式，置空则回落到css
        elem.style.width = (ud || lr) && width_min * 2 + BOARD.clientWidth < 0.875 * innerWidth ? "" : "100%";
    }
}
resize_callback();

function check_click_callback(check, l_check)
{
    if (l_check.piece_stat != PIECE_STAT.EMPTY)
    {
        return;
    }
    
    let x = l_check.x;
    let y = l_check.y;
    
    //
    //log("" + x + " " + y);
    //
    
    r_check_draw(check);
    r_check_unfocus(check);
    
    l_check.piece_stat = current_emplacer;
    
    //helpers below
    let mapping = {
        "0": (i, d) => { return i; },
        "1": (i, d) => { return i + d; },
        "-1": (i, d) => { return i - d; }
    };
    
    let MG = class MappingGroup {
        constructor(a, b) {
            this.mns = {
                x: mapping[-a],
                y: mapping[-b]
            };
            this.pst = {
                x: mapping[a],
                y: mapping[b]
            };
        }
    };
    
    let MGs = {
        x: new MG(1, 0),
        y: new MG(0, 1),
        xy: new MG(1, 1),
        yx: new MG(1, -1)
    };
    
    class ArrayPair {
        constructor() {
            this.mns = new Array();
            this.pst = new Array();
        }
        
        apply(mg, d) {
            try {
                this.mns.push(MAP.access(mg.mns.x(x, d), mg.mns.y(y, d)));
            } catch (e) {}
            
            try {
                this.pst.push(MAP.access(mg.pst.x(x, d), mg.pst.y(y, d)));
            } catch (e) {}
        }
        
        iter(f) {
            return [f(this.mns), f(this.pst)];
        }
    }
    //helpers above
    
    let descend_pieces = new Array();
    let is_descending = false;
    
    if (window.tmp_timeouts === undefined)
    {
        window.tmp_timeouts = new Object();
    }
    let tmp_timeouts = window.tmp_timeouts;
    
    for (let key of Object.keys(MGs))
    {
        let arr_pair = new ArrayPair();
        for (let d = 1; d < 4; d++)
        {
            arr_pair.apply(MGs[key], d);
        }
        
        //iterate pieces in 2 ways
        let ret = arr_pair.iter(arr =>
        {
            let piece_num = 0;
            let neighbor_pieces = new Array();
            
            for (let l_check of arr)
            {
                if (l_check.piece_stat === current_emplacer)
                {
                    piece_num++;
                    neighbor_pieces.push(l_check);
                }
                else
                {
                    break;
                }
            }
            
            return [piece_num, neighbor_pieces];
        });
        let tot_num = ret[0][0] + ret[1][0] + 1;
        
        //
        //log(key + " ret=" + ret);
        //
        
        if (tot_num >= 4) //descend!
        {
            descend_pieces = descend_pieces.concat(ret[0][1], ret[1][1]);
            descend_pieces.push(l_check);
            is_descending = true;
        }
        else if (tot_num === 3 && !is_descending)
        {
            let arr_pair = new ArrayPair();
            
            for (let d = 0; d < SIZE; d++)
            {
                arr_pair.apply(MGs[key], d);
            }
            
            arr_pair.iter(arr =>
            {
                for (let l_check of arr)
                {
                    if (l_check.piece_stat === (current_emplacer === WHITE ? BLACK : WHITE))
                    {
                        return;
                    }
                    
                    let r_check = l_check.get_r_check();
                    r_check_highlight(r_check);
                    
                    if (typeof tmp_timeouts[r_check.id] === "number")
                    {
                        clearTimeout(tmp_timeouts[r_check.id]);
                    }
                    tmp_timeouts[r_check.id] = setTimeout(() =>
                    {
                        r_check_unhighlight(r_check);
                        delete tmp_timeouts[r_check.id];
                    }, 1500);
                }
            });
        }
    }
    
    if (PLAYERS.can_interrupt_descend(l_check))
    {
        PLAYERS.interrupt_descend(current_emplacer);
    }

    if (is_descending)
    {
        for (let l_check of descend_pieces)
        {
            l_check.piece_stat = PIECE_STAT.EMPTY;
            r_check_draw_descend(l_check.get_r_check());
        }
        
        PLAYERS.invoke_descend(current_emplacer, descend_pieces);
    }
    else
    {
        PLAYERS.finish_descend(current_emplacer);
    }
    
    PLAYERS.access(current_emplacer).stop_timer();
    
    current_emplacer = current_emplacer === WHITE ? BLACK : WHITE;
    
    PLAYERS.access(current_emplacer).start_timer();
}

function r_check_draw(check) {
    let piece = get_check_content(check, "piece");
    let color = current_emplacer === WHITE ? "#fff" : "#000";
    piece.style.backgroundImage =
    "radial-gradient(circle, " + `${color} 0, ${color} 48%, ` +
    "transparent, black 50%, black 55%, transparent 55%, transparent)";
}

function r_check_draw_descend(check) {
    let piece = get_check_content(check, "piece");
    let color = current_emplacer === WHITE ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)";
    piece.style.backgroundImage =
    "radial-gradient(circle, transparent, transparent 48%, black 48%, black 50%," +
    `${color} 50%, ${color} 55%, black 55%, black 57%, transparent 55%, transparent)`;
}

function r_check_undraw(check) {
    let piece = get_check_content(check, "piece");
    piece.style.backgroundImage = "";
}

function r_check_focus(check) {
    check.style.backgroundImage = linear_gradient("left", "rgba(255, 0, 0, 0.5)");
    check.style.backgroundSize = "50% 50%";
}

function r_check_unfocus(check) {
    check.style.backgroundImage = "";
    check.style.backgroundSize = "";
}

function r_check_highlight(check) {
    let highlight = get_check_content(check, "highlight");
    highlight.style.backgroundImage = linear_gradient("right", "rgba(255, 255, 0, 0.5)");
    highlight.style.backgroundSize = "50% 50%";
}

function r_check_unhighlight(check) {
    let highlight = get_check_content(check, "highlight");
    highlight.style.backgroundImage = "";
    highlight.style.backgroundSize = "";
}

function r_check_plant(check) {
    let plant = get_check_content(check, "mana_plant");
    plant.style.overflow = "hidden";
    plant.innerHTML = `<svg version="1.1" baseProfile="full" width="${plant.clientWidth}" height="${plant.clientHeight}" xmlns="http://www.w3.org/2000/svg"><text x="${plant.clientWidth / 2}" y="${plant.clientHeight}" font-size="${plant.clientWidth}" text-anchor="middle" fill="rgba(0, 255, 0, 0.5)">草</text></svg>`;
}

function r_check_unplant(check) {
    let plant = get_check_content(check, "mana_plant");
    plant.style.overflow = "";
    plant.innerHTML = "";
}

function r_stat_disable(stat) {
    stat.style.backgroundImage =
    "linear-gradient(to bottom right, transparent 0, transparent 45%, " +
    "red 45%, red 55%, transparent 55%, transparent)";
}

function r_stat_enable(stat) {
    stat.style.backgroundImage = "";
}

function getQueryString(name) {
    return new URL(window.location.href).searchParams.get(name);
}

function flip_coin(head, tail) {
    return Math.random() > 0.5 ? head : tail;
}

function getRandomIntInclusive(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // 包含最小值和最大值
}

function reset_class(elem, class_name) {
    let class_attr = document.createAttribute("class");
    class_attr.nodeValue = class_name;
    elem.attributes.setNamedItem(class_attr);
}

function get_r_check_id(x, y) {
    return "check " + x + " " + y;
}

function get_check_content_id(check, content) { 
    return check.id + " " + content;
}

function get_check_content(check, content) {
    return document.getElementById(get_check_content_id(check, content));
}

function r_check_access(x, y) {
    index_bound_secure(x, y);
    return document.getElementById(get_r_check_id(x,y));
}

function index_bound_secure(x, y) {
    if (x >= SIZE || x < 0 || y >= SIZE || y < 0) {
        throw "Index out of Bounds Exception";
    }
}

function log(str) {
    document.getElementById("logger").innerHTML += `<p>${str}</p><br>`;
}

function linear_gradient(orient, color) {
    return `linear-gradient(to bottom ${orient}, ${color} 0, ${color} 12.5%, ` +
        `transparent 12.5%, transparent 37.5%, ${color} 37.5%, ${color} 62.5%, ` +
        `transparent 62.5%, transparent 87.5%, ${color} 87.5%, ${color})`;
}