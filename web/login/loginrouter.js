define(function (require, exports, module) {

    require("./views/LoginIndex");
    require("./views/LoginView");

    var ViewerRouter = Backbone.Router.extend({
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
            if(seajs.isPrivate) {
                model.loginDTO.set("private", true);
            }
            view.indexpage = new IndexView({
                el: $("body")
            });
        },

        /**
         * 进入系统后的首页
         */
        homepage: function (path) {
            if (!view.login) {
                view.login = new LoginView({
                    model: model.loginDTO
                });
            } else {
                view.login.delegateEvents();
                view.login.rebind();
            }
            view.indexpage.$el.find(".content").html(view.login.el);
        }
    })

    exports.initialize = function () {
        router.viewerRouter = new ViewerRouter();
        Backbone.history.start(); // 当所有的 路由 创建并设置完毕，调用 Backbone.history.start() 开始监控 hashchange 事件并分配路由
    };
})