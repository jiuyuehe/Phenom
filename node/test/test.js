//var app = require('../app'),
var http = require("request"),
    should = require("should"),
    form = require("form-data"),
    fs = require("fs"),
    path = require("path"),
    webservice = require("../support/WebService")
    , DiskUtil = require("../support/DiskUtil");

describe("test another file upload", function () {
    it(" file upload ok", function (done) {
        var r = http({
            url: "http://127.0.0.1:3000" + webservice.fileRoutingUpload,
            method: "post"
        }, function (err, res, body) {
            console.log("err: ", ", body: ", body);
            if (err)
                done(err);
            else
                done();
        });
        var form = r.form();
        var form = r.form();
        form.append("UT", "101287@5a9c8511b77e8d837c110dd6e21b9e549eee1661odg11w53wzsamfzqei1yfd5q61375069418029");
        form.append("ei", 101285);
        form.append("ui", 101287);
        form.append("fi", 101324);
        form.append("gn", '13-ldldldldldldlld.png');
        form.append("tp", 'sharedisk');
        form.append("file", fs.createReadStream("D:/workspace/oatos-work/oatos_web/oatos_node/test/files/13.png"));
    })
})

describe("test file upload", function () {
    it(" file upload ok", function (done) {
        var r = http({
            url: "http://127.0.0.1:3000" + webservice.fileRoutingUpload,
            method: "post"
        }, function (err, res, body) {
            console.log("err: ", ", body: ", body);
            if (err)
                done(err);
            else
                done();
        });
        var form = r.form();
        var form = r.form();
        form.append("UT", "101287@5a9c8511b77e8d837c110dd6e21b9e549eee1661odg11w53wzsamfzqei1yfd5q61375069418029");
        form.append("ei", 101285);
        form.append("ui", 101287);
        form.append("fi", 101324);
        form.append("gn", 'a-ldldldldldldlld.png');
        form.append("tp", 'sharedisk');
        form.append("file", fs.createReadStream("D:/workspace/oatos-work/oatos_web/oatos_node/test/files/a.png"));
    })
})

