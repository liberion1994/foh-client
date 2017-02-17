/**
 * Created by liboyuan on 2017/2/11.
 */


//local, called from user(that is to say, react events)
export const FETCH_GAME_REMOTE = 'FETCH_GAME_REMOTE';
export const PREPARE_GAME_REMOTE = 'PREPARE_GAME_REMOTE';
export const UNPREPARE_GAME_REMOTE = 'UNPREPARE_GAME_REMOTE';
export const LEAVE_GAME_REMOTE = 'LEAVE_GAME_REMOTE';
export const OFFER_MAJOR_AMOUNT_REMOTE = 'OFFER_MAJOR_AMOUNT_REMOTE';
export const CHOOSE_MAJOR_COLOR_REMOTE = 'CHOOSE_MAJOR_COLOR_REMOTE';
export const RESERVE_CARDS_REMOTE = 'RESERVE_CARDS_REMOTE';
export const CHOOSE_A_COLOR_REMOTE = 'CHOOSE_A_COLOR_REMOTE';
export const PLAY_CARDS_REMOTE = 'PLAY_CARDS_REMOTE';

export const SEND_CHAT_REMOTE = 'SEND_CHAT_REMOTE';

export const ON_MESSAGE_DISMISS_REMOTE = 'ON_MESSAGE_DISMISS_REMOTE';
export const ON_RESULT_DISMISS_REMOTE = 'ON_RESULT_DISMISS_REMOTE';

export const ADD_ROBOT_REMOTE = 'ADD_ROBOT_REMOTE';
export const REMOVE_ROBOT_REMOTE = 'REMOVE_ROBOT_REMOTE';

export const NO_LONGER_SYNCHRONIZED_REMOTE_GAME = 'NO_LONGER_SYNCHRONIZED_REMOTE_GAME';

export function fetch_game_remote() {
    return { type: FETCH_GAME_REMOTE }
}
export function prepare_game_remote() {
    return { type: PREPARE_GAME_REMOTE }
}
export function unprepare_game_remote() {
    return { type: UNPREPARE_GAME_REMOTE }
}
export function leave_game_remote() {
    return { type: LEAVE_GAME_REMOTE }
}
export function offer_major_amount_remote(amount) {
    return { type: OFFER_MAJOR_AMOUNT_REMOTE, amount: amount }
}
export function choose_major_color_remote(color) {
    return { type: CHOOSE_MAJOR_COLOR_REMOTE, color: color }
}
export function reserve_cards_remote(cards) {
    return { type: RESERVE_CARDS_REMOTE, cards: cards}
}
export function choose_a_color_remote(color) {
    return { type: CHOOSE_A_COLOR_REMOTE, color: color }
}
export function play_cards_remote(cards) {
    return { type: PLAY_CARDS_REMOTE, cards: cards}
}

export function send_chat_remote(chat) {
    return { type: SEND_CHAT_REMOTE, chat: chat }
}

export function on_message_dismiss_remote() {
    return { type: ON_MESSAGE_DISMISS_REMOTE }
}
export function on_result_dismiss_remote() {
    return { type: ON_RESULT_DISMISS_REMOTE }
}
export function add_robot_remote(sid, robot) {
    return { type: ADD_ROBOT_REMOTE, sid: sid, robot: robot }
}
export function remove_robot_remote(sid) {
    return { type: REMOVE_ROBOT_REMOTE, sid: sid }
}

export function no_longer_synchronized_remote_game() {
    return {type: NO_LONGER_SYNCHRONIZED_REMOTE_GAME};
}

//remote, called from middleware
export const ON_ERROR_REMOTE = 'ON_ERROR_REMOTE';
export const ON_SYNCHRONIZE_REMOTE = 'ON_SYNCHRONIZE_REMOTE';
export const ON_GAME_ACTION_REMOTE = 'ON_GAME_ACTION_REMOTE';
export const ON_HEART_BEAT_REMOTE = 'ON_HEART_BEAT_REMOTE';
export const ON_CHAT_REMOTE = 'ON_CHAT_REMOTE';

export const ON_NEW_ACTION_REMOTE = 'ON_NEW_ACTION_REMOTE';
export const ON_ENTER_GAME_REMOTE = 'ON_ENTER_GAME_REMOTE';
export const ON_PREPARE_GAME_REMOTE = 'ON_PREPARE_GAME_REMOTE';
export const ON_UNPREPARE_GAME_REMOTE = 'ON_UNPREPARE_GAME_REMOTE';
export const ON_LEAVE_GAME_REMOTE = 'ON_LEAVE_GAME_REMOTE';

export const ON_OFFER_MAJOR_AMOUNT_REMOTE = 'ON_OFFER_MAJOR_AMOUNT_REMOTE';
export const ON_CHOOSE_MAJOR_COLOR_REMOTE = 'ON_CHOOSE_MAJOR_COLOR_REMOTE';
export const ON_RESERVE_CARDS_REMOTE = 'ON_RESERVE_CARDS_REMOTE';
export const ON_CHOOSE_A_COLOR_REMOTE = 'ON_CHOOSE_A_COLOR_REMOTE';
export const ON_PLAY_CARDS_REMOTE = 'ON_PLAY_CARDS_REMOTE';

export const ON_GAME_START_REMOTE = 'ON_GAME_START_REMOTE';
export const ON_WIN_IN_OFFER_MAJOR_AMOUNT_REMOTE = 'ON_WIN_IN_OFFER_MAJOR_AMOUNT_REMOTE';
export const ON_BECOME_MASTER_REMOTE = 'ON_BECOME_MASTER_REMOTE';
export const ON_NEW_TURN_BEGIN_REMOTE = 'ON_NEW_TURN_BEGIN_REMOTE';
export const ON_UPDATE_CARDS_IN_HAND_REMOTE = 'ON_UPDATE_CARDS_IN_HAND_REMOTE';
export const ON_BECOME_SUB_MASTER_REMOTE = 'ON_BECOME_SUB_MASTER_REMOTE';
export const ON_WIN_IN_PLAY_CARDS_REMOTE = 'ON_WIN_IN_PLAY_CARDS_REMOTE';
export const ON_WIN_RESERVED_CARDS_REMOTE = 'ON_WIN_RESERVED_CARDS_REMOTE';
export const ON_DROP_CARDS_FAIL_REMOTE = 'ON_DROP_CARDS_FAIL_REMOTE';
export const ON_DROP_CARDS_FAIL_RESTORE_REMOTE = 'ON_DROP_CARDS_FAIL_RESTORE_REMOTE';
export const ON_GAME_OVER_REMOTE = 'ON_GAME_OVER_REMOTE';
export const ON_LEVEL_UP_REMOTE = 'ON_LEVEL_UP_REMOTE';
export const ON_BECOME_NEXT_MASTER_REMOTE = 'ON_BECOME_NEXT_MASTER_REMOTE';

export function on_synchronize_remote(room) {
    return {type: ON_SYNCHRONIZE_REMOTE, room: room};
}
export function on_error_remote(info) {
    return {type: ON_ERROR_REMOTE, info: info};
}
export function on_heart_beat_remote(countDown) {
    return {type: ON_HEART_BEAT_REMOTE, countDown: countDown};
}
export function on_chat_remote(chat) {
    return {type: ON_CHAT_REMOTE, chat: chat};
}

//action
export function on_new_action_remote() {
    return {type: ON_NEW_ACTION_REMOTE};
}
export function on_enter_game_remote(sid, content) {
    return {type: ON_ENTER_GAME_REMOTE, sid: sid, content: content};
}
export function on_prepare_game_remote(sid, content) {
    return {type: ON_PREPARE_GAME_REMOTE, sid: sid, content: content};
}
export function on_leave_game_remote(sid, content) {
    return {type: ON_LEAVE_GAME_REMOTE, sid: sid, content: content};
}

export function on_unprepare_game_remote(sid, content) {
    return {type: ON_UNPREPARE_GAME_REMOTE, sid: sid, content: content};
}
export function on_offer_major_amount_remote(sid, content) {
    return {type: ON_OFFER_MAJOR_AMOUNT_REMOTE, sid: sid, content: content};
}
export function on_choose_major_color_remote(sid, content) {
    return {type: ON_CHOOSE_MAJOR_COLOR_REMOTE, sid: sid, content: content};
}
export function on_reserve_cards_remote(sid, content) {
    return {type: ON_RESERVE_CARDS_REMOTE, sid: sid, content: content};
}
export function on_choose_a_color_remote(sid, content) {
    return {type: ON_CHOOSE_A_COLOR_REMOTE, sid: sid, content: content};
}
export function on_play_cards_remote(sid, content) {
    return {type: ON_PLAY_CARDS_REMOTE, sid: sid, content: content};
}

//events
export function on_game_start_remote(content) {
    return {type: ON_GAME_START_REMOTE, content: content};
}
export function on_win_in_offer_major_amount_remote(content) {
    return {type: ON_WIN_IN_OFFER_MAJOR_AMOUNT_REMOTE, content: content};
}
export function on_become_master_remote(content) {
    return {type: ON_BECOME_MASTER_REMOTE, content: content};
}
export function on_new_turn_begin_remote(content) {
    return {type: ON_NEW_TURN_BEGIN_REMOTE, content: content};
}
export function on_update_cards_in_hand_remote(content) {
    return {type: ON_UPDATE_CARDS_IN_HAND_REMOTE, content: content};
}
export function on_become_sub_master_remote(content) {
    return {type: ON_BECOME_SUB_MASTER_REMOTE, content: content};
}
export function on_win_in_play_cards_remote(content) {
    return {type: ON_WIN_IN_PLAY_CARDS_REMOTE, content: content};
}
export function on_win_reserved_cards_remote(content) {
    return {type: ON_WIN_RESERVED_CARDS_REMOTE, content: content};
}
export function on_drop_cards_fail_remote(content) {
    return {type: ON_DROP_CARDS_FAIL_REMOTE, content: content};
}
export function on_drop_cards_fail_restore_remote(content) {
    return {type: ON_DROP_CARDS_FAIL_RESTORE_REMOTE, content: content};
}
export function on_game_over_remote(content) {
    return {type: ON_GAME_OVER_REMOTE, content: content};
}
export function on_level_up_remote(content) {
    return {type: ON_LEVEL_UP_REMOTE, content: content};
}
export function on_become_next_master_remote(content) {
    return {type: ON_BECOME_NEXT_MASTER_REMOTE, content: content};
}