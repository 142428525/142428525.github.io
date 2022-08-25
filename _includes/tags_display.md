***

{% for tag in page.tags %}
<a href="{{'/special#' | append: {{tag}} | absolute_url}}" style="">{{tag}}</a>
{% endfor %}
