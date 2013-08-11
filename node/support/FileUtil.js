var fs = require("fs")
    , Wind = require("wind")
    , Async = Wind.Async
    , Task = Async.Task
    , Binding = Async.Binding;

Wind.logger.level = Wind.Logging.Level.WARN;

exports.existsAsync = fs.existsAsync = Binding.fromCallback(fs.exists);
exports.mkdirAsync = Binding.fromStandard(fs.mkdir);
exports.readdirAsync = fs.readdirAsync = Binding.fromStandard(fs.readdir);
exports.statAsync = fs.statAsync = Binding.fromStandard(fs.stat);
exports.closeAsync = fs.closeAsync = Binding.fromStandard(fs.close);
exports.openAsync = fs.openAsync = Binding.fromStandard(fs.open);
exports.readAsync = fs.readAsync = Binding.fromStandard(fs.read);
exports.writeAsync = fs.writeAsync = Binding.fromStandard(fs.write);
exports.rmdirAsync = fs.rmdirAsync = Binding.fromStandard(fs.rmdir);

var copyFileByPipeAsync = eval(Wind.compile("async", function (srcFile, targetFile) {
    var streamIn = fs.createReadStream(srcFile);
    var streamOut = fs.createWriteStream(targetFile);
    streamIn.pipe(streamOut);

    var any = $await(Task.whenAny({
        errorIn: Async.onEvent(streamIn, "error"),
        errorOut: Async.onEvent(streamOut, "error"),
        end: Async.onEvent(streamOut, "close")
    }))

    if (any.key != "end") {
        throw any.task.result;
    }
}));

exports.copyFileByPipeAsync = copyFileByPipeAsync;