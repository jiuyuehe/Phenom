define(function (require, exports, module) {

    require("../../utils/crypto-sha256");
    require("../../utils/util");
    require("../../utils/security");

    /**
     * 用户DTO
     */
    window.UserDTO = Backbone.Model.extend({
        urlRoot: "",

        idAttribute: 'userId',

        defaults: {
            onlineStatus: "",
            agent: undefined,
            userType: undefined,
            icon: "",
            empNum: undefined
        },

        isAdmin: function () {
            return this.get("userType") === constants.UserType.Administrator;
        },

        isSecAdmin: function () {
            return this.get("userType") === constants.UserType.SecondAdministrator;
        },

        initialize: function () {
            if (!this.get("icon")) {
                ("f" == this.get("gender")) ? this.set("icon", constants.defaultWomenIcon) : this.set("icon", constants.defaultIcon);
            } else {
                if (this.get("icon") == "images/icon/woman.png" || this.get("icon") == "/os/assets/website/img/defaultAvatar64woman.png") {
                    this.set("icon", constants.defaultWomenIcon);
                } else if (this.get("icon") == "images/icon/man.png" || this.get("icon") == "/os/assets/website/img/defaultAvatar64man.png") {
                    this.set("icon", constants.defaultIcon);
                } else if (this.get("icon") == constants.defaultIcon && "f" == this.get("gender")) {
                    this.set("icon", constants.defaultWomenIcon);
                }
            }
            if (!this.get("realName") && this.get("userName")) {
                this.set("realName", this.get("userName"));
            }

            if (!this.get("deptId")) {
                this.set("deptId", constants.departIdNull);
                this.set("deptName", "未分组联系人");
            } else {
                var depart = collection.departmentList.get(this.get("deptId"));
                depart && this.set("deptName", depart.get("name"));
            }
            if (this.get("onlineStatus") === constants.UserStatus.Corbet && this.id !== cache.userId) {
                this.set("onlineStatus ", constants.UserStatus.Logout);
            }
            if (this.get("registerDate"))
                this.set("registerDate", constants.dateFromMillSec(this.get("registerDate"), "YYYY-MM-0d"));
            !this.get("locked") && (this.set("locked", false));
        },

        /**
         * 设置指定用户为当前用户的常用联系人
         */
        setUsualContact: function (userId, callback) {
            resturl.setUsualContact({
                userId: this.get("userId"),
                usualContactUserList: [userId]
            }, callback).start();
        },

        /**
         * 删除常用联系人
         * @param userId
         * @param callback
         */
        deleteUsualContact: function (userId, callback) {
            resturl.deleteUsualContact({
                userId: this.get("userId"),
                usualContactUserList: [userId]
            }, callback).start();
        },

        /**
         * 发送用户上线消息
         */
        sendUserJoinMsg: function () {
            resturl.sendMessage({
                code: util.guid(),
                messageType: "UserJoin",
                messageBody: util.getAgent(),
                sender: cache.userId,
                fromUser: cache.username,
                receiver: cache.entId,
                sendDate: Date.parse(new Date())
            }).start();
        },

        isOffline: function () {
            return _.contains([constants.UserStatus.Offline, constants.UserStatus.UserLeave, constants.UserStatus.Logout], this.get("onlineStatus"));
        },

        /**
         * 发送强制其他登录端下线的消息
         */
        sendForceOfflineMsg: function () {
            resturl.sendMessage({
                code: util.guid(),
                messageType: MessageType.ForceOffline,
                messageBody: cache.clientId,
                sender: cache.userId,
                receiver: cache.userId,
                sendDate: Date.parse(new Date())
            }).start();
        },

        logout: function () {
            resturl.logout(this.id).start();
            //发送用户退出消息
            resturl.sendMessage({
                code: util.guid(),
                sender: cache.userId,
                receiver: cache.entId,
                messageType: 'UserLea',
                fromUser: cache.username,
                sendDate: Date.parse(new Date())
            }).start();
        },

        /**
         * 发送视频邀请
         * @param {UserDTO} she
         */
        sendVideoInviteMsg: function (she) {
            this.sendVideoMsg(she, MessageType.VideoInvite);
        },

        /**
         *  发送视频开始消息
         * @param {UserDTO} she
         */
        sendVideoStartMsg: function (she) {
            this.sendVideoMsg(she, MessageType.VideoStart);
        },

        /**
         * 发送视频结束消息
         * @param {UserDTO} she
         */
        sendVideoEndMsg: function (she) {
            this.sendVideoMsg(she, MessageType.VideoEnd);
        },

        /**
         * 发送拒绝视频消息
         * @param {UserDTO} she
         */
        sendVideoRefuseMsg: function (she) {
            this.sendVideoMsg(she, MessageType.VideoRefuse);
        },

        sendVideoMsg: function (she, messageType) {
            resturl.sendMessage({
                code: util.guid(),
                messageId: util.guid(),
                messageType: messageType,
                messageBody: cache.clientId,
                sender: cache.userId,
                fromUser: cache.username,
                receiver: she.id,
                sendDate: Date.parse(new Date())
            }).start();
        },

        /**
         * 更新企业信息
         *
         * @param callback
         */
        updateUserInfo: function (callback) {
            var userModel = _.omit(this.toJSON(), "prevOnlineStatus");
            var userJson = JSON.stringify(userModel);
            resturl.updateUserProfile(userJson,function (result) {
                if (constants.isResponseOK(result)) {
                    resturl.sendMessage({
                        code: util.guid(),
                        messageType: MessageType.UserInfoUpdate,
                        messageBody: userJson,
                        sender: cache.userId,
                        fromUser: cache.username,
                        receiver: cache.entId,
                        sendDate: Date.parse(new Date())
                    }).start();
                    model.currentUser.set(userModel);
                    model.currentUser.set("prevOnlineStatus", model.currentUser.get("onlineStatus"));
                }
                callback && callback(result);
            }).start();
        },

        /**
         * 修改用户的状态
         *
         * @param changeStatus
         */
        changeUserStatus: function (changeStatus) {
            var that = this;
            resturl.changeUserStatus({
                userId: cache.userId,
                entId: cache.entId,
                userStatus: changeStatus,
                agent: util.getAgent()
            },function () {
                that.set({
                    onlineStatus: changeStatus,
                    prevOnlineStatus: changeStatus
                });
                collection.userList.trigger(events.changeDepartmentUserOnline, that);
            }).start();
        },

        /**
         * 返回用户展示的名称
         *
         * @returns {*}
         */
        getDisplayName: function () {
            return this.get("realName") || this.get("userName");
        },

        /**
         * 加载用户阻止联系人userid数组
         */
        loadBlockUserIds: function (callback) {
            var that = this;
            resturl.getBlockUserIdsByUserId({
                    entId: cache.entId,
                    userId: cache.userId,
                    blockUserId: this.id
                },function (result) {
                    if (constants.isResponseError(result))
                        return false;

                    var blockUserIds = JSON.parse(result);
                    that.set("blockUserIds", blockUserIds);
                    callback && callback(blockUserIds || []);
                }
            ).start();
        },

        /**
         * 删除阻止联系人
         * @param callback
         */
        deleteEntBlock: function (callback) {
            resturl.deleteEntBlock({
                entId: cache.entId,
                userId: cache.userId,
                blockUserId: this.id
            }, callback).start();
        },

        addAdmin: function (callback) {
            resturl.addAdmin({
                entId: cache.entId,
                userId: cache.userId,
                userIds: [this.id]
            }, callback).start();
        },

        /**
         * 设置二级管理员的权限
         * @param [callback]
         */
        updateAdminPermission: function (callback) {
            var param = this.get("adminPermission").toJSON();
            _.extend(param, {
                userId: cache.userId,
                adminUserId: this.id   // 二级管理员的userId
            });
            resturl.updateAdmin(param, callback).start();
        },

        /**
         * 删除二级管理员
         */
        delAdmin: function (callback) {
            resturl.delAdmin({
                entId: cache.entId,
                userId: cache.userId,
                adminUserId: this.id
            }, callback).start();
        },

        /**
         * 管理员重置用户密码
         * @param newpwd
         * @param callback
         */
        resetPassword: function (newpwd, callback) {
            var nonceDTO = Security.getNonceDTO(this.id, newpwd);
            resturl.resetPassword(_.extend({
                entId: cache.entId,
                userId: cache.userId,
                resetUserId: this.id,
                agent: 'web'
            }, nonceDTO), callback).start();
        }
    });

});