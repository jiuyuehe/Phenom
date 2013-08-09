define(function (require, exports, module) {

    window.MultiFileDownloadView = Backbone.View.extend({

        tagName: 'div',
        id: 'multiFileDownloadView',
        className: 'modal fade hide multiFileDownloadView',
        $downloadBtn: undefined,
        $zipTip: undefined,
        $loadingView: undefined,
        downloadCallback: undefined,

        initialize: function (deferView) {
            this.render();
        },

        close: function () {
            this.$el.modal('hide');
            this.off();
            this.undelegateEvents();
            this.remove();
        },

        render: function () {
            this.$el.html(tplpre.multiFileDownloadView());
            this.$zipTip = this.$el.find("#zip-tip");
            this.$downloadBtn = this.$el.find("#downloadBtn");
            this.$loadingView = this.$el.find(".loading-img");

            this.$el.modal({
                keyboard: true,
                backdrop: 'static'
            });

            var that = this;
            this.model.zipMultiFiles(function (result) {
                that.$loadingView.hide();
                if (ErrorType.errorNoPermission === result) {
                    that.$zipTip.text("无此权限！");
                    that.$downloadBtn.addClass("hide");
                    return false;
                }
                if (ErrorType.error500 === result) {
                    that.$zipTip.text("文件压缩失败，请重新下载！");
                    that.$downloadBtn.addClass("hide");
                    return false;
                }

                that.model.set("path", result);
                that.$zipTip.text("文件已经压缩完成，您可以点击下载按钮下载！");
                that.$downloadBtn.removeClass("disabled").text('下载').attr("href", that.model.getDownloadUrl()).attr("target", "_blank");
                that.$downloadBtn.click(function () {
                    that.downloadCallback && that.downloadCallback();
                    that.close();
                    return true;
                });
            });
            return this;
        }

    });
});