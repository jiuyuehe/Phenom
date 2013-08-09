define(function (require, exports, module) {

    window.IndexView = Backbone.View.extend({

        initialize: function () {
            this.render();
        },

        render: function () {
            $(this.el).html(tplpre.index());
            return this;
        }
    });
})