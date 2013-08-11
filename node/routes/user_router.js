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
    var username = req.params.username;
    var password = req.params.password;
    eval(Wind.compile("async", function () {
        $await(userDao.saveUserAsync(username, password));

    }));
    res.json({succ: "OK"});
}