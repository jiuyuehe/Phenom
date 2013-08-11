//var app = require('../app'),
var http = require("request"),
    should = require("should"),
    form = require("form-data"),
    fs = require("fs"),
    path = require("path"),
    webservice = require("../support/WebService")
    , DiskUtil = require("../support/DiskUtil")
    , ImageMagick = require("imagemagick");

describe(" test  ImageMagick ", function () {
    it('ImageMagick resize ', function (done) {
        ImageMagick.resize({
            srcPath: "D:/workspace/oatos-work/oatos_web/oatos_node/test/files/a.jpg",
            dstPath: "D:/workspace/oatos-work/oatos_web/oatos_node/test/files/a-96.png",
            width: 96
        }, function (err, stdout, stderr) {
            if (err)
                done(err);
            else
                done();
        })
    });
});