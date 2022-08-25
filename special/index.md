---
title: 特殊
description: 此处不完全收录了一些对不完全所有页面进行的不完全自动统计
tags: test
---
点<a href="..">我</a>返回首页

***

最后更新于{{site.time | date: "%Y-%m-%d %H:%M:%S"}}。
## 孤立页面
### /
- [404]({{"404" | absolute_url}})
- [ex-index]({{"ex-index" | absolute_url}})

### /news/
- [all_touhou_festivals]({{"news/all_touhou_festivals" | absolute_url}})
- [bible]({{"news/bible" | absolute_url}})
- [countdown]({{"news/countdown" | absolute_url}})
- [test]({{"news/test" | absolute_url}})
- [touhou_festivals]({{"news/touhou_festivals" | absolute_url}})

***

以下为自动生成列表。
## 施工中
{% assign test_pages = site.pages | where_exp:"page","page.tags contains 'test'" %}
{% for test_page in test_pages %}
- [{{test_page.title}}]({{test_page.url}})
{% endfor %}
