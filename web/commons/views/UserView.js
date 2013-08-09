define(function (require, exports, module) {

    window.UserView = Backbone.View.extend({
        tagName: "div",
        className: "user-center",
        _modelBinder: undefined,
        editValue: false,

        events: {
            "click .status ul li ul li": "changeUserStatus",
            "click .userView p.can-edit": "edit",
            "blur .userView input.edit": "close",
            "click .userView .pay-service": "payService",
            "blur .userView input.edit": "close",
            "click .userView .btn-danger": "logOut"
        },

        initialize: function () {
            this.listenTo(model.currentUser, events.currentUserInfoChange, this.render);
            this._modelBinder = new Backbone.ModelBinder();
            this.render();
        },

        render: function () {
            $(this.el).html(tplpre.userView());
            var binds = {
                "userName": "[class=user-name]",
                'icon': {selector: '[alt=avatar]', elAttribute: 'src', converter: this.getAvatar},
                'jobTitle': '[class=jobTitle]',
                'phone': '[name=phone]',
                'mobile': '[name=mobile]',
                'registerMailAccount': '[class=mail]',
                'signature': '[name=signature]',
                'onlineStatus': [
                    {selector: '[name=status-box]', elAttribute: 'class', converter: this.getOnline},
                    {selector: '[name=onlineStatus]', converter: util.getUserStatusTip}
                ]
            }
            this._modelBinder.bind(this.model, this.el, binds);
            this.getDiskRemainSize();
            this.model.set("prevOnlineStatus", this.model.get("onlineStatus"));
            if (seajs.isPrivate) {
                this.$el.find("a.pay-service").hide();
            }
            return this;
        },

        getAvatar: function (direction, value) {
            return value || constants.defaultIcon;
        },

        getOnline: function (direction, value) {
            return value + "";
        },

        getPayUrl: function (direction, value) {
            var url = "";
            if ((value + "") != "") {
                url = "http://app.oatos.com/pay/price?id=" + value;
            }
            return url;
        },

        changeUserStatus: function (eve) {
            var chageStatus = $(eve.currentTarget).attr("value");
            router.approuter.navigate("user/status/" + chageStatus, true);

            this.$el.find(".status .nav li .caret").click();
            return false;
        },

        edit: function (e) {
            this.editValue = $(e.currentTarget).find('input').val();
            $(e.currentTarget).addClass('editing').find('input').focus();
        },

        close: function (e) {
            var input = $(e.currentTarget);
            input.parent().removeClass("editing");
            if (input.val() != this.editValue) {
                this.model.set(input.attr('name'), input.val());
                var userModel = _.omit(this.model.toJSON(), "prevOnlineStatus");
                resturl.updateUserProfile(userModel).start();
            }
        },

        getDiskRemainSize: function () {
            var _this = this;
            if ((cache.entId + "") != "") {
                resturl.getShareDiskUsedSizeByEntId(cache.entId,function (data) {
                    var remainSize = model.currentEnterprise.get("diskSize") - parseInt(data);
                    remainSize = parseInt(remainSize / 1024);
                    _this.$el.find(".userView .space").html(remainSize + "M");
                }).start();
            }
        },

        payService: function () {
            if (!view.serviceView) {
                model.payService = new ServiceDTO();
                view.serviceView = new ServiceView({model: model.payService});
            } else {
                view.serviceView.model = model.payService;
                view.serviceView.rebind();
            }

            view.serviceView.showModal();
            return false;
        },

        logOut: function () {
            router.approuter.loginOut();
        }
    });

});

