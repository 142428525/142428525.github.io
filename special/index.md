---
title: 特殊
description: 此处不完全收录了一些对不完全所有页面进行的不完全自动统计
tags: test
---
点<a href="..">我</a>返回首页

最后更新于{{site.time | date: "%Y-%m-%d %H:%M:%S"}}。
## 孤立页面
### ./
- [404]({{"404" | absolute_url}})
- [ex-index]({{"ex-index" | absolute_url}})

### ./news/
- [all_touhou_festivals]({{"news/all_touhou_festivals" | absolute_url}})
- [bible]({{"news/bible" | absolute_url}})
- [countdown]({{"news/countdown" | absolute_url}})
- [test]({{"news/test" | absolute_url}})
- [touhou_festivals]({{"news/touhou_festivals" | absolute_url}})

## ex-系列旧页面
~~内容一样~~ 在被新页面替代后停止更新的，原来的纯html页面。此列表不收录暂无新页面替代的旧页面。

现在的新页面是Jekyll使用markdown套html模板生成的页面。
### ./MGE/
- [ex-about]({{"MGE/ex-about" | absolute_url}})
- [ex-contact]({{"MGE/ex-contact" | absolute_url}})
- [ex-index]({{"MGE/ex-index" | absolute_url}})

### ./news/
- [ex-index]({{"news/ex-index" | absolute_url}})
- [ex-like]({{"news/ex-like" | absolute_url}})

以上为手打列表。

***

以下为自动生成列表。
## 施工中
筛选`page.tags`变量中存在test的页面。
{% assign test_pages = site.pages | where_exp:"page","page.tags contains 'test'" %}
{% for test_page in test_pages %}
- [{{test_page.title}}]({{test_page.url}})
{% endfor %}
