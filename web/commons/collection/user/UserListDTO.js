/**
 * 用户集合DTO
 */
define(function (require, exports, module) {

    require("../../model/user/AdminPermissionDTO");

    window.UserListDTO = Backbone.Collection.extend({
        model: UserDTO,
        localStorage: new Backbone.LocalStorage("userListStorage"),
        url: "",

        initialize: function () {
            this.listenTo(model.messageEvent, MessageType.UserJoin, this.onUserJoin);
            this.listenTo(model.messageEvent, MessageType.ColleagueNew, this.onColleagueNew);
            this.listenTo(model.messageEvent, MessageType.UserLeave, this.onUserLeave);
            this.listenTo(model.messageEvent, MessageType.UserStatusChange, this.onUserStatusChange);
            this.listenTo(model.messageEvent, MessageType.UserInfoUpdate, this.onUserInfoUpdate);
        },

        /**
         * 加载/重新加载user到集合中
         * @param userId
         */
        loadUser: function (userId) {
            var that = this;
            resturl.getUserInfo(userId,function (result) {
                if (!constants.isResponseError(result)) {
                    var userDTO = new UserDTO(JSON.parse(result));
                    if (that.get(userDTO.id)) {
                        that.get(userDTO).set(userDTO.toJSON());
                    } else {
                        that.unshift(userDTO).trigger(EventType.addUserEvent, userDTO);
                    }
                }
            }).start();
        },

        fetchSecAdmins: function (userList) {
            var that = this;
            resturl.getAdminList({
                entId: cache.entId,
                userId: cache.userId
            },function (result) {
                if (constants.isResponseError(result))
                    return false;
                var adminPermissDTOs = JSON.parse(result);

                var adminUsers = _.map(adminPermissDTOs, function (permission) {
                    var user = userList.get(permission.userId);
                    user && user.set("adminPermission", new AdminPermissionDTO(permission));
                    return user;
                });

            }).start();
        },

        startUserStatusTimer: function () {
            setInterval(function () {
                resturl.changeOlineStatus({
                    entId: cache.entId,
                    userId: cache.userId,
                    agent: 'web',
                    status: model.currentUser.get("onlineStatus")
                }).start();

                resturl.getUserStatuses({
                    entId: cache.entId,
                    userId: cache.userId
                },function (result) {
                    var userStatusList = JSON.parse(result);
                    _.each(userStatusList, function (statusDTO) {
                        var user = collection.userList.get(statusDTO.userId);
                        user && user.set({'onlineStatus': statusDTO.userStatus});
                    })
                }).start();
            }, 120000);
        },

        getCheckedUsers: function () {
            return this.where({checked: true});
        },

        /**
         * 返回指定部门的员工
         * @param departId
         * @returns {*}
         */
        getDepartUsers: function (departId) {
            return this.where({"departmentId": departId});
        },

        onUserJoin: function (messageDTO) {
            log.debug("UserListDTO > onUserJoin");
            var user = this.get(messageDTO.get("sender"))
            if (user) {
                user.set({
                    onlineStatus: constants.UserStatus.Online,
                    agent: messageDTO.get("messageBody")
                });
            }
        },

        onUserLeave: function (messageDTO) {
            log.debug("UserListDTO > onUserLeave");
            var user = this.get(messageDTO.get("sender"))
            if (user) {
                user.set({onlineStatus: constants.UserStatus.Logout});
            }
        },

        onUserStatusChange: function (messageDTO) {
            log.debug("UserListDTO > onUserStatusChange");
            var user = this.get(messageDTO.get("sender"))
            if (user) {
                user.set({onlineStatus: messageDTO.get("messageBody")});
                if (user.get("onlineStatus") == constants.UserStatus.Corbet && user.get("userId") != cache.userId) {
                    user.set("onlineStatus", constants.UserStatus.Logout);
                }
                collection.userList.trigger(events.changeDepartmentUserOnline, user);
            }
        },

        onUserInfoUpdate: function (messageDTO) {
            log.debug("UserListDTO > onUserInfoUpdate");
            var user = this.get(messageDTO.get("sender"))
            if (user) {
                var userInfoDTO = JSON.parse(messageDTO.get("messageBody"));
                user.set(userInfoDTO);
            }
        },

        onColleagueNew: function (messageDTO) {
            log.debug("UserListDTO > onColleagueNew");
        }
    });

    window.ChatUserListDTO = Backbone.Collection.extend({
        model: UserDTO,
        url: "",

        initialize: function () {
        }
    });
})