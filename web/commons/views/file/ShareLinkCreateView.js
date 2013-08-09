/**
 * 分享文件页面
 */
define(function (require, exports, module) {

    window.ShareLinkCreateView = Backbone.View.extend({
        tagName: 'div',
        id: 'shareLinkCreateView',
        className: 'modal fade hide file-share-view',
        _modelBinder: undefined,
        linkArea: undefined,
        file: undefined,

        events: {
            'click [name^=check]': 'toggleCheck',
            'click #generatebtn': 'generateShareLink'
        },

        initialize: function () {
            var that = this;
            this.file = this.model.get("file");
            this._modelBinder = new Backbone.ModelBinder();
            this.render();
        },

        render: function () {
            this.$el.html(tplpre.shareLinkCreateView());
            this.linkArea = this.$el.find("[name=linkinfo]");

            var bindings = {
                'file.name': '[name=file-name]',
                'file.updateTime': {selector: '[name=updateTime]'},
                'file.size': {selector: '[name=size]', converter: util.sizeConverter},
                'file.type': {selector: '[name=file-icon]', elAttribute: 'class', converter: util.typeConverter},
                'checkExpireDate': {selector: '[name=checkExpireDate]', elAttribute: 'class', converter: util.checkConverter},
                'checkPassword': {selector: '[name=checkPassword]', elAttribute: 'class', converter: util.checkConverter},
                'checkDownloadAmt': {selector: '[name=checkDownloadAmt]', elAttribute: 'class', converter: util.checkConverter},
                'expireDate': '[id=expireDate]',
                'downloadAmt': '[name=downloadAmt]',
                'inputPassword': '[name=password]'
            }
            this.$el.find("input[name=expireDate]").attr("readonly", !this.model.get("checkExpireDate"));
            this.$el.find("input[name=downloadAmt]").attr("readonly", !this.model.get("checkDownloadAmt"));
            this.$el.find("input[name=password]").attr("readonly", !this.model.get("checkPassword"));
            this.$el.find("input[name=expireDate]").val(this.model.get("expireDate"));
            this._modelBinder.bind(this.model, this.el, bindings);
            return this;
        },

        toggleCheck: function (event) {
            var name = $(event.target).attr("name");
            this.model.set(name, !this.model.get(name));
            if (this.model.get(name)) {
                $(event.target).parents("div.controls").find("input[name]").removeAttr("readonly");
                $(event.target).parents("div.controls").find("span.checkbox-sprite").removeClass("false");
                $(event.target).parents("div.controls").find("span.checkbox-sprite").addClass("true");
            }
            else {
                $(event.target).parents("div.controls").find("input[name]").attr("readonly", "readonly");
                $(event.target).parents("div.controls").find("span.checkbox-sprite").removeClass("true");
                $(event.target).parents("div.controls").find("span.checkbox-sprite").addClass("false");
            }
        },


        generateShareLink: function () {
            var that = this;
            if (this.model.get("checkExpireDate") && this.model.get("expireDate")) {
                var now = new Date();
                var nowTime = now.getTime();
                if (nowTime - moment(this.model.get("expireDate") + ' 18:00:00', 'YYYY-MM-DD HH:mm:ss').toDate().getTime() > 0) {
                    alertify.alert("到期时间不能早于今天！");
                    return;
                }
            }

            if (this.model.get("checkDownloadAmt") && this.model.get("downloadAmt")) {
                if (isNaN(this.model.get("downloadAmt"))) {
                    alertify.alert("下载次数必须是数字！");
                    return;
                }
                if (this.model.get("downloadAmt") < 1) {
                    alertify.alert("下载次数不能小于1次！");
                    return;
                }
            }

            if (this.model.get("checkPassword") && this.model.get("inputPassword")) {
                if (this.model.get("inputPassword").length < 6) {
                    alertify.alert("密码不能少于6位！");
                    return;
                }
            }
            if (!this.model.get('linkId')) {
                this.model.createShareLink(this._shareCallback());
            } else {
                this.model.updateShareLink(this._updateShareCallback());
            }
            this.addCopeFlash();
        },

        _shareCallback: function () {
            var that = this;
            return function (result) {
                if (result == ErrorType.errorNoPermission) {
                    alertify.alert("无此权限！");
                } else if (result == ErrorType.errorFileDeleted) {
                    alertify.alert("文件已被删除!");
                } else if (result == ErrorType.error500) {
                    alertify.alert("系统错误！");
                } else {
                    var shareLink = JSON.parse(result);

                    that.$el.find("form").addClass("hide");
                    that.$el.find("#generatebtn").addClass("hide");

                    that.$el.find('.sharelink-url').removeClass("hide");
                    that.$el.find('[name=linkinfo]').val('http://' + location.host + '/os/share.html?lc=' + shareLink.linkCode);
                    that.$el.find('.modal-footer a.btn').html("完成");

                    var isFileViewer = !!model.currentFile;
                    var entFile = isFileViewer ? model.currentFile : router.fileRouter.getFileById(that.file.fileId);
                    entFile.set("shareLinkId", shareLink.linkId);
                    !isFileViewer && model.messageEvent.trigger(EventType.addShareLink, entFile);
                }
            };
        },

        _updateShareCallback: function () {
            var that = this;
            return function (result) {
                if (result !== Error.error500) {
                    that.$el.find("form").addClass("hide");
                    that.$el.find("#generatebtn").addClass("hide");
                    that.$el.find('.sharelink-url').removeClass("hide");
                    that.$el.find('[name=linkinfo]').val('http://' + location.host + '/os/share.html?lc=' + that.model.get('linkCode'));
                    that.$el.find('.modal-footer a.btn').html("完成");
                }
            }
        },

        addCopeFlash: function () {
            var flashvars = {};
            flashvars.id = "createCopyFlash";
            var params = {};
            params.wmode = "transparent";
            var attributes = {};
            swfobject.embedSWF("swf/clipboard.swf", "createCopyFlash", '80', '30', '11.1.0', 'clipboard.swf', flashvars, params, attributes);
        },

        close: function () {
            this._modelBinder.unbind();
            this.off();
            this.undelegateEvents();
            this.remove();
        }
    });
});