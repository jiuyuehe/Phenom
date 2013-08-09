define(function (require, exports, module) {

    /**
     * 设置DTO
     */
    window.SettingDTO = Backbone.Model.extend({
        urlRoot: "",

        defaults: {
            minBodyWidth: 977,
            minBodyHeight: 698,
            minMainboxHeight: 631,
            minContentRightWidth: 500,

            headerHeight: 67,
            slideRightHeaderHeight: 26,
            slideRightNavTabHeight: 37,
            slideRightSearchHeight: 40,

            fileOperationBarHeight: 61,
            filleBreadcrumb: 30,
            fileTableHeaderHeight: 35,
            folderTreeBottomHeight: 112,
            fileThumbHeight: 190,
            fileDealBtnHeight: 95,

            contentLeftWidth: 206,
            contentRightMargin: 20,
            slideRightWidth: 270,

            adminTitleHeight: 45,
            adminNameHeight: 30,
            adminNavtabsHeight: 68,
            adminButtonHeight: 40,
            adminFolderPermissionHeight:51,
            adminSubBtnHeight: 35,
            adminRecordSpaceHeight: 20,
            adminUserMgrTitleHeight: 40,

            width: 0,
            height: 0
        },

        getSlideContentHeight: function () {
            return this.getMainboxHeight() - this.get("slideRightHeaderHeight") - this.get("slideRightNavTabHeight");
        },

        geDepartmentTreeHeight: function () {
            return this.getMainboxHeight() - this.get("slideRightHeaderHeight") - this.get("slideRightNavTabHeight")
                - this.get("slideRightSearchHeight") - 15;
        },

        getSlideRightContentHeight: function () {
            return this.getMainboxHeight() - this.get("slideRightHeaderHeight");
        },

        getNewConferenceHeight: function () {
            return this.getMainboxHeight() - this.get("slideRightHeaderHeight") - this.get("slideRightNavTabHeight")
                 - 10;
        },

        /**
         * 返回常用联系人树的高度
         */
        getUsualContactTreeHeight: function () {
            return this.getMainboxHeight() - this.get("slideRightHeaderHeight") - this.get("slideRightNavTabHeight")
                - 40;
        },

        getContentRightWidth: function () {
            return this.get("width") - this.get("contentLeftWidth") - 1;
        },

        getContentRightWidthMinusSlide: function () {
            return this.get("width") - this.get("contentLeftWidth") - this.get("slideRightWidth") - 1;
        },

        getMainboxHeight: function () {
            return this.get("height") - this.get("headerHeight")-25;
        },

        getMainboxWidth: function () {
            return this.get("width");
        },

        getFileTableHeight: function () {
            var height = this.getMainboxHeight() - this.get("fileOperationBarHeight")
                - this.get("filleBreadcrumb") - this.get("fileTableHeaderHeight") - 10;
            return height;
        },

        getFolderTreeHeight: function () {
            return this.getMainboxHeight() - this.get("folderTreeBottomHeight");
        },

        getFileDetailHeight: function () {
            return this.getMainboxHeight() - this.get("slideRightHeaderHeight") - this.get("fileThumbHeight") - this.get("fileDealBtnHeight");
        },

        getAdminLeftHeight: function () {
            return this.getMainboxHeight();
        },

        getAdminServicesHeight: function () {
            return this.getMainboxHeight() - this.get("adminTitleHeight") - this.get("adminNameHeight") - this.get("adminNavtabsHeight");
        },

        getAdminShareDiskHeight: function () {
            return this.getMainboxHeight() - this.get("adminTitleHeight") - this.get("adminNavtabsHeight") - this.get("adminButtonHeight");
        },

        getAdminFolderPermissionHeight: function () {
            return this.getMainboxHeight() - this.get("adminTitleHeight") - this.get("adminNavtabsHeight") - this.get("adminFolderPermissionHeight") - this.get("adminSubBtnHeight");
        },

        getAdminSetRoleHeight: function () {
            return this.getMainboxHeight() - this.get("adminTitleHeight") - this.get("adminNavtabsHeight") - this.get("adminButtonHeight") - this.get("adminSubBtnHeight");
        },

        getAdminRecordDepartHeight: function () {
            return this.getMainboxHeight() - this.get("adminTitleHeight") - this.get("adminRecordSpaceHeight") - this.get("adminButtonHeight");
        },

        getAdminRecordHeight: function () {
            return this.getMainboxHeight() - this.get("adminTitleHeight") - this.get("adminRecordSpaceHeight") - this.get("adminNavtabsHeight");
        },

        getAdminUserMgrHeight: function () {
            return this.getMainboxHeight() - this.get("adminTitleHeight") - this.get("adminNavtabsHeight") - this.get("adminButtonHeight") - this.get("adminUserMgrTitleHeight");
        },

        getAdminCommMarHeight: function () {
            return this.getMainboxHeight() - this.get("adminTitleHeight") - this.get("adminNavtabsHeight") - this.get("adminButtonHeight") - this.get("adminNameHeight");
        }
    })
})