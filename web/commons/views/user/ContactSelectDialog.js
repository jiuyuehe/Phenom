define(function (require, exports, module) {

    require("./ContactSelectTree");

    /**
     * 选中联系人对话框
     */
    window.ContactSelectDialog = Backbone.View.extend({
        tagName: "div",
        className: "contact-select-dialog modal fade hide",
        $contactTree: undefined,
        submitCallback: undefined,
        contactTree: undefined,

        departmentList: undefined,
        userList: undefined,

        initialize: function () {
            this.departmentList = this.options.departmentList
            this.userList = this.options.userList;
            this.render();
        },

        render: function () {
            this.$el.html(tplpre.contactSelectDialog());
            this.$contactTree = this.$el.find(".contact-tree-wrap");

            this.contactTree = new ContactSelectTree({
                id: "contactSelectDialogTree",
                departmentList: this.departmentList,
                userList: this.userList
            });
            this.contactTree.showCheckbox(true);
            this.contactTree.onChangeHeight(388);
            this.$contactTree.html(this.contactTree.el);
            return this;
        },

        addSubmitCallback: function (callback) {
            this.submitCallback = callback;
        },

        show: function () {
            this.contactTree.reset();
            this.$el.modal({
                keyboard: true,
                backdrop: 'static'
            });
            return this;
        },

        hide: function () {
            this.$el.modal("hide");
        },

        events: {
            "click .btn-add-sure": "onSubmit"
        },

        onSubmit: function () {
            this.submitCallback && this.submitCallback(this.contactTree.isCheckbox() ? this.contactTree.getCheckUsers() : this.contactTree.getSelectUser());
            this.hide();
        }
    });
})
;