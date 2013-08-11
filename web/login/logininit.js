define(function (require) {

    require("./../commons/utils/util");
    require("./../commons/utils/security");
    require("./../commons/utils/crypto-sha256");

    _.extend(window, {
        resturl: require('./../commons/utils/resturl'),
        ErrorType: require("./../commons/utils/ErrorType"),
        EventType: require('./../commons/utils/EventType'),
        MessageType: require("./../commons/utils/MessageType")
    });

    $(function () {
        var router = require("./loginrouter");
        router.initialize()
    });
})