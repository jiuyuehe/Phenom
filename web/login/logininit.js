define(function (require) {

    require("./../commons/utils/util");
    require("./../commons/utils/security");
    require("./../commons/utils/crypto-sha256");

    require('./../commons/model/user/SettingDTO');
    require('./../commons/model/user/LoginDTO');

    require('log4javascript');

    _.extend(window, {
        resturl: require('./../commons/utils/resturl'),
        ErrorType: require("./../commons/utils/ErrorType"),
        EventType: require('./../commons/utils/EventType'),
        MessageType: require("./../commons/utils/MessageType")
    });

    var initlogger = function () {
        window.log = log4javascript.getLogger();
        var consoleAppender = new log4javascript.BrowserConsoleAppender();
        consoleAppender.setThreshold(log4javascript.Level.DEBUG);
        log.addAppender(consoleAppender);
    };

    var initSetting = function () {
        model.setting = new SettingDTO({
            contentLeftWidth: 206,
            slideRightWidth: 270,
            width: $(window).width(),
            height: $(window).height(),
            innerWidth: $(window).innerWidth(),
            innerHeight: $(window).innerHeight()
        });

        $(window).resize(function (event) {
            model.setting.set({
                width: $(window).width(),
                height: $(window).height(),
                innerWidth: $(window).innerWidth(),
                innerHeight: $(window).innerHeight()
            });
            log.debug("model.setting: ", model.setting.toJSON());
        });
    };

    var initData = function () {
        model.loginDTO = new LoginDTO();
    };

    $(function () {
        initlogger();
        initSetting();
        initData();

        require.async(location.pathname.indexOf("login.html") > 0 ? './loginrouter' : './registerrouter', function (router) {
            router.initialize()
        });
    });
    /**end module*/
})