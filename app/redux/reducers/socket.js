/**
 * Created by liboyuan on 2016/12/22.
 */

import * as States from '../states/socketState';
import * as Actions from '../actions/socketAction';

export default function socket(state = {
    state: States.DISCONNECTED
}, action) {
    switch (action.type) {
        case Actions.SOCKET_READY:
            return { ...state, ...{ state: States.CONNECTED } };
        case Actions.SOCKET_DISCONNECT:
            return { ...state, ...{ state: States.DISCONNECTED } };
        default:
            return state;
    }
}