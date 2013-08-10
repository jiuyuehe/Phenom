define(function (require) {

    window.$ = window.jQuery = require('jquery');
    window.Backbone = require('backbone-all');
    window.Handlebars = require('handlebars');

    require('bootstrap');
    require("jquery-plugin");
    require("backbone-plugin");

    require('commons-utils');
    require("wind");
    require('log4javascript');

    window.Task = Wind.Async.Task;

    var cssfiles = {
        'bootstrap': 'cssbase/bootstrap.min.css',
        'boostrap-response': 'cssbase/bootstrap-responsive.min.css',
        'bootstrap-plugin': 'cssbase/bootstrap-plugin.min.css',
        'login-register': seajs.devMode ? "cssbase/login-register.css" : "cssbase/login-register.min.css"
    }

    require.async(_.values(cssfiles));

    /**
     * init logger
     */
    (function () {
        window.log = log4javascript.getLogger();
        var consoleAppender = new log4javascript.BrowserConsoleAppender();
        consoleAppender.setThreshold(log4javascript.Level.DEBUG);
        log.addAppender(consoleAppender);
    }());


    _.extend(window, {
        model: {},
        collection: {},
        view: {},
        tplpre: {},
        cache: {},
        router: {},
        setting: {}
    });

    var tpls = {
        "loginLayout": './tpls/LoginLayout.tpl',
        "loginView": './tpls/LoginView.tpl',
        "registerView": './tpls/RegisterView.tpl'
    }

    if (seajs.devMode) {
        require.async(_.values(tpls), function (tplpre) {
            var args = arguments;
            _.each(_.keys(tpls), function (key, index) {
                window.tplpre[key] = Handlebars.compile(args[index]);
            })
            seajs.use('./web/login/logininit');
        });
    } else {
        require.async(["./login-tpls", "./../commons/commons-utils", "./../commons/commons-models"], function (tpls) {
            _.extend(window.tplpre, tpls);
            require.async("./login-views", function () {
                seajs.use("phenom/login/logininit");
            });
        });
    }
});
