/**
 * @required LoginForm
 * @required RegisterForm
 */
define(function (require, exports, module) {

    require("./LoginView");
    require("./RegisterView");

    require("../../commons/model/user/LoginDTO");
    require("../../commons/model/user/RegisterDTO");

    window.LoginLayout = Backbone.View.extend({

        $loginForm: undefined,
        $registerForm: undefined,
        loginForm: undefined,
        registerForm: undefined,

        initialize: function () {
            this.render();
        },

        render: function () {
            this.$el.html(tplpre.loginLayout());
            this.$loginForm = this.$el.find("#panel-login");
            this.$registerForm = this.$el.find("#panel-register");

            this.loginForm = new LoginView({
                model: new LoginDTO()
            });
            this.$loginForm.html(this.loginForm.el);

            this.registerForm = new RegisterView({
                model: new RegisterDTO()
            });
            this.$registerForm.html(this.registerForm.el);
            return this;
        }
    });
})