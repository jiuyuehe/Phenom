define(function (require, exports, module) {

    window.LoadingView = Backbone.View.extend({

        $deferArea: undefined,
        $loadingImg: undefined,

        initialize: function () {
            this.render();
        },

        render: function () {
            this.$el.append(tplpre.loadingView());

            this.$deferArea = this.$el.find(".defer-area");
            this.$loadingImg = this.$el.find(".loading-img");
            return this;
        },

        isShow: function () {
            return !this.$deferArea.hasClass("hide");
        },

        show: function () {
            this.$deferArea.removeClass("hide");
        },

        hide: function () {
            this.$deferArea.addClass('hide');
        },

        resetPostion: function () {
            this.$deferArea.css({
                width: this.$el.width(),
                height: this.$el.height(),
                left: this.$el.offset().left,
                top: this.$el.offset().top
            });
        }
    });
});