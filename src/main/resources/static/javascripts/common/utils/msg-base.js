/**
 * @fileOverview 向主框架发送各种消息
 * @author maxinyue
 * @version 0.1
 */

/**
 *  @author maxinyue
 *  @description 截图功能
 *  @requires ../javascripts/security/html2canvas.js
 */
window.addEventListener('message', function (event) {
    //如果父引用是本地的窗口，不再发送screenshot消息（去掉死循环）
//    if(window === window.parent.top) {
//        return false;
//    }
    //如果消息来源不是功能菜单，不再截图
    if(!event.data.funcId) return false;
    console.info("screenshot");
    html2canvas(document.body, {
        onrendered: function (canvas) {
            window.parent.top.postMessage(
                {
                    type: "screenshot",
                    body: {
                        url: window.document.location.href,
                        menu: event.data,
                        img: canvas.toDataURL("image/png")
                    }
                }
                , "*");
        },
        width: 1024,
        height: 768
    });
}, true);

/**
 * @description 告诉主框架关闭当前界面
 */
function closeThisByMain(path, backUrl) {
    window.parent.top.postMessage(
        {
            type: "closeFrame",
            body: {
                url: HrStr.isNull(path) ? Path.getFuncSrc() : Path.getFuncSrc() + path,
                backUrl: backUrl
            }
        }
        , "*");
}

/**
 * @description 获取员工id
 * @return {String}员工id
 */
function getEmpId() {
    return getQueryString(window.document.location.search, "userId");
}

/**
 * @description 获取业务平台id
 * @return {String}业务平台id
 */
function getAppId() {
    return getQueryString(window.document.location.search, "appId");
}

/**
 * @description 告诉主框架跳转页面
 * @param {String}url 对应AppFunctions的funcSrc
 * @param {String}queryString 需要给页面传递的参数
 */
function changeMainSrc(url, queryString) {
    window.parent.top.postMessage(
        {
            type: "changeMainSrc",
            body: {
                url: url,
                queryString: queryString
            }
        }
        , "*");
}

/**
 * @description 告诉主框架改变funcName
 * @param {String}funcName 主框架功能名称
 */
function changeFuncName(funcName) {
    window.parent.top.postMessage(
        {
            type: "changeFuncName",
            body: {
                name: funcName
            }
        }
        , "*");
}

/**
 * @description 获取当前功能
 * @return {Object}当前功能
 */
function getCurrentFuc(){
    return getLocalJsonObject("currentFuc");
}

/**
 * @description 告诉主框架跳转页面--目标不在工作站功能菜单中也可以跳转
 * @param {object}submenu 目标页面信息{funcId: '页面功能临时id，用于标识此页面', funcName: '页面功能名称', funcSrc: '页面url'}
 * @param {String}queryString 需要给页面传递的参数
 */
function changeMainSrcNotInFrame(submenu, queryString) {
    window.parent.top.postMessage(
        {
            type: "changeMainSrcNotInFrame",
            body: {
                submenu: submenu,
                queryString: queryString
            }
        }
        , "*");
}


