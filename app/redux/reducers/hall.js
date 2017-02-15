/**
 * Created by liboyuan on 2016/12/24.
 */

import update from 'react-addons-update';
import * as Actions from '../actions/hallAction';

export default function hall(state = {
    synchronized: false,
    content: null,
    chats: [],
    events: []
}, action) {
    let tmp = null, tmp2 = null;
    switch (action.type) {
        case Actions.NO_LONGER_SYNCHRONIZED_HALL:
            return {...state, ...{synchronized: false}};
        case Actions.ON_NEW_EVENT_HALL:
            tmp = {...state, ...{synchronized: true}};
            return update(tmp, {content: {eid: {$apply: x => (x+1)}}});
        case Actions.ON_SYNCHRONIZE_HALL:
            return {...state, ...{synchronized: true, content: action.content}};
        case Actions.ON_CREATE_ROOM:
            return update(state, {content: {rooms: {$push: [action.content.info]}}});
        case Actions.ON_REMOVE_ROOM:
            for (let i = 0; i < state.content.rooms.length; i ++) {
                if (state.content.rooms[i].id == action.content.id) {
                    tmp = i; break;
                }
            }
            if (tmp != null)
                return update(state, {content: {rooms: {$splice: [[tmp, 1]]}}});
            else
                return state;
        case Actions.ON_USER_ONLINE:
            return update(state, {content: {onlineUsers: {$push: [action.content.info]}}});
        case Actions.ON_USER_OFFLINE:
            for (let i = 0; i < state.content.onlineUsers.length; i ++) {
                if (state.content.onlineUsers[i].username == action.content.username) {
                    tmp = i; break;
                }
            }
            if (tmp != null)
                return update(state, {content: {onlineUsers: {$splice: [[tmp, 1]]}}});
            else
                return state;
        case Actions.ON_ENTER_ROOM:
            for (let i = 0; i < state.content.onlineUsers.length; i ++) {
                if (state.content.onlineUsers[i].username == action.content.username) {
                    tmp = i; break;
                }
            }
            if (tmp != null)
                tmp2 = update(state, {content: {onlineUsers: {[tmp]: {roomId: {$set: action.content.id}}}}});
            else
                tmp2 = state;
            for (let i = 0; i < state.content.rooms.length; i ++) {
                if (state.content.rooms[i].id == action.content.id) {
                    tmp = i; break;
                }
            }
            if (tmp != null)
                return update(tmp2, {content: {rooms: {[tmp]: {content: {seats: {[action.content.sid]: {$set: {
                    playerName: action.content.username,
                    majorNumber: action.content.majorNumber,
                    prepared: false
                }}}}}}}});
            else
                return tmp2;
        case Actions.ON_LEAVE_ROOM:
            for (let i = 0; i < state.content.onlineUsers.length; i ++) {
                if (state.content.onlineUsers[i].username == action.content.username) {
                    tmp = i; break;
                }
            }
            if (tmp != null)
                tmp2 = update(state, {content: {onlineUsers: {[tmp]: {roomId: {$set: null}}}}});
            else
                tmp2 = state;
            for (let i = 0; i < state.content.rooms.length; i ++) {
                if (state.content.rooms[i].id == action.content.id) {
                    tmp = i; break;
                }
            }
            if (tmp != null)
                return update(tmp2, {content: {rooms: {[tmp]: {content: {seats: {[action.content.sid]: {$set: null}}}}}}});
            else
                return tmp2;
        case Actions.ON_GAME_START_ROOM:
            for (let i = 0; i < state.content.rooms.length; i ++) {
                if (state.content.rooms[i].id == action.content.id) {
                    tmp = i; break;
                }
            }
            if (tmp != null)
                return update(state, {content: {rooms: {[tmp]: {content: {inGame: {$set: true}}}}}});
            else
                return state;
        case Actions.ON_GAME_OVER_ROOM:
            for (let i = 0; i < state.content.rooms.length; i ++) {
                if (state.content.rooms[i].id == action.content.id) {
                    tmp = i; break;
                }
            }
            if (tmp != null)
                return update(state, {content: {rooms: {[tmp]: {content: {inGame: {$set: false}}}}}});
            else
                return state;
        default:
            return state;
    }
}