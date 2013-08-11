var util = require("../public/js/utils/util")
    , constants = require("../public/js/utils/constants")
    , DiskUtil = require("../support/DiskUtil");

function UploadFileBean(json) {
    if (json) {
        _.extend(this, json);
    } else {
        this.entId = undefined;
        this.userId = undefined;
        this.folderId = undefined;
        this.guidName = undefined;
        this.type = undefined;
        this.token = undefined;
        this.fileName = undefined;
        this.fileSize = undefined;
    }
}

/**
 * 是否是企业网盘
 * @returns {boolean}
 */
UploadFileBean.prototype.isEntDisk = function () {
    return this.type === constants.fileType.shareDisk;
}

/**
 * 获取文件的相对路径
 * @returns {string}
 */
UploadFileBean.prototype.getFilePath = function () {
    var basePath = this.isEntDisk() ? DiskUtil.getShareDiskDir(this.entId) : DiskUtil.getPersonalDiskDir(this.userId);
    return basePath + "/" + this.guidName;
}

UploadFileBean.prototype.getFileAbsPath = function () {
    return DiskUtil.onlinediskPath + "/" + this.getFilePath();
}

UploadFileBean.prototype.toAddFileParam = function () {
    return _.extend({
        entId: this.entId,
        userId: this.userId,
        folderId: this.folderId,
        name: this.fileName,
        guid: this.guidName,
        size: util.getFileKbSize(this.fileSize)
    }, this.thumb ? {thumb: this.thumb} : {});
};

UploadFileBean.prototype.toFileDTO = function () {
    return {
        entId: this.entId,
        userId: this.userId,
        fileId: this.fileId,
        folderId: this.folderId,
        name: this.fileName,
        guid: this.guidName,
        size: util.getFileKbSize(this.fileSize),
        type: this.type
    }
}

UploadFileBean.prototype.toJmsBean = function () {
    return {
        entId: this.entId,
        userId: this.userId,
        type: this.type,
        folderId: this.folderId,
        fileId: this.fileId,
        guidName: this.guidName,
        token: this.token
    }
}

UploadFileBean.prototype.toConvertDTO = function (swfPath, pdfPath) {
    var convertDTO = {
        entId: this.entId,
        userId: this.userId,
        fileId: this.fileId,
        fileType: this.type,
        startPage: 0,
        convertType: constants.DocConvertType.DOC_TO_SWF,
        sourcePath: this.getFilePath(),
        swfPath: swfPath,
        priorty: constants.DocConvertPriority.FILE_VIEW
    };

    if (constants.isPdfType(constants.getFileSuffix(this.guidName))) {
        convertDTO.pdfPath = this.getFilePath();
    } else if (constants.isDocSupport(constants.getFileSuffix(this.guidName))) {
        convertDTO.pdfPath = pdfPath;
    }
    return convertDTO;
}

module.exports = UploadFileBean;

