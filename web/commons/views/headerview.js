define(function (require, exports, module) {

    require('./UserView');

    window.HeaderView = Backbone.View.extend({

        _modelBinder: undefined,

        events: {
            "click #usercenterbutton": "usercentersubmit",
            'click ul.nav > li:eq(4)': 'showUserInfo'
        },

        initialize: function () {
            this._modelBinder = new Backbone.ModelBinder();
            this.render();
        },

        render: function () {
            this.$el.html(tplpre.header());

            var binds = {
                "userName": "[class=userName]",
                'icon': {selector: '[alt=avatar]', elAttribute: 'src', converter: this.getAvatar},
                'onlineStatus': {selector: '[name=onlineStatus]', elAttribute: 'class', converter: this.getOnline},
                'userType': [
                    {selector: '[name=admin-mgr]', elAttribute: 'class', converter: this.showAdmin},
                    {selector: '#adminMgr', elAttribute: 'href', converter: this.addHref}
                ]
            }
            this._modelBinder.bind(this.model, this.el, binds);
            return this;
        },

        hideAdminBtn: function () {
            this.$el.find("ul.nav li:last").addClass('hide');
        },

        switchNav: function () {
            this.$el.find("#usershow-nav").attr("href", view.slideRight && view.slideRight.id === 'userLayout' ? '#slide/close' : '#user/show');
            this.$el.find("#conference-nav").attr("href", view.slideRight && view.slideRight.id === 'conferenceView' ? '#slide/close' : '#conference');
            this.$el.find("#message-nav").attr("href", view.slideRight && view.slideRight.id === 'messageView' ? '#slide/close' : '#message');
            this.$el.find("#upload-nav").attr("href", view.slideRight && view.slideRight.id === 'uploadDownloadView' ? '#slide/close' : '#disk/show/upload');
        },

        getAvatar: function (direction, value) {
            return  value || constants.defaultIcon;
        },

        getOnline: function (direction, value) {
            return value + "";
        },

        showAdmin: function (direction, value, attrName, model) {
            return model.isAdmin() || model.isSecAdmin() ? "show-important" : "";
        },

        addHref: function (direction, value, attrName, model) {
            var href = "";
            if (model.isAdmin() || model.isSecAdmin()) {
                href = util.getUrlPrefix() + (seajs.isPrivate ? '/admin/admin.jsp?private=true' : '/os/admin.html' ) + (!seajs.isPrivate && seajs.devMode ? '?dev' : '');
            }
            return href;
        },

        usercentersubmit: function () {
            view.mainbox = new UserCenterView({
                model: model.session,
                el: $("#mainbox")
            });
        },

        showUserInfo: function () {
            var that = this;
            if (!view.userView) {
                view.userView = new UserView({model: this.model});
                this.$el.find('ul.nav > li:eq(4)').popover({
                    html: true,
                    placement: 'bottom',
                    content: view.userView.el,
                    trigger: 'click'
                });
                this.$el.find('ul.nav > li:eq(4)').click();
            } else {
                view.userView.delegateEvents();
            }
            $('.user-center .userView > div a.btn').click(function (e) {
                that.$el.find('ul.nav > li:eq(4)').popover('hide');
            });
            $('#mainbox').click(function (e) {
                that.$el.find('ul.nav > li:eq(4)').popover('hide');
            });
        }
    });

});
