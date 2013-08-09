module.exports = function (grunt) {

    var _ = require("underscore");
    var web_css_tmps = ['oatos.css', 'website.css', 'file.css', 'contact.css', 'conference.css', 'message.css', 'setting.css'];
    var web_css = _.map(web_css_tmps, function (each) {
        return "../css/" + each
    });

    var share_css_tmps = ['oatos.css', 'website.css', 'share.css'];
    var share_css = _.map(share_css_tmps, function (each) {
        return "../css/" + each;
    })

    var viewer_css_tmps = ['oatos.css', 'website.css', 'file.css', 'fileview.css', 'icons.css'];
    var viewer_css = _.map(viewer_css_tmps, function (each) {
        return "../css/" + each
    });

    var bs_plugin_tmps = ['bootstrap-datepicker.min.css', "bootstrap-editable.min.css", "bootstrap-wysiwyg.min.css", "font-awesome.min.css"];
    var bs_plugin = _.map(bs_plugin_tmps, function (each) {
        return "../css/" + each
    });

    grunt.initConfig({

        handlebars: {
            options: {
                namespace: "tplpre",
                amd: true,
                processContent: function (content) {
                    content = content.replace(/^[/x20/t]+/mg, '').replace(/[/x20/t]+$/mg, '');
                    content = content.replace(/^[/r/n]+/, '').replace(/[/r/n]*$/, '');
                    content = content.replace(/\n|\r|(\r\n)|(\u0085)|(\u2028)|(\u2029)/g, "");
                    return content;
                },

                processName: function (filename) {
                    var tmpName = filename.substring(filename.lastIndexOf("/") + 1, filename.lastIndexOf('.'));
                    var firstChar = tmpName.substring(0, 1);
                    return firstChar.toLowerCase() + tmpName.substring(1);
                }
            },

            compile: {
                files: {
                    "dist/commons/commons-tpls-src.js": "oatos/commons/tpls/**/*.tpl",
                    "dist/login/login-tpls-src.js": "oatos/login/tpls/**/*.tpl",
                    "dist/share/share-tpls-src.js": "oatos/share/tpls/**/*.tpl",
                    "dist/viewer/viewer-tpls-src.js": "oatos/viewer/tpls/**/*.tpl",
                    "dist/website/website-tpls-src.js": "oatos/website/tpls/**/*.tpl",
                    "dist/admin/admin-tpls-src.js": "oatos/admin/tpls/**/*.tpl"
                }
            }
        },

        transport: {
            options: {
                paths: ['./sea-modules'],
                handlebars: {
                    id: 'handlebars'
                },
                debug: false,
                idleading: ''
            },
            hello: {
                files: {
                    // commons module
                    'dist/commons/models': ['oatos/commons/{model,collection}/**/*.js'],
                    'dist/commons/utils': ['oatos/commons/utils/**/*.js'],
                    'dist/commons/views': ['oatos/commons/views/**/*.js'],

                    // login module
                    'dist/login/views': ['oatos/login/views/**/*.js'],
                    'dist/login/main': ['oatos/login/*.js'],

                    // share module
                    'dist/share/views': ['oatos/share/views/**/*.js'],
                    'dist/share/main': ['oatos/share/*.js'],

                    // viewer
                    'dist/viewer/views': ['oatos/viewer/views/**/*.js'],
                    'dist/viewer/main': ['oatos/viewer/*.js'],

                    // website module
                    'dist/website/views': ['oatos/website/views/**/*.js'],
                    'dist/website/utils': ['oatos/website/utils/**/*.js'],
                    'dist/website/main': ['oatos/website/*.js'],

                    // admin module
                    'dist/admin/views': ['oatos/admin/views/**/*.js'],
                    'dist/admin/main': ['oatos/admin/*.js']
                }
            }
        },

        concat: {
            main: {
                options: {
                    relative: true  // this will include relative dependencies
                },
                files: {
                    // commons module
                    'dist/commons/commons-models-src.js': ['dist/commons/models/**/**.js'],
                    'dist/commons/commons-utils-src.js': ['dist/commons/utils/**/**.js'],
                    'dist/commons/commons-views-src.js': ['dist/commons/views/**/**.js'],

                    // login module
                    'dist/login/login-views-src.js': ['dist/login/views/**/**.js'],
                    'dist/login/main-src.js': ['dist/login/main/**/*.js'],

                    // share
                    'dist/share/share-views-src.js': ['dist/share/views/**/**.js'],
                    'dist/share/main-src.js': ['dist/share/main/**/*.js'],

                    //viewer
                    'dist/viewer/viewer-views-src.js': ['dist/viewer/views/**/**.js'],
                    'dist/viewer/main-src.js': ['dist/viewer/main/**/*.js'],

                    // website module
                    'dist/website/website-views-src.js': ['dist/website/views/**/**.js'],
                    'dist/website/website-utils-src.js': ['dist/website/utils/**/**.js'],
                    'dist/website/main-src.js': ['dist/website/main/**/*.js'],

                    // admin module
                    'dist/admin/admin-views-src.js': ['dist/admin/views/**/**.js'],
                    'dist/admin/main-src.js': ['dist/admin/main/**/*.js']
                }
            }
        },
        uglify: {
            main: {
                files: {
                    // commons module
                    'dist/commons/commons-models.js': ['dist/commons/commons-models-src.js'],
                    'dist/commons/commons-utils.js': ['dist/commons/commons-utils-src.js'],
                    'dist/commons/commons-views.js': ['dist/commons/commons-views-src.js'],
                    'dist/commons/commons-tpls.js': ['dist/commons/commons-tpls-src.js'],

                    // login module
                    'dist/login/login-views.js': ['dist/login/login-views-src.js'],
                    'dist/login/main.js': ['dist/login/main-src.js'],
                    'dist/login/login-tpls.js': ['dist/login/login-tpls-src.js'],

                    // share
                    'dist/share/share-views.js': ['dist/share/share-views-src.js'],
                    'dist/share/main.js': ['dist/share/main-src.js'],
                    'dist/share/share-tpls.js': ['dist/share/share-tpls-src.js'],

                    // viewer
                    'dist/viewer/viewer-views.js': ['dist/viewer/viewer-views-src.js'],
                    'dist/viewer/main.js': ['dist/viewer/main-src.js'],
                    'dist/viewer/viewer-tpls.js': ['dist/viewer/viewer-tpls-src.js'],

                    // website module
                    'dist/website/website-views.js': ['dist/website/website-views-src.js'],
                    'dist/website/website-utils.js': ['dist/website/website-utils-src.js'],
                    'dist/website/main.js': ['dist/website/main-src.js'],
                    'dist/website/website-tpls.js': ['dist/website/website-tpls-src.js'],

                    // admin module
                    'dist/admin/admin-views.js': ['dist/admin/admin-views-src.js'],
                    'dist/admin/main.js': ['dist/admin/main-src.js'],
                    'dist/admin/admin-tpls.js': ['dist/admin/admin-tpls-src.js']
                }
            }
        },

        replace: {
            example: {
                src: ['dist/*/*-tpls.js'],
                overwrite: true,
                replacements: [
                    {
                        from: 'define(["handlebars"],function(a){',
                        to: 'define(["handlebars"],function(require){var a = require("handlebars");'
                    }
                ]
            },

            appversion: {
                src: ['seajs-config.js'],
                overwrite: true,
                replacements: [
                    {
                        from: /\d{10}/g,
                        to: "<%= grunt.template.today('yyyymmddhh') %>"
                    }
                ]
            }
        },

        cssmin: {
            combine: {
                files: {
                    // bootstrap plugin
                    '../css/bootstrap-plugin.min.css': bs_plugin,
                    '../css/login-register.min.css': ["../css/login-register.css"],
                    '../css/website.min.css': web_css,
                    '../css/share.min.css': share_css,
                    '../css/viewer.min.css': viewer_css,
                    '../css/alertify/alertify.min.css': ["../css/alertify/alertify.core.css", "../css/alertify/alertify.default.css"],
                    '../css/newfile.min.css': ["../css/oatos.css", "../css/website.css", "../css/newfile.css"],
                    '../css/manager.min.css': ["../css/manager.css"]
                }
            }
        },

        copy: {
            main: {
                files: [
                    {expand: true, flatten: true, src: ['dist/commons/*'], dest: 'sea-modules/oatos/commons/', filter: 'isFile'},
                    {expand: true, flatten: true, src: ['dist/login/*'], dest: 'sea-modules/oatos/login/', filter: 'isFile'},
                    {expand: true, flatten: true, src: ['dist/share/*'], dest: 'sea-modules/oatos/share/', filter: 'isFile'},
                    {expand: true, flatten: true, src: ['dist/viewer/*'], dest: 'sea-modules/oatos/viewer/', filter: 'isFile'},
                    {expand: true, flatten: true, src: ['dist/website/*'], dest: 'sea-modules/oatos/website/', filter: 'isFile'},
                    {expand: true, flatten: true, src: ['dist/admin/*'], dest: 'sea-modules/oatos/admin/', filter: 'isFile'}
                ]
            }
        },

        clean: {
            build: ['dist', 'sea-modules/oatos']
        }
    })

    grunt.loadNpmTasks('grunt-cmd-transport');
    grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.loadNpmTasks('grunt-cmd-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('build', [ 'clean', 'handlebars', 'transport', 'concat', 'uglify', 'replace', 'copy', 'cssmin']);
}
