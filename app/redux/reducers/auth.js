/**
 * Created by liboyuan on 2016/12/23.
 */

import * as States from '../states/authState';
import * as Actions from '../actions/authAction';

export default function auth(state = {
    state: States.UNAUTHENTICATED,
}, action) {
    switch (action.type) {
        case Actions.ON_AUTH_SUCCESS:
            return { ...state, ...{ state: States.AUTHENTICATED, username: action.username } };
        case Actions.ON_AUTH_FAILURE:
            return { ...state, ...{ state: States.UNAUTHENTICATED, errorCode: action.errorCode } };
        case Actions.ON_AUTH_LOGOUT:
            return { ...state, ...{ state: States.UNAUTHENTICATED, errorCode: null } };
        default:
            return state;
    }
}