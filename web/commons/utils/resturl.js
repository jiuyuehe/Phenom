define(function (require, exports, module) {

    var baseurl = "http://localhost:3000";

    var asAjaxOptions = function (url, data, options) {
        return {
            url: baseurl + url,
            type: "POST",
            dataType: 'json',
            contentType: 'application/json',
            timeout: 10000,
            data: {username: 'yufei'}
        };
    }

    var ajaxAsync = function (url, data, options) {
        var option = asAjaxOptions(url, data, _.isFunction(options) ? {} : options);
        var callback = _.isFunction(options) ? options : null;

        log.debug("option: ", option);
        return new Wind.Async.Task(function (task) {
            jQuery.extend(option, {
                success: function (result) {
                    callback && callback(result);
                    task.complete("success", result);
                },

                error: function (result) {
                    console.log(result)
                    log.error("[resturl] ", option.url, ' http error: ', result);
                    callback && callback({fail: "error500"});
                    task.complete("success", {fail: "error500"});
                }
            });
            $.ajax(option);
        });
    }

    var services = {
        register: "/register"
    };

    var restful = {};
    _.each(services, function (url, key) {
        if (_.startsWith(key, "get")) {
            restful[key] = _.partial(ajaxAsync, url, undefined, {type: 'GET'});
        } else {
            restful[key] = _.partial(ajaxAsync, url);
        }
    })

    return restful;
})