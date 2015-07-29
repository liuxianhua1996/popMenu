(function($) {
	require(['js/popMenu'], function(popMenu) {
		$(document).ready(function() {
			$("#content").html(popMenu.popMenu_V.render().$el);
			popMenu.popMenu_V.setParent($("#content"));
			popMenu.popMenu_C.add({
				context: "这条消息会在8秒后消失"
			});
			setTimeout(function() {
				popMenu.popMenu_C.add({
					context: "这条消息会在9秒后消失"
				});
			}, 1000);
			setTimeout(function() {
				popMenu.popMenu_C.add({
					context: "这条消息会先隐藏,后显示"
				});
			}, 2000);
			setTimeout(function() {
				popMenu.popMenu_C.add({
					context: "这条消息会先隐藏,后显示"
				});
			}, 9000);
			setTimeout(function() {
				popMenu.popMenu_C.add({
					context: "这条消息会先隐藏,后显示"
				});
			}, 10000);
		})
	})
})(jQuery)