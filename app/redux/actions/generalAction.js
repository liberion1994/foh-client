/**
 * Created by liboyuan on 2016/12/25.
 */

export const SEND_OPERATION_REQUEST = 'SEND_OPERATION_REQUEST';
export const SEND_OPERATION_SUCCESS = 'SEND_OPERATION_SUCCESS';
export const SEND_OPERATION_FAILURE = 'SEND_OPERATION_FAILURE';

export function send_operation_request() {
    return {type: SEND_OPERATION_REQUEST};
}

export function send_operation_success() {
    return {type: SEND_OPERATION_SUCCESS};
}

export function send_operation_failure(errorCode) {
    return {type: SEND_OPERATION_FAILURE, errorCode: errorCode}
}