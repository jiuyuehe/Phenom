module.exports = {
    /**
     * <p>
     * 新建或更新文档. 如果参数中type='new', 则是新建文档, 其他type=onlinedisk | type = sharedisk时, 则是更新文档
     * </p>
     *
     * <b>参数：</b>
     * <ul>
     * <li>{@link SaveFileDTO}的JSON：保存文件信息
     * </ul>
     * <b>正常返回：</b>
     * <ul>
     * <li>{@link FileDTO}的JSON：保存成功的文件信息
     * </ul>
     * <b>异常返回：</b>
     * <ul>
     * <li>{@link ErrorType#error500}：系统错误
     * <li>{@link ErrorType#errorSameFile}文件重复
     * <li>{@link ErrorType#errorFolderDeleted}：父文件已被删除
     * </ul>
     */
    saveFile: "/sc/file/saveHtml",

    /**
     * <p>
     * 保存企业文件到个人网盘
     * </p>
     *
     * <b>参数：</b>
     * <ul>
     * <li>{@link SaveFileDTO}的JSON：保存文件信息
     * </ul>
     * <b>正常返回：</b>
     * <ul>
     * <li>{@link NetworkFileDTO}的JSON：保存成功的文件信息
     * </ul>
     * <b>异常返回：</b>
     * <ul>
     * <li>{@link ErrorType#error500}：系统错误
     * </ul>
     */
    saveFileToDisk: "/sc/file/saveFileToDisk",

    /**
     * <p>
     * 接收聊天文件
     * </p>
     *
     * <b>参数：</b>
     * <ul>
     * <li>{@link AcceptFileDTO}的JSON：保存文件信息
     * </ul>
     * <b>正常返回：</b>
     * <ul>
     * <li>{@link NetworkFilesDTO}的JSON：保存成功的文件信息
     * </ul>
     * <b>异常返回：</b>
     * <ul>
     * <li>{@link ErrorType#error500}：系统错误
     * </ul>
     */
    acceptFile: "/sc/file/acceptFile",

    /**
     * <p>
     * 复制个人网盘文件至企业网盘，发送更新消息
     * </p>
     *
     * <b>参数：</b>
     * <ul>
     * <li>{@link SharePersonalFileDTO}的JSON：复制个人网盘文件至企业网盘DTO
     * </ul>
     * <b>正常返回：</b>
     * <ul>
     * <li>{@link CommConstants#OK_MARK}：复制成功
     * </ul>
     * <b>异常返回：</b>
     * <ul>
     * <li>{@link ErrorType#errorNoPermission}：没有权限
     * <li>{@link ErrorType#errorSameFile}：目录下已经有与此同名的文件存在
     * <li>{@link ErrorType#errorFolderSpaceOver}：文件夹空间已满
     * <li>{@link ErrorType#errorNoSpace}：企业网盘空间已满
     * <li>{@link ErrorType#error500}：系统错误
     * </ul>
     */
    sharePersonalFile: "/sc/shareDisk/sharePersonalFile",

    /**
     * <p>
     * 通过照相/上传图片修改用户头像服务
     * </p>
     * <p>
     * <b>参数：</b>
     * </p>
     * <p>
     * <b>正常返回：</b>
     * </p>
     * <b>异常返回：</b><br>
     * <ul>
     * <li>
     * </ul>
     */
    takePicture: "/sc/swf/takePicture",

    /**
     * <p>
     * 文件上传服务. 包括企业文件和个人文件上传
     * </p>
     * <b>参数： </b>{@link FileUploadDTO} 文件上传DTO<br>
     * <p>
     * <b>正常返回： </b>企业文件{@link ShareFileDTO} or 个人文件{@link NetworkFileDTO}
     * </p>
     * <b>异常返回： </b>
     * <p> 个人文件异常返回: <p>
     * <ul>
     * <li>{@link ErrorType#error500} 服务器内部错误
     * <li>{@link ErrorType#errorSameFile} 文件重名
     * <li>{@link ErrorType#errorNoSpace} 个人网盘空间不足
     * </ul>
     *
     * <p>企业文件异常返回: </p>
     * <ul>
     * <li>{@link ErrorType#errorNoPermission}：用户没有当前文件夹下的上传权限
     * <li>{@link ErrorType#errorFolderSpaceOver}：当前文件夹空间已满
     * <li>{@link ErrorType#errorNoSpace}：企业网盘空间已满
     * <li>{@link ErrorType#errorSameFile}：同一文件夹下存在同名文件
     * <li>{@link ErrorType#errorFolderDeleted}：父文件夹已经删除
     * <li>{@link ErrorType#error500}：系统错误
     * </ul>
     */
    fileRoutingUpload: "/sc/file/fileRoutingUpload",

    /**
     * 上传文件到FileManager
     */
    uploadFileToFM: "/file/fileUpload",

    /**
     * <p>
     * 分段文件上传
     * </p>
     * <p>
     * <b>参数：</b>
     * </p>
     * <p>
     * <b>正常返回：</b>
     * </p>
     * <b>异常返回：</b><br>
     * <ul>
     * <li>
     * </ul>
     */
    selectionFileUpload: "/sc/file/sectionFileUpload",

    /**
     * <p>
     * 浏览图片，取图片尺寸及地址
     * </p>
     *
     * <b>参数：</b>
     * <ul>
     * <li>{@link ViewFileDTO}的JSON：文件转换浏览信息
     * </ul>
     * <b>正常返回：</b>{@link ViewFileResultDTO}的JSON
     * <ul>
     * <li>{@link ViewFileResultDTO#message} = {@link CommConstants#OK_MARK}：<br>
     * 转换成功，{@link ViewFileResultDTO#url}为图片地址，{@link ViewFileResultDTO#width}
     * 为图片宽度px，{@link ViewFileResultDTO#height}为图片高度px
     * <li>{@link ViewFileResultDTO#message} =
     * {@link ErrorType#errorNoPermission}：没有浏览权限
     * <li>{@link ViewFileResultDTO#message} =
     * {@link ErrorType#errorNotSupported}：该文件不支持图片预览
     * <li>{@link ViewFileResultDTO#message} =
     * {@link ErrorType#errorFileNotFound}：文件不存在
     * <li>{@link ViewFileResultDTO#message} = {@link ErrorType#error500}：系统错误
     * </ul>
     * <b>异常返回：</b>
     * <ul>
     * <li>{@link ErrorType#error500}：系统错误
     * </ul>
     */
    viewFileAsImage: "/sc/file/viewFileAsImage",

    /**
     * <p>
     * 将文件转成html，浏览文件
     * </p>
     *
     * <b>参数：</b>
     * <ul>
     * <li>{@link ViewFileDTO}的JSON：文件转换浏览信息
     * </ul>
     * <b>正常返回：</b>{@link ViewFileResultDTO}的JSON
     * <ul>
     * <li>{@link ViewFileResultDTO#message} = {@link CommConstants#OK_MARK}：<br>
     * 转换成功，{@link ViewFileResultDTO#url}为html地址
     * <li>{@link ViewFileResultDTO#message} = {@link CommConstants#QUEUED}
     * ：文档已加入等待队列，等待转换
     * <li>{@link ViewFileResultDTO#message} = {@link CommConstants#ERROR_MARK}
     * ：文档转换失败
     * <li>{@link ViewFileResultDTO#message} =
     * {@link ErrorType#errorNoPermission}：没有浏览权限
     * <li>{@link ViewFileResultDTO#message} =
     * {@link ErrorType#errorNotSupported}：该文件不支持转成html
     * <li>{@link ViewFileResultDTO#message} =
     * {@link ErrorType#errorFileNotFound}：文件不存在
     * <li>{@link ViewFileResultDTO#message} = {@link ErrorType#error500}：系统错误
     * </ul>
     * <b>异常返回：</b>
     * <ul>
     * <li>{@link ErrorType#error500}：系统错误
     * </ul>
     */
    viewFileAsHtml: "/sc/file/viewFileAsHtml",

    /**
     * <p>
     * 将文件转成pdf，浏览文件
     * </p>
     *
     * <b>参数：</b>
     * <ul>
     * <li>{@link ViewFileDTO}的JSON：文件转换浏览信息
     * </ul>
     * <b>正常返回：</b>{@link ViewFileResultDTO}的JSON
     * <ul>
     * <li>{@link ViewFileResultDTO#message} = {@link CommConstants#OK_MARK}：<br>
     * 转换成功，{@link ViewFileResultDTO#url}为pdf地址
     * <li>{@link ViewFileResultDTO#message} = {@link CommConstants#QUEUED}
     * ：文档已加入等待队列，等待转换
     * <li>{@link ViewFileResultDTO#message} = {@link CommConstants#ERROR_MARK}
     * ：文档转换失败
     * <li>{@link ViewFileResultDTO#message} =
     * {@link ErrorType#errorNoPermission}：没有浏览权限
     * <li>{@link ViewFileResultDTO#message} =
     * {@link ErrorType#errorNotSupported}：该文件不支持转成pdf
     * <li>{@link ViewFileResultDTO#message} =
     * {@link ErrorType#errorFileNotFound}：文件不存在
     * <li>{@link ViewFileResultDTO#message} = {@link ErrorType#error500}：系统错误
     * </ul>
     * <b>异常返回：</b>
     * <ul>
     * <li>{@link ErrorType#error500}：系统错误
     * </ul>
     */
    viewFileAsPdf: "/sc/file/viewFileAsPdf",

    /**
     * <p>
     * 将文件转成swf，浏览文件
     * </p>
     *
     * <b>参数：</b>
     * <ul>
     * <li>{@link ViewFileDTO}的JSON：文件转换浏览信息
     * </ul>
     * <b>正常返回：</b>{@link ViewFileResultDTO}的JSON
     * <ul>
     * <li>{@link ViewFileResultDTO#message} = {@link CommConstants#OK_MARK}：<br>
     * 转换成功，{@link ViewFileResultDTO#url}为分段swf地址，
     * {@link ViewFileResultDTO#pageCount}为文件页数
     * <li>{@link ViewFileResultDTO#message} = {@link CommConstants#QUEUED}
     * ：文档已加入等待队列，等待转换
     * <li>{@link ViewFileResultDTO#message} = {@link CommConstants#ERROR_MARK}
     * ：文档转换失败
     * <li>{@link ViewFileResultDTO#message} =
     * {@link ErrorType#errorNoPermission}：没有浏览权限
     * <li>{@link ViewFileResultDTO#message} =
     * {@link ErrorType#errorNotSupported}：该文件不支持转成swf
     * <li>{@link ViewFileResultDTO#message} =
     * {@link ErrorType#errorFileNotFound}：文件不存在
     * <li>{@link ViewFileResultDTO#message} = {@link ErrorType#error500}：系统错误
     * </ul>
     * <b>异常返回：</b>
     * <ul>
     * <li>{@link ErrorType#error500}：系统错误
     * </ul>
     */
    viewFileAsSwf: "/sc/file/viewFileAsSwf",

    /**
     * <p>
     * 将文件转成html，在线编辑文件
     * </p>
     *
     * <b>参数：</b>
     * <ul>
     * <li>{@link ViewFileDTO}的JSON：文件转换浏览信息
     * </ul>
     * <b>正常返回：</b>{@link ViewFileResultDTO}的JSON
     * <ul>
     * <li>{@link ViewFileResultDTO#message} = {@link ErrorType#errorFileLocked}
     * +:用户名：文件被他人锁定
     * <li>{@link ViewFileResultDTO#message} = {@link CommConstants#OK_MARK}：<br>
     * 转换成功，{@link ViewFileResultDTO#content}为文件html内容
     * <li>{@link ViewFileResultDTO#message} = {@link CommConstants#QUEUED}
     * ：文档已加入等待队列，等待转换
     * <li>{@link ViewFileResultDTO#message} = {@link CommConstants#ERROR_MARK}
     * ：文档转换失败
     * <li>{@link ViewFileResultDTO#message} =
     * {@link ErrorType#errorNoPermission}：没有编辑权限
     * <li>{@link ViewFileResultDTO#message} =
     * {@link ErrorType#errorNotSupported}：该文件不支持转成html
     * <li>{@link ViewFileResultDTO#message} =
     * {@link ErrorType#errorFileNotFound}：文件不存在
     * <li>{@link ViewFileResultDTO#message} = {@link ErrorType#error500}：系统错误
     * </ul>
     * <b>异常返回：</b>
     * <ul>
     * <li>{@link ErrorType#error500}：系统错误
     * </ul>
     */
    editFileAsHtml: "/sc/file/editFileAsHtml",

    /**
     * <p>
     * 取媒体文件路径
     * </p>
     *
     * <b>参数：</b>
     * <ul>
     * <li>{@link ViewFileParam}的JSON：文件转换浏览信息
     * </ul>
     * <b>正常返回：</b>{@link ViewFileResultDTO}的JSON
     * <ul>
     * <li>{@link ViewFileResultDTO#message} = {@link CommConstants#OK_MARK}：<br>
     * {@link ViewFileResultDTO#url}为文件地址
     * <li>{@link ViewFileResultDTO#message} =
     * {@link ErrorType#errorNoPermission}：没有浏览权限
     * <li>{@link ViewFileResultDTO#message} =
     * {@link ErrorType#errorNotSupported}：该文件不支持预览
     * <li>{@link ViewFileResultDTO#message} =
     * {@link ErrorType#errorFileNotFound}：文件不存在
     * <li>{@link ViewFileResultDTO#message} = {@link ErrorType#error500}：系统错误
     * </ul>
     * <b>异常返回：</b>
     * <ul>
     * <li>{@link ErrorType#error500}：系统错误
     * </ul>
     */
    viewFileAsMedia: "/sc/file/viewFileAsMedia",

    /**
     * <p>
     * 普通文件下载服务
     * </p>
     * <p>
     * <b>参数：</b>
     * </p>
     * <p>
     * <b>正常返回：</b>
     * </p>
     * <b>异常返回：</b><br>
     * <ul>
     * <li>
     * </ul>
     */
    fileDownload: "/web/file/fileDownload",

    /**
     * <p>
     * 文件夹压缩服务
     * </p>
     * <p>
     * <b>参数：</b>
     * </p>
     * <p>
     * <b>正常返回：</b>
     * </p>
     * <b>异常返回：</b><br>
     * <ul>
     * <li>
     * </ul>
     */
    zipFolder: "/web/folder/zip",

    /**
     * <p>
     * 文件夹下载服务
     * </p>
     * <p>
     * <b>参数：</b>
     * </p>
     * <p>
     * <b>正常返回：</b>
     * </p>
     * <b>异常返回：</b><br>
     * <ul>
     * <li>
     * </ul>
     */
    downloadFolder: "/sc/folder/download",

    /**
     * <p>
     * 多文件和文件夹压缩服务
     * </p>
     * <p>
     * <b>参数：</b>
     * </p>
     * <p>
     * <b>正常返回：</b> 压缩文件地址
     * </p>
     * <b>异常返回：</b><br>
     * <ul>
     * <li>
     * </ul>
     */
    zipMultiFiles: "/sc/multifile/zip",

    /**
     * <p>
     * 多文件和文件夹下载服务
     * </p>
     * <p>
     * <b>参数：</b>
     * </p>
     * <p>
     * <b>正常返回：</b>
     * </p>
     * <b>异常返回：</b><br>
     * <ul>
     * <li>
     * </ul>
     */
    downloadMultiFiles: "/sc/multifile/download",

    /**
     * <p>
     * 外链文件下载服务
     * </p>
     * <p>
     * <b>参数：</b>
     * </p>
     * <p>
     * <b>正常返回：</b>
     * </p>
     * <b>异常返回：</b><br>
     * <ul>
     * <li>
     * </ul>
     */
    shareLinkFileDownload: "/sc/file/shareLinkDownload",

    /**
     * <p>
     * 获取媒体文件流
     * </p>
     * <p>
     * <b>参数：</b>
     * </p>
     * <ul>
     * <li>{@link ViewFileDTO}的JSON：文件信息
     * </ul>
     * <b>正常返回：</b>
     * <ul>
     * <li>文件流
     * </ul>
     * <b>异常返回：</b>
     */
    getMediaStream: "/file/getMediaStream",

    /**
     * <p>
     * 网盘文件分段下载
     * </p>
     * <p>
     * <b>参数：</b>
     * </p>
     * <p>
     * <b>正常返回：</b>
     * </p>
     * <b>异常返回：</b><br>
     * <ul>
     * <li>
     * </ul>
     */
    sectionFileDownload: "/sc/file/sectionOnlineFileDownload",

    /**
     * <p>
     * 检查网盘文件服务
     * </p>
     * <p>
     * <b>参数：</b>
     * </p>
     * <p>
     * <b>正常返回：</b>
     * </p>
     * <b>异常返回：</b><br>
     * <ul>
     * <li>
     * </ul>
     */
    checkDiskFile: "/sc/checkDiskFile",

    /**
     * <p>
     * 文件转发下载
     * </p>
     * <p>
     * <b>参数：</b>
     * </p>
     * <p>
     * <b>正常返回：</b>
     * </p>
     * <b>异常返回：</b><br>
     * <ul>
     * <li>
     * </ul>
     */
    fileRouting: "/onlinedisk/**",

    /**
     * <p>
     * 获取版本信息服务
     * </p>
     * <p>
     * <b>参数：</b>
     * </p>
     * <p>
     * <b>正常返回：</b>
     * </p>
     * <b>异常返回：</b><br>
     * <ul>
     * <li>
     * </ul>
     */
    getVersoin: "/web/getVersion",

    /**
     * <p>
     * 生产验证码
     * </p>
     * <p>
     * <b>参数：</b>
     * </p>
     * <p>
     * <b>正常返回：</b>
     * </p>
     * <b>异常返回：</b><br>
     * <ul>
     * <li>
     * </ul>
     */
    verifyCode: "/validationCodeServlet",

    /**
     * <p>
     * 对验证码进行验证服务
     * </p>
     * <p>
     * <b>参数：</b>
     * </p>
     * <p>
     * <b>正常返回：</b>
     * </p>
     * <b>异常返回：</b><br>
     * <ul>
     * <li>
     * </ul>
     */
    wordVerify: "/servlet/wordVerify",

    /**<p>
     * 手机端写日志的接口
     * </p>
     * <b>参数：</b>
     *   platform : 写在http header中, 值为android/ios
     *
     * <b>正常返回：</b>
     * <b>异常返回：</b><br>
     */
    writeLog: "/sc/write/log",

    /**
     * 获取配置服务
     */
    getConfig: "/getConfig",

    /**
     * 发送JMS消息服务
     * <b>参数：</b>
     * <b>正常返回：</b>
     * <b>异常返回：</b><br>
     */
    sendJmsMessage: "/sendmessage",

    /**
     * 批量发送消息
     * MessagesDTO
     */
    sendMessages: "/sc/message/sendMessages"
}