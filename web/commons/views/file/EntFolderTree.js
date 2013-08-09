define(function (require, exports, module) {

    window.EntFolderTree = Backbone.View.extend({

        tagName: 'ul',
        className: 'ztree',
        id: "entFolderTree",
        zTree: undefined,
        isSelect: false,

        folderList: undefined,

        initialize: function () {
            this.folderList = this.collection;

            this.listenTo(this.folderList, EventType.loadFile, this.onLoadFiles);
            this.listenTo(this.folderList, EventType.addFolderNodes, this.onAddFolderNodes);
            this.listenTo(this.folderList, EventType.newFile, this.addFolderNode);
            this.listenTo(this.folderList, EventType.removeFile, this.removeNode);
            this.listenTo(model.messageEvent, EventType.selectPerTree, this.onSelectPerTree);
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
                data: {
                    simpleData: {
                        enable: true,
                        idKey: "fileId",
                        pIdKey: "parentId",
                        rootPId: ""
                    }
                },
                callback: {
                    beforeExpand: function (treeId, treeNode) {
                        that.$el.find("#" + treeNode.tId + "_a").click();
                        return false;
                    },
                    onClick: function (event, treeId, treeNode) {
                        model.messageEvent.trigger(EventType.selectEntTree, that.folderList.get(treeNode.fileId));
                        var selectFolder = that.folderList.get(treeNode.fileId);
                        that.trigger(EventType.selectFolder, selectFolder || model.rootEntFolder);
                        if ($(event.target).is('a')) {
                            that.zTree.expandNode(treeNode, !treeNode.open);
                        }
                        that.isSelect = true;
                        return false;
                    },
                    beforeRename: this.beforeRename()
                }
            }, []);
            this.addFolderNode(model.rootEntFolder);
            return this;
        },

        close: function () {
            this.undelegateEvents();
            this.remove();
            $.fn.zTree.destroy(this.id);
        },

        rebind: function () {
            this.initialize();
            this.delegateEvents();
        },

        addFolderNode: function (folder, parentNode) {
            if (!folder.isFolder() || this.zTree.getNodeByParam("fileId", folder.get("fileId")))
                return false;

            if (parentNode) {
                this.doAddNode(folder, parentNode);
                retun;
            }

            var parentId = folder.get("parentId");
            var parentNode = parentId ? this.zTree.getNodeByParam("fileId", parentId) : null;
            if ((parentId && parentId !== 'entRoot') && !parentNode) {
                return false;
            }
            this.doAddNode(folder, parentNode);
        },

        onAddFolderNodes: function (folders) {
            _.each(folders, function (folder) {
                this.addFolderNode(folder);
            }, this);
        },

        doAddNode: function (folder, parentNode) {
            return this.zTree.addNodes(parentNode, {
                fileId: folder.get("fileId"),
                parentId: folder.get("parentId") || 0,
                name: folder.get("name"),
                open: false,
                isParent: true,
                iconSkin: 'folder'
            }, true);
        },

        doAddNodes: function (folders, parentNode) {
            this.zTree.addNodes(parentNode, _.map(folders, function (folder) {
                return {
                    fileId: folder.get("fileId"),
                    parentId: folder.get("parentId") || 0,
                    name: folder.get("name"),
                    open: false,
                    isParent: true,
                    iconSkin: 'folder'
                };
            }, this), true);
        },

        removeNode: function (file) {
            var files = _.isArray(file) ? file : [file];
            _.each(files, function (eachFile) {
                eachFile.isFolder() && this.zTree.removeNode(this.zTree.getNodeByParam("fileId", eachFile.id));
            }, this);
        },

        /**
         * 移除全部的子节点
         * @param folderId
         */
        removeChildNodes: function (folderId) {
            var parentNode = this.zTree.getNodeByParam('fileId', folderId);
            if (parentNode) {
                this.zTree.removeChildNodes(parentNode);
            }
        },

        /**
         * 返回选中的文件夹, 没有选中时返回null
         */
        getSelectFolder: function () {
            var nodes = this.zTree.getSelectedNodes();
            if (!nodes.length)
                return null;
            var selectFolder = this.folderList.get(nodes[0].fileId);
            return selectFolder || model.rootEntFolder;
        },

        showAddFolderView: function (folder) {
            this.folderList.unshift(folder);
            var parentNode = this.zTree.getNodeByParam("fileId", folder.get("parentId"));
            var nodes = this.doAddNode(folder, parentNode);
            this.zTree.editName(nodes[0]);
        },

        showRenameView: function (folder) {
            var node = this.zTree.getNodeByParam("fileId", folder.id);
            if (node) {
                node.oldName = node.name;
                this.zTree.editName(node);
            } else {
                alertify.alert("文件夹不存在!");
            }
        },

        beforeRename: function () {
            var that = this;
            return function (treeId, treeNode, newName) {
                if (!newName || !$.trim(newName)) {
                    alertify.alert("请输入合法的文件夹名称！");
                    return false;
                }
                if (treeNode.fileId == 'new') {
                    that.submitNewFolder(treeId, treeNode, newName);
                } else {
                    that.submitRenameFolder(treeId, treeNode, newName);
                }
                return true;
            };
        },

        submitRenameFolder: function (treeId, treeNode, newName) {
            if (treeNode.oldName == newName)
                return true;
            var that = this;
            var folder = this.folderList.get(treeNode.fileId);
            folder.set("name", newName);
            folder.rename(function (result) {
                if (constants.isResponseOK(result)) {
                    folder.reload();
                    alertify.alert("重命名成功!");
                } else {
                    var message;
                    if (result === ErrorType.errorSameFolder) {
                        message = "文件夹名重复！";
                    } else {
                        message = "重命名失败!";
                    }
                    alertify.confirm(message, function (e) {
                        if (e) {
                            treeNode.name = treeNode.oldName;
                            that.showRenameView(that.getSelectFolder());
                        } else {
                            treeNode.name = treeNode.oldName;
                            that.showRenameView(that.getSelectFolder());
                            that.zTree.cancelEditName();
                        }
                    });
                }
            });
        },

        submitNewFolder: function (treeId, treeNode, newName) {
            var that = this;
            var folder = this.folderList.get(treeNode.fileId);
            folder.set("name", newName);
            folder.createFolder(function (result) {
                if (!constants.isResponseError(result)) {
                    folder.set("fileId", result);
                    folder.reload();
                    treeNode.fileId = result;
                    alertify.alert("新建成功!");
                } else {
                    var message;
                    if (result === ErrorType.errorSameFolder) {
                        message = "文件夹名重复！";
                    } else if (result === ErrorType.errorFolderDeleted) {
                        message = "父文件夹被删除！";
                    } else {
                        message = "新建失败!";
                    }
                    alertify.confirm(message, function (e) {
                        if (e) {
                            treeNode.name = treeNode.oldName;
                            that.showRenameView(that.getSelectFolder());
                        } else {
                            treeNode.name = treeNode.oldName;
                            that.showRenameView(that.getSelectFolder());
                        }
                    });
                }
            });
        },

        deleteSelectNode: function () {
            var that = this;
            var nodes = this.zTree.getSelectedNodes();
            if (!nodes.length)
                return;
            var folder = this.folderList.get(nodes[0].fileId);
            resturl.deleteEntFolderToRecycle(folder.asFileParam(),function (result) {
                switch (result) {
                    case ErrorType.OK_MARK:
                        alertify.success("删除成功！");
                        that.zTree.removeNode(nodes[0]);
                        that.folderList.remove(folder);
                        break;
                    case ErrorType.errorEditSysFolder:
                        alertify.success("系统文件夹，不能删除！");
                        break;
                    case ErrorType.error500:
                        alertify.success("系统错误！");
                        break;
                    default:
                        alertify.success("删除失败！");
                }
            }).start();
        },

        onMoveFiles: function (destFolder, moveFiles) {
            var destNode = this.zTree.getNodeByParam('fileId', destFolder.get("fileId"));
            _.each(moveFiles, function (file) {
                if (file.isFolder()) {
                    var moveNode = this.zTree.getNodeByParam('fileId', file.get("fileId"));
                    this.zTree.moveNode(destNode, moveNode, 'inner');
                }
            }, this);
        },

        /**
         * 在企业文件夹树中添加子节点
         */
        onLoadFiles: function (entFiles, currentFolder) {
            var that = this;
            var entFolders = _.filter(entFiles, function (file) {
                return file.isFolder();
            });
            var parentNode = this.zTree.getNodeByParam('fileId', currentFolder.id);
            var treeFileIds = _.pluck(this.zTree.getNodesByParam('parentId', currentFolder.id, parentNode), 'fileId');
            var newFileIds = _.map(entFolders, function (folder) {
                return folder.id;
            });

            var needAddFileIds = _.without(newFileIds, treeFileIds) , needDeleteFileIds = _.without(treeFileIds, newFileIds);
            this.doAddNodes(_.filter(entFolders, function (folder) {
                return _.contains(needAddFileIds, folder.id);
            }), parentNode);

            _.each(needDeleteFileIds, function (folderId) {
                this.zTree.removeNode(this.zTree.getNodeByParam('fileId', folderId, parentNode));
            }, this);
        },

        onSelectPerTree: function () {
            if (this.isSelect) {
                this.$el.find("a.curSelectedNode").removeClass("curSelectedNode");
                this.isSelect = false;
            }
        }

        /*object end */});
});
