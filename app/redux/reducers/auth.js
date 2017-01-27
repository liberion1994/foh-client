/**
 * Created by liboyuan on 2016/12/23.
 */

import * as States from '../states/authState';
import * as Actions from '../actions/authAction';

export default function auth(state = {
    state: States.UNAUTHENTICATED,
}, action) {
    switch (action.type) {
        case Actions.AUTH_REQUEST:
            return { ...state, ...{ state: States.REQUESTED, authType: action.authType } };
        case Actions.AUTH_SUCCESS:
            return { ...state, ...{ state: States.AUTHENTICATED, userName: action.agent.username } };
        case Actions.AUTH_FAILURE:
            return { ...state, ...{ state: States.FAILED, errorCode: action.errorCode } };
        case Actions.AUTH_LOGOUT:
            return { ...state, ...{ state: States.UNAUTHENTICATED } };
        default:
            return state;
    }
}