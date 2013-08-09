define(function (require, exports, module) {

    window.MainboxView = Backbone.View.extend({

        $contentLeft: undefined,
        $contentRight: undefined,
        $slideRight: undefined,

        initialize: function () {
            this.listenTo(this.model, 'change:width', this.onChangeWidth);
            this.listenTo(this.model, 'change:height', this.onChangeHeight);
            this.render();
        },

        render: function () {
            this.$el.append(tplpre.mainbox());
            this.$contentLeft = this.$el.find("#content-left");
            this.$contentRight = this.$el.find("#content-right");
            this.$slideRight = this.$el.find("#slide-right");

            this.ctrlXScroll();
            this.ctrlYScroll();

            this.$contentLeft.width(this.model.get("contentLeftWidth"));
            this.$slideRight.width(this.model.get("slideRightWidth"));
            this.$contentRight.width(this.model.getContentRightWidth());

            return this;
        },

        updateContentLeft: function (contentLeftView) {
            if (view.contentLeft && view.contentLeft.id === contentLeftView.id)
                return;
            view.contentLeft && view.contentLeft.close();
            view.contentLeft = contentLeftView;
            this.$contentLeft.append(contentLeftView.el);
        },

        /**
         * 更新contentRight部分的界面, 并移除就的view
         *
         * @param contentRightView
         */
        updateContentRight: function (contentRightView) {
            if (view.contentRight && view.contentRight.id === contentRightView.id)
                return;
            view.contentRight && view.contentRight.close();
            view.contentRight = contentRightView;
            this.$contentRight.append(contentRightView.el);
        },

        /**
         * 更新SlideRight部分的界面, 并移除旧的view
         *
         * @param slideRightView
         */
        updateSlideRight: function (slideRightView) {
            if (view.slideRight && view.slideRight.id === slideRightView) {
                return;
            }
            view.slideRight && view.slideRight.close();
            view.slideRight = slideRightView;
            this.$slideRight.append(slideRightView.el);
            this.showSlideRight();
            view.header.switchNav();
        },

        ctrlYScroll: function () {
            this.$el.height(this.model.getMainboxHeight());
        },

        ctrlXScroll: function () {
            $('body').width(this.model.getMainboxWidth());
            this.$el.width(this.model.getMainboxWidth());
        },

        onChangeWidth: function () {
            this.ctrlXScroll();

            var contentRightWidth = this.isSlideShow() ? this.model.getContentRightWidthMinusSlide() : this.model.getContentRightWidth();
            if (contentRightWidth < this.model.get("minContentRightWidth"))
                contentRightWidth = this.model.get("minContentRightWidth");
            this.$contentRight.width(contentRightWidth);
        },

        onChangeHeight: function () {
            this.ctrlYScroll();

            this.$contentLeft.height(model.setting.getMainboxHeight());
            this.$contentRight.height(model.setting.getMainboxHeight());
            this.$slideRight.height(model.setting.getMainboxHeight());

            view.fileLeftView && view.fileLeftView.onChangeHeight();
            view.fileTable && view.fileTable.onChangeHeight();
            view.userLayout && view.userLayout.onChangeHeight();
            view.fileShareView && view.fileShareView.onChangeHeight();
            view.recycleView && view.recycleView.onChangeHeight();
            view.fileCollectView && view.fileCollectView.onChangeHeight();
            view.fileDetailView && view.fileDetailView.onChangeHeight();
            view.conferenceView && view.conferenceView.planConferenceView && view.conferenceView.planConferenceView.onChangeHeight();

            view.adminLeftView && view.adminLeftView.onChangeHeight();
            view.guideView && view.guideView.onChangeHeight();
            view.serviceCenterView && view.serviceCenterView.onChangeHeight();
            view.systemView && view.systemView.onChangeHeight();
            view.memberView && view.memberView.onChangeHeight();
            view.permissionView && view.permissionView.onChangeHeight();
            view.recordView && view.recordView.onChangeHeight();
        },

        showSlideRight: function () {
            if (this.$slideRight.hasClass("hide")) {
                var that = this;
                this.$contentRight.animate({
                    width: this.model.getContentRightWidthMinusSlide() + "px"
                }, 500, function () {
                    that.$slideRight.removeClass('hide');
                    view.chatWindowView && view.chatWindowView.singleDialog && view.chatWindowView.singleDialog.position(that.getChatLeft(), '100%');
                    view.fileTable && view.fileTable.onChangeWidth();
                    view.fileShareView && view.fileShareView.onChangeWidth();
                });

            }
        },

        getChatLeft: function (flag) {
            var width = 0;
            if (flag === true) {//多人聊天
                width = 332;
            } else {
                width = 250;
            }

            return this.$slideRight.hasClass("hide") ? this.model.getMainboxWidth() - width :
                this.model.getMainboxWidth() - this.model.get("slideRightWidth") - width;
        },

        getChatTop: function (flag) {
            if (flag === true) {//多人聊天
                return  this.model.getMainboxHeight() - 168;
            } else {
                return  this.model.getMainboxHeight() - 180;
            }
        },

        getTipsLeft: function () {
            return this.$slideRight.hasClass("hide") ? this.model.getMainboxWidth() - 212 :
                this.model.getMainboxWidth() - this.model.get("slideRightWidth") - 212;
        },

        getTipsTop: function () {
            return  this.model.getMainboxHeight() + 31;
        },

        isSlideShow: function () {
            return !this.$slideRight.hasClass("hide");
        },

        hideSlideRight: function () {
            if (!this.$slideRight.hasClass("hide")) {
                var that = this;

                view.slideRight && view.slideRight.close();
                view.slideRight = null;
                view.header.switchNav();

                this.$contentRight.animate({
                    width: this.model.getContentRightWidth() + "px"
                }, 500, function () {
                    that.$slideRight.addClass('hide');
                    view.fileTable && view.fileTable.onChangeWidth();
                    view.fileShareView && view.fileShareView.onChangeWidth();
                    if (view.chatWindowView && view.chatWindowView.singleDialog)
                        view.chatWindowView.singleDialog.position(that.getChatLeft(), '100%');
                });
            }
        }
    });
})