var stomp = require("stomp")
    , config = require("../config").config
    , restful = require("./restful");

var stomp_args = {
    port: 61613,
    host: config.activemq_ip,
    'content-type': 'text/plain;charset=utf-8',
    debug: false
};
var client = new stomp.Stomp(stomp_args);
client.on('connected', function () {
    console.log('[] amq Connected');

    client.subscribe({
        destination: config.FileUploadQueue,
        ack: 'client'
        //    'activemq.prefetchSize': '10'
    }, function (body, headers) {
        var strMsg = (body + "")
        console.log('Handle Queue:  ' + config.FileUploadQueue);
        var message = _.unescape(strMsg);
        console.log(" original message: ", message);
        restful.uploadFileToFM(JSON.parse(message));
    });
});

client.on('message', function (message) {
    client.ack(message.headers['message-id']);
});

client.on('error', function (error_frame) {
    console.log(error_frame.body);
    client.disconnect();
});

client.connect();

/**
 * activemq客户端连接
 *
 * @type {stomp.Stomp}
 */
exports.client = client;

/**
 * 发送JMS消息
 * @param dest
 * @param message
 */
exports.sendMessage = function (dest, message) {
    client.send({
        destination: dest,
        'body': message,
        'persistent': true
    });
}

