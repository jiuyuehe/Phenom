define(function (require, exports, module) {

    require("../../utils/crypto-sha256");
    require("../../utils/util");
    require("../../utils/security");

    window.RegisterDTO = Backbone.Model.extend({
        urlRoot: "",

        defaults: {
            username: "google@qq.com",
            password: "123456",
            repassword: "123456"
        },

        initialize: function () {

        },

        validation: {
            password: [
                {
                    required: true,
                    msg: '请输入用户密码'
                },
                {
                    minLength: 5,
                    maxLength: 20,
                    msg: '密码长度在6-20位之间'
                }
            ],
            repassword: [
                {
                    required: true,
                    msg: '请输入用户密码'
                },
                {
                    equalTo: 'password',
                    msg: '两次输入密码不一致'
                }
            ],
            username: [
                {
                    required: true,
                    msg: '请输入用户注册邮箱'
                }  ,
                {
                    pattern: 'email',
                    msg: '用户邮箱格式有误'
                }
            ]
        },

        register: function (callback) {
            var that = this;
            this.set(Security.getNonceDTO(this.get("username"), this.get("password")));
            resturl.register({
                'username': 'yufei',
                "password": '123456'},function (result) {
                log.debug("register result: ", result);
                callback && callback(result);
            }).start();
        }
    });

});