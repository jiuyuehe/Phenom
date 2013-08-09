define(function (require, exports, module) {

    /**
     * 用户登陆DTO
     */
    window.LoginDTO = Backbone.Model.extend({
        urlRoot: "",

        defaults: {
            entName: "",
            userName: "",
            password: "",
            agent: util.getAgent(),
            clientId: util.guid()
        },

        initialize: function () {
            this.set("entName", $.trim(this.get("entName")));
            this.set("userName", $.trim(this.get("userName")));
            this.set("password", $.trim(this.get("password")));
        },

        validation: {
            agent: {
                required: false
            },
            clientId: {
                required: false
            },
            password: [
                {
                    required: true,
                    msg: '登录信息错误'
                },
                {
                    minLength: 5,
                    maxLength: 20,
                    msg: '登录信息错误'
                }
            ],
            userName: {
                required: true,
                msg: '登录信息错误'
            },
            entName: [
                {
                    required: true,
                    msg: '登录信息错误'
                },
                {
                    minLength: 2,
                    maxLength: 50,
                    msg: '登录信息错误'
                }
            ]
        },

        securityLoginDTO: function () {
            this.set("nonce", Security.randomCharString());
            this.set("password", Crypto.SHA256(this.get("password")));
            this.set("hashKey", Crypto.SHA256(this.get("userName") + this.get("password") + this.get("nonce")));
            this.set("password", Security.codeDecode(this.get("nonce"), Security.byteStringToHexString(this.get("password"))));
        },

        createAdminToken: function (token) {
            var args = token.split('@');
            if (args.length == 2) {
                return {entId: parseInt(args[0]), token: token}
            } else if (args.length == 3) {
                return {userId: parseInt(args[0]), entId: parseInt(args[1]), token: token}
            }
        },

        login: function (callback) {
            var isDomainUser = this.get('domainUser');
            if (isDomainUser) {
                this.set('realPwd', this.get('password'));
            }
            this.securityLoginDTO();
            var that = this;
            var loginJson = _.omit(this.toJSON(), 'private', 'domainUser');
            this.set('account', this.get('userName'));
            this.set('enterpriseName', this.get('entName'));
            var adminloginJson = _.omit(this.toJSON(), 'private', 'domainUser', 'realPwd', 'userName', 'entName');
            var Task = Wind.Async.Task;
            eval(Wind.compile("async", function () {
                var result = $await(Task.whenAll({
                    clientTokenResult: isDomainUser ? resturl.loginByLdap(loginJson) : resturl.logon(loginJson),
                    adminTokenResult: resturl.adminLogin(adminloginJson)
                }));

                if (constants.isResponseError(result.clientTokenResult)) {
                    callback && callback(result.clientTokenResult);
                    return false;
                }
                if (!constants.isResponseError(result.adminTokenResult)) {
                    var adminToken = that.createAdminToken(result.adminTokenResult);
                    constants.setAdminLoginCookies(that, adminToken);
                } else {
                    constants.clearLoginCookies();
                }
                constants.setUserLoginCookies(that, result.clientTokenResult);
                callback && callback('OK');
            }))().start();
        }
    });

});