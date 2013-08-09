define(function (require, exports, module) {

    /**
     * 添加常用联系人树
     *
     */
    window.ContactSelectTree = Backbone.View.extend({
        tagName: 'ul',
        id: "contactSelectTree",
        className: 'contactSelectTree ztree user-tree overflow-auto-y',
        zTree: undefined,
        hideNodes: [],

        departmentList: undefined,
        userList: undefined,

        initialize: function () {
            this.departmentList = this.options.departmentList
            this.userList = this.options.userList;

            this.listenTo(this.departmentList, events.loadDepartment, this.addDepartmentNodes);
            this.listenTo(this.userList, EventType.addUserEvent, this.onAddUser);
            this.render();
        },

        render: function () {
            this.$el.html(" ");
            this.onChangeHeight();
            var that = this;
            this.zTree = $.fn.zTree.init(this.$el, {
                view: {
                    dblClickExpand: false,
                    showLine: false,
                    selectedMulti: false,
                    addDiyDom: function (treeId, treeNode) {
                        that.showAvatar(treeNode, that);
                    }
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
                        treeNode.type === 'user' && that.trigger(EventType.selectUser, that.userList.get(treeNode.id));
                        treeNode.type === 'department' && that.trigger(EventType.selectDept, that.departmentList.get(treeNode.id));
                        return true;
                    },

                    onCheck: function (event, treeId, treeNode) {
                        treeNode.type === 'user' && that.trigger(EventType.checkUser, that.userList.get(treeNode.id), treeNode.checked);
                        treeNode.type === 'department' && that.trigger(EventType.checkDept, that.departmentList.get(treeNode.id), treeNode.checked);
                        return true;
                    },

                    onNodeCreated: function (event, treeId, treeNode) {
                        var id = "#" + treeNode.tId + "_a";
                        that.$el.find(id).addClass(treeNode.type);
                        var checkId = "#" + treeNode.tId + "_check";
                        that.$el.find(checkId).attr("name", treeNode.type + "_chk");
                    }
                }
            }, []);
            setTimeout(function () {
                that.departmentList.length && that.addDepartmentNodes(that.departmentList);
            }, 100);
        },

        showAvatar: function (treeNode, that) {
            if (treeNode.type !== 'user')
                return;
            var currentUser = that.userList.get(treeNode.id);
            var anchor = that.$el.find("#" + treeNode.tId + "_a .button");
            var icon = currentUser.get("icon") || constants.defaultIcon;
            var editStr = "<img alt='avatar' src='" + icon + "' >";
            anchor.append(editStr);
        },

        close: function () {
            this.undelegateEvents();
            this.remove();
            //  $.fn.zTree.destroy(this.id);
        },

        rebind: function () {
            this.initialize();
            this.delegateEvents();
        },

        onChangeHeight: function (height) {
            if (height)
                this.$el.height(height);
            else
                this.$el.height(model.setting.getUsualContactTreeHeight() - 40);
        },

        /**
         * 将该部门员工树恢复到初始状态, 即清除所有选中的
         */
        reset: function () {
            this.zTree.checkAllNodes(false);
        },

        /**
         * 隐藏指定的用户
         * @param userIds
         */
        hideUsers: function (userIds) {
            // 显示之前隐藏的节点:
            if (this.hideNodes && this.hideNodes.length) {
                this.zTree.showNodes(this.hideNodes);
                this.hideNodes = [];
            }
            _.each(userIds, function (userId) {
                var node = this.zTree.getNodeByParam("id", userId);
                if (node) {
                    this.zTree.hideNode(node);
                    this.hideNodes.push(node);
                }
            }, this);
        },

        showUsers: function () {
            var nodes = this.zTree.getNodesByParam("isHidden", true);
            this.zTree.showNodes(nodes);
        },

        checkedUsers: function (users) {
            this.zTree.checkAllNodes(false);
            var that = this;
            _.each(users, function (user) {
                var node = that.zTree.getNodeByParam("id", user.id);
                node && that.zTree.checkNode(node, true);
            })
        },

        checkedUserIds: function (userIds) {
            var that = this;
            this.zTree.checkAllNodes(false);
            _.each(userIds, function (userId) {
                var node = that.zTree.getNodeByParam("id", userId);
                node && that.zTree.checkNode(node, true);
            })
        },

        /**
         * 返回选中的用户
         * @return [array] 用户数组
         */
        getCheckUsers: function () {
            var nodes = this.zTree.getCheckedNodes(true);
            return _.map(_.where(nodes, {type: "user"}), function (node) {
                return this.userList.get(node.id);
            }, this);
        },

        getCheckUserIds: function () {
            var nodes = this.zTree.getCheckedNodes(true);
            return _.map(_.where(nodes, {type: 'user'}), function (node) {
                return node.id;
            });
        },

        /**
         * 返回选中的部门ids
         * @returns {*}
         */
        getCheckedDepartIds: function () {
            var nodes = this.zTree.getCheckedNodes(true);
            if (!nodes.length)
                return [];

            return  _.map(_.where(nodes, {'type': 'department'}), function (node) {
                return node.id;
            });
        },

        /**
         * 获取选中的用户, 当tree为单选时
         * @returns {*}
         */
        getSelectUserId: function () {
            var nodes = this.zTree.getSelectedNodes();
            if (!nodes.length || nodes[0].type !== 'user')
                return null;
            return nodes[0].id;
        },

        getSelectDeptId: function () {
            var nodes = this.zTree.getSelectedNodes();
            if (!nodes.length || nodes[0].type !== 'department')
                return null;
            return nodes[0].id;
        },

        getSelectUser: function () {
            return this.userList.get(this.getSelectUserId());
        },

        showCheckbox: function (show) {
            this.zTree.setting.check.enable = show;
        },

        isCheckbox: function () {
            return this.zTree.setting.check.enable;
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

            this.addUserNodes(this.userList.where({'departmentId': department.get("deptId")}));
            return nodes[0];
        },

        addUserNodes: function (userList) {
            _.each(userList, function (user) {
                this.addUserNode(user, true);
            }, this);
        },

        onAddUser: function (user) {
            this.addUserNode(user, false);
        },

        addUserNode: function (user, silence) {
            var parentNode = user.get("deptId") ? this.zTree.getNodeByParam("id", user.get("deptId")) : null;
            this.zTree.addNodes(parentNode, {
                id: user.get("userId"),
                parentId: user.get("deptId") || 0,
                name: user.getDisplayName(),
                open: false,
                type: 'user',
                isParent: false,
                iconSkin: "user_avatar"
            }, silence);
        }


        /**end view*/})
})