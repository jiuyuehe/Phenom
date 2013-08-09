define(function (require, exports, module) {

    require('../../commons/model/user/LoginDTO');
    require('../../commons/model/user/RegisterDTO');

    window.LoginView = Backbone.View.extend({
        tagName: 'div',
        className: 'log-cont',
        _modelBinder: undefined,

        loginDTO: undefined,
        registerDTO: undefined,

        events: {
            "show #panel-register": "onShowRegister",
            "click .btn-login": "onLogin",
            "click .btn-register": "onRegister"
        },

        initialize: function () {
            this.loginDTO = new LoginDTO();
            this.registerDTO = new RegisterDTO();
            this._modelBinder = new Backbone.ModelBinder();
            this.render();
        },

        render: function () {
            this.loginDTO = this.model;
            this.$el.html(tplpre.loginView());

            Backbone.Validation.bind(this, {
                invalid: this.isValid
            });

            this._modelBinder.bind(this.loginDTO, this.$el.find("form:first"));
            return this;
        },

        isValid: function (view, attr, error, selector) {
            log.debug("invalid: ", attr, ",error:", error)
            view.$el.find(_.sprintf("input[%s=%s]", selector, attr)).siblings(".help-inline").text(error);
        },


        onShowRegister: function () {
            this._modelBinder.unbind();
            Backbone.Validation.unbind(this);
            this.model = this.registerDTO;
            Backbone.Validation.bind(this, {
                invalid: this.isValid
            });
            this._modelBinder.bind(this.registerDTO, this.$el.find("form:last"));
        },

        setInputEnable: function (enable) {
            this.$el.find("input:text, input:password").attr("disabled", !enable);
        },

        onLogin: function () {
            if (this.loginDTO.isValid(true)) {
                this.setInputEnable(false);
                this.loginDTO.login(this._loginCallback());
            }
            return false;
        },

        onRegister: function () {
            if (this.registerDTO.isValid(true)) {
                this.setInputEnable(false);
                this.registerDTO.register(function (result) {

                });

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