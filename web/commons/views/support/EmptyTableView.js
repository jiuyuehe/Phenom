define(function (require, exports, module) {

    window.EmptyTableView = Backbone.View.extend({

        $emptyTable: undefined,

        initialize: function (deferView) {
            this.render();
        },

        render: function () {
            this.$el.append(tplpre.emptyTableView());

            this.$emptyTable = this.$el.find(".empty-table");
            return this;
        },

        changeHeight: function (height) {
            this.$emptyTable.height(height);
        },

        show: function () {
            this.$emptyTable.show();
        },

        hide: function () {
            this.$emptyTable.hide();
        },

        setContent: function (content) {
            this.$emptyTable.find("div").html(content);
        },

        resetPostion: function () {
            this.$emptyTable.css({
                width: this.$el.width(),
                height: this.$el.height(),
                left: this.$el.offset().left,
                top: this.$el.offset().top
            });
        }
    });
});