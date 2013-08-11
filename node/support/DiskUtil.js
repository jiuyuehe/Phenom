var config = require("../config").config
    , FileUtil = require("./FileUtil")
    , fs = require("fs")
    , constants = require("../public/js/utils/constants")
    , ImageMagick = require("imagemagick")
    , Wind = require("wind")
    , Async = Wind.Async
    , Task = Async.Task
    , Binding = Async.Binding;

Wind.logger.level = Wind.Logging.Level.WARN;

var onlinediskPath = config.NetworkDiskPath,
    shareDiskBasePath = "/onlinedisk/share",
    personalDiskBasePath = "/onlinedisk/personal",
    tempBasePath = "/onlinedisk/temp",
    shareDiskPath = onlinediskPath + shareDiskBasePath,
    personalDiskPath = onlinediskPath + personalDiskBasePath,
    tempPath = onlinediskPath + tempBasePath;

var getConferenceDocDirAsync = eval(Wind.compile("async", function (entId, conferenceId) {
    var confDir = getShareDiskDir(entId) + conferenceId;
    $await(mkdirAsync(confDir));
    return confDir;
}));

var mkdirAsync = eval(Wind.compile("async", function (basePath) {
    var exist = $await(FileUtil.existsAsync(onlinediskPath + basePath));
    if (!exist)
        $await(FileUtil.mkdirAsync(onlinediskPath + basePath));
}));

function getPersonalDiskDir(userId) {
    return personalDiskBasePath + "/" + userId;
}

function getShareDiskDir(entId) {
    return shareDiskBasePath + "/" + entId;
}

/**
 * 返回文件后缀
 * @returns {*}
 */
function getFileSuffix(filename) {
    return _.include(filename, '.') ? _.strRightBack(filename, '.') : '';
}

/**
 * 返回文件前缀
 * @returns {*}
 */
function getFilePrefix(filename) {
    return _.strLeftBack(filename, ".");
}

/**
 * 返回企业网盘/个人网盘的绝对路径
 * @param diskType
 * @param entId
 * @param userId
 * @returns {string}
 */

var getTargetFileAsync = eval(Wind.compile("async", function (uploadBean) {
    var targetDir = $await(exports.createTargetDirAsync(uploadBean.type, uploadBean.entId, uploadBean.userId));
    return $await(FileUtil.openAsync(targetDir + uploadBean.guidName, 'w'));
}));

/**
 * 创建并返回目标目录
 * @param diskType
 * @param entId
 * @param userId
 */
var createTargetDirAsync = eval(Wind.compile("async", function (diskType, entId, userId) {
    var targetDir = (diskType === 'sharedisk' ? getShareDiskDir(entId) : getPersonalDiskDir(userId));
    console.log("targetDir", targetDir);

    $await(mkdirAsync(targetDir));
    return onlinediskPath + targetDir;
}));

/**
 * 返回swf路径的文件相对路径
 * @param diskType
 * @param entId
 * @param userId
 * @param guidName
 * @type {Object}
 */
var getSwfFilePath = eval(Wind.compile("async", function (diskType, entId, userId, guidName) {
    console.log("gwtSwfFilePath firstline")
    var targetDir = (diskType === 'sharedisk' ? getShareDiskDir(entId) : getPersonalDiskDir(userId));
    targetDir = targetDir + "/swf";
    $await(mkdirAsync(targetDir));
    targetDir = targetDir + "/" + getFilePrefix(guidName);
    console.log("gwtSwfFilePath before $await: ", targetDir);
    $await(mkdirAsync(targetDir));
    console.log("gwtSwfFilePath after $await: ", targetDir);
    return targetDir;
}));

/**
 * 获取转换后的pdf文件地址
 * @type {Object}
 */
var getPdfFilePath = eval(Wind.compile("async", function (diskType, entId, userId, guidName) {
    console.log("getPdfFilePath firstline")
    var targetDir = (diskType === 'sharedisk' ? getShareDiskDir(entId) : getPersonalDiskDir(userId));
    targetDir = targetDir + "/pdf";
    $await(mkdirAsync(targetDir));
    console.log("getPdfFilePath: ", targetDir);
    return targetDir + "/" + getFilePrefix(guidName) + ".pdf";
}));

var getFileAbsPath = function (diskType, entId, userId, guidName) {
    var targetDir = (diskType === 'sharedisk' ? getShareDiskDir(entId) : getPersonalDiskDir(userId));
    return onlinediskPath + "/" + targetDir + "/" + guidName;
}

var getFilePath = function (diskType, entId, userId, guidName) {
    var targetDir = (diskType === 'sharedisk' ? getShareDiskDir(entId) : getPersonalDiskDir(userId));
    return  targetDir + "/" + guidName;
}

/**
 * 返回图片的缩略图相对路径
 * @type {Object}
 */
var getThumbRelPath = eval(Wind.compile("async", function (type, entId, userId, guid) {
    var dir = tempBasePath;
    switch (type) {
        case constants.fileType.onlineDisk:
        case constants.fileType.onlineDiskThumb:
            dir = getPersonalDiskDir(userId);
            break;
        case constants.fileType.shareDisk:
        case constants.fileType.shareDiskThumb:
            dir = getShareDiskDir(entId);
            break;
    }
    dir += "/thumb";
    $await(mkdirAsync(dir));
    return dir + "/" + constants.getFilePrefix(guid) + ".png";
}));

/**
 * 生成图片缩略图
 */
var createImageThumbAsync = function (srcPath, destPath) {
    return Task.create(function (task) {
        ImageMagick.resize({
            srcPath: srcPath,
            dstPath: destPath,
            width: 96,
            heigth: 96
        }, function (err, stdout, stderr) {
            if (err)
                task.complete("failure", err);
            else
                task.complete("success");
        });
    })
};

exports.onlinediskPath = onlinediskPath;
exports.getPersonalDiskDir = getPersonalDiskDir;
exports.getShareDiskDir = getShareDiskDir;

exports.getTargetFileAsync = getTargetFileAsync;
exports.createTargetDirAsync = createTargetDirAsync;
exports.getSwfFilePath = getSwfFilePath;
exports.getPdfFilePath = getPdfFilePath;
exports.getFileAbsPath = getFileAbsPath;
exports.getFilePath = getFilePath;
exports.getThumbRelPath = getThumbRelPath


