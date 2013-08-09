define(function (require, exports, module) {

    window.DepartmentTree = Backbone.View.extend({
        tagName: 'ul',
        id: "departmentTree",
        className: 'departmentTree ztree',
        zTree: undefined,

        initialize: function () {
            this.departmentList = this.collection;
            this.listenTo(this.departmentList, EventType.loadDepartment, this.addDepartmentNodes);
            this.render();
        },

        render: function () {
            this.$el.html("");

            var that = this;
            this.zTree = $.fn.zTree.init(this.$el, {
                view: {
                    dblClickExpand: false,
                    showLine: false,
                    selectedMulti: false
                },
                edit: {
                    enable: true,
                    showRemoveBtn: false,
                    showRenameBtn: false
                },
                data: {
                    simpleData: {
                        enable: true,
                        idKey: "id",
                        pIdKey: "parentId",
                        rootPId: ""
                    }
                },
                callback: {
                    beforeClick: function (treeId, treeNode) {
                        that.zTree.expandNode(treeNode);
                        return true;
                    },
                    beforeRename: that.beforeRename()
                }
            }, []);
            if (this.departmentList.length > 0) {
                this.addDepartmentNodes(this.departmentList);
            }
        },

        beforeRename: function () {
            var that = this;
            return function (treeId, treeNode, newName) {
                if (!treeNode.rename && !treeNode.newDepart)
                    return true;

                if (!newName || !$.trim(newName) || newName === '新建的部门') {
                    alertify.alert("请输入合法的部门名称!");
                    return false;
                }

                if (treeNode.newDepart) {
                    that.submitNewDepart(treeId, treeNode, newName);
                    return false;
                }
                if (treeNode.rename) {
                    that.submitRenameDepart(treeId, treeNode, newName);
                    return false;
                }
                return false;
            };
        },

        submitRenameDepart: function (treeId, treeNode, newName) {
            var that = this;
            var depart = this.departmentList.get(treeNode.id);
            depart.renameDept(newName, function (result) {
                switch (result) {
                    case ErrorType.errorSameName:
                        alertify.alert("该部门名称重复了!");
                        break;
                    case  ErrorType.error500:
                        alertify.alert("重命名部门失败!");
                        break;
                    default:
                        alertify.alert("重命名部门成功!");
                        _.extend(treeNode, {
                            id: depart.id,
                            name: depart.get("name"),
                            rename: false
                        });
                        that.zTree.updateNode(treeNode);
                        that.zTree.cancelEditName();
                }
            });
        },

        submitNewDepart: function (treeId, treeNode, newName) {
            var that = this;
            var depart = this.departmentList.get(treeNode.id);
            depart.set("name", newName);
            depart.addDept(function (result) {
                switch (result) {
                    case ErrorType.errorSameName:
                        alertify.alert("该部门名称重复了!");
                        break;
                    case  ErrorType.error500:
                        alertify.alert("新建部门失败!");
                        break;
                    default:
                        alertify.alert("新建部门成功!");
                        _.extend(treeNode, {
                            id: depart.id,
                            name: depart.get("name"),
                            newDepart: null
                        });
                        that.zTree.updateNode(treeNode);
                        that.zTree.cancelEditName();
                }
            });
        },

        /**
         * 处理添加部门事件
         */
        showAddDepartView: function (department) {
            log.debug(" showAddDepartView");
            this.departmentList.add(department);

            var parentNode = department.get("parentId") === constants.departIdNull ? null
                : this.zTree.getNodeByParam("id", department.get("parentId"));
            var nodes = this.zTree.addNodes(parentNode, {
                id: department.get("departmentId"),
                parentId: department.get("parentId") || 0,
                name: department.get("name"),
                open: false,
                type: 'department',
                isParent: true,
                newDepart: true
            }, true);
            this.zTree.editName(nodes[0]);
        },

        showRenameView: function (department) {
            var node = this.zTree.getNodeByParam("id", department.id);
            if (node) {
                node.rename = true;
                this.zTree.editName(node);
            } else {
                alertify.alert("该部门不存在!");
            }
        },

        /**
         * 将该部门员工树恢复到初始状态, 即清除所有选中的
         */
        reset: function () {
            this.zTree.checkAllNodes(false);
        },

        /**
         * 返回选中的部门, 没有选中时返回null
         */
        getSelectDepart: function () {
            var nodes = this.zTree.getSelectedNodes();
            if (!nodes.length)
                return null;
            return this.departmentList.get(nodes[0].id);
        },

        deleteSelectNode: function () {
            var that = this;
            var nodes = this.zTree.getSelectedNodes();
            if (!nodes.length)
                return;
            that.zTree.removeNode(nodes[0]);
        },

        addDepartmentNodes: function (departmentList) {
            departmentList.each(function (department) {
                this._addDepartmentNode(departmentList, department);
            }, this);
        },

        _addDepartmentNode: function (departmentList, department) {
            if (department.id === constants.departIdNull)
                return false;

            var currentNode = this.zTree.getNodeByParam("id", department.id);
            if (currentNode)
                return currentNode;

            var parentNode = null;
            if (department.get("parentId")) {
                parentNode = this.zTree.getNodeByParam("id", department.get("parentId"));
                if (!parentNode) {
                    parentNode = this._addDepartmentNode(departmentList, departmentList.get(department.get("parentId")));
                }
            }
            var nodes = this.zTree.addNodes(parentNode, {
                id: department.get("departmentId"),
                parentId: department.get("parentId") || 0,
                name: department.get("name"),
                open: false,
                type: 'department',
                isParent: true
            }, true);
            return nodes[0];
        }
        /**end view*/})
})