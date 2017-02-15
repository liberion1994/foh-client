/**
 * Created by liboyuan on 2016/12/23.
 */

export const ON_AUTH_SUCCESS = 'ON_AUTH_SUCCESS';
export const ON_AUTH_FAILURE = 'ON_AUTH_FAILURE';
export const ON_AUTH_LOGOUT = 'ON_AUTH_LOGOUT';

export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';

export function on_auth_success(username) {
    return {type: ON_AUTH_SUCCESS, username: username};
}

export function on_auth_failure(errorCode) {
    return {type: ON_AUTH_FAILURE, errorCode: errorCode};
}

export function on_auth_logout() {
    return {type: ON_AUTH_LOGOUT};
}


export function authenticate(content) {
    return {type: AUTHENTICATE, content: content};
}

export function logout() {
    return {type: LOGOUT};
}
