# 142428525.github.io
我不知道这是什么QwQ

好吧好吧，其实这是一个奇奇怪怪的东西，主要是 ~~Blog或者什么别的整活玩意~~ 现在只剩整活玩意了！

~~你看就知道了，我还整这`README.md`有什么用~~ 233（尬笑）
# 注记
## `layout`变量
- `layout: MGE`只应当在`./MGE/`下使用
- `layout: news`只应当在`./news/`下使用
- `layout: MGE_style`不作限制
## magic numbers
### `layout: MGE`
- `a1` bool，是否激活第1个导航链接框（主页）
- `a2` bool，是否激活第3个导航链接框（联系）
- `a3` bool，是否激活第4个导航链接框（关于）
### `layout: news`
- `a1` bool，是否激活第1个导航链接框（主页）
- `a2` bool，是否激活第3个导航链接框（特辑）
## `tags`变量
为了方便`./special`抓取对应页面的列表，每个`site.pages`中的内容页面**必须**设置`tags`变量

无序列表子节点表示填写时需带上父节点
- `MGE`标记了`./MGE/`下的页面
- `news`同上
- `test`标记了所有未完工页面
- `???` ???
# TODO
- 给页面加上tags显示
- 多加点tag
- ???
