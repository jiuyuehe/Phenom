define(function (require, exports, module) {

    require("./views/LoginLayout");

    var LoginRouter = Backbone.Router.extend({
        routes: {
            "": "homepage",
            "index": "homepage",
            "login": "homepage",
            "*actions": "homepage"
        },

        before: function (route) {
            log.debug(' route filter before > route: ', route);
            if (!route || route === 'index') {
                return true;
            }
            if (!view.indexpage) {
                this.navigate('index', true);
                return false;
            }
        },

        after: function () {
            // $("#mainbox").slideUp();
        },

        initialize: function () {
            view.loginLayout = new LoginLayout({
                el: $("body")
            });
        },

        /**
         * 进入系统后的首页
         */
        homepage: function (path) {
        }
    })

    exports.initialize = function () {
        router.loginRouter = new LoginRouter();
        Backbone.history.start(); // 当所有的 路由 创建并设置完毕，调用 Backbone.history.start() 开始监控 hashchange 事件并分配路由
    };
})