(function($) {
	define(function() {
		var PopMenu_M = Backbone.Model.extend({
			initialize: function(params) {
				this.time = params.time || 8000;
				this.context = params.context || "";
			},

			setTime: function(time) {
				this.time = time < 0 ? this.time + time : time;
			},
			getTime: function() {
				return this.time;
			},
			getContext: function() {
				return this.context;
			}
		});

		var PopMenu_C = Backbone.Collection.extend({
			model: PopMenu_M,
		});

		var PopMenuItem = Backbone.View.extend({
			tagName: "li",
			initialize: function(params) {
				this.model = params;
				this.display = params.display || false;
				this.idx = params.idx || 0;
				this.bind("remove", this.fadeOut, this);
			},
			fadeOut: function() {
				this.$el.slideUp(300);
			},
			shows: function() {
				this.$el.css("display", "block");
				this.display = true;
				this.model.set({
					display: true
				});
			},
			render: function() {
				this.$el.html(this.model.getContext()).css("display", "none");
				return this;
			},
			remove: function() {
				this.trigger("remove");
			},
			reduceTime: function(time) {
				this.model.setTime(-time);
			},
			getTime: function() {
				return this.model.getTime();
			}

		});

		var PopMenuView = Backbone.View.extend({
			tagName: "div",
			className: "popMenu",
			initialize: function(param) {

				this.maxMsg = (param.maxMsg <= 0) ? 1 : param.maxMsg;
				this.msgQue = param.collection;
				this.timer = null;
				this.items = {};
				this.index = 0;
				this.hover = param.hover || false;
				this.showCnt = 0;

				this.$arrow = $("<div>").addClass("arrow");
				this.$popover = $("<ul>");
				this.$detail = $("<div>").html("...").addClass("moreDetail").hide();

				this.msgQue.bind("add", this.addMsg, this);
				this.msgQue.bind("hide", this.removeMsg, this);
				this.msgQue.bind("disappear", this.resetMsgs, this);

			},
			events: {
				"mouseenter ul": "appear",
				"mouseleave": "disappear"
			},
			setParent: function(parent) {
				if (!parent) {
					return false;
				}
				this.$parent = parent;
				this.$el.css({
					left: this.$parent.offset().left + this.$parent.width()/2 - this.$el.width()/2,
					top:this.$parent.offset().top + this.$parent.height(),
				});
				this.$parent.bind("mouseover", _.bind(this.display, this));
				this.$parent.bind("mouseleave", _.bind(this.disappear, this));
			},
			setWidth:function(width){
				this.$el.width = width || "100%";
			},
			display: function() {
				if (this.msgQue.length == 0) {
					return;
				}
				this.$el.show();
				this.appear();
			},
			appear: function() {
				// 把所有内容都展示出来
				_.each(this.items, function(val, key) {
					val.shows();
				});
				this.$popover.addClass("mouseover");
				this.hover = true;
				this.$detail.hide();
				//关掉定时器		
				this.stopTimer();
				//event.stopPropagation();
			},
			disappear: function(event) {
				this.$el.slideUp(300);
				this.$popover.removeClass("mouseover");
				//this.msgQue.reset();
				this.msgQue.trigger("disappear", this.msgQue);
				this.hover = false;

			},
			//遍历底下的所有View，把他们的时间减少1000,
			poll: function() {
				_.each(this.items, function(val, key) {
					if (val.display === true) {
						if ((val.getTime() - 1000) === 0) {
							this.msgQue.trigger("hide", val.model);
							val.reduceTime(1000);
							val.display = false;
							var nextMsg = _.findWhere(this.items, {
								idx: val.idx + this.maxMsg
							});
							nextMsg && nextMsg.shows();

						} else {
							val.reduceTime(1000);
						}
					}
				}, this);
				this.showCnt > this.maxMsg ? this.$detail.show() : this.$detail.hide();
				this.showCnt == 0 ? this.$el.slideUp(300) : this.$el.show();
			},
			addMsg: function(msg) {

				msg.idx = ++this.index;
				var newItem = new PopMenuItem(msg);
				var id = msg.id || msg.cid;
				this.items[id] = newItem;
				this.$popover.append(newItem.render().$el);

				if (this.hover === false) {

					this.timer = this.timer == null ? setInterval(_.bind(this.poll, this), 1000) : this.timer;
					this.showCnt++;
					if (this.showCnt == 1) {
						this.poll();
					}
					if (this.showCnt <= this.maxMsg) {
						newItem.shows();
					}
				} else {
					newItem.shows();
				}
				return this;
			},
			removeMsg: function(msg) {
				var id = msg.id || msg.cid;
				this.items[id].remove();

				(0 == --this.showCnt) && this.stopTimer();
			},
			resetMsgs: function() {

				this.showCnt = 0;
				_.each(this.items, function(val, key) {
					val.display = false;
					val.$el.hide();
					val.model.time = 0;
				});
			},
			render: function() {
				this.$el.append(this.$arrow);
				this.$el.append(this.$popover);
				this.$el.append(this.$detail);
				this.$el.hide();
				return this;
			},
			stopTimer: function() {
				clearInterval(this.timer);
				this.timer = null;
			}
		});
		var popMenu_C = new PopMenu_C();
		var popMenu_V = new PopMenuView({
			maxMsg: 2,
			collection: popMenu_C
		});
		return {
			popMenu_C: popMenu_C,
			popMenu_V: popMenu_V
		}
	});
})(jQuery)