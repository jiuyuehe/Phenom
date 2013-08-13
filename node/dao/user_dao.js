var models = require("../models");

var User = models.User;
exports.saveUserAsync = function (registerDTO) {
    var user = new User();
    _.extend(user, registerDTO);
    user.saveAsync = Binding.fromStandard(user.save);
    return user.saveAsync();
}

