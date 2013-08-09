define(function (require, exports, module) {

    /**
     * 用户登陆DTO
     */
    window.RegisterDTO = Backbone.Model.extend({
        urlRoot: "",

        defaults: {
            username: "",
            password: "",
            repassword: "",
            agent: util.getAgent(),
            clientId: util.guid()
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
            eval(Wind.compile("async", function () {
                var result = resturl.logon(loginJson);
                if (constants.isResponseError(result)) {
                    callback && callback(result);
                    return false;
                }

                $.cookie("un", loginDTO.get("username"));
                $.cookie("ut", userToken, {path: '/'});
                $.cookie("si", true, {path: '/'});
                callback && callback('OK');
            }))().start();
        }
    });

});