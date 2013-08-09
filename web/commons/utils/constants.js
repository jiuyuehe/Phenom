define(function (require, exports, module) {

    window.moment = require('moment');

    return {
        amqTopic: "topic://conlect.oatOS.",
        amqTopic2: "/topic/conlect.oatOS.",
        ERROR_MARK: 'error',
        OK_MARK: 'OK',
        QUEUED: "QUEUED",

        // file type constants
        docType: ['doc', 'docx', 'wps'],
        excelType: ['xls', 'xlsx', 'xlt', 'csv'],
        imgType: ['png', 'jpg', 'gif', 'jpeg', 'bmp', 'ico', 'wbmp'],
        pptType: ['ppt', 'pptx'],
        pdfType: ['pdf'],
        txtType: ['txt', 'java', 'c', 'h', 'js', 'css', 'php', 'sql', 'xml', 'log'],
        htmlType: ['html', 'htm', 'tpl'],
        oatwType: ['oatw'],
        mp4Type: ['mp4', 'mov', 'flv', 'webm', 'm4v', 'avi', 'ogv', 'f4v', 'wmv'],
        mp3Type: ['mp3', 'aac', 'm4a', 'f4a', 'ogg', 'oga'],
        zipType: ['zip', '7z', 'war', 'tar', 'rar'],
        vidType: ["mp4", "m4v", "f4v", "mov", "flv"],
        audType: ["aac", "m4a", "f4a", "mp3"],
        departIdNull: -1,

        defaultIcon: "img/defaultAvatar64man.png",
        defaultWomenIcon: "img/defaultAvatar64woman.png",
        defaultImgThumb: 'img/default-img-thumb.png',
        defaultPassword: '6a5b4321',

        /**
         * 是否支持文档转换的类型
         * @returns {*}
         */
        isFileConvertSupport: function (type) {
            if (!this._convertTypes) {
                this._convertTypes = [];
                _.each([this.docType, this.excelType, this.pptType, this.pdfType], function (each) {
                    this._convertTypes = this._convertTypes.concat(each);
                }, this);
            }
            return _.contains(this._convertTypes, type);
        },

        /**
         * 是否支持预览
         *
         * @param type
         * @returns {*}
         */
        isPreviewSupport: function (type) {
            if (!this._previewTypes) {
                var that = this;
                this._previewTypes = [];
                _.each([this.docType, this.excelType, this.imgType, this.pptType, this.pdfType, this.txtType, this.htmlType, this.oatwType, this.vidType, this.audType], function (each) {
                    that._previewTypes = that._previewTypes.concat(each);
                });
            }
            return _.contains(this._previewTypes, type);
        },

        isResponseError: function (result) {
            return _.startsWith(result, this.ERROR_MARK);
        },

        isResponseOK: function (result) {
            return result === this.OK_MARK;
        },

        isHtmlType: function (type) {
            return _.contains(this.htmlType, type);
        },

        isTxtType: function (type) {
            return _.contains(this.txtType, type);
        },

        isOatwType: function (type) {
            return _.contains(this.oatwType, type);
        },

        isPdfType: function (type) {
            return type && type.toLowerCase() === 'pdf';
        },

        isMp4Type: function (type) {
            return _.contains(this.mp4Type, type);
        },

        isMp3Type: function (type) {
            return _.contains(this.mp3Type, type);
        },

        isImgType: function (type) {
            return _.contains(this.imgType, type);
        },

        isVidType: function (type) {
            return _.contains(this.vidType, type);
        },

        isAudType: function (type) {
            return _.contains(this.audType, type);
        },

        isDocSupport: function (type) {
            return _.contains(this.docType.concat(this.excelType).concat(this.pptType), type);
        },

        searchFileType: function () {
            if (!this._fileMap) {
                var that = this;
                this._fileMap = [];
                _.each([this.docType, this.excelType, this.pptType, this.pdfType, this.txtType], function (each) {
                    that._fileMap = that._fileMap.concat(each);
                });
            }

            return this._fileMap;
        },

        FilePermissionErrorMsg: {
            /**
             * 读，查看文件的内容
             */
            Read: '无此权限！',
            /**
             * 写，可以编辑文件，创建文件夹，修改文件或文件夹名字
             */
            Write: '无此权限！',
            /**
             * 可以下载
             */
            Download: '无此权限！',
            /**
             * 上传文件
             */
            Upload: '无此权限！',
            /**
             * 删除子文件夹或者子文件
             */
            Delete: '无此权限！',
            /**
             * 共享
             */
            Share: '无此权限！',
            /**
             * 预览，可以在文件列表中看到文件夹下的子文件夹和文件
             */
            List: '无此权限！',
            /**
             * 本地交互
             */
            Local: '无此权限！'
        },

        /**
         * 文件权限常量
         */
        FilePermission: {
            /**
             * 读，查看文件的内容
             */
            Read: 'Read',
            /**
             * 写，可以编辑文件，创建文件夹，修改文件或文件夹名字
             */
            Write: 'Write',
            /**
             * 可以下载
             */
            Download: 'Download',
            /**
             * 上传文件
             */
            Upload: 'Upload',
            /**
             * 删除子文件夹或者子文件
             */
            Delete: 'Delete',
            /**
             * 共享
             */
            Share: 'Share',
            /**
             * 预览，可以在文件列表中看到文件夹下的子文件夹和文件
             */
            List: 'List',
            /**
             * 本地交互
             */
            Local: 'Local'
        },

        /**
         * 返回收到文件更新消息后需要检查的权限数组
         * @returns {Array}
         */
        getFileMsgPermissions: function () {
            return this._fileMsgPermission ? this._fileMsgPermission :
                (this._fileMsgPermission = [this.FilePermission.Read, this.FilePermission.Download, this.FilePermission.List]);
        },

        // file operation
        operation: {
            NewFolder: 'NewFolder',
            NewFile: 'NewFile',
            UploadFile: 'UploadFile',
            RenameFile: 'RenameFile',
            RenameFolder: 'RenameFolder',
            /*删除到回收站中*/
            Delete: 'Delete',

            /*彻底删除*/
            DeletePermanently: 'DeletePermanently',

            /*移动文件*/
            Move: 'Move',

            /*回收站中恢复*/
            RestoreFromRecycle: 'RestoreFromRecycle',

            /*恢复文件版本*/
            RestoreVersion: 'RestoreVersion',

            EmptyRecycle: 'EmptyRecycle',

            'EditFile': 'EditFile',
            'ShareFile': 'ShareFile',
            'Lock': 'Lock',
            'SetFolderSize': 'SetFolderSize'
        },

        getFileOperationTip: function (operation) {
            switch (operation) {
                case this.operation.NewFolder:
                    return '新建文件夹';
                case this.operation.NewFile:
                    return '创建 ';
                case  this.operation.UploadFile:
                    return '上传';
                case this.operation.RenameFile:
                case this.operation.RenameFolder:
                    return "重命名"
                case this.operation.Delete:
                    return "删除";
                case this.operation.DeletePermanently:
                    return "删除回收站";
                case this.operation.Move:
                    return "移动";
                case this.operation.RestoreFromRecycle:
                    return "恢复";
                case this.operation.RestoreVersion:
                    return "恢复版本";
                case this.operation.Lock:
                    return "锁定";
            }
            return '修改';
        },

        getFileOperationAllTip: function (operation) {
            switch (operation) {
                case this.operation.NewFolder:
                    return '新建文件夹';
                case this.operation.NewFile:
                    return '创建文件';
                case  this.operation.UploadFile:
                    return '上传文件';
                case this.operation.RenameFile:
                    return "重命名文件";
                case this.operation.RenameFolder:
                    return "重命名文件夹";
                case this.operation.Delete:
                    return "删除";
                case this.operation.DeletePermanently:
                    return "删除回收站";
                case this.operation.Move:
                    return "移动";
                case this.operation.RestoreFromRecycle:
                    return "恢复";
                case this.operation.RestoreVersion:
                    return "恢复版本";
                case this.operation.Lock:
                    return "锁定";
            }
            return '修改';
        },

        // file type
        fileType: {
            shareDisk: "sharedisk",
            onlineDisk: "onlinedisk",
            conferenceDoc: "conferenceDoc",
            icon: 'icon',
            temp: 'tempfile'
        },

        isEntDisk: function (fileType) {
            return fileType === this.fileType.shareDisk;
        },

        fileStatus: {
            active: 0,
            recycle: 1,
            deleted: -1
        },

        FileConvertStatus: {
            /**
             * 上传到文件cache
             */
            UPLOAD_TO_CACHE: "0",
            /**
             * 同步到文件服务器
             */
            UPLOAD_TO_FS: "1",
            /**
             * 正在处理转换
             */
            CONVERT_START: "2",
            /**
             * 转换完成
             *
             */
            CONVERT_DONE: "3",
            /**
             * 转换失败
             *
             */
            CONVERT_ERROR: "4"
        },

        /**
         * 文件是否转换中...
         * @param fileType
         * @param fileStatus
         * @returns {*}
         */
        isFileConverting: function (fileType, fileStatus) {
            return _.contains([this.FileConvertStatus.UPLOAD_TO_CACHE, this.FileConvertStatus.UPLOAD_TO_FS, this.FileConvertStatus.CONVERT_START], fileStatus);
        },

        // 成员的会议状态
        ConferenceMemberStatus: {
            Invited: "invited",			//会议邀请中
            Accepted: "accepted",		//接受会议邀请
            Refused: 'refused',			//拒绝会议邀请
            Attended: 'attended'		//出席会议
        },

        ConferenceType: {
            appointment: 0,             //预约会议
            immediate: 1                //即时会议
        },

        ConferenceStatus: {
            Created: "new",             //未召开会议
            Held: "held",               //会议正在召开
            Ended: "ended"              //会议召开结束
        },

        // 用户在线状态
        UserStatus: {
            Online: "online",           //在线
            Offline: "offline",         //离线
            Busy: "busy",               //忙碌
            Corbet: "corbet",           //隐身
            Leave: "leave",             //离开
            Logout: "logout"            //退出
        },

        DATE_TIME_FORMAT: 'YYYY-MM-DD HH:mm:ss',

        specialFolderMap: {
            'Share': '共享文件夹',
            'share': '共享文件夹',
            'My documents': '我的文档',
            'My pictures': '我的图片',
            'Received files': '接受的文件',
            'Send files': '发送的文件'
        },

        entSpecialFolderNames: {
            'Share': '共享文件夹',
            'share': '共享文件夹'
        },

        personSpecialFolderNames: {
            'My documents': '我的文档',
            'My pictures': '我的图片',
            'Received files': '接受的文件',
            'Send files': '发送的文件'
        },

        rootFolderId: {
            entDisk: 'entRoot',
            personDisk: 'personRoot'
        },

        /**
         * 判断是否是特殊文件夹
         * @param {EntFileDTO} file
         * @returns {boolean|*}
         */
        isSpecialFolder: function (file) {
            var parentId = file.get("parentId");
            if (file.isEntDisk() && parentId === 'entRoot') {
                return this.isSpecialEntFolder(file.get("realname"));
            }
            if (parentId === 'personRoot' && !file.isEntDisk())
                return this.isSpecialPersonFolder(file.get("realname"));
            return false;
        },

        /**
         * 是否是特殊的企业文件夹
         * @param folderName
         * @returns {Boolean}
         */
        isSpecialEntFolder: function (folderName) {
            return _.some(_.keys(this.entSpecialFolderNames), function (name) {
                return name === folderName;
            });
        },

        /**
         * 是否是特殊的个人文件夹
         * @returns {Boolean}
         */
        isSpecialPersonFolder: function (folderName) {
            return _.some(_.keys(this.personSpecialFolderNames), function (name) {
                return name === folderName;
            });
        },

        getUserStatusTip: function (status) {
            var result = '未知';
            switch (status) {
                case constants.UserStatus.Online:
                    result = "在线";
                    break;
                case constants.UserStatus.Busy:
                    result = "忙碌";
                    break;
                case constants.UserStatus.Leave:
                    result = "离开";
                    break;
                case constants.UserStatus.Corbet:
                    result = "隐身";
                    break;
                default:
                    result = "离线";
                    break;
            }
            return result;
        },

        fileDeleteStatus: {
            active: 0,
            /*删除到回收站*/
            recycle: 1,
            /*已删除*/
            deleted: -1
        },

        /** 消息状态*/
        MsgStatus: {
            New: 'New',
            Read: 'Read'
        },

        /**
         * 返回文件下载链接地址
         * @param file
         * @returns {}
         */
        getFileDownloadUrl: function (file) {
            if (file.isFolder()) {
                return '#file/download/' + file.id;
            }
            return resturl.singleFileDownload + '?' + $.param({
                'ei': cache.entId,
                'ui': cache.userId,
                'UT': cache.token,
                'fid': file.get("fileId"),
                'gn': file.get("guid"),
                'fi': file.get('parentId'),
                'tp': file.isEntDisk() ? constants.fileType.shareDisk : constants.fileType.onlineDisk
            });
        },

        /**
         * 返回外链文件下载链接地址
         * @param file
         * @returns {}
         */
        getShareFileDownloadUrl: function (file) {
            if (file.isFolder())
                return '#file/download/' + file.id;
            return resturl.singleShareFileDownload + '?' + $.param({
                'ei': cache.entId,
                'ui': cache.userId,
                'UT': cache.token,
                'fid': file.get("fileId"),
                'gn': file.get("guid"),
                'fi': file.get('parentId'),
                'tp': file.isEntDisk() ? constants.fileType.shareDisk : constants.fileType.onlineDisk,
                'cdp': false
            });
        },

        /**
         * 从字符串时间格式化为毫秒数
         *
         * @param []
         */
        getMillSec: function (strTime, format) {
            var format = format || this.DATE_TIME_FORMAT;
            return moment(strTime, format).toDate().getTime();
        },

        /**
         *  格式化毫秒数时间
         * @param [int] millsec
         * @return [] date
         */
        dateFromMillSec: function (millsec, format) {
            var format = format || this.DATE_TIME_FORMAT;
            return moment(parseInt(millsec)).format(format);
        },

        getRenameFileMsg: function (result) {
            var msg = null;
            switch (result) {
                case constants.errorType.OK_MARK:
                    msg = "重命名成功！";
                    break;
                case constants.errorType.errorNoPermission:
                    msg = "无此权限！";
                    break;
                case constants.errorType.errorSameFile:
                    msg = "文件夹下存在同名文件！";
                    break;
                case constants.errorType.errorSameFolder:
                    msg = "文件夹下存在同名文件夹！";
                    break;
                case constants.errorType.errorFileLocked:
                    msg = "文件被锁定！";
                    break;
                case constants.errorType.errorVersionConflict:
                    msg = "版本冲突！";
                    break;
                case constants.errorType.error500:
                    msg = "error500!";
                    break;
            }
            return msg;
        },

        /**
         *  用户类型
         */
        UserType: {
            /**
             * 个人用户
             */
            PersonalUser: 0,
            /**
             * 企业用户
             */
            BusinessUser: 1,

            /**
             * 企业管理员
             */
            Administrator: 2,

            /**
             * 企业二级管理员
             */
            SecondAdministrator: 3
        },

        Cookies: {
            COOKIE_ENTERPRISE_NAME: 'en',
            COOKIE_USER_ACCOUNT: 'ua',
            COOKIE_USER_TOKEN: 'ut',
            COOKIE_KEEP_SIGN_IN: 'ksi',
            COOKIE_SIGN_IN: 'si',
            COOKIE_ENTADMIN_TOKEN: 'eat'
        },

        clearLoginCookies: function () {
            $.cookie(constants.Cookies.COOKIE_USER_TOKEN, null, {path: '/'});
            $.cookie(constants.Cookies.COOKIE_SIGN_IN, null);
            $.cookie(constants.Cookies.COOKIE_ENTADMIN_TOKEN, null, {path: '/'});
            $.cookie(constants.Cookies.COOKIE_SIGN_IN, null, {path: '/'});
        },

        clearAdminLogicCookies: function () {
            $.cookie(constants.Cookies.COOKIE_ENTERPRISE_NAME, null);
            $.cookie(constants.Cookies.COOKIE_ENTADMIN_TOKEN, null);
            $.cookie(constants.Cookies.COOKIE_SIGN_IN, null, {path: '/'});
        },

        setUserLoginCookies: function (loginDTO, userToken) {
            $.cookie(constants.Cookies.COOKIE_ENTERPRISE_NAME, loginDTO.get("enterpriseName"), {path: '/'});
            $.cookie(constants.Cookies.COOKIE_USER_ACCOUNT, loginDTO.get("account"));
            $.cookie(constants.Cookies.COOKIE_USER_TOKEN, userToken, {path: '/'});
            $.cookie(constants.Cookies.COOKIE_SIGN_IN, true, {path: '/'});
        },

        setAdminLoginCookies: function (loginDTO, adminToken) {
            $.cookie(constants.Cookies.COOKIE_ENTERPRISE_NAME, loginDTO.get("enterpriseName"), {path: '/'});
            $.cookie(constants.Cookies.COOKIE_ENTADMIN_TOKEN, adminToken.token, {path: '/'});
            $.cookie(constants.Cookies.COOKIE_SIGN_IN, 'true', {path: '/'});
        },

        getVideoMsgTip: function (type) {
            switch (type) {
                case MessageType.VideoInvite:
                    return "邀请您视频聊天";
                case MessageType.VideoStart:
                    return "接受您的视频邀请";
                case MessageType.VideoEnd:
                    return "结束视频聊天";
                case MessageType.VideoRefuse:
                    return "拒绝视频聊天";
            }
        },

        getConferenceMsgTip: function (type) {
            switch (type) {
                case MessageType.ConferenceInvite:
                    return "邀请您出席视频会议";
                case MessageType.ConferenceStart:
                    return "视频会议开始";
                case MessageType.ConferenceEnd:
                    return "视频会议结束";
                case MessageType.ConferenceUpdate:
                    return "更新视频会议";
                case MessageType.ConferenceAcceptInvite:
                    return "接受视频会议邀请";
                case MessageType.ConferenceRefuseInvite:
                    return "拒绝视频会议邀请";
                case MessageType.ConferenceAcceptStart:
                    return "出席视频会议";
                case MessageType.ConferenceRefuseStart:
                    return "拒绝出席视频会议";
                case MessageType.ConferenceCancel:
                    return "取消视频会议";
            }
        },

        /**
         * 返回文件后缀
         * @returns {*}
         */
        getFileSuffix: function (filename) {
            return _.include(filename, '.') ? _.strRightBack(filename, '.') : '';
        },

        /**
         * 返回文件前缀
         * @returns {*}
         */
        getFilePrefix: function (filename) {
            return _.strLeftBack(filename, ".");
        },

        /**
         * 返回按钮显示/隐藏的控制对象
         * @param isEntDisk
         * @param files
         * @returns {*}
         */
        getBtnCtrls: function (isEntDisk, files) {
            var ctrls = {
                'attention-btn': false,
                'faviourte-btn': false,
                'share-btn': false,
                'lock-btn': false,
                'unlock-btn': false,
                'del-attention-btn': false,
                'del-faviourte-btn': false,
                'del-share-btn': false,

                'move-btn': false,
                'delete-btn': false,
                'rename-btn': false,
                'download-btn': true,
                'copy-btn': false
            }

            if (!isEntDisk) {
                ctrls = _.extend(ctrls, {
                    'move-btn': true,
                    'delete-btn': true
                }, files.length === 1 ? {
                    'rename-btn': true,
                    'copy-btn': !files[0].isFolder()
                } : {
                    'copy-btn': _.all(files, function (file) {
                        return !file.isFolder()
                    }) });

                return ctrls;
            }

            if (files.length > 1) {
                // 判断是否显示取消收藏/收藏/取消分享/取消关注/
                var hasunfav = false, hasunattention = false, hasunshare = false, hasfolder = false;
                _.each(files, function (file) {
                    if (file.isFolder())
                        hasfolder = true;
                    if (!file.get('favorite'))
                        hasunfav = true;
                    if (!file.get('remind'))
                        hasunattention = true;
//                    if (!file.get("shareLinkId"))
//                        hasunshare = true;
                });
                return _.extend(ctrls, {
                    'attention-btn': hasunattention,
                    'faviourte-btn': !hasfolder && hasunfav,
                    'move-btn': true,
                    'delete-btn': true,
                    'del-attention-btn': !hasunattention,
                    'del-faviourte-btn': !hasunfav
                })
            }

            var file = files[0];
            ctrls = _.extend(ctrls, {
                'share-btn': !file.get("shareLinkId"),
                'del-share-btn': !!file.get("shareLinkId"),
                'attention-btn': !file.get("remind"),
                'del-attention-btn': file.get("remind"),
                'faviourte-btn': !file.isFolder() && !file.get("favorite"),
                'del-faviourte-btn': !file.isFolder() && file.get("favorite")
            });

            if (!file.get("lockByUserId")) {
                ctrls = _.extend(ctrls, {
                    'lock-btn': !file.isFolder(),
                    'move-btn': true,
                    'rename-btn': true,
                    'delete-btn': true
                })
            } else if (this.hasUnlockPermissin(file.get("lockByUserId"))) {
                ctrls = _.extend(ctrls, {
                    'unlock-btn': !file.isFolder(),
                    'move-btn': true,
                    'rename-btn': true,
                    'delete-btn': true
                })
            }
            return ctrls;
        },

        /**
         * 返回每个文件项的icon操作图标控制对象
         * @param file
         */
        getIconCtrls: function (file) {
            var ctrls = {
                'file-icon-unlock': false,
                'file-icon-delattention': false,
                'file-icon-delshare': false,
                'file-icon-delfavourite': false,
                'file-icon-convert': false
            }
            if (file.isConvertSupport() && file.isFileConverting()) {
                ctrls = _.extend(ctrls, {'file-icon-convert': true});
            }
            if (!file.isEntDisk())
                return ctrls;

            ctrls = _.extend(ctrls, {
                'file-icon-unlock': !file.isFolder() && file.get("lockByUserId"),
                'file-icon-delattention': !!file.get("remind"),
                'file-icon-delshare': !!file.get("shareLinkId"),
                'file-icon-delfavourite': !file.isFolder() && !!file.get("favorite")
            });

            return ctrls;
        },

        hasUnlockPermissin: function (lockByUserId) {
            return lockByUserId && (lockByUserId === cache.userId);
        },

        /**
         * 是否是根文件夹
         * @param fileId
         * @returns {boolean}
         */
        isRootFolder: function (fileId) {
            return fileId === 'entRoot' || fileId === 'personRoot';
        },

        getRouterForFile: function (type) {
            if (constants.isImgType(type)) {
                return  '#pic';
            } else if (constants.isPdfType(type) || constants.isDocSupport(type)) {
                return  "#pdf";
            } else if (constants.isTxtType(type) || constants.isHtmlType(type)) {
                return  "#html";
            } else if (constants.isOatwType(type)) {
                return  "#edit";
            } else if (constants.isVidType(type)) {
                return  "#vid";
            } else if (constants.isAudType(type)) {
                return  "#aud";
            } else {
                return '#unknow';
            }
        }
    }
})