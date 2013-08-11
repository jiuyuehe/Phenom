var req = require("request")
    , config = require("../config").config
    , webservice = require("./WebService")
    , DiskUtil = require("./DiskUtil")
    , fs = require("fs")
    , Wind = require("wind")
    , Async = Wind.Async
    , Task = Async.Task
    , Binding = Async.Binding;

Wind.logger.level = Wind.Logging.Level.WARN;

var postAsync = Binding.fromStandard(req.post, "resp", "body");

var sendPost = function (token, serviceType, data, callback) {
    return Task.create(function (t) {
        var options = {
            url: config.AppService + serviceType,
            headers: {
                'UT': token,
                'Content-Type': 'text/plain; charset=UTF-8',
                'Accept': 'text/plain;charset=UTF-8'
            },
            body: data
        }
        console.log("sendPost: ", options);
        req.post(options, function (err, resp, body) {
            if (err) {
                t.complete("failure", "error500");
                callback && callback("error500")
            } else {
                t.complete("success", body);
                callback && callback(body);
            }
        });
    });
};

exports.uploadFileToFM = function (jmsBean) {
    console.log("uploadFileToFM: ", jmsBean);
    var r = req({
        url: config.FileManangerService + webservice.uploadFileToFM,
        method: "post",
        headers: {
            "UT": jmsBean.token,
            "fp": DiskUtil.getFilePath(jmsBean.type, jmsBean.entId, jmsBean.userId, jmsBean.guidName),
            "fid": jmsBean.fileId,
            "tp": jmsBean.type
        }
    }, function (err, res, body) {
        console.log("err: ", ", body: ", body);
    });
    var form = r.form();
    form.append("file", fs.createReadStream(DiskUtil.getFileAbsPath(jmsBean.type, jmsBean.entId, jmsBean.userId, jmsBean.guidName)));
}

exports.saveMessage = function (token, data, callback) {
    return sendPost(token, "/sc/message/sendMessage", data, callback);
}

exports.addPersonalFile = function (token, data, callback) {
    return sendPost(token, "/sc/disk/addPersonalFile", data, callback);
}

/**
 * 添加企业网盘文件
 */
exports.addEntFile = function (token, data, callback) {
    return sendPost(token, "/sc/entDisk/addEntFile", data, callback);
}

