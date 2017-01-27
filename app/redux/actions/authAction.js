/**
 * Created by liboyuan on 2016/12/23.
 */
import ioreq from 'socket.io-request';
import * as Request from '../../socket/request';
import {Error} from '../../socket/error';
import {to_hall_page} from './pageLocationAction';

export const AUTH_REQUEST = 'AUTH_REQUEST';
export const AUTH_SUCCESS = 'AUTH_SUCCESS';
export const AUTH_FAILURE = 'AUTH_FAILURE';
export const AUTH_LOGOUT = 'AUTH_LOGOUT';

function auth_request(authType) {
    return {
        type: AUTH_REQUEST,
        authType: authType
    }
}

function auth_success(agent) {
    return {
        type: AUTH_SUCCESS,
        agent: agent
    }
}

export function auth_failure(errorInfo) {
    return {
        type: AUTH_FAILURE,
        errorCode: errorInfo
    }
}

function auth_logout() {
    return {
        type: AUTH_LOGOUT
    }
}

/**
 * 验证身份，方式包括：
 * auth_code登录
 * 账号密码登录
 * 注册登录
 * @returns {function(*)}
 */
export function authenticate(content) {
    return dispatch => {
        dispatch(auth_request(content.type));
        // ioreq(socket).request(Request.AUTH, content)
        //     .then(function (res) {
        //         if (!res.success) {
        //             dispatch(auth_failure(res.errorCode));
        //         } else {
        //             localStorage.authenticationCode = res.authenticationCode;
        //             dispatch(auth_success(res.agent));
        //             dispatch(to_hall_page());
        //         }
        //     })
        //     .catch(function (err) {
        //         dispatch(auth_failure(Error.REQUEST_FAIL));
        //     });
    }
}

export function logout() {

}