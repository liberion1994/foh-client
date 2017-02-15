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

    FORCED_LOGOUT: 20000
};

export function errorToAuthTitle(code) {
    switch (code) {
        case Error.WRONG_SESSION_ID:
            return 'Session失效';
        case Error.NO_USERS_FOUND:
            return '未找到用户';
        case Error.WRONG_PASSWORD:
            return '密码错误';
        case Error.USER_ALREADY_EXIST:
            return '用户已存在';
        case Error.UNKNOWN_AUTH_TYPE:
            return '未知的验证方式';
        case Error.NOT_AUTHENTICATED:
            return '尚未登录';
        case Error.DATABASE_FAIL:
            return '数据库内部错误';
        case Error.INVALID_USERNAME:
            return '非法的用户名';
        case Error.INVALID_PASSWORD:
            return '非法的密码';
        case Error.FORCED_LOGOUT:
            return '账户在其他地方登录';
        default:
            return '未知错误';
    }
}

export default Error;
