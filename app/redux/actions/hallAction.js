/**
 * Created by liboyuan on 2016/12/24.
 */

export const FETCH_HALL = 'FETCH_HALL';
export const CREATE_ROOM = 'CREATE_ROOM';
export const ENTER_ROOM = 'ENTER_ROOM';
export const NO_LONGER_SYNCHRONIZED_HALL = 'NO_LONGER_SYNCHRONIZED_HALL';

export function fetch_hall() {
    return {type: FETCH_HALL};
}
export function create_room(room) {
    return {type: CREATE_ROOM, room: room};
}
export function enter_room(id, sid) {
    return {type: ENTER_ROOM, id: id, sid: sid};
}
export function no_longer_synchronized_hall() {
    return {type: NO_LONGER_SYNCHRONIZED_HALL};
}

export const ON_NEW_EVENT_HALL = 'ON_NEW_EVENT_HALL';
export const ON_SYNCHRONIZE_HALL = 'ON_SYNCHRONIZE_HALL';
export const ON_CREATE_ROOM = 'ON_CREATE_ROOM';
export const ON_REMOVE_ROOM = 'ON_REMOVE_ROOM';
export const ON_USER_ONLINE = 'ON_USER_ONLINE';
export const ON_USER_OFFLINE = 'ON_USER_OFFLINE';
export const ON_ENTER_ROOM = 'ON_ENTER_ROOM';
export const ON_LEAVE_ROOM = 'ON_LEAVE_ROOM';
export const ON_GAME_START_ROOM = 'ON_GAME_START_ROOM';
export const ON_GAME_OVER_ROOM = 'ON_GAME_OVER_ROOM';

export function on_new_event_hall() {
    return {type: ON_NEW_EVENT_HALL};
}

export function on_synchronize_hall(content) {
    return {type: ON_SYNCHRONIZE_HALL, content: content};
}
export function on_create_room(content) {
    return {type: ON_CREATE_ROOM, content: content};
}
export function on_remove_room(content) {
    return {type: ON_REMOVE_ROOM, content: content};
}
export function on_user_online(content) {
    return {type: ON_USER_ONLINE, content: content};
}
export function on_user_offline(content) {
    return {type: ON_USER_OFFLINE, content: content};
}
export function on_enter_room(content) {
    return {type: ON_ENTER_ROOM, content: content};
}
export function on_leave_room(content) {
    return {type: ON_LEAVE_ROOM, content: content};
}
export function on_game_start_room(content) {
    return {type: ON_GAME_START_ROOM, content: content};
}
export function on_game_over_room(content) {
    return {type: ON_GAME_OVER_ROOM, content: content};
}