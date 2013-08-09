<div class="reg-main">
    <div class="left-border">
    </div>
    <div class="reg-pane">
        <div class="reg-title">
                <span>
                    创建一个免费的OATOS企业网盘
                </span>
        </div>
        <div class="login-info-title">
            <ul>
                <li><i class="icon-reg-info"></i><span>企业登录信息</span></li>
                <li id="ent-val-info"></li>
            </ul>
        </div>
        <form class="bs-docs-example form-horizontal" id="regForm">
            <div class="control-group">
                <label for="inputEntName" class="control-label">
                    企&nbsp;&nbsp;&nbsp;&nbsp;业:
                </label>
                <div class="controls">
                    <input type="text" placeholder="公司或项目名称" id="enterpriseName" name="enterpriseName">
                    <span class="help-inline"></span>
                </div>
            </div>
            <div class="control-group">
                <label for="inputAccount" class="control-label">
                    账&nbsp;&nbsp;&nbsp;&nbsp;号:
                </label>
                <div class="controls">
                    <input type="text" placeholder="管理员帐号" id="adminName" name="adminName">
                    <span class="help-inline"></span>
                </div>
            </div>
            <div class="control-group">
                <label for="inputPassword" class="control-label">
                    密&nbsp;&nbsp;&nbsp;&nbsp;码:
                </label>
                <div class="controls">
                    <input type="password" placeholder="6-20位数字、字母、符号混合" id="adminPassword" name="adminPassword">
                    <span class="help-inline"></span>
                </div>
            </div>
            <div class="control-group">
                <label for="inputConfirmPassword" class="control-label">
                    确认密码:
                </label>
                <div class="controls">
                    <input type="password" placeholder="再次输入密码" id="confirmPassword" name="confirmPassword">
                    <span class="help-inline"></span>
                </div>
            </div>

            <div class="login-info-title">
                <ul>
                    <li><i class="icon-reg-contact"></i><span>联系方式</span></li>
                    <li id="contact-val-info"></li>
                </ul>
            </div>
            <div class="control-group">
                <label for="inputAdminName" class="control-label">
                    姓&nbsp;&nbsp;&nbsp;&nbsp;名:
                </label>

                <div class="controls">
                    <input type="text" placeholder="真实姓名" id="contact" name="contact">
                    <span class="help-inline"></span>
                </div>
            </div>
            <div class="control-group">
                <label for="inputEmail" class="control-label">
                    邮&nbsp;&nbsp;&nbsp;&nbsp;箱:
                </label>
                <div class="controls">
                    <input type="text" placeholder="常用的邮箱" id="mail" name="mail">
                    <span class="help-inline"></span>
                </div>
            </div>
            <div class="control-group">
                <label for="inputPhone" class="control-label">
                    电&nbsp;&nbsp;&nbsp;&nbsp;话:
                </label>
                <div class="controls">
                    <input type="text" placeholder="手机或座机号码" id="mobile" name="mobile">
                    <span class="help-inline"></span>
                </div>
            </div>
            <div class="control-group">
                <label for="inputCode" class="control-label">
                    <span class="per-3 first">验</span><span class="per-3">证</span><span class="per-3 last">码</span>:
                </label>
                <div class="controls">
                    <input type="text" placeholder="验证码" maxlength="4" id="VerCode" name="VerCode1">
                    <img class="code-image" src="validationCodeServlet"/>
                        <span class="help-inline ver-code">
                            换一张
                        </span>
                        <span class="help-inline"></span>
                </div>
            </div>
            <div class="control-group">
                <div class="controls">
                    <label class="checkbox reg-check">
                        <input type="checkbox" id="agreeCheck">
                        我已经阅读并同意
                        <a href="http://www.oatos.com/supports/terms/" target="_blank">
                            《OATOS服务条款》
                        </a>
                            <span class="help-inline">
                            </span>
                    </label>
                    <button class="btn btn-success" type="submit" id="regBtn">
                        立即注册
                    </button>
                </div>
            </div>
        </form>
        <div>
                <span>
                    已有OATOS账号
                </span>
                <span>
                    <a id="showLogin" href="login.html">
                        立即登录
                    </a>
                </span>
        </div>
    </div>
    <div class="right-border">
    </div>
</div>