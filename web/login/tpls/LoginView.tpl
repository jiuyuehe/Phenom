<div class="row login">
    <div class="left-border">
    </div>
    <div class="login-pane">
        <div class="login-title">登录OATOS企业网盘</div>
        <div class="control-group" id="errorTip"></div>
        <form class="bs-docs-example form-horizontal" id="logForm">
          <div class="control-group" name="private">
            <label for="inputEntName" class="control-label">企业:</label>
            <div class="controls">
              <input type="text" placeholder="企业名称" id="logEntName" name="logEntName" />
            </div>
          </div>
          <div class="control-group">
            <label for="inputAccount" class="control-label">账号:</label>
            <div class="controls">
              <input type="text" placeholder="登录账号" id="logAccount" name="logAccount" />
            </div>
          </div>
          <div class="control-group">
            <label for="inputPassword" class="control-label">密码:</label>
            <div class="controls">
              <input type="password" placeholder="登录密码" id="logPassword" name="logPassword"/>
            </div>
          </div>
          <div class="control-group">
            <div class="controls controls-log">
              <label class="checkbox inline">
                <input type="checkbox" id="httpsCheck" name="httpsCheck"/> 使用HTTPS
              </label>
              <label class="checkbox inline" name="domainUser">
                <input type="checkbox" id="domainCheck" name="domainCheck"/> 域用户
              </label>
              <button class="btn btn-info" type="submit" id="loginBtn">登 录</button>
            </div>
          </div>
        </form>
        <div name="registerServer">
          <a id="showRegister" href="register.html">立即注册</a> 获取OATOS永久免费服务
        </div>
    </div>
    <div class="right-border">
    </div>
</div>