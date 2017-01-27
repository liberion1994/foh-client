/**
 * Created by liboyuan on 2016/12/23.
 */

export const Error = {

    //验证错误
    WRONG_SESSION_ID: 100000,
    NO_USERS_FOUND: 100001,
    WRONG_PASSWORD: 100002,
    USER_ALREADY_EXIST: 100003,
    UNKNOWN_AUTH_TYPE: 100004,
    NOT_AUTHENTICATED: 100005,

    //内部错误
    DATABASE_FAIL: 101000,

    //正则验证错误
    INVALID_USERNAME: 102000,
    INVALID_PASSWORD: 102001,

    //聊天错误
    SENDING_MESSAGE_TOO_FREQUENTLY: 103000,
    SENDING_MESSAGE_TOO_LONG: 103001,
    SENDING_MESSAGE_ILLEGAL_CHANNEL: 103002,

    //非法操作错误
    ENTERING_TABLE_WHILE_IN_TABLE: 104000,
    TABLE_NOT_FOUND: 104001,
    SEAT_NOT_FOUND: 104002,
    ENTERING_SEAT_ALREADY_OCCUPIED: 104003,
    LEAVING_TABLE_WHILE_NOT_IN_TABLE: 104004,
    LEAVING_IN_GAME: 104005,
    PREPARE_WHILE_NOT_UNPREPARED: 104006,
    UNPREPARE_WHILE_NOT_PREPARED: 104007,

    REQUEST_FAIL: 200000

};

export function errorToAuthTitle(code) {
    switch (code) {
        case Error.WRONG_SESSION_ID:
            return 'Session错误';
        case Error.NO_USERS_FOUND:
            return '未找到用户';
        case Error.WRONG_PASSWORD:
            return '密码错误';
        case Error.USER_ALREADY_EXIST:
            return '用户已存在';
        case Error.UNKNOWN_AUTH_TYPE:
            return '未知的验证方式';
        case Error.REQUEST_FAIL:
            return '请求出错';
        case Error.NOT_AUTHENTICATED:
            return '尚未登录';
    }
}

export function isAuthError(errorCode) {
    return errorCode >= 100000 && errorCode < 101000;
}

export default Error;
