var routers = require("./");
var userRouter = routers.UserRouter;

module.exports = function (app) {
    app.post('/service/login', userRouter.login);
    app.post('/service/register', userRouter.register);
};
