/**
 * Created by liboyuan on 2016/12/24.
 */
import ioreq from 'socket.io-request';
import * as Request from '../../socket/request';
import {Error, isAuthError} from '../../socket/error';
import {auth_failure} from './authAction';
import {send_operation_request, send_operation_success, send_operation_failure} from './generalAction';
import {to_game_page} from './pageLocationAction';

export const GET_TABLE_REQUEST = 'GET_TABLE_REQUEST';
export const GET_TABLE_SUCCESS = 'GET_TABLE_SUCCESS';
export const GET_TABLE_FAILURE = 'GET_TABLE_FAILURE';

export const HALL_CHAT_RECEIVED = 'HALL_CHAT_RECEIVED';
export const HALL_CHAT_READ = 'HALL_CHAT_READ';

export const ENTER_TABLE = 'ENTER_TABLE';

function get_table_request() {
    return {type: GET_TABLE_REQUEST};
}

function get_table_success(content) {
    return {type: GET_TABLE_SUCCESS, content: content};
}

function get_table_failure(errorCode) {
    return {type: GET_TABLE_FAILURE, errorCode: errorCode}
}

export function enter_table_success() {
    return {type: ENTER_TABLE}
}

/**
 * 获取大厅信息，在加载大厅页面时触发
 * @returns {function(*)}
 */
export function get_tables() {
    return dispatch => {
        dispatch(get_table_request());
        ioreq(socket).request(Request.GET_TABLES, null)
            .then(function (res) {
                if (!res.success) {
                    if (isAuthError(res.errorCode))
                        dispatch(auth_failure(res.errorCode));
                    dispatch(get_table_failure(res.errorCode));
                } else {
                    dispatch(get_table_success(res.content));
                }
            })
            .catch(function () {
                dispatch(get_table_failure(Error.REQUEST_FAIL));
            });
    }
}

/**
 * 加入桌子，成功后跳转
 * @param content
 * @returns {function(*)}
 */
export function enter_table(content) {
    return dispatch => {
        dispatch(send_operation_request());
        ioreq(socket).request(Request.ENTER_TABLE, content)
            .then(function (res) {
                if (!res.success) {
                    if (isAuthError(res.errorCode))
                        dispatch(auth_failure(res.errorCode));
                    dispatch(send_operation_failure(res.errorCode));
                } else {
                    dispatch(send_operation_success());
                    dispatch(enter_table_success());
                    //TODO 加入channel
                    dispatch(to_game_page());
                }
            })
            .catch(function (err) {
                dispatch(send_operation_failure(Error.REQUEST_FAIL));
            });
    }
}