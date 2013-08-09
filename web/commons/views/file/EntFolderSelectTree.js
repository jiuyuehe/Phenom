define(function (require, exports, module) {

    require("jqueryztree");

    window.EntFolderSelectTree = Backbone.View.extend({

        tagName: 'ul',
        className: 'ztree entFolderSelectTree folder-tree',
        id: "EntFolderSelectTree",
        zTree: undefined,
        checkCallback: undefined,

        initialize: function () {
            this.listenTo(this.collection, EventType.loadFile, this.onLoadFiles);
            this.render();
        },

        render: function () {
            this.$el.html("");
            var that = this;
            this.zTree = $.fn.zTree.init(this.$el, {
                view: {
                    dblClickExpand: true,
                    showLine: false,
                    selectedMulti: false
                },
                check: {
                    chkboxType: { "Y": "s", "N": "ps" }
                },
                data: {
                    simpleData: {
                        enable: true,
                        idKey: "fileId",
                        pIdKey: "parentId",
                        rootPId: ""
                    }
                },
                callback: {
                    beforeClick: function (treeId, treeNode) {
                        if (!treeNode.open) {
                            that.collection.fetchFolder(treeNode.fileId);
                            that.zTree.expandNode(treeNode);
                            return true;
                        }
                        that.zTree.expandNode(treeNode, false);
                        return false;
                    },
                    onCheck: this.createCheckCallback()

                }
            }, []);
            this.addFolderNode(model.rootEntFolder);
            log.debug('[render]-[EntFolderSelectTree]');
            return this;
        },

        createCheckCallback: function () {
            var that = this;
            return function (event, treeId, treeNode) {
                var checkedNodes = that.zTree.getCheckedNodes(true);
                var folderIds = _.map(checkedNodes, function (node) {
                    return node.fileId;
                });
                that.checkCallback && that.checkCallback(folderIds);
            }
        },

        addCheckCallback: function (callback) {
            this.checkCallback = callback;
        },

        /**在企业文件夹树中添加子节点
         *
         */
        onLoadFiles: function (entFiles, currentFolder) {
            var entFolders = _.filter(entFiles, function (file) {
                return file.isFolder();
            });
            entFolders.length && _.each(entFolders, this.addFolderNode, this);

            var parentNode = this.zTree.getNodeByParam("fileId", currentFolder.id);
            parentNode && !parentNode.open && this.zTree.expandNode(parentNode);
        },

        showDialog: function (okCallback) {
            var that = this;
            $.dialog({
                title: "企业文件目录",
                content: this.el,
                max: false,
                min: false,
                width: 200,
                height: 320,
                init: function () {
                    that.render();
                    that.delegateEvents();
                },
                ok: okCallback,
                cancelVal: "关闭",
                cancel: true
            });
            this.collection.fetchRootFolder();
        },

        onChangeHeight: function (heigth) {
            this.$el.height(heigth);
        },

        /**
         * 清理Tree的选中项
         */
        clean: function () {
            this.zTree.cancelSelectedNode();
        },

        checkFolders: function (folderIds) {
            log.debug("checkFolders: ", folderIds);
            _.each(folderIds, function (folderId) {
                var node = this.zTree.getNodeByParam("fileId", folderId);
                node && this.zTree.checkNode(node, true);
            }, this);
        },

        /**
         * 获取唯一选中的文件夹
         *
         * @returns {*}
         */
        getSelectedFolder: function () {
            var folders = this.getSelectedFolders();
            return folders && folders[0];
        },

        /**
         * 获取选中的多个文件夹
         *
         * @returns {*}
         */
        getSelectedFolders: function () {
            var that = this;
            var selectedFolders = _.map(this.zTree.getSelectedNodes(), function (treeNode) {
                if (constants.isRootFolder(treeNode.fileId))
                    return model.rootEntFolder;
                return that.collection.get(treeNode.fileId);
            });
            return selectedFolders;
        },

        addFolderNode: function (folder) {
            if (!folder.isFolder() || this.zTree.getNodeByParam("fileId", folder.get("fileId")))
                return false;
            var parentId = folder.get("parentId");
            var treeNode = parentId ? this.zTree.getNodeByParam("fileId", parentId) : null;

            this.zTree.addNodes(treeNode, {
                fileId: folder.get("fileId"),
                parentId: folder.get("parentId") || 0,
                name: folder.get("name"),
                open: false,
                isParent: true,
                iconSkin: 'folder'
            }, true)
        },

        showCheckbox: function (show) {
            this.zTree.setting.check.enable = show;
        }

        /*object end */});
});
