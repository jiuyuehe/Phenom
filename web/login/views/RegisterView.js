define(function (require, exports, module) {

    require('../../commons/model/user/LoginDTO');
    require('../../commons/model/user/RegisterDTO');

    window.RegisterView = Backbone.View.extend({
        tagName: 'div',
        className: 'view-register',
        _modelBinder: undefined,

        registerDTO: undefined,

        events: {
            "click .btn-register": "onRegister"
        },

        initialize: function () {
            this._modelBinder = new Backbone.ModelBinder();
            this.render();
        },

        render: function () {
            this.registerDTO = this.model;
            this.$el.html(tplpre.registerView());

            Backbone.Validation.bind(this, {
                invalid: this.isValid
            });

            this._modelBinder.bind(this.registerDTO, this.$el);
            return this;
        },

        isValid: function (view, attr, error, selector) {
            log.debug("invalid: ", attr, ",error:", error)
            view.$el.find(_.sprintf("input[%s=%s]", selector, attr)).siblings(".help-inline").text(error);
        },

        setInputEnable: function (enable) {
            this.$el.find("input:text, input:password").attr("disabled", !enable);
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