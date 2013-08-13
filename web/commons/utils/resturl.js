define(function (require, exports, module) {

    var baseurl = "http://localhost/service";

    var asAjaxOptions = function (url, data) {
        return {
            url: baseurl + url,
            type: "POST",
            dataType: 'json',
            contentType: 'application/json',
            timeout: 10000,
            data: _.isString(data) ? data : JSON.stringify(data)
        };
    }

    var ajaxAsync = function (url, data, callback) {
        var option = asAjaxOptions(url, data);
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
        restful[key] = _.partial(ajaxAsync, url);
    })

    return restful;
})