/**
 * Created by liboyuan on 2016/12/24.
 */

import * as Actions from '../actions/hallAction';
import * as States from '../states/hallState';

export default function hall(state = {
    state: States.UNFETCHED,
    content: null,
    chats: {newArrived: false, content: []}
}, action) {
    switch (action.type) {
        case Actions.GET_TABLE_REQUEST:
            return { ...state, ...{ state: States.REQUESTED } };
        case Actions.GET_TABLE_SUCCESS:
            return { ...state, ...{ state: States.FETCHED, content: action.content } };
        case Actions.GET_TABLE_FAILURE:
            return { ...state, ...{ state: States.FAILED, errorCode: action.errorCode } };
        case Actions.HALL_CHAT_RECEIVED:
            return { ...state, ...{ chats: { newArrived: true, content: [...state.chats.content, action.chat]} } };
        case Actions.HALL_CHAT_READ:
            return { ...state, ...{ chats: { ...state.chats, ...{ newArrived: false } } } };
        default:
            return state;
    }
}