/*
 * GET users listing.
 */

var util = require("util");
var userDao = require("../dao/user_dao");

exports.login = function (req, res) {
    res.json({succ: "respond with a resource"});
};

exports.register = function (req, res) {
    console.log("register: ", req.body);
    var password = req.body.password;
    var registerDTO = {
        username: req.body.username,
        realname: req.body.username.split('@')[0],
        password: req.body.password
    }

    eval(Wind.compile("async", function () {
        var result = $await(userDao.saveUserAsync(registerDTO));
        console.log("save result: ", result);

    }))().start();

    res.json({succ: "OK"});
}