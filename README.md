# popMenu
这是一个类似bootstrap的弹出组件popover。但是能显示更多内容和拥有更多的交互。

#HTML
<div id="content"></div>

$("#content").html(popMenu.popMenu_V.render().$el);
//父元素有鼠标悬停，弹出菜单效果
popMenu.popMenu_V.setParent($("#content"));
//增加一条消息
popMenu.popMenu_C.add({	context: "这条消息会在8秒后消失"});
setTimeout(function() {
    popMenu.popMenu_C.add({
    context: "这条消息会先隐藏,后显示"
    });}, 9000);

具体事例可以看代码index.js
