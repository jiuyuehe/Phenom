define(function (require, exports, module) {

    window.LoginView = Backbone.View.extend({
        tagName: 'div',
        className: 'log-cont',
        _modelBinder: undefined,

        events: {
            "click #loginBtn": "login"
        },

        initialize: function () {
            this._modelBinder = new Backbone.ModelBinder();
            this.render();
        },

        render: function () {
            this.$el.html(tplpre.loginView());

            Backbone.Validation.bind(this, {

                valid: function (view, attr, selector) {
                },

                invalid: function (view, attr, error, selector) {
                    view.$el.find("#errorTip").text(error);
                }
            });

            this.rebind();
            return this;
        },

        rebind: function () {
            var bindings = {
                'userName': '[name=logAccount]',
                'entName': '[name=logEntName]',
                'password': '[name=logPassword]',
                'private': [
                    {selector: '[name=private]', elAttribute: 'class', converter: this.setPrivate},
                    {selector: '[name=registerServer]', elAttribute: 'class', converter: this.setPrivate},
                    {selector: '[name=domainUser]', elAttribute: 'class', converter: this.showPrivate}
                ]
            };
            this._modelBinder.bind(this.model, this.el, bindings);
        },

        setPrivate: function (direction, value) {
            return value ? 'hide' : '';
        },

        showPrivate: function (direction, value) {
            return value ? '' : 'hide';
        },

        setInputEnable: function (enable) {
            this.$el.find('#logEntName').attr("disabled", !enable);
            this.$el.find('#logAccount').attr("disabled", !enable);
            this.$el.find('#logPassword').attr("disabled", !enable);
            this.$el.find('#loginBtn').attr("disabled", !enable);
        },

        login: function () {
            if (this.model.isValid(true)) {
                this.$el.find("#errorTip").empty();
                this.setInputEnable(false);
                var loginModel = new LoginDTO(this.model.toJSON());
                if (this.$el.find('#domainCheck').is(':checked')) {
                    loginModel.set("domainUser", true);
                }
                loginModel.login(this._loginCallback());
            }
            return false;
        },

        _loginCallback: function () {
            var that = this;
            return function (result) {
                that.setInputEnable(true);
                switch (result) {
                    case 'OK':
                        that.goSystem();
                        break;
                    case 'errorWrongPWD':
                    case 'errorWrongAccount':
                        that.$el.find("#errorTip").text("登录信息错误");
                        break;
                    case 'errorUserLocked':
                        that.$el.find("#errorTip").text("用户已被锁定，不能登录");
                        break;
                    case 'errorAuditFail':
                        that.$el.find("#errorTip").text("企业已经停止服务");
                        break;
                    default:
                        that.$el.find("#errorTip").text("系统错误！");
                        break;
                }
            }
        },

        goSystem: function () {
            var url = (this.$el.find('#httpsCheck').is(':checked') ? 'https:'
                : 'http:')
                + '//' + location.host;
            //var url = location.protocol + '//' + location.host;
            var p = location.pathname;
            p = p.substring(0, p.lastIndexOf('/'))
                + '/oatos.html' + (seajs.devMode ? '?dev' : "");
            url = url + p;
            location.assign(url);
        },

        close: function () {
            this._modelBinder.unbind();
            this.off();
            this.undelegateEvents();
            this.remove();
        }
    });

});