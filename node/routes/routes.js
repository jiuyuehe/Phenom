var routers = require("./");
var userRouter = routers.UserRouter;

module.exports = function (app) {
    app.post('/login', userRouter.login);
};
