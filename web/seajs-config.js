define(function (require) {
    seajs.devMode = (location.href.indexOf("?dev") > 0);
    seajs.isPrivate = false;
    seajs.appVersion = "2013080803";
    seajs.config({
        base: "./assets/sea-modules/",
        plugins: ["text"],
        debug: false,
        paths: {
            'cssbase': seajs.devMode ? '../../../css' : '../../../../css'
        },
        //文件映射
        map: [
            //可配置版本号
            ['.css', '.css?v=' + seajs.appVersion],
            ['.js', '.js?v=' + seajs.appVersion]
        ],
        alias: {
            '$': 'jquery/jquery/1.9.1/jquery-debug',
            'jquery': 'jquery/jquery/1.9.1/jquery-debug',
            'jquery-plugin': 'jquery-plugin/jquery-plugin',
            'jquerycookie': 'jquery-plugin/cookie/1.3/cookie',
            'jquery-mousewheel': 'jquery-plugin/mousewheel/3.1.3/mousewheel',
            'jquery-hotkeys': 'jquery-plugin/jquery-hotkeys/jquery-hotkeys',
            'jquery-hoverIntent': 'jquery-plugin/jquery-hoverIntent/jquery-hoverIntent',
            'jqueryztree': 'jquery-plugin/jqueryztree/jquery.ztree.all-3.5.min',
            'dialog': 'jquery-plugin/lhgdialog/lhgdialog',
            'alertify': 'jquery-plugin/alertify/alertify-debug',
            'select2': "jquery-plugin/select2/select2",
            'select2-zh-CN': "jquery-plugin/select2/select2_locale_zh-CN",

            'handlebars': seajs.devMode ? 'gallery/handlebars/1.0.0/handlebars' : 'gallery/handlebars-runtime/1.0.0/handlebars',
            'underscore': 'gallery/underscore/1.4.4/underscore',
            'underscore-string': 'gallery/underscore-string/underscore.string',

            'backbone': 'gallery/backbone/1.0.0/backbone',
            'backbone-all': 'gallery/backbone/1.0.0/backbone-all',
            'backbone-plugin': 'gallery/backbone-plugin/backbone-plugin',
            'backbone-modelbinder': 'gallery/backbone-plugin/backbone-modelbinder/backbone-modelbinder',
            'backbone-collectionbinder': 'gallery/backbone-plugin/backbone-collectionbinder/backbone-collectionbinder',
            'backbone-validation': 'gallery/backbone-plugin/backbone-validation/backbone-validation',
            'backbone-deepmodel': 'gallery/backbone-plugin/backbone-deepmodel/backbone-deepmodel',
            'backbone-routefilter': 'gallery/backbone-plugin/backbone-routefilter/backbone-routefilter',
            'backbone-paginator': 'gallery/backbone-plugin/backbone-paginator/backbone-paginator',
            'backbone-localStorage': 'gallery/backbone-plugin/backbone-localStorage/backbone-localStorage',

            'bootstrap': 'gallery/bootstrap/bootstrap',
            'bootstrap-plugin': 'gallery/bootstrap-plugin/bootstrap-plugin',
            'bootstrap-editable': 'gallery/bootstrap-plugin/bootstrap-editable/bootstrap-editable',
            'bootstrap-datepicker': 'gallery/bootstrap-plugin/bootstrap-datepicker/bootstrap-datepicker',
            'bootstrap-datepicker-zh-CN': 'gallery/bootstrap-plugin/bootstrap-datepicker/locales/bootstrap-datepicker.zh-CN',
            'bootstrap-datetimepicker': 'gallery/bootstrap-plugin/bootstrap-datetimepicker/bootstrap-datetimepicker',
            'bootstrap-datetimepicker-zh-CN': 'gallery/bootstrap-plugin/bootstrap-datetimepicker/locales/bootstrap-datetimepicker.zh-CN',
            'bootstrap-wysiwyg': 'gallery/bootstrap-plugin/bootstrap-wysiwyg/bootstrap-wysiwyg',
            'bootstrap-fuelux': 'gallery/bootstrap-plugin/bootstrap-fuelux/wizard',

            'swfupload-all': 'gallery/swfupload/swfupload-all',
            'swfobject': 'gallery/swfobject/2.2.0/swfobject',
            'swfupload': 'gallery/swfupload/swfupload',
            'swfupload-jquery': 'gallery/swfupload/jquery.swfupload',
            'websocket': 'websocket/web-socket',

            "commons-utils": "commons-utils/commons-utils",
            'wind': 'gallery/wind/wind-all-0.7.3',
            'log4javascript': 'gallery/log4javascript/log4javascript',
            'moment': 'gallery/moment/2.0.0/moment',
            'moment-zh-cn': 'gallery/moment/2.0.0/zh-cn',
            'jwplayer': 'gallery/jwplayer/jwplayer'
        }
    })
    ;
})