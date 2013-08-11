var constants = require("../public/js/utils/constants")
    , config = require("../config").config
    , FileUtil = require("./FileUtil")
    , DiskUtil = require("./DiskUtil")
    , restful = require("./restful")
    , Amq = require("./AmqConnector")
    , Wind = require("wind")
    , Async = Wind.Async
    , Task = Async.Task
    , Binding = Async.Binding
    , UploadFileBean = require("./UploadFileBean");

/**
 * 处理文件上传
 */
exports.handleUpload = eval(Wind.compile("async", function (uploadBean) {
    var strFileId = null
    if ('onlinedisk' === uploadBean.type)
        strFileId = $await(handlePersonalFileUpload(uploadBean))
    else
        strFileId = $await(handleShareFileUpload(uploadBean));
    console.log("handleUpload strFileId: ", strFileId);

    if (_.startsWith(strFileId, "error")) {
        $await(FileUtil.rmdirAsync(DiskUtil.onlinediskPath + "/" + uploadBean.getFilePath()));
        return strFileId;
    }

    uploadBean.fileId = parseInt(strFileId);
    console.log("jmsBean: ", uploadBean.toJmsBean());
    Amq.sendMessage(config.FileUploadQueue, JSON.stringify(uploadBean.toJmsBean()));

    var path = $await(Task.whenAll({
        swfPath: DiskUtil.getSwfFilePath(uploadBean.type, uploadBean.entId, uploadBean.userId, uploadBean.guidName),
        pdfPath: DiskUtil.getPdfFilePath(uploadBean.type, uploadBean.entId, uploadBean.userId, uploadBean.guidName)
    }));
    var convertDTO = uploadBean.toConvertDTO(path.swfPath, path.pdfPath);
    console.log("convertDTO: ", convertDTO);
    Amq.sendMessage(config.FileConvertQueue, JSON.stringify(convertDTO));
    return strFileId;
}));

var handlePersonalFileUpload = eval(Wind.compile("async", function (uploadBean) {
    var addFileParam = uploadBean.toAddFileParam();
    var thumnPath = null;
    // TODO think create iamge thumb

    var strFileId = $await(restful.addPersonalFile(uploadBean.token, JSON.stringify(addFileParam)));
    return strFileId;
}));

var handleShareFileUpload = eval(Wind.compile("async", function (uploadBean) {
    var addFileParam = uploadBean.toAddFileParam();
    var thumnPath = null;
    // TODO think create iamge thumb

    var strFileId = $await(restful.addEntFile(uploadBean.token, JSON.stringify(addFileParam)));
    return strFileId;
}));