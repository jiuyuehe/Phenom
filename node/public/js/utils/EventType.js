/**
 * 事件类型常量
 */
define(function (require, exports, module) {

    var entFolderPrefix = 'entFolder: ';
    var currentEntFolderPrefix = 'currentEntFolder:'
    var departmentPrefix = 'department: ';
    var currentUserPrefix = 'currentUser:';

    var fileType = {
        changeCurrentEntFolder: currentEntFolderPrefix + 'change',
        addEntFolder: entFolderPrefix + 'add',
        /**新建文件夹事件*/
        newFile: 'newFile',
        /**
         * 删除文件或者文件夹事件
         */
        removeFile: 'removeFile',
        /**
         * 修改文件事件
         */
        updateFile: 'updateFile',

        /**
         * 移动文件和文件夹事件
         */
        moveFiles: "moveFiles",
        /**
         * 加载文件事件
         */
        loadFile: "loadFile",

        addFolderNodes: "addFolderNodes",

        /**
         * 选择文件夹事件
         */
        selectFile: 'selectFile',
        /**
         * 新建文件事件
         */
        addFile: 'addFile',

        changeCurrentFolder: 'changeCurrentFolder',

        /**
         * 加载完成垃圾文件事件
         */
        loadRecycleFiles: "recycle:load",

        /**
         * 加载完成个人网盘垃圾文件后，触发事件
         *
         */
        loadPersonalRecycleFiles: "personalRecycle:load",

        /**
         * 新增常用联系人事件
         */
        addUsualContact: "addUsualContact",
        /**
         * 删除常用联系人事件
         */
        removeUsualContact: "removeUsualContact",

        /**
         * 锁定企业文件
         */
        lockShareFile: 'lockShareFile',
        /**
         * 添加关注文件消息
         */
        addRemindFile: 'addRemindFile',
        /**
         * 移除关注文件消息
         */
        removeRemindFile: 'removeInterestFile',

        addFavouriteFile: 'addFavouriteFile',

        removeFavouriteFile: 'removeFavouriteFile',
        /**
         * 添加分享事件
         */
        addShareLink: 'addShareLink',
        /**
         * 删除分享事件
         */
        removeShareLink: 'removeShareLink',
        /**
         * 选中企业文件
         */
        selectEntTree: 'selectEntTree',
        /**
         * 选中个人文件
         */
        selectPerTree: 'selectPerTree'
    };

    var userType = {
        addDepartment: departmentPrefix + 'add',
        loadDepartment: departmentPrefix + 'load',
        changeDepartmentUserOnline: departmentPrefix + 'changeOnline',
        currentUserInfoChange: currentUserPrefix + 'InfoChange'
    };


    var systemType = {
        /** Amq连接断开*/
        AmqDisconnect: "AmqDisconnect",
        /**Amq连接建立*/
        AmqConnect: "AmqConnect"
    };


    return _.extend({}, fileType, userType, systemType);
});
