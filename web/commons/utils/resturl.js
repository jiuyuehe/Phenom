define(function (require, exports, module) {

    var baseurl = "/os";

    var services = {};

//    var restful = {
//        "getUserInfo": "/sc/user/getUserInfo"
//    }
//
//    _.each(restful, function (value, key) {
//        services[key] = function (param, callback) {
//            return this.ajaxTask(this.param("/sc/ent/getEnterprise", param), callback);
//        };
//    })

    return {

        baseurl: baseurl,
        /**
         * 调用后台服务的路径
         */
        serviceUrl: baseurl + "/flexService",
        /**
         * 发送消息路径
         */
        sendMessageUrl: baseurl + '/sendmessage',
        /**
         * 普通文件上传路径
         */
        uploadUrl: baseurl + '/sc/file/fileRoutingUpload',
        /**
         * 单个文件下载路径
         */
        singleFileDownload: baseurl + '/sc/file/fileDownload',

        folderDownload: baseurl + "/sc/folder/download",
        multiFileDownload: baseurl + "/sc/multifile/download",
        /**
         * 单个分享文件下载路径
         */
        singleShareFileDownload: baseurl + '/sc/file/shareLinkDownload',
        /**
         * 照相头像路径
         */
        takePhotoUrl: baseurl + '/sc/swf/takePicture',
        /**
         * 获取图片地址及尺寸
         */
        getPicUrl: baseurl + '/sc/file/viewFileAsImage',
        /**
         * 验证码校验
         */
        checkWordVerifyUrl: baseurl + '/servlet/wordVerify',

        getMediaStreamUrl: baseurl + '/file/getMediaStream',

        ajaxTask: function (option, callback) {
            var isJsonRequired = (option.dataType === 'json');
            option.dataType = 'text';
            return new Wind.Async.Task(function (task) {
                jQuery.extend(option, {
                    success: function (data) {
                        var result = data;
                        if (constants.isResponseError(data)) {
                            log.info("[resturl] ", option.headers.serviceType, ' fail: ', data);
                        } else if (isJsonRequired) {
                            result = JSON.parse(data);
                        }
                        callback && callback(result);
                        task.complete("success", result);
                    },

                    error: function (data) {
                        log.error("[resturl] ", option.headers.serviceType, ' http error: ', data);
                        callback && callback("error500");
                        task.complete("success", 'error500');
                    }
                });
                $.ajax(option);
            });
        },

        param: function (serviceType, data) {
            return {
                url: this.serviceUrl,
                type: 'POST',
                headers: {
                    'serviceType': serviceType,
                    'UT': cache.token,
                    'Content-Type': 'text/plain; charset=UTF-8',
                    'Accept': 'text/plain;charset=UTF-8'
                },
                timeout: 10000,
                data: _.isString(data) ? data : JSON.stringify(data),
                dataType: 'json'
            };
        },

        webServiceParam: function (serviceUrl, data) {
            return {
                url: serviceUrl,
                type: 'POST',
                headers: {
                    'UT': cache.token,
                    'Content-Type': 'text/plain; charset=UTF-8',
                    'Accept': 'text/plain;charset=UTF-8'
                },
                data: _.isString(data) ? data : JSON.stringify(data),
                dataType: 'text'
            };
        },

        webServiceParamHeader: function (serviceUrl, data, headers) {
            return {
                url: serviceUrl,
                type: 'POST',
                headers: headers,
                data: _.isString(data) ? data : JSON.stringify(data),
                dataType: 'text'
            };
        },

        paramString: function (serviceType, data, options) {
            return _.extend(this.param(serviceType, data), {'dataType': 'text', processData: false}, options || {});
        },

        sendMessageParam: function (data) {
            return _.extend(this.param("", data), {'dataType': 'text', "url": this.sendMessageUrl});
        },

        /**
         * 发送JMS消息
         * @param  {object} data
         * @return {string}      return OK if success.
         */
        sendMessage: function (data, callback) {
            return this.ajaxTask(this.sendMessageParam(data), callback);
        },

        /** 获取用户信息 */
        getUserProfile: function (data, callback) {
            return this.ajaxTask(this.param("/sc/login/getUserProfile", data), callback);
        },

        /**
         *更新用户信息，
         * @param  {[type]} data [UserInfoDTO]
         * @return {[type]}      [ok，error]
         */
        updateUserProfile: function (data) {
            return this.ajaxTask(this.paramString("/sc/login/updateUserProfile", data));
        },

        /** 获取企业信息 */
        getEnterprise: function (data, callback) {
            return this.ajaxTask(this.param("/sc/ent/getEnterprise", data), callback);
        },

        /**
         * 按文件夹取企业网盘子文件夹和文件，取顶层文件夹时，文件夹id传null
         *
         * @param {FolderAndFileParamDTO}
         *            folderAndFileParamDTO 包含了userId和folderIds的DTO
         * @return {ShareFolderAndFileDTO} 企业网盘文件夹list和文件list
         */
        getEntFolderAndFileByFolderId: function (folderAndFileParamDTO, callback) {
            return this.ajaxTask(this.param("/sc/shareDisk/getEntFolderAndFileByFolderId", folderAndFileParamDTO), callback);
        },
        /**
         * 按文件夹取个人网盘子文件夹和文件，取顶层文件夹时，文件夹ID传null
         *
         * @param {FolderAndFileParamDTO}
         *            folderAndFileParamDTO 如果要去顶层文件夹, folderId为null
         * @return {[type]} [description]
         */
        getPersonalFolderAndFileByFolderId: function (folderAndFileParamDTO, callback) {
            return this.ajaxTask(this.param('/sc/disk/getPersonalFolderAndFileByFolderId', folderAndFileParamDTO), callback);
        },

        /**
         * 按企业id取企业网盘文件夹列表
         * @param baseParam
         * @param [callback]
         * @return List<EnterpriseFolderDTO>的JSON：企业网盘文件夹的list
         */
        getEntFolderByEntId: function (baseParam, callback) {
            return this.ajaxTask(this.param("/sc/entDisk/getEntFolderByEntId", baseParam), callback);
        },

        /**
         * 取企业角色列表
         * @param baseParam
         * @param [callback]
         * @return List<RoleDTO>的JSON：角色list
         */
        getRoleList: function (baseParam, callback) {
            return this.ajaxTask(this.param("/sc/entDisk/getRoleList", baseParam), callback);
        },

        /**
         * 新建角色
         * @param createRoleParam
         * @param [callback]
         * @return roleId：角色id
         */
        createRole: function (createRoleParam, callback) {
            return this.ajaxTask(this.paramString("/sc/entDisk/createRole", createRoleParam), callback);
        },

        /**
         * 重命名角色
         * @param renameRoleParam
         * @param [callback]
         * @return OK
         */
        renameRole: function (renameRoleParam, callback) {
            return this.ajaxTask(this.paramString("/sc/entDisk/renameRole", renameRoleParam), callback);
        },

        /**
         * 删除角色
         * @param roleIdParam
         * @param [callback]
         * @returns {*}
         */
        deleteRoleById: function (roleIdParam, callback) {
            return this.ajaxTask(this.paramString("/sc/entDisk/deleteRoleById", roleIdParam), callback);
        },

        /**
         * 按角色取权限
         * @param roleIdParam
         * @param [callback]
         * @return List<PermissionDTO>的JSON：权限list
         */
        getPermissionsByRoleId: function (roleIdParam, callback) {
            return this.ajaxTask(this.param("/sc/entDisk/getPermissionsByRoleId", roleIdParam), callback);
        },

        /**
         * 设置角色权限
         * @param rolePermissionParam
         * @param [callback]
         * @return OK
         */
        updateRolePermissions: function (rolePermissionParam, callback) {
            return this.ajaxTask(this.paramString("/sc/entDisk/updateRolePermissions", rolePermissionParam), callback);
        },

        /**
         * 按用户id取企业部门和成员,包含在线状态，不包含角色信息
         *
         * @param {string}
         *            userId
         * @return {DepartmentAndUserDTO} 企业部门和用户DTO
         */
        getDepartmentAndUserWithStatusByUserId: function (userId, callback) {
            return this.ajaxTask(this.param('/sc/ent/getDepartmentAndUserWithStatusByUserId', userId), callback);
        },

        /**
         * 按用户取部门和同事列表，包括用户在线状态
         * @param baseParam
         * @param callback
         * @returns {*}
         */
        getDeptAndUserWithStatus: function (baseParam, callback) {
            return this.ajaxTask(this.param('/sc/user/getDeptAndUserWithStatus', baseParam), callback);
        },

        /**
         * 取联系人分组列表和联系人列表
         * @param baseParam
         * @param [callback]
         * @returns {*}
         */
        getContactGroupAndUser: function (baseParam, callback) {
            return this.ajaxTask(this.param('/sc/contact/getContactGroupAndUser', baseParam), callback);
        },

        /**
         * 删除常用联系人信息
         *
         * @param {UsualContactDTO}
         *            usualContactDTO
         * @return {String} OK error500
         */
        deleteUsualContact: function (usualContactDTO, callback) {
            return this.ajaxTask(this.paramString('/sc/usualContact/deleteUsualContact', usualContactDTO), callback);
        },

        /**
         * 设置常用联系人信息
         *
         * @param {UsualContactDTO}
         *            usualContactDTO
         * @return {String} OK error500
         */
        setUsualContact: function (usualContactDTO, callback) {
            return this.ajaxTask(this.paramString('/sc/usualContact/setUsualContact', usualContactDTO), callback);
        },

        /**
         * 取会议列表包括参会者
         *
         * @param {ConferenceDTO}
         *            conDTO
         */
        createConference: function (conDTO, callback) {
            return this.ajaxTask(this.webServiceParam(baseurl + '/sc/conference/createConference', conDTO), callback);
            //return this.ajaxTask(this.webServiceParam(this.getPicUrl, ViewFileDTO), callback);
        },

        /**
         *  取企业网盘回收站中的文件和文件夹
         * @param   long entId 企业ID
         * @return     企业网盘文件夹list,和文件list
         */
        getEntFolderAndFileInRecycle: function (entId, callback) {
            return this.ajaxTask(this.paramString('/sc/shareDisk/getEntFolderAndFileInRecycle', entId), callback);
        },

        /**
         * 取个人网盘中的回收站的文件和文件列表
         * @param userId    用户id;
         * @param {function} [callback]  回调函数
         * @returns {*}回调函数中的值
         */
        getPersonalFolderAndFileInRecycle: function (userId, callback) {
            return this.ajaxTask(this.paramString('/sc/disk/getPersonalFolderAndFileInRecycle', userId), callback);
        },

        getPersonalFolderAndFileInRecycle: function (userId, callback) {
            return this.ajaxTask(this.paramString('/sc/disk/getPersonalFolderAndFileInRecycle', userId), callback);
        },

        /**
         * 新建企业网盘目录
         */
        newShareFolder: function (entFile, callback) {
            return this.ajaxTask(this.paramString('/sc/shareDisk/newShareFolder', entFile), callback);
        },

        /**
         * 新建企业网盘文件夹
         */
        createEntFolder: function (CreateFolderParam, callback) {
            return this.ajaxTask(this.paramString('/sc/entDisk/createEntFolder', CreateFolderParam), callback);
        },

        /**
         * 添加个人文件夹
         */
        addDiskFolder: function (param, callback) {
            return this.ajaxTask(this.paramString('/sc/disk/addFolder/', param), callback);
        },

        /**
         * 新建或保存文档
         *
         * @param {json}
         *            newFileDTO 新建文档DTO
         * @return {FileDTO} [description]
         */
        saveFile: function (newFileDTO, callback) {
            return this.ajaxTask(this.paramString("/sc/file/saveHtml", newFileDTO), callback);
        },

        /**
         * 用户密码修改
         *
         * @param {json}
         *            passwordChangeDTO
         */
        changeAdminPassword: function (passwordChangeDTO, callback) {
            return this.ajaxTask(this.paramString('/sc/ent/changeAdminPassword', passwordChangeDTO), callback);

        },
        /**
         * 用户密码修改
         * @param {json}      passwordChangeDTO
         * @param {function} [callback]
         */
        changePassword: function (passwordChangeDTO, callback) {
            return this.ajaxTask(this.paramString('/sc/login/changePassword', passwordChangeDTO), callback);

        },
        /**
         * [ 验证用户密码 ]
         * @param  passwordChangeDTO
         * @param {function} [callback]
         * @return {[type]} String
         */
        checkPassword: function (passwordChangeDTO, callback) {
            return this.ajaxTask(this.paramString('/sc/ent/checkUserPassword', passwordChangeDTO), callback);
        },

        /**
         * 删除个人文件到回收站中
         * @param personalFileParam
         * @param {function} [callback]
         * @return {string} OK or error500
         */
        deletePersonalFileToRecycle: function (personalFileParam, callback) {
            return this.ajaxTask(this.paramString('/sc/disk/deleteFileToRecycle', personalFileParam), callback);
        },

        /**
         * 删除个人文件夹到回收站中
         *
         * @param personalFolderParam
         * @param {function} [callback]
         * @return {string} OK or error500
         */
        deletePersonalFolderToRecycle: function (personalFolderParam, callback) {
            return this.ajaxTask(this.paramString('/sc/disk/deleteFolderToRecycle', personalFolderParam), callback);
        },

        /**
         * 删除个人网盘文件夹和文件至回收站
         *
         * @param personalFolderAndFileParam
         * @param {function} [callback]
         * @returns {*}
         */
        deletePersonalFolderAndFileToRecycle: function (personalFolderAndFileParam, callback) {
            return this.ajaxTask(this.paramString('/sc/disk/deletePersonalFolderAndFileToRecycle', personalFolderAndFileParam), callback);
        },

        /**
         * 修改企业信息
         */
        updateEnterprise: function (data, callback) {
            return this.ajaxTask(this.paramString('/sc/ent/updateEnterprise', data), callback);
        },

        /**
         * 删除企业网盘文件至回收站
         *
         * @param shareFileParam
         * @param {function} [callback]
         * @returns {string} OK or error500
         */
        deleteShareFileToRecycle: function (shareFileParam, callback) {
            return this.ajaxTask(this.paramString('/sc/shareDisk/deleteShareFileToRecycle', shareFileParam), callback);
        },

        /**
         *  删除企业文件夹到回收站
         *
         * @param shareFolderParam
         * @param {function} [callback]
         * @returns {string} OK or error500
         */
        deleteShareFolderToRecycle: function (shareFolderParam, callback) {
            return this.ajaxTask(this.paramString('/sc/shareDisk/deleteShareFolderToRecycle', shareFolderParam), callback);
        },

        /**
         *  删除企业网盘文件夹至回收站
         *
         * @param EntFolderParam
         * @param {function} [callback]
         * @returns {string} OK or error500
         */
        deleteEntFolderToRecycle: function (EntFolderParam, callback) {
            return this.ajaxTask(this.paramString('/sc/entDisk/deleteEntFolderToRecycle', EntFolderParam), callback);
        },

        /**
         *  删除企业网盘文件夹和文件至回收站
         *
         * @param shareFolderAndFileParam
         * @param {function} [callback]
         * @returns {*}
         */
        deleteShareFolderAndFileToRecycle: function (shareFolderAndFileParam, callback) {
            return this.ajaxTask(this.paramString('/sc/shareDisk/deleteShareFolderAndFileToRecycle', shareFolderAndFileParam), callback);
        },

        /**
         *  获得个人收藏夹文件列表
         * @param userId
         * @param {function} [callback]  回调函数, 可以不传
         * @returns {FavoriteFilesDTO}  企业网盘文件列表DTO. 个人网盘不能收藏文件
         */
        getFavoriteFiles: function (userId, callback) {
            return this.ajaxTask(this.paramString('/sc/favoriteFile/getFavoriteFile', userId), callback);
        },

        /**
         * 添加个人收藏夹文件列表
         * @param favoriteFilesDTO
         * @param {function} [callback]
         * @returns {string} OK or error500
         */
        addFavoriteFile: function (favoriteFilesDTO, callback) {
            return this.ajaxTask(this.paramString('/sc/favoriteFile/addFavoriteFile', favoriteFilesDTO), callback);
        },

        /**
         * 取消个人收藏夹文件列表
         * @param favoriteFilesDTO
         * @param {function} [callback]
         * @returns OK or error500
         */
        delFavoriteFile: function (favoriteFilesDTO, callback) {
            return this.ajaxTask(this.paramString('/sc/favoriteFile/delFavoriteFile', favoriteFilesDTO), callback);
        },

        /**
         * 关注企业网盘文件夹和文件
         * @param folderAndFileIdParam
         * @param {function} [callback]
         * @returns {string} OK or errorNoPermission or error500
         */
        remindShareFolderAndFile: function (folderAndFileIdParam, callback) {
            return this.ajaxTask(this.paramString('/sc/shareDisk/remindShareFolderAndFile', folderAndFileIdParam), callback);
        },

        /**
         *  获取企业文件
         * @param fileId
         * @returns {shareFileDTO}
         */
        getShareFileById: function (fileId, callback) {
            return this.ajaxTask(this.paramString('/sc/shareDisk/getShareFileById', fileId), callback);
        },

        /**
         * 返回文件信息， 包括文件收藏、分享等状态信息
         * @param shareFileIdParam
         * @param {function} [callback]
         * @returns {*}
         */
        getShareFileWithStatus: function (shareFileIdParam, callback) {
            return this.ajaxTask(this.paramString('/sc/shareDisk/getShareFile', shareFileIdParam), callback);
        },

        /**
         * 按文件夹id取单个企业网盘文件夹信息, 不包括文件的收藏等信息
         *  @param folderId
         * @param  callback
         * @returns {shareFolderDTO}
         */
        getShareFolderById: function (folderId, callback) {
            return this.ajaxTask(this.paramString('/sc/shareDisk/getShareFolderById', folderId), callback);
        },

        /**
         *返回文件信息,包括文件状态
         * @param shareFolderIdParam
         * @param {function} [callback]
         * @returns {*}
         */
        getShareFolderWithStatus: function (shareFolderIdParam, callback) {
            return this.ajaxTask(this.paramString('/sc/shareDisk/getShareFolder', shareFolderIdParam), callback);
        },

        /**
         * 获取个人文件
         * @param fileId
         * @param {function} [callback]
         * @returns {*}
         */
        getPersonFileById: function (fileId, callback) {
            return this.ajaxTask(this.paramString('/sc/disk/getFileById', fileId), callback);
        },

        /**
         *  取个人网盘中的单个文件夹信息
         * @param folderId
         * @param {function} [callback]
         * @returns {*}
         */
        getPersonFolderById: function (folderId, callback) {
            return this.ajaxTask(this.paramString('/sc/disk/getPrivateFolderById', folderId), callback);
        },

        /**
         * 取单个文件夹信息
         * @param folderId
         * @param {function} [callback]  [optional]
         * @returns {networkFileDTO}
         */
        getPersonalFolderById: function (folderId, callback) {
            return this.ajaxTask(this.paramString('/sc/disk/getPrivateFolderById', folderId), callback);
        },

        /*
         * 创建文件共享外链
         * @return {object} ShareLinkDTO
         * */
        createShareFileLink: function (createFileLinkParam, callback) {
            return this.ajaxTask(this.paramString('/sc/shareLink/createShareFileLink', createFileLinkParam), callback);
        },

        /*
         * 创建文件夹共享外链
         * @return {object} ShareLinkDTO
         * */
        createShareFolderLink: function (createFolderLinkParam, callback) {
            return this.ajaxTask(this.paramString('/sc/shareLink/createShareFolderLink', createFolderLinkParam), callback);
        },

        /**
         * 企业网盘文件重命名
         * @param {RenameShareFileParam}
         * @returns {string}
         */
        renameShareFile: function (param, callback) {
            return this.ajaxTask(this.paramString('/sc/shareDisk/renameShareFile', param), callback);
        },

        /**
         *  企业网盘文件夹重命名
         * @param {RenameShareFolderParam}
         * @returns {string}
         */
        renameShareFolder: function (param, callback) {
            return this.ajaxTask(this.paramString('/sc/shareDisk/renameShareFolder', param), callback);
        },

        /**
         *  企业网盘文件夹重命名
         * @param {RenameShareFolderParam}
         * @returns {string}
         */
        renameEntFolder: function (param, callback) {
            return this.ajaxTask(this.paramString('/sc/entDisk/renameEntFolder', param), callback);
        },

        /**
         * 个人网盘文件重命名
         * @param {RenamePersonalFileParam}
         * @returns {string}
         */
        renamePersonalFile: function (param, callback) {
            return this.ajaxTask(this.paramString('/sc/disk/renamePersonalFile', param), callback);
        },

        /**
         *  个人网盘文件夹重命名
         * @param {RenamePersonalFolderParam}
         * @returns {string}
         */
        renamePersonalFolder: function (param, callback) {
            return this.ajaxTask(this.paramString('/sc/disk/renamePersonalFolder', param), callback);
        },

        /**
         * 企业网盘文件移动
         * @param moveShareFileParam
         * @returns {string} OK
         */
        moveShareFile: function (moveShareFileParam, callback) {
            return this.ajaxTask(this.paramString('/sc/shareDisk/moveShareFile', moveShareFileParam), callback);
        },

        /**
         * 企业网盘文件夹移动
         * @param moveShareFolderParam
         * @returns {string} OK
         */
        moveShareFolder: function (moveShareFolderParam, callback) {
            return this.ajaxTask(this.paramString('/sc/shareDisk/moveShareFolder', moveShareFolderParam), callback);
        },

        /**
         * 企业网盘文件和文件夹移动
         * @param moveShareFolderAndFileParam
         * @returns {string} OK
         */
        moveShareFolderAndFile: function (moveShareFolderAndFileParam, callback) {
            return this.ajaxTask(this.paramString('/sc/shareDisk/moveShareFolderAndFile', moveShareFolderAndFileParam), callback);
        },

        /**
         * 个人网盘文件移动
         * @param movePersonalFileParam
         * @returns {string} OK
         */
        movePersonalFile: function (movePersonalFileParam, callback) {
            return this.ajaxTask(this.paramString('/sc/disk/movePersonalFile', movePersonalFileParam), callback);
        },

        /**
         * 个人网盘文件夹移动
         * @param movePersonalFolderParam
         * @returns {string} OK
         */
        movePersonalFolder: function (movePersonalFolderParam, callback) {
            return this.ajaxTask(this.paramString('/sc/disk/movePersonalFolder', movePersonalFolderParam), callback);
        },

        /**
         * 个人网盘文件和文件夹移动
         * @param MovePersonalFolderAndFileParam
         * @returns {string} OK
         */
        movePersonalFolderAndFile: function (MovePersonalFolderAndFileParam, callback) {
            return this.ajaxTask(this.paramString('/sc/disk/movePersonalFolderAndFile', MovePersonalFolderAndFileParam), callback);
        },

        /**
         *   取用户分享记录
         * @param userId
         * @returns {*}
         */
        getShareLinkByUserId: function (userId, callback) {
            return this.ajaxTask(this.paramString('/sc/shareLink/getShareLinkByUserId', userId), callback);
        },

        /**
         *   取用户分享记录
         * @param entId
         * @returns {*}     ShareLinksDTO
         */
        getShareLinkByEntId: function (entId, callback) {
            return this.ajaxTask(this.paramString('/sc/shareLink/getShareLinkByEntId', entId), callback);
        },

        /**
         * 更新外链
         * @param updateShareLinkParam
         * @returns {*}
         */
        updateLink: function (updateShareLinkParam, callback) {
            return this.ajaxTask(this.paramString('/sc/shareLink/updateLink', updateShareLinkParam), callback);
        },

        /**
         * 删除共享链接
         * @param ShareLinkParam的JSON：外链参数  {entId:XXX,userId:XXX,linkId:XXX}
         * @returns {*}
         */
        deleteShareLink: function (shareLinkParam, callback) {
            return this.ajaxTask(this.paramString('/sc/shareLink/deleteLink', shareLinkParam), callback);
        },
        /**
         * 批量删除链接
         * @param ShareLinkParam的JSON：外链参数  [{entId:XXX,userId:XXX,linkId:XXX}]
         * @returns {*}
         */
        deleteEntShareLinks: function (shareLinks, callback) {
            return this.ajaxTask(this.paramString('/sc/shareLink/deleteLinks', shareLinks), callback);
        },

        /**
         * 按外链code获取共享链接
         * @param linkCode 链接代码
         * @returns ShareLinkInfoDTO 共享链接信息DTO
         */
        getShareLinkByCode: function (linkCode, callback) {
            return this.ajaxTask(this.param('/pub/shareLink/getShareLinkByCode', linkCode), callback);
        },

        /**
         * 按linkId获取共享链接
         * @param linkId 链接代码
         * @returns ShareLinkInfoDTO 共享链接信息DTO
         */
        getShareLinkByLinkId: function (linkId, callback) {
            return this.ajaxTask(this.param('/sc/shareLink/getShareLinkByLinkId', linkId), callback);
        },

        /**
         * 验证共享链接是否可以下载
         * @param linkID  外链ID
         * @returns {String} OK
         */
        checkShareLinkDownload: function (linkID, callback) {
            return this.ajaxTask(this.paramString('/sc/shareLink/checkShareLinkDownload', linkID), callback);
        },

        /**
         * 按外链id取共享的文件夹列表和文件列表
         * @param linkID  外链ID
         * @returns ShareLinkFilesDTO的JSON
         */
        getShareLinkFiles: function (linkID, callback) {
            return this.ajaxTask(this.param('/sc/shareDisk/getShareLinkFiles', linkID), callback);
        },

        /**
         * 验证共享链接是否可以下载
         * @param linkId:size：外链id+":"+文件大小kb
         * @returns {String} OK
         */
        updateShareLinkDownCount: function (linkIDSize, callback) {
            return this.ajaxTask(this.paramString('/sc/shareLink/updateShareLinkDownCount', linkIDSize), callback);
        },

        /**
         *  将文件转成html，浏览文件
         *
         * @param viewFileDTO
         * @returns {*}
         */
        viewFileAsHtml: function (viewFileDTO, callback) {
            return this.ajaxTask(this.paramString('/sc/file/viewFileAsHtml', viewFileDTO), callback);
        },

        /**
         *  将文件转成html，在线编辑文件
         *
         * @param viewFileDTO
         * @returns {*}
         */
        editFileAsHtml: function (viewFileDTO, callback) {
            return this.ajaxTask(this.paramString('/sc/file/editFileAsHtml', viewFileDTO), callback);
        },

        /**
         * 员工登录
         * @param LogonParam
         * @returns {token：用户令牌}
         */
        logon: function (LogonParam, callback) {
            return this.ajaxTask(this.paramString('/pub/user/logon', LogonParam, {timeout: 10000}), callback);
        },

        /**
         * 私有云员工域登录
         * @param LogonParam
         * @returns {token：用户令牌}
         */
        loginByLdap: function (LogonParam, callback) {
            return this.ajaxTask(this.paramString('/pub/user/loginByLdap', LogonParam, {timeout: 10000}), callback);
        },

        /**
         * 员工登录
         * @param loginDTO
         * @returns {EnterpriseLoginDTO Or error}
         */
        login: function (loginDTO, callback) {
            return this.ajaxTask(this.paramString('/pub/ent/enterpriseUserLogin', loginDTO, {timeout: 10000}), callback);
        },

        /**
         * 管理员登录
         * @param loginDTO
         * @returns {*}
         */
        adminLogin: function (loginDTO, callback) {
            return this.ajaxTask(this.paramString('/pub/ent/admin/login', loginDTO, {timeout: 10000}), callback);
        },

        /**
         * 退出登录
         * @param userId
         * @returns {string} OK
         */
        logout: function (userId, callback) {
            return this.ajaxTask(this.paramString('/sc/login/logout', userId), callback);
        },

        /*
         *  验证码校验
         *  @param code 验证码
         *  @returns {string} true
         * */
        checkWordVerify: function (code, callback) {
            return this.ajaxTask(this.webServiceParamHeader(this.checkWordVerifyUrl, code, ""), callback);
        },

        /**
         * 检查企业名是否被注册
         * @param entName
         * @returns {} false 可以使用
         */
        checkEntName: function (entName, callback) {
            return this.ajaxTask(this.paramString('/pub/ent/existEnterprise', entName), callback);
        },

        /**
         * 企业注册
         * @param EnterpriseDTO
         * @returns {String} OK
         */
        registerEnterprise: function (EnterpriseDTO, callback) {
            return this.ajaxTask(this.paramString('/pub/ent/admin/registerEnterprise', EnterpriseDTO, {timeout: 10000}), callback);
        },

        /**
         * 修改用户状态
         * @param userStatusDTO
         * @returns {string} OK
         */
        changeUserStatus: function (userStatusDTO, callback) {
            return this.ajaxTask(this.paramString('/sc/login/changeUserStatus', userStatusDTO), callback);
        },

        /**
         * 修改用户信息
         * @param userInfoDTO
         * @returns {string} OK
         */
        updateUserProfile: function (userInfoDTO, callback) {
            return this.ajaxTask(this.paramString('/sc/login/updateUserProfile', userInfoDTO), callback);
        },

        /**
         * 取企业网盘已使用空间
         * @param entId
         * @returns {long} 企业网盘已使用空间，单位KB
         */
        getShareDiskUsedSizeByEntId: function (entId, callback) {
            return this.ajaxTask(this.paramString('/sc/shareDisk/getShareDiskUsedSizeByEntId', entId), callback);
        },

        /**
         * 从个人网盘回收站恢复文件
         * @param personalFileParam
         * @returns {*}
         */
        restorePersonalFile: function (personalFileParam, callback) {
            return this.ajaxTask(this.paramString('/sc/disk/restorePersonalFile', personalFileParam), callback);
        },

        /**
         *   从个人网盘回收站恢复文件夹
         */
        restorePersonalFolder: function (personalFolderParam, callback) {
            return this.ajaxTask(this.paramString('/sc/disk/restorePersonalFolder', personalFolderParam), callback);
        },

        /**
         *   从个人网盘回收站恢复文件夹和文件
         * @param personalFolderAndFileParam
         */
        restorePersonalFolderAndFile: function (personalFolderAndFileParam, callback) {
            return this.ajaxTask(this.paramString('/sc/disk/restorePersonalFolderAndFile', personalFolderAndFileParam), callback);
        },

        /**
         * 清空个人网盘回收站
         * @param baseParam
         */
        emptyPersonalRecycle: function (baseParam, callback) {
            return this.ajaxTask(this.paramString('/sc/disk/emptyPersonalRecycle', baseParam), callback);
        },

        /**
         *  清空企业网盘回收站
         * @param baseParam
         * @param {function} [callback]
         * @returns {*}
         */
        emptyEntRecycle: function (baseParam, callback) {
            return this.ajaxTask(this.paramString('/sc/shareDisk/emptyRecycle', baseParam), callback);
        },

        /**
         * 从企业网盘回收站恢复文件
         * @param shareFileParam
         * @returns {*}
         */
        restoreShareFile: function (shareFileParam, callback) {
            return this.ajaxTask(this.paramString('/sc/shareDisk/restoreShareFile', shareFileParam), callback);
        },

        /**
         *  从企业网盘回收站恢复文件夹
         * @param shareFolderParam
         * @returns {*}
         */
        restoreShareFolder: function (shareFolderParam, callback) {
            return this.ajaxTask(this.paramString('/sc/shareDisk/restoreShareFolder', shareFolderParam), callback);
        },

        /**
         * 从企业网盘回收站恢复文件夹和文件
         * @param shareFolderAndFileParam
         * @returns {*}
         */
        restoreShareFolderAndFile: function (shareFolderAndFileParam, callback) {
            return this.ajaxTask(this.paramString('/sc/shareDisk/restoreShareFolderAndFile', shareFolderAndFileParam), callback);
        },

        /**
         * 删除企业网盘回收站文件
         * @param shareFileParam
         * @returns {*}
         */
        deleteRecycleShareFile: function (shareFileParam, callback) {
            return this.ajaxTask(this.paramString('/sc/shareDisk/deleteRecycleShareFile', shareFileParam), callback);
        },

        /**
         *  删除企业网盘回收站文件夹
         * @param shareFolderParam
         * @returns {*}
         */
        deleteRecycleShareFolder: function (shareFolderParam, callback) {
            return this.ajaxTask(this.paramString('/sc/shareDisk/deleteRecycleShareFolder', shareFolderParam), callback);
        },

        /**
         *  删除企业网盘回收站文件夹和文件
         * @param shareFolderAndFileParam
         * @returns {*}
         */
        deleteRecycleShareFolderAndFile: function (shareFolderAndFileParam, callback) {
            return this.ajaxTask(this.paramString('/sc/shareDisk/deleteRecycleShareFolderAndFile', shareFolderAndFileParam), callback);
        },

        /**
         *   删除个人网盘回收站文件
         * @param personalFileParam
         * @param {function} [callback]
         * @returns {*}
         */
        deleteRecyclePersonalFile: function (personalFileParam, callback) {
            return this.ajaxTask(this.paramString('/sc/disk/deleteRecyclePersonalFile', personalFileParam), callback);
        },

        /**
         *  删除个人网盘回收站文件夹
         * @param personalFolderParam
         * @param {function} [callback]
         * @returns {*}
         */
        deleteRecyclePersonalFolder: function (personalFolderParam, callback) {
            return this.ajaxTask(this.paramString('/sc/disk/deleteRecyclePersonalFolder', personalFolderParam), callback);
        },

        /**
         *  删除个人网盘回收站文件夹和文件
         * @param personalFolderAndFileParam
         * @param {function} [callback]
         * @returns {*}
         */
        deleteRecyclePersonalFolderAndFile: function (personalFolderAndFileParam, callback) {
            return this.ajaxTask(this.paramString('/sc/disk/deleteRecyclePersonalFolderAndFile', personalFolderAndFileParam), callback);
        },

        /*
         *  企业网盘全局搜索文件
         *  @param SearchFileParamDTO的JSON：文件搜索参数
         *  @SearchShareFilesDTO的JSON：企业网盘搜索文件list
         * */
        searchFilesAll: function (SearchFileParamDTO, callback) {
            return this.ajaxTask(this.paramString('/sc/shareDisk/searchShareFile', SearchFileParamDTO), callback);
        },

        /*
         *  个人网盘全局搜索文件
         *  @param SearchFileParamDTO的JSON：文件搜索参数
         *  @SearchPersonalFilesDTO的JSON：企业网盘搜索文件list
         * */
        searchPersonalFilesAll: function (SearchFileParamDTO, callback) {
            return this.ajaxTask(this.paramString('/sc/disk/searchPersonalFile', SearchFileParamDTO), callback);
        },

        /*
         *  取图片地址及尺寸
         *  @param ViewFileDTO的JSON：文件转换浏览信息
         *  @ViewFileDTO的JSON ViewFileResultDTO.url为图片地址，ViewFileResultDTO.width 为图片宽度px，ViewFileResultDTO.height为图片高度px
         * */
        getImageInfo: function (ViewFileDTO, callback) {
            return this.ajaxTask(this.webServiceParam(this.getPicUrl, ViewFileDTO), callback);
        },

        /**
         * 个人网盘复制到功能
         */
        copyPersonFile: function (sharePersonalFileDTO, callback) {
            return this.ajaxTask(this.paramString('/sc/shareDisk/sharePersonalFile', sharePersonalFileDTO), callback);
        },

        /**
         *   取用户离线消息
         * @param userId
         * @returns {*}
         */
        getOfflineMessageByUserId: function (userId) {
            return this.ajaxTask(this.param('/sc/message/getOfflineMessage', userId));
        },
        confirmMessage: function (messageDTO, callback) {
            return this.ajaxTask(this.paramString('/sc/message/confirmMessage', messageDTO), callback);
        },

        /**
         *获取用户聊天历史消息
         * @param getHistoryDTO {userId,buddyUserId,skipResults, maxResults}
         * @return MessagesDTO
         */
        getChatHistory: function (getHistoryDTO, callback) {
            return this.ajaxTask(this.paramString('/sc/message/getChatHistory', getHistoryDTO), callback);
        },
        /**
         * 取历史记录
         *
         * @param {string}
         *            userId
         */
        getMessageRecord: function (userId, callback) {
            return this.ajaxTask(this.paramString('/sc/message/getMessageRecord', userId), callback);
        },

        /**
         * 获取最近7天的文件访问记录
         * @param message
         * @param {function} [callback]
         * @returns {*}
         */
        getFileAccessRecords: function (callback) {
            return this.ajaxTask(this.paramString('/sc/message/getEntRecord', {
                sender: cache.userId,
                messageType: MessageType.FileAccessRecord,
                sendDate: moment().subtract("days", 7).valueOf() + ''
            }), callback);
        },
        /**
         * 取会议列表包括参会者
         *
         * @param {string}
         *            userId
         */
        getConferenceListByUserId: function (userId) {
            return this.ajaxTask(this.param('/sc/conference/getConferenceByUserId', userId));
        },
        /**
         * 取会议列表包括参会者
         *
         * @param {ConferenceDTO}
         *            conDTO
         */
        deleteConference: function (conDTO, callback) {
            return this.ajaxTask(this.webServiceParam(baseurl + '/sc/conference/deleteConference', conDTO), callback);
        },

        /**
         * 取文件夹的所有父文件夹id
         * @param shareFolderParam
         * @returns {*}
         */
        getParentIdsByFolder: function (shareFolderParam, callback) {
            return this.ajaxTask(this.paramString('/sc/shareDisk/getParentIdsByFolder', shareFolderParam), callback);
        },

        /**
         * 取文件的所有父文件夹id
         * @param shareFileParam
         * @param {function} callback
         * @returns {*}
         */
        getParentIdsByFile: function (shareFileParam, callback) {
            return this.ajaxTask(this.paramString('/sc/shareDisk/getParentIdsByFile', shareFileParam), callback);
        },

        /**
         * 检查文件操作权限
         *
         * @param checkPermissionDTO
         * @param {function} [callback]
         * @returns {*}
         */
        checkPermission: function (checkPermissionDTO, callback) {
            return this.ajaxTask(this.paramString('/sc/shareDisk/checkPermission', checkPermissionDTO), callback);
        },

        /**
         *检查多个文件的操作权限
         *
         * @param checkPermissionsDTO
         * @param {function} [callback]
         * @returns {*}
         */
        checkPermissions: function (checkPermissionsDTO, callback) {
            return this.ajaxTask(this.paramString('/sc/shareDisk/checkPermissions', checkPermissionsDTO), callback);
        },

        /**
         * 按文件取企业网盘文件历史修改记录
         * @param shareFileUpdateDTO
         * @param {function} [callback]
         * @returns {*}
         */
        getShareFileHistory: function (shareFileUpdateDTO, callback) {
            return this.ajaxTask(this.paramString('/sc/shareDisk/getShareFileHistory', shareFileUpdateDTO), callback);
        },

        /**
         * 按文件夹取企业网盘文件夹历史修改记录
         * @param shareFolderUpdateDTO
         * @param {optional | function} callback
         * @returns {*}
         */
        getShareFolderHistory: function (shareFolderUpdateDTO, callback) {
            return this.ajaxTask(this.paramString('/sc/shareDisk/getShareFolderHistory', shareFolderUpdateDTO), callback);
        },

        /**
         *  恢复企业网盘文件历史版本
         * @param shareFileParam
         * @param {optional} callback
         * @returns {*}
         */
        restoreShareFileVersion: function (shareFileParam, callback) {
            return this.ajaxTask(this.paramString('/sc/shareDisk/restoreShareFileVersion', shareFileParam), callback);
        },

        /**
         * 恢复企业网盘文件夹历史版本
         * @param shareFolderParam  {folderId, version}
         * @param {optional} callback
         * @returns {*}
         */
        restoreShareFolderVersion: function (shareFolderParam, callback) {
            return this.ajaxTask(this.paramString('/sc/shareDisk/restoreShareFolderVersion', shareFolderParam), callback);
        },

        /**
         * 按文件夹和版本取企业网盘文件夹历史版本详细修改记录
         * @param shareFolderUpdateDTO {folderId, version}
         * @param {function} [callback]
         * @returns {object} ShareHistoryDTO
         */
        getShareFolderVersionDetail: function (shareFolderUpdateDTO, callback) {
            return this.ajaxTask(this.paramString('/sc/shareDisk/getShareFolderVersionDetail', shareFolderUpdateDTO), callback);
        },

        /**
         * 检查企业网盘文件夹权限
         * @param checkFolderPermissionParam
         * @param {function} [callback]
         * @returns {*}
         */
        checkFolderPermission: function (checkFolderPermissionParam, callback) {
            return this.ajaxTask(this.paramString('/sc/shareDisk/checkFolderPermission', checkFolderPermissionParam), callback);
        },

        /**
         * 编辑会议
         *
         * @param {ConferenceDTO}
         *            conDTO
         */
        updateConference: function (conDTO, callback) {
            return this.ajaxTask(this.paramString('/sc/conference/updateConference', conDTO), callback);
        },

        /**
         * 删除视频会议文档
         *
         * @param {ConferenceDocsDTO}
         */
        deleteConferenceDoc: function (docsDTO, callback) {
            return this.ajaxTask(this.webServiceParam(baseurl + '/sc/conference/deleteConferenceDoc', docsDTO), callback);
        },

        /**
         * 锁定企业网盘文件
         * @param shareFileDTO
         * @param {function} [callback]
         * @returns {*}
         */
        lockShareFile: function (shareFileDTO, callback) {
            return this.ajaxTask(this.paramString('/sc/file/lockShareFile', shareFileDTO), callback);
        },

        /**
         * 解锁企业网盘文件
         * @param ShareFilesDTO的JSON：文件信息list
         * @param {function} [callback]
         * @returns {*}  OK or error500
         */
        unlockShareFiles: function (shareFilesDTO, callback) {
            return this.ajaxTask(this.paramString('/sc/file/unlockShareFiles', shareFilesDTO), callback);
        },

        /**
         * 取会议文档
         *
         * @param {ConferenceDTO}
         *            conDTO
         */
        getConferenceDocs: function (id, callback) {
            return this.ajaxTask(this.paramString('/sc/conference/getConferenceDocsByConId', id), callback);
        },

        /**
         * 将文件转成swf，浏览文件
         * @param viewFileResultDTO
         * @param {function} callback
         * @returns {*}
         */
        viewFileAsSwf: function (viewFileResultDTO, callback) {
            return this.ajaxTask(this.paramString('/sc/file/viewFileAsSwf', viewFileResultDTO), callback);
        },

        /**
         * 保存企业文件到个人网盘
         *
         * @param saveFileDTO
         * @param {function} [callback]
         * @returns {*}
         */
        saveEntFileToPersonDisk: function (saveFileDTO, callback) {
            return this.ajaxTask(this.webServiceParam(baseurl + '/sc/file/saveFileToDisk', saveFileDTO), callback);
        },

        /**
         * 批量发送消息
         *
         * @param messagesDTO
         * @param {function} [callback]
         * @returns {*}
         */
        sendMessages: function (messagesDTO, callback) {
            return this.ajaxTask(this.paramString('/sc/message/sendMessages', messagesDTO), callback);
        },

        /**
         * 批量发送消息
         *
         * @param messagesDTO
         * @param {function} [callback]
         * @returns {*}
         */
        updateConferenceMember: function (memberDTO, callback) {
            return this.ajaxTask(this.paramString('/sc/conference/updateConferenceMember', memberDTO), callback);
        },

        /**
         * 取媒体文件地址
         *
         * @param viewFileParam
         * @param {function} [callback]
         * @returns {*}
         */
        viewFileAsMedia: function (viewFileParam, callback) {
            return this.ajaxTask(this.webServiceParam(baseurl + '/sc/file/viewFileAsMedia', viewFileParam), callback);
        },

        getMediaStream: function (viewFileParam, callback) {
            return this.ajaxTask(this.webServiceParam('/file/getMediaStream', viewFileParam), callback);
        },

        /**
         * 关注文件
         * @param shareFileIdParam
         * @param {function} [callback]
         * @returns {string} OK or error500
         */
        remindFile: function (shareFileIdParam, callback) {
            return this.ajaxTask(this.paramString('/sc/shareDisk/remindShareFile', shareFileIdParam), callback);
        },

        /*
         * 关注文件夹
         * @program {shareFolderIdParam} 企业网盘文件夹id参数
         * returns {string} OK or error500 or nopermission;
         * */
        remindFolder: function (shareFolderIdParam, callback) {
            return this.ajaxTask(this.paramString('/sc/shareDisk/remindShareFolder', shareFolderIdParam), callback);
        },

        /**
         *关注企业网盘文件夹和文件
         * @param ShareFolderAndFileIdParam
         * @param {function} [callback]
         * @return {*}
         */
        remindShareFolderAndFile: function (ShareFolderAndFileIdParam, callback) {
            return this.ajaxTask(this.paramString('/sc/shareDisk/remindShareFolderAndFile', ShareFolderAndFileIdParam), callback);
        },

        /**
         * 关注文件
         * @param shareFileIdParam
         * @param {function} [callback]
         * @returns {string} OK or error500
         */
        deleteRemindShareFile: function (shareFileIdParam, callback) {
            return this.ajaxTask(this.paramString('/sc/shareDisk/deleteRemindShareFile', shareFileIdParam), callback);
        },

        /*
         * 取消关注企业网盘文件夹
         * @program {ShareFolderIdParam} 企业网盘文件夹id参数
         * returns {string} OK or error500 or nopermission;
         * */
        deleteRemindShareFolder: function (shareFolderIdParam, callback) {
            return this.ajaxTask(this.paramString('/sc/shareDisk/deleteRemindShareFolder', shareFolderIdParam), callback);
        },

        /**
         * 取消关注企业网盘文件夹和文件
         * @param shareFolderAndFileIdParam
         * @param {function} [callback]
         * @returns {*}
         */
        deleteRemindShareFolderAndFile: function (shareFolderAndFileIdParam, callback) {
            return this.ajaxTask(this.paramString('/sc/shareDisk/deleteRemindShareFolderAndFile', shareFolderAndFileIdParam), callback);
        },

        /**
         * 设置企业网盘文件备注
         *
         * @param shareFileRemarkParam
         * @param {function} [callback]
         * @returns {*}
         */
        updateShareFileRemark: function (shareFileRemarkParam, callback) {
            return this.ajaxTask(this.paramString('/sc/shareDisk/updateShareFileRemark', shareFileRemarkParam), callback);
        },

        /**
         * 设置企业网盘文件夹备注
         *
         * @param shareFolderRemarkParam
         * @param {function} [callback]
         * @returns {*}
         */
        updateShareFolderRemark: function (shareFolderRemarkParam, callback) {
            return this.ajaxTask(this.paramString('/sc/shareDisk/updateShareFolderRemark', shareFolderRemarkParam), callback);
        },

        /**
         *取用户关注的文件夹和文件
         * @param BaseParam
         * @param [callback]
         * @returns {object} EntFolderAndFileDTO
         */
        getRemindEntFolderAndFile: function (BaseParam, callback) {
            return this.ajaxTask(this.paramString('/sc/entDisk/getRemindEntFolderAndFile', BaseParam), callback);
        },

        /**
         * 取分享的文件夹和文件列表
         *
         * @param baseParam
         * @param {function} [callback]
         * @returns {*}
         */
        getLinkFolderAndFile: function (baseParam, callback) {
            return this.ajaxTask(this.param('/sc/shareLink/getLinkFolderAndFile', baseParam), callback);
        },

        /**
         * 取会议信息
         *
         * @param id
         *            conDTO
         */
        getConferenceById: function (id, callback) {
            return this.ajaxTask(this.paramString('/sc/conference/getConferenceById', id), callback);
        },

        /**
         * 设置企业网盘文件备注
         *
         * @param remarkParam
         * @param {function} [callback]
         * @returns {*}
         */
        updatePersonalFileRemark: function (remarkParam, callback) {
            return this.ajaxTask(this.paramString('/sc/disk/updatePersonalFileRemark', remarkParam), callback);
        },

        /**
         * 设置企业网盘文件夹备注
         *
         * @param remarkParam
         * @param {function} [callback]
         * @returns {*}
         */
        updatePersonalFolderRemark: function (remarkParam, callback) {
            return this.ajaxTask(this.paramString('/sc/disk/updatePersonalFolderRemark', remarkParam), callback);
        },

        /**
         *   取同事在线状态
         * @param baseParam
         * @param {function} [callback]
         * @returns {*}
         */
        getUserStatuses: function (baseParam, callback) {
            return this.ajaxTask(this.paramString('/sc/user/getUserStatuses', baseParam), callback);
        },

        /**
         * 修改用户在线状态
         * @param changeUserStatusParam
         * @returns {*}
         */
        changeOlineStatus: function (changeUserStatusParam) {
            return this.ajaxTask(this.paramString('/sc/user/changeOlineStatus', changeUserStatusParam));
        },

        /**
         * 添加参会人
         * @param {function} [callback]
         * @param memberPam
         */
        addConferenceMembers: function (memberPam, callback) {
            return this.ajaxTask(this.paramString('/sc/conference/addConferenceMembers', memberPam), callback);
        },

        /**
         * 获取企业网盘的文件和文件夹
         * @param folderAndFileIdParam
         * @param {function} [callback]
         * @returns {*}
         */
        getShareFolderAndFileById: function (folderAndFileIdParam, callback) {
            return this.ajaxTask(this.param('/sc/shareDisk/getShareFolderAndFileById', folderAndFileIdParam), callback);
        },

        /**
         * 压缩文件夹
         * @param multiFileDownloadDTO
         * @param [callback]
         * @returns {*}
         */
        zipFolder: function (multiFileDownloadDTO, callback) {
            return this.ajaxTask(this.paramString('/sc/folder/zip', multiFileDownloadDTO), callback);
        },

        /**
         * 压缩多个文件
         * @param multiFileDownloadDTO
         * @param [callback]
         * @returns {*}
         */
        zipMultiFiles: function (multiFileDownloadDTO, callback) {
            return this.ajaxTask(this.paramString('/sc/multifile/zip', multiFileDownloadDTO), callback);
        },

        /*
         * 获取企业服务状态信息
         * @param EntId
         *
         * */
        getEntServiceStatus: function (EntId, callback) {
            return this.ajaxTask(this.paramString('/pub/pay/info', EntId), callback);
        },

        /*
         * 返回企业当前的服务信息
         * @param EntId   企业Id
         * */
        getCurrentService: function (EntId, callback) {
            return this.ajaxTask(this.paramString('/sc/service/getCurrServiceList', EntId), callback)
        },

        /**
         * 添加部门
         * @param addDepartmentParam
         * @param [callback]
         * @returns {*}
         */
        addDept: function (addDepartmentParam, callback) {
            return this.ajaxTask(this.paramString('/sc/user/addDept', addDepartmentParam), callback)
        },

        /**
         * 重命名部门
         * @param renameDepartmentParam
         * @param [callback]
         * @returns {*}
         */
        renameDept: function (renameDepartmentParam, callback) {
            return this.ajaxTask(this.paramString('/sc/user/renameDept', renameDepartmentParam), callback)
        },

        /**
         * 删除部门
         * @param departmentIdParam
         * @param [callback]
         * @returns {*}
         */
        deleteDept: function (departmentIdParam, callback) {
            return this.ajaxTask(this.paramString('/sc/user/deleteDept', departmentIdParam), callback)
        },

        /**
         *  添加账号
         * @param addUserParam
         * @param [callback]
         * @returns {*}
         */
        addUser: function (addUserParam, callback) {
            return this.ajaxTask(this.paramString('/sc/user/addUser', addUserParam), callback)
        },

        /**
         * 修改用户信息
         * @param updateUserParam
         * @param [callback]
         * @returns {*}
         */
        updateUserInfo: function (updateUserParam, callback) {
            return this.ajaxTask(this.paramString('/sc/user/updateUserInfo', updateUserParam), callback)
        },

        /**
         * 重置用户信息
         * @param resetUserParam
         * @param [callback]
         * @returns {*}
         */
        resetUserInfo: function (resetUserParam, callback) {
            return this.ajaxTask(this.paramString('/sc/user/resetUserInfo', resetUserParam), callback)
        },

        /**
         * 根据userId获取UserInfo
         * @param userId
         * @param [callback]
         * @returns {*}
         */
        getUserInfo: function (userId, callback) {
            return this.ajaxTask(this.paramString('/sc/user/getUserInfo', userId), callback)
        },

        /**
         * 批量锁定用户
         * @param userIdsParam
         * @param [callback]
         * @returns {*}
         */
        lockUsers: function (userIdsParam, callback) {
            return this.ajaxTask(this.paramString('/sc/user/lockUsers', userIdsParam), callback)
        },

        /**
         * 批量解锁账号
         * @param userIdsParam
         * @param [callback]
         * @returns {*}
         */
        unlockUsers: function (userIdsParam, callback) {
            return this.ajaxTask(this.paramString('/sc/user/unlockUsers', userIdsParam), callback)
        },

        /**
         * 批量删除账号
         * @param userIdsParam
         * @param [callback]
         * @returns {*}
         */
        deleteUsers: function (userIdsParam, callback) {
            return this.ajaxTask(this.paramString('/sc/user/deleteUsers', userIdsParam), callback)
        },

        /**
         * 按用户id取阻止联系人用户id
         * @param blockUserParam
         * @param [callback]
         * @returns {*}
         */
        getBlockUserIdsByUserId: function (blockUserParam, callback) {
            return this.ajaxTask(this.paramString('/sc/block/getBlockUserIdsByUserId', blockUserParam), callback)
        },

        /**
         *  取消企业阻止联系
         * @param blockParam
         * @param [callback]
         * @returns {*}
         */
        deleteEntBlock: function (blockParam, callback) {
            return this.ajaxTask(this.paramString('/sc/block/deleteEntBlock', blockParam), callback)
        },

        /**
         * 设置企业阻止联系人
         * @param entBlockParam
         * @param [callback]
         * @returns {*}
         */
        updateEntBlock: function (entBlockParam, callback) {
            return this.ajaxTask(this.paramString('/sc/block/updateEntBlock', entBlockParam), callback)
        },

        /**
         * 取企业的管理员列表
         * @param baseParam
         * @param [callback]
         * @returns {*}
         */
        getAdminList: function (baseParam, callback) {
            return this.ajaxTask(this.paramString('/sc/admin/getAdminList', baseParam), callback)
        },

        /**
         *  修改管理员权限
         * @param updateAdminParam
         * @param [callback]
         * @returns {*}
         */
        updateAdmin: function (updateAdminParam, callback) {
            return this.ajaxTask(this.paramString('/sc/admin/updateAdmin', updateAdminParam), callback)
        },

        /**
         * 删除管理员
         * @param adminParam
         * @param [callback]
         * @returns {*}
         */
        delAdmin: function (adminParam, callback) {
            return this.ajaxTask(this.paramString('/sc/admin/delAdmin', adminParam), callback)
        },

        /**
         * 添加管理员
         * @param userIdsParam
         * @param [callback]
         * @returns {*}
         */
        addAdmin: function (userIdsParam, callback) {
            return this.ajaxTask(this.paramString('/sc/admin/addAdmin', userIdsParam), callback)
        },

        /*
         * 修改员工默认密码；
         * @param UpdateEmpPwdParam（json）
         * @return {*}
         */
        updateEmpDefaultPwd: function (updateEmpPwdParam, callback) {
            return this.ajaxTask(this.paramString('/sc/ent/updateEmpDefaultPwd', updateEmpPwdParam), callback);
        },

        /**
         *  取登录记录
         * @param baseParam
         * @param [callback]
         * @returns {*} LogonLogDTO
         */
        getLoginLog: function (baseParam, callback) {
            return this.ajaxTask(this.paramString('/sc/user/getLoginLog', baseParam), callback);
        },

        /**
         *  取聊天记录
         * @param baseParam
         * @param [callback]
         * @returns {*}
         */
        getChatRecord: function (baseParam, callback) {
            return this.ajaxTask(this.paramString('/sc/msg/getChatRecord', baseParam), callback);
        },

        /**
         *  分页取聊天详细历史记录
         * @param getChatHistoryParam
         * @param [callback]
         * @returns {*}
         */
        getPagedChatHistory: function (getChatHistoryParam, callback) {
            return this.ajaxTask(this.paramString('/sc/msg/getPagedChatHistory', getChatHistoryParam), callback);
        },

        /**
         *  取企业网盘操作记录
         * @param baseParam
         * @param [callback]
         * @returns {*}
         */
        getFileOperateLog: function (baseParam, callback) {
            return this.ajaxTask(this.paramString('/sc/entDisk/getFileOperateLog', baseParam), callback);
        },

        /**
         * 取企业网盘文件下载和预览记录
         * @param baseParam
         * @param [callback]
         * @returns {*}
         */
        getFileAccessLog: function (baseParam, callback) {
            return this.ajaxTask(this.paramString('/sc/entDisk/getFileAccessLog', baseParam), callback);
        },

        /**
         * 设置员工默认密码
         * @param updateEmpPwdParam
         * @param [callback]
         * @returns {*}
         */
        updateEmpDefaultPwd: function (updateEmpPwdParam, callback) {
            return this.ajaxTask(this.paramString('/sc/ent/updateEmpDefaultPwd', updateEmpPwdParam), callback);
        },

        /**
         * 重置用户密码
         * @param resetPasswordParam
         * @param callback
         * @returns {*}
         */
        resetPassword: function (resetPasswordParam, callback) {
            return this.ajaxTask(this.paramString('/sc/user/resetPassword', resetPasswordParam), callback);
        },

        /**
         *  按角色取用户id
         * @param roleIdParam
         * @param [callback]
         * @returns {*}
         */
        getUserIdsByRoleId: function (roleIdParam, callback) {
            return this.ajaxTask(this.paramString('/sc/entDisk/getUserIdsByRoleId', roleIdParam), callback);
        },

        /**
         *  设置用户角色
         * @param roleUsersParam
         * @param callback
         * @returns {*}
         */
        updateRoleUsers: function (roleUsersParam, callback) {
            return this.ajaxTask(this.paramString('/sc/entDisk/updateRoleUsers', roleUsersParam), callback);
        }

    };

})