---
title: 特殊
description: 此处不完全收录了一些对不完全所有页面进行的不完全自动统计
tags: test,bill,baka
---
点<a href="..">我</a>返回首页

***

也许最后更新于{{site.time | date: "%Y-%m-%d %H:%M:%S"}}。
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

{% assign temp_tag_list_list = "," %}
{% for pagee in site.pages %}
	{% assign page_tags_str = pagee.tags | join: "," | append: "," %}
	{% assign tag_list = tag_list | append: page_tags_str %}
{% endfor %}
{% assign tag_list = tag_list | remove_first: "," %}
{% assign tag_list = tag_list | split: "" | reverse | join: ""  | remove_first: "," %}
{% assign tag_list = tag_list | split: "" | reverse | join: "" %}
{% assign tag_list = tag_list | split: "," %}
{% assign tag_list = tag_list | uniq %}
{% assign tag_list = tag_list | sort %}

<form action="">
	<p style="display:inline;">请在此处选择要筛选的tag：</p>
	<select id="tags_select">
		<option selected disabled hidden style="display:none;" value="">
		</option>
		{% for tag in tag_list %}
			{% unless tag == "" %}
		<option value="{{tag}}">{{tag}}</option>
			{% endunless %}
		{% endfor %}
	</select>
</form>

{% for tag in tag_list %}
	{% unless tag == "" %}
<div id="{{tag}}" style="display:none;">
	<h2>{{tag}}</h2>
	<p>筛选<code>page.tags</code>变量中存在{{tag}}的页面。</p>
		{% assign tag_pages = site.pages | where_exp: "page","page.tags contains tag" %}
	<ul>
		{% for tag_page in tag_pages %}
		<li><a href="{{tag_page.url}}">{{tag_page.title}}</a></li>
		{% endfor %}
	</ul>
</div>
	{% endunless %}
{% endfor %}

<script>
	var selector = document.getElementById("tags_select");
	setInterval(
	function s()
	{
		for(let i = 1; i < selector.length; i++)
		{
			var value = selector.options[i].value;
			var result = document.getElementById(value);
			if(i == selector.selectedIndex)
			{
				result.style.display = "block";
			}
			else
			{
				result.style.display = "none";
			}
		}
	},100);
</script>

{% include tags_display.md %}
