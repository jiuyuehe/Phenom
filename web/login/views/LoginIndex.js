define(function (require, exports, module) {

    window.IndexView = Backbone.View.extend({

        initialize: function () {
            this.render();
        },

        render: function () {
            this.$el.html(tplpre.loginIndex());
            if (model.loginDTO.get("private")) {
                this.$el.find(".nav.row li.span1").hide();
                this.$el.find(".about").hide();
            }
            var attentionCard = '<div class="arrention-oatos"><div class="attention-title">关注OATOS：<a target="_blank"href="http://weibo.com/oatos">新浪微博</a><a target="_blank"href="http://t.qq.com/oatoscloud">腾讯微博</a></div><div class="attention-weixin">打开微信，“扫一扫”加为好友</div><img alt="关注“企业云科技”微信"src="img/logreg/qycloud_weixin.png"></div>';
            this.$el.find("#attention").popover({
                html: true,
                placement: 'top',
                content: attentionCard,
                trigger: 'manual'
            }).mouseenter(function (e) {
                    $(this).popover('show');
                });
            this.$el.find("#attention").mouseleave(function (e) {
                $('.arrention-oatos').mouseleave(function (e) {
                    $('#attention').popover('hide');
                });
                $('#attention').parent().mouseleave(function (e) {
                    $('#attention').popover('hide');
                });
            });
            this.$el.find("#attention").mouseenter();
            this.$el.find("#attention").popover('hide');
            return this;
        }
    });
})