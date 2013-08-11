var util = {};

util.isNet = function () {
    return "app.oatos.net" == (window.location.hostname + "");
};

/**
 * Get cookie by name, if name not exist, return null
 */
util.getCookie = function (name) {
    var arr = document.cookie
        .match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null)
        return unescape(arr[2]);
    return null;
};
/**
 * Get locale
 */
util.getLocale = function () {
    var locale = util.getCookie('lang');
    locale = locale || util.getUrlEncodedKey('locale');
    locale = locale ? locale : (navigator.language || navigator.browserLanguage
        || navigator.systemLanguage || navigator.userLanguage).replace(
            /-/g, '_');
    var index = locale.indexOf('_');
    if (index != -1) {
        var lang, region;
        lang = locale.substring(0, index);
        region = locale.substring(index, locale.length).toUpperCase();
        locale = lang + region;
    }
    return locale;
};
/**
 * Example:<br>
 * <code>
 * loadExternalFiles({
 * 		prefix:"<script type='text\/javascript' src='",
 * 		suffix:"><\/script>", 
 * 		fileUrls:["js/util.js","js/md5.js"], 
 * 		version: "20120101" 
 * });
 * </code>
 *
 * @param settings
 */
util.loadExternalFiles = function (settings) {
    var fileUrlStrs = [];
    var i;
    for (i in settings.fileUrls) {
        fileUrlStrs.push(settings.prefix + settings.fileUrls[i] + "?t="
            + settings.version + settings.suffix);
    }
    document.write(fileUrlStrs.join(""));
};

util.escapeRegExp = function (str) {
    if (str)
        return str.replace(/[.*+?^${}()|[\]\/\\]/g, "\\$0");
    return null;
};
util.trimEnd = function (str, c) {
    if (str && c)
        return str.replace(new RegExp(util.escapeRegExp(c) + "*$"), '');
    return str.replace(/\s+$/, '');
};
util.trimStart = function (str, c) {
    if (str && c)
        return str.replace(new RegExp("^" + util.escapeRegExp(c) + "*"), '');
    return str.replace(/^\s+/, '');
};
/**
 * set
 */
util.setUrlEncodedKey = function (key, value, query) {
    query = query || window.location.search;
    var q = query + "&";
    var re = new RegExp("[?|&]" + key + "=.*?&");
    if (!re.test(q))
        q += key + "=" + encodeURI(value);
    else
        q = q.replace(re, "&" + key + "=" + encodeURIComponent(value) + "&");
    q = util.trimEnd(util.trimStart(q, "&"), "&");
    return q.charAt(0) == "?" ? q : q = "?" + q;
};

util.getUrlEncodedKey = function (key, query) {
    if (!query)
        query = window.location.search;
    var re = new RegExp("[?|&]" + key + "=(.*?)&");
    var matches = re.exec(query + "&");
    if (!matches || matches.length < 2)
        return null;
    return decodeURIComponent(matches[1].replace("+", " "));
};
util.isSupportBrowser = function () {
    var ua = navigator.userAgent.toLowerCase();
    if (function () {
        return ua.indexOf('msie 9') != -1;
    }())
        return true;
    if (function () {
        return ua.indexOf('msie 8') != -1;
    }())
        return true;
    if (function () {
        return ua.indexOf('msie 6') != -1 || ua.indexOf('msie 7') != -1;
    }()) {
        return false;
    }
    return true;
};

util.isCompatiableMode = function () {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('msie')) {
        var iereg = /msie\s*(\d)/i;
        ua.match(iereg);
        var ieversion = RegExp.$1;
        var mode = document.documentMode;
        if (ieversion != mode && (ieversion >= 8 || mode >= 8) && !(ieversion >= 8 && mode >= 8)) {
            return true;
        }
        // ie9 兼容视图
        if (ieversion == 7 && ua.indexOf('trident/5.0') != -1) {
            return true;
        }
    }
    return false;
};

util.isIE = function () {
    var ua = navigator.userAgent.toLowerCase();
    return ua.indexOf('msie') != -1;
};

util.isIE9 = function () {
    var ua = navigator.userAgent.toLowerCase();
    var iereg = /msie\s*(\d)/i;
    ua.match(iereg);
    var ieversion = RegExp.$1;
    return ua.indexOf('msie') != -1 && ieversion == 9;
};

util.isMobile = function () {
    return util.isIPhone() || util.isAndroidPhone() || util.isIPad()
        || util.isAndroidPad();
};
util.isIPad = function () {
    var platForm = navigator.platform.toLowerCase();
    if (platForm.indexOf("ipad") != -1) {
        return true;
    }
    return false;
};
util.isIPhone = function () {
    var platForm = navigator.platform.toLowerCase();
    if (platForm.indexOf("iphone") != -1 || platForm.indexOf("ipod") != -1) {
        return true;
    }
    return false;
};
util.isAndroidPhone = function () {
    var platForm = navigator.platform.toLowerCase();
    if (platForm.indexOf("android") != -1
        || platForm.indexOf("linux armv7l") != -1) {
        return true;
    }
    return false;
};
util.isAndroidPad = function () {
    var platForm = navigator.platform.toLowerCase();
    if (platForm.indexOf("android") != -1
        || platForm.indexOf("linux armv7l") != -1) {
        return true;
    }
    return false;
};

util.S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
};

util.guid = function () {
    var S4 = util.S4;
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4()
        + S4() + S4());
};

util.getAgent = function () {
    var agent = "pc";
    if (util.isIPad() || util.isIPhone()) {
        agent = "pad";
    }
    return agent;
};

util.convertSize = function (size) {
    var unit = 'K';
    if (size > 1024) {
        size = size / 1024;
        unit = 'M';
    }
    if (size > 1024) {
        size = size / 1024;
        unit = 'G';
    }
    if (size > 1024) {
        size = size / 1024;
        unit = 'T';
    }
    return size + unit;
};

util.sizeConverter = function (direction, size) {
    if (direction === 'ModelToView') {
        if (!size || size.length <= 0 || size === '--')
            return "-";

        var unit = 'K';
        if (size > 1024) {
            size = size / 1024;
            unit = 'M';
        }
        if (size > 1024) {
            size = size / 1024;
            unit = 'G';
        }
        if (size > 1024) {
            size = size / 1024;
            unit = 'T';
        }
        return _.numberFormat(size, 0) + unit;
    }
};

util.getFileKbSize = function (size) {
    return size > 1024 ? size / 1024 : 1;
};

util.typeConverter = function (direction, value) {
    if (direction === 'ModelToView') {
        if (!value)
            return 'file-unknow';
        var lower = value.toLocaleLowerCase();
        if ('folder' === value)
            return 'file-folder';

        if (constants.isOatwType(lower))
            return 'file-oatw';
        if (constants.isTxtType(lower) || constants.isHtmlType(lower))
            return 'file-txt';
        if (_.indexOf(constants.pdfType, lower) !== -1)
            return 'file-pdf';
        if (_.indexOf(constants.imgType, lower) !== -1)
            return 'file-img';
        if (_.indexOf(constants.mp3Type, lower) !== -1)
            return 'file-mp3';
        if (_.indexOf(constants.docType, lower) !== -1)
            return 'file-doc';
        if (_.indexOf(constants.excelType, lower) !== -1)
            return 'file-excel';
        if (_.indexOf(constants.mp4Type, lower) !== -1)
            return 'file-mp4';
        if (_.indexOf(constants.pptType, lower) !== -1)
            return 'file-ppt';
        if (_.indexOf(constants.zipType, lower) !== -1)
            return 'file-zip';
        return 'file-unknow';
    }
};

util.dateConverter = function (direction, value) {
    if (value)
        return moment(parseInt(value)).format("YYYY-MM-DD hh:mm:ss");
    else
        return ' - ';
};

util.checkConverter = function (direction, value) {
    return value + ' ' + (value && 'entFileItemSelect');
};

util.convertDisplayName = function (direction, value, attrName, model) {
    return model.getDisplayName();
};

util.getUserStatusTip = function (direction, status) {
    var result = '未知';
    switch (status) {
        case constants.UserStatus.Online:
            result = "在线";
            break;
        case constants.UserStatus.Busy:
            result = "忙碌";
            break;
        case constants.UserStatus.Leave:
            result = "离开";
            break;
        case constants.UserStatus.Corbet:
            result = "隐身";
            break;
        default:
            result = "离线";
            break;
    }
    return result;
},

    util.getFileSuffix = function (fileName) {
        if (!fileName || fileName.indexOf('.') === -1)
            return "";
        return fileName.substr(fileName.lastIndexOf('.') + 1).toLowerCase();
    };

util.getFileName = function (fileName) {
    if (!fileName || fileName.indexOf('.') === -1)
        return fileName;
    return fileName.substring(0, fileName.lastIndexOf('.')).toLowerCase();
};

util.getOATOSHtmlBody = function (html) {
    var t = html;
    var body = t;
    if (t.indexOf("<body") > 0) {
        t = t.substring(t.indexOf("<body"));
        t = t.substring(t.indexOf(">") + 1);
        body = t.substring(0, t.indexOf("</body>"));
    } else if (t.indexOf("<BODY") > 0) {
        t = t.substring(t.indexOf("<BODY"));
        t = t.substring(t.indexOf(">") + 1);
        body = t.substring(0, t.indexOf("</BODY>"));
    }
    return body;
};

/**
 * 返回请求的url前缀: http://192.168.1.68/
 *
 * @returns {string}
 */
util.getUrlPrefix = function () {
    return location.protocol + "//" + location.host;
};

/**
 * 返回文件浏览路径
 * @param file
 * @returns {string}
 */
util.getPreviewUrl = function (file) {
    var param = $.param({
        entId: cache.entId,
        fileId: file.fileId,
        folderId: file.folderId,
        type: file.diskType
    });
    if (constants.isOatwType(file.type)) {
        return 'newfile.html?' + (seajs.devMode ? 'dev&' : '&') + param + "#edit";
    } else {
        return 'fileviewer.html?' + (seajs.devMode ? 'dev&' : '&') + param + constants.getRouterForFile(file.type);
    }
};

/**
 *  返回文件列表中每一项的浏览路径
 * @param model
 * @returns {string}
 */
util.getItemPreviewUrl = function (model) {
    if (model.isFolder()) {
        return '###';
    }
    if (!model.isPreviewSupport())
        return '###';

    return this.getPreviewUrl({
        fileId: model.id,
        folderId: model.get("parentId"),
        type: model.get("type"),
        diskType: model.get("diskType")
    });
};

util.getSharePreviewUrl = function (file) {
    var param = $.param({
        entId: cache.entId,
        fileId: file.fileId,
        type: file.diskType
    })
    if (constants.isImgType(file.type)) {
        return 'fileviewer.html?' + param + '#share/pic';
    } else if (constants.isPdfType(file.type) || constants.isDocSupport(file.type)) {
        return 'fileviewer.html?' + param + "#share/pdf";
    } else if (constants.isTxtType(file.type) || constants.isHtmlType(file.type) || constants.isOatwType(file.type)) {
        return 'fileviewer.html?' + param + "#share/html";
    } else if (constants.isVidType(file.type)) {
        return 'fileviewer.html?' + param + "#share/vid";
    } else if (constants.isAudType(file.type)) {
        return 'fileviewer.html?' + param + "#share/aud";
    } else {
        return '#' + file.diskType + "/open/tips/" + file.fileId;
    }
};

util.getDownloadUrl = function (fileId, folderId, diskType, guid) {
    var param = {
        'ei': cache.entId,
        'ui': cache.userId,
        'UT': cache.token,
        'fid': fileId,
        'gn': guid,
        'fi': folderId,
        'tp': diskType
    }

    return resturl.singleFileDownload + '?' + $.param(param);
};

util.loadJs = function (scriptId, file) {
    var scriptTag = document.getElementById(scriptId);
    var head = document.getElementsByTagName('head').item(0);
    if (scriptTag) head.removeChild(scriptTag);
    var script = document.createElement('script');
    script.src = file;
    script.type = 'text/javascript';
    script.id = scriptId;
    head.appendChild(script);
};

util.loadCss = function (cssId, file) {
    var cssTag = document.getElementById(cssId);
    var head = document.getElementsByTagName('head').item(0);
    if (cssTag) head.removeChild(cssTag);
    var css = document.createElement('link');
    css.href = file;
    css.rel = 'stylesheet';
    css.type = 'text/css';
    css.id = cssId;
    head.appendChild(css);
};

util.loadJsByJq = function (scriptId, file) {
    var head = $('head').remove('#' + scriptId);
    $("<scri" + "pt>" + "</scr" + "ipt>").attr({src: file, type: 'text/javascript', id: scriptId}).appendTo(head);
};

module.exports = util;