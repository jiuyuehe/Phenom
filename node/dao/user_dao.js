var models = require("../models");

var User = models.User;
User.prototype.saveAsync = Binding.fromStandard(User.prototype.save);

exports.saveUserAsync = function (username, password) {
    var user = new User();
    user.username = username;
    user.realname = username.split('@')[0];
    user.password = password;
    return user.saveAync();
}

