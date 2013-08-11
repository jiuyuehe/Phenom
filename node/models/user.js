var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../config').config;

var UserSchema = new Schema({
    username: { type: String, index: true },
    realname: { type: String, unique: true },
    password: { type: String }
});

mongoose.model('User', UserSchema);
