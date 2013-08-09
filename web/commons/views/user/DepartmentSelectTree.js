/**
 * 部门选择树
 */
define(function (require, exports, module) {

    window.DepartmentSelectTree = Backbone.View.extend({
        tagName: 'ul',
        id: "departmentSelectTree",
        className: 'departmentSelectTree ztree user-tree overflow-auto-y',
        zTree: undefined,
        checkCallback: undefined,

        departmentList: undefined,

        initialize: function () {
            this.departmentList = this.collection;
            this.listenTo(this.departmentList, events.loadDepartment, this.addDepartmentNodes);
            this.render();
        },

        render: function () {
            this.$el.html(" ");
            //this.onChangeHeight();
            var that = this;
            this.zTree = $.fn.zTree.init(this.$el, {
                view: {
                    dblClickExpand: false,
                    showLine: false,
                    selectedMulti: false
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
                    onNodeCreated: function (event, treeId, treeNode) {
                        var id = "#" + treeNode.tId + "_a";
                        that.$el.find(id).addClass(treeNode.type);
                        var checkId = "#" + treeNode.tId + "_check";
                        that.$el.find(checkId).attr("name", treeNode.type + "_chk");
                    },
                    onCheck: this.createCheckDepartCallback()
                }
            }, []);
            setTimeout(function () {
                that.departmentList.length && that.addDepartmentNodes(that.departmentList);
            }, 10);
        },

        close: function () {
            this.undelegateEvents();
            this.remove();
            $.fn.zTree.destroy("contactSelectTree");
        },

        rebind: function () {
            this.initialize();
            this.delegateEvents();
        },

        onChangeHeight: function (heigth) {
            if (heigth)
                this.$el.height(heigth);
            else
                this.$el.height(model.setting.getUsualContactTreeHeight() - 40);
        },

        checkDeparts: function (departIds) {
            log.debug("checkDeparts: ", departIds)
            _.each(departIds, function (departId) {
                var node = this.zTree.getNodeByParam("id", departId);
                node && this.zTree.checkNode(node, true);
            }, this);
        },

        /**
         * 返回选中的部门
         * @returns {*}
         */
        getSelectDepart: function () {
            var nodes = this.zTree.getSelectedNodes();
            if (!nodes.length)
                return null;
            return this.departmentList.get(nodes[0].id);
        },

        /**
         * 选中部门
         * @param departmentId
         */
        selectDepartment: function (departmentId) {
            var selectNode = this.zTree.getNodeByParam("id", departmentId);
            if (selectNode) {
                this.zTree.selectNode(selectNode, false);
            }
        },

        createCheckDepartCallback: function () {
            var that = this;
            return function (event, treeId, treeNode) {
                var checkedNodes = that.zTree.getCheckedNodes(true);
                var departIds = _.map(checkedNodes, function (node) {
                    return node.id;
                });
                that.checkCallback && that.checkCallback(departIds);
            }
        },

        addCheckCallback: function (callback) {
            this.checkCallback = callback;
        },

        showCheckbox: function (show) {
            this.zTree.setting.check.enable = show;
        },

        /**
         * 将该部门员工树恢复到初始状态, 即清除所有选中的
         */
        reset: function () {
            this.zTree.checkAllNodes(false);
        },

        addDepartmentNodes: function (departmentList) {
            departmentList.each(function (department) {
                this._addDepartmentNode(departmentList, department);
            }, this);
        },

        _addDepartmentNode: function (departmentList, department) {
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
    })
})