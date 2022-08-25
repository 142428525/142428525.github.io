---
layout: MGE_style
title: 超形上学部 - 咕霸百科全书
head_title: 超形上学部
description: 杀死我们的<a class="text" href="https://scp-wiki-cn.wikidot.com/sandrewswann-s-proposal" title="谁？你！">神</a>
head_img_href: https://142428525.github.io/image/'pataphysics.html
head_img_title: 遵循CC BY-SA 3.0协议
head_img_width: 150px
head_img_height: 150px
head_img_src: https://142428525.github.io/image/'pataphysics.svg
categories: bill baka wiki test
tags: pataphysics scp
---

hello world!
## bill
### baka
> blockquote

Don't use `#`.

CJKの显示

var:{{site.github.url}},{{site.url}},{{"image/'pataphysics.svg" | absolute_url}}

`以上，①适用范围小，不推荐    ②单独使用只能       ③很好，就是长了点，不能指定根目录，可能需要转义`

#### list:
{% for pagee in site.pages %}
- [{{pagee.title}}]({{pagee.url}})
	- {{pagee.categories}}
	- {{pagee.tags}}

{% endfor %}

#### special:
{% for pagee in site.pages | where_exp:"pageee","pageee.tags contains 'scp'" %}
- [{{pagee.title}}]({{pagee.url}})
	- {{pagee.categories}}
	- {{pagee.tags}}

{% endfor %}
