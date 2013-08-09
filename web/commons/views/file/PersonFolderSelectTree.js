define(function (require, exports, module) {

    require("jqueryztree");

    window.PersonFolderSelectTree = Backbone.View.extend({

        tagName: 'ul',
        className: 'ztree personFolderSelectTree',
        id: "personFolderSelectTree",
        zTree: undefined,

        initialize: function () {
            this.listenTo(this.collection, EventType.loadFile, this.onLoadFiles);
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
                    }
                }
            }, []);
            this.addFolderNode(model.rootPersonFolder);
            return this;
        },

        /**在企业文件夹树中添加子节点
         *
         */
        onLoadFiles: function (files, currentFolder) {
            var entFolders = _.filter(files, function (file) {
                return file.isFolder();
            });
            entFolders.length && _.each(entFolders, this.addFolderNode, this);

            var parentNode = this.zTree.getNodeByParam("fileId", currentFolder.id);
            parentNode && !parentNode.open && this.zTree.expandNode(parentNode);
        },

        showDialog: function (okCallback) {
            var that = this;
            $.dialog({
                title: "个人文件目录",
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

        /**
         * 清理Tree的选中项
         */
        clean: function () {
            this.zTree.cancelSelectedNode();
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
                if (constants.isRootFolder(treeNode.fileId)) {
                    return model.rootPersonFolder;
                }
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
        }
        /*object end */});
});
