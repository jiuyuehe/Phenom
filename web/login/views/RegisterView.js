define(function (require, exports, module) {

    window.RegisterView = Backbone.View.extend({
        tagName: 'div',
        className: 'reg-cont',
        _modelBinder: undefined,
        btnNum: undefined,

        events: {
            "click #regBtn": "checkInfo",
            "keyup .controls input": "check",
            "click #checkName": "checkEntName",
            "click label.reg-check": "showCheckAgree",
            "click .ver-code": "changeImg",
            "keyup #VerCode": "checkWordVerify",
            "click #checkName": "checkEntName"
        },

        initialize: function () {
            this._modelBinder = new Backbone.ModelBinder();
            this.btnNum = 0;
            this.render();
        },

        render: function () {
            this.$el.html(tplpre.registerView());

            Backbone.Validation.bind(this, {

                valid: function (view, attr, selector) {
                    view.$el.find("#" + attr).next().html("<i class='icon-validate-ok'></i>");
                    if (attr == "enterpriseName") {
                        view.$el.find("#" + attr).next().html("<label class='right-tip' id='checkName'>检查</label>");
                    }
                    if (attr == 'confirmPassword') view.$el.find("#ent-val-info").html('');
                },

                invalid: function (view, attr, error, selector) {
                    view.$el.find("#" + attr).next().html("<i class='icon-validate-fail'></i>");
                    if (attr == 'enterpriseName' || attr == 'adminName' || attr == 'adminPassword' || attr == 'confirmPassword') {
                        view.$el.find("#ent-val-info").html(error);
                    } else {
                        if (attr == 'contact' || attr == 'mail' || attr == 'mobile' || attr == 'VerCode')
                            view.$el.find("#contact-val-info").html(error);
                    }
                }
            });
            this.rebind();
            return this;
        },

        rebind: function () {
            var bindings = Backbone.ModelBinder.createDefaultBindings(this.el, 'name');
            this._modelBinder.bind(this.model, this.el, bindings);
        },

        setRegInputEnable: function (enable) {
            this.$el.find('#enterpriseName').attr("disabled", !enable);
            this.$el.find('#adminName').attr("disabled", !enable);
            this.$el.find('#adminPassword').attr("disabled", !enable);
            this.$el.find('#confirmPassword').attr("disabled", !enable);
            this.$el.find('#contact').attr("disabled", !enable);
            this.$el.find('#mail').attr("disabled", !enable);
            this.$el.find('#mobile').attr("disabled", !enable);
            this.$el.find('#VerCode').attr("disabled", !enable);
            this.$el.find('#agreeCheck').attr("disabled", !enable);
            this.$el.find('#regBtn').attr("disabled", !enable);
        },

        checkInfo: function () {
            this.btnNum = 1;
            if (this.model.isValid(true)) {
                if (!this.checkAgree()) {
                    return false;
                }
                var that = this;
                this.setRegInputEnable(false);
                resturl.checkWordVerify("code=" + this.$el.find("#VerCode").val(),function (data) {
                    data = $.trim(data);
                    if (data == "true") {
                        that.$el.find("#VerCode").next().next().next().html("<i class='icon-validate-ok'></i>");
                        that.$el.find("#contact-val-info").html('');
                        that.register();
                    } else {
                        that.$el.find("#contact-val-info").html('验证码错误！');
                        that.$el.find("#VerCode").next().next().next().html("<i class='icon-validate-fail'></i>");
                        that.setRegInputEnable(true);
                    }
                }).start();
            }
            return false;
        },

        register: function () {
            var registerModel = new EnterpriseDTO(this.model.toJSON());
            this.model.securityRegisterDTO(registerModel);
            var that = this;
            this.model.register(registerModel, function (result) {
                that.setRegInputEnable(true);
                if (result == "OK") {
                    var loginModel = new LoginDTO({
                        userName: that.model.get("adminName"),
                        entName: that.model.get("enterpriseName"),
                        password: that.model.get("adminPassword")
                    });
                    $.cookie(constants.Cookies.COOKIE_ENTERPRISE_NAME, loginModel.get("entName"), {path: '/'});
                    $.cookie(constants.Cookies.COOKIE_USER_ACCOUNT, loginModel.get("userName"));
                    loginModel.login(that.loginCallback());
                } else if (result == "errorEnterpriseAlreadyExist") {
                    that.$el.find("#ent-val-info").html("企业名称已经被注册");
                    that.$el.find("#enterpriseName").next().html("<i class='icon-validate-fail'></i>");
                } else {
                    alertify.success("系统错误！");
                }
            });
        },

        loginCallback: function () {
            var that = this;
            return function (result) {
                var url = location.protocol + '//' + location.host;

                var p = location.pathname;
                p = p.substring(0, p.lastIndexOf('/'));

                if (result == "OK") {
                    p += '/oatos.html';
                } else {
                    p += '/login.html';
                }
                p += (seajs.devMode ? "?dev" : "");
                location.assign(p);
            }
        },

        check: function (event) {
            var eventTarget = $(event.currentTarget);
            if (eventTarget.attr("id") == "enterpriseName") {
                if (eventTarget.val().length < 2) {
                    eventTarget.next().html("<i class='icon-validate-fail'></i>");
                    this.$el.find("#ent-val-info").html("企业名称2~50个字符");
                } else {
                    this.$el.find("#ent-val-info").html("");
                    eventTarget.next().html("<a class='right-tip' id='checkName'>检查</label>");
                }
                return;
            }
            if (this.btnNum == 1) {
                this.model.set(eventTarget.attr("name"), eventTarget.val());
                this.model.isValid(true);
            }
        },

        checkAgree: function () {
            this.showCheckAgree();
            return this.$el.find("#agreeCheck").is(":checked");
        },

        showCheckAgree: function () {
            if (!this.$el.find("#agreeCheck").is(":checked")) {
                this.$el.find("#contact-val-info").html('同意条款才能注册！');
                this.$el.find(".reg-check .help-inline").html("<i class='icon-validate-fail'></i>");
            } else {
                this.$el.find(".reg-check .help-inline").html("<i class='icon-validate-ok'></i>");
            }
        },

        checkEntName: function () {
            var that = this;
            resturl.checkEntName(this.$el.find('#enterpriseName').val(),function (result) {
                if (result == 'false') {
                    that.$el.find("#ent-val-info").html("");
                    that.$el.find("#enterpriseName").next().html("<i class='icon-validate-ok'></i>");
                } else {
                    that.$el.find("#ent-val-info").html("企业名称已经被注册");
                    that.$el.find("#enterpriseName").next().html("<i class='icon-validate-fail'></i>");
                }
            }).start();
        },

        checkWordVerify: function () {
            var that = this;
            resturl.checkWordVerify("code=" + this.$el.find("#VerCode").val(),function (data) {
                data = $.trim(data);
                if (data == "true") {
                    if (that.$el.find("#contact-val-info").html() == '验证码错误！') {
                        that.$el.find("#contact-val-info").html('');
                    }
                    that.$el.find("#VerCode").next().next().next().html("<i class='icon-validate-ok'></i>");
                } else {
                    that.$el.find("#contact-val-info").html('验证码错误！');
                    that.$el.find("#VerCode").next().next().next().html("<i class='icon-validate-fail'></i>");
                    return;
                }
            }).start();
        },

        changeImg: function () {
            var imgSrc = this.$el.find(".code-image");
            var src = imgSrc.attr("src");
            imgSrc.attr("src", this.chgUrl(src));
        },
        chgUrl: function (url) {
            url = url.substring(0, 25);
            url = url + "?" + Math.random();
            return url;
        },

        close: function () {
            this._modelBinder.unbind();
            this.off();
            this.undelegateEvents();
            this.remove();
        }
    });

});