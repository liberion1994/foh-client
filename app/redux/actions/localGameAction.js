/**
 * Created by liboyuan on 2017/1/24.
 */


//local, called from user(that is to say, react events)
export const FETCH_GAME_LOCAL = 'FETCH_GAME_LOCAL';
export const ENTER_GAME_LOCAL = 'ENTER_GAME_LOCAL';
export const PREPARE_GAME_LOCAL = 'PREPARE_GAME_LOCAL';
export const UNPREPARE_GAME_LOCAL = 'UNPREPARE_GAME_LOCAL';
export const LEAVE_GAME_LOCAL = 'LEAVE_GAME_LOCAL';
export const OFFER_MAJOR_AMOUNT_LOCAL = 'OFFER_MAJOR_AMOUNT_LOCAL';
export const CHOOSE_MAJOR_COLOR_LOCAL = 'CHOOSE_MAJOR_COLOR_LOCAL';
export const RESERVE_CARDS_LOCAL = 'RESERVE_CARDS_LOCAL';
export const CHOOSE_A_COLOR_LOCAL = 'CHOOSE_A_COLOR_LOCAL';
export const PLAY_CARDS_LOCAL = 'PLAY_CARDS_LOCAL';

export const ON_MESSAGE_DISMISS_LOCAL = 'ON_MESSAGE_DISMISS_LOCAL';
export const ON_RESULT_DISMISS_LOCAL = 'ON_RESULT_DISMISS_LOCAL';

export const ADD_ROBOT_LOCAL = 'ADD_ROBOT_LOCAL';
export const REMOVE_ROBOT_LOCAL = 'REMOVE_ROBOT_LOCAL';

export function fetch_game_local() {
    return { type: FETCH_GAME_LOCAL }
}
export function enter_game_local(sid) {
    return { type: ENTER_GAME_LOCAL, sid: sid }
}
export function prepare_game_local() {
    return { type: PREPARE_GAME_LOCAL }
}
export function unprepare_game_local() {
    return { type: UNPREPARE_GAME_LOCAL }
}
export function leave_game_local() {
    return { type: LEAVE_GAME_LOCAL }
}
export function offer_major_amount_local(amount) {
    return { type: OFFER_MAJOR_AMOUNT_LOCAL, amount: amount }
}
export function choose_major_color_local(color) {
    return { type: CHOOSE_MAJOR_COLOR_LOCAL, color: color }
}
export function reserve_cards_local(cards) {
    return { type: RESERVE_CARDS_LOCAL, cards: cards}
}
export function choose_a_color_local(color) {
    return { type: CHOOSE_A_COLOR_LOCAL, color: color }
}
export function play_cards_local(cards) {
    return { type: PLAY_CARDS_LOCAL, cards: cards}
}
export function on_message_dismiss_local() {
    return { type: ON_MESSAGE_DISMISS_LOCAL }
}
export function on_result_dismiss_local() {
    return { type: ON_RESULT_DISMISS_LOCAL }
}
export function add_robot_local(sid, robot) {
    return { type: ADD_ROBOT_LOCAL, sid: sid, robot: robot }
}
export function remove_robot_local(sid) {
    return { type: REMOVE_ROBOT_LOCAL, sid: sid }
}

//remote, called from middleware
export const ON_ERROR_LOCAL = 'ON_ERROR_LOCAL';

export const ON_SYNCHRONIZE_LOCAL = 'ON_SYNCHRONIZE_LOCAL';

export const ON_NEW_ACTION_LOCAL = 'ON_NEW_ACTION_LOCAL';
export const ON_ENTER_GAME_LOCAL = 'ON_ENTER_GAME_LOCAL';
export const ON_PREPARE_GAME_LOCAL = 'ON_PREPARE_GAME_LOCAL';
export const ON_UNPREPARE_GAME_LOCAL = 'ON_UNPREPARE_GAME_LOCAL';
export const ON_LEAVE_GAME_LOCAL = 'ON_LEAVE_GAME_LOCAL';

export const ON_OFFER_MAJOR_AMOUNT_LOCAL = 'ON_OFFER_MAJOR_AMOUNT_LOCAL';
export const ON_CHOOSE_MAJOR_COLOR_LOCAL = 'ON_CHOOSE_MAJOR_COLOR_LOCAL';
export const ON_RESERVE_CARDS_LOCAL = 'ON_RESERVE_CARDS_LOCAL';
export const ON_CHOOSE_A_COLOR_LOCAL = 'ON_CHOOSE_A_COLOR_LOCAL';
export const ON_PLAY_CARDS_LOCAL = 'ON_PLAY_CARDS_LOCAL';

export const ON_GAME_START_LOCAL = 'ON_GAME_START_LOCAL';
export const ON_WIN_IN_OFFER_MAJOR_AMOUNT_LOCAL = 'ON_WIN_IN_OFFER_MAJOR_AMOUNT_LOCAL';
export const ON_BECOME_MASTER_LOCAL = 'ON_BECOME_MASTER_LOCAL';
export const ON_NEW_TURN_BEGIN_LOCAL = 'ON_NEW_TURN_BEGIN_LOCAL';
export const ON_UPDATE_CARDS_IN_HAND_LOCAL = 'ON_UPDATE_CARDS_IN_HAND_LOCAL';
export const ON_BECOME_SUB_MASTER_LOCAL = 'ON_BECOME_SUB_MASTER_LOCAL';
export const ON_WIN_IN_PLAY_CARDS_LOCAL = 'ON_WIN_IN_PLAY_CARDS_LOCAL';
export const ON_WIN_RESERVED_CARDS_LOCAL = 'ON_WIN_RESERVED_CARDS_LOCAL';
export const ON_DROP_CARDS_FAIL_LOCAL = 'ON_DROP_CARDS_FAIL_LOCAL';
export const ON_DROP_CARDS_FAIL_RESTORE_LOCAL = 'ON_DROP_CARDS_FAIL_RESTORE_LOCAL';
export const ON_GAME_OVER_LOCAL = 'ON_GAME_OVER_LOCAL';
export const ON_LEVEL_UP_LOCAL = 'ON_LEVEL_UP_LOCAL';
export const ON_BECOME_NEXT_MASTER_LOCAL = 'ON_BECOME_NEXT_MASTER_LOCAL';

export function on_synchronize_local(room) {
    return {type: ON_SYNCHRONIZE_LOCAL, room: room};
}
export function on_error_local(info) {
    return {type: ON_ERROR_LOCAL, info: info};
}

//action
export function on_new_action_local() {
    return {type: ON_NEW_ACTION_LOCAL};
}
export function on_enter_game_local(sid, content) {
    return {type: ON_ENTER_GAME_LOCAL, sid: sid, content: content};
}
export function on_prepare_game_local(sid, content) {
    return {type: ON_PREPARE_GAME_LOCAL, sid: sid, content: content};
}
export function on_leave_game_local(sid, content) {
    return {type: ON_LEAVE_GAME_LOCAL, sid: sid, content: content};
}

export function on_unprepare_game_local(sid, content) {
    return {type: ON_UNPREPARE_GAME_LOCAL, sid: sid, content: content};
}
export function on_offer_major_amount_local(sid, content) {
    return {type: ON_OFFER_MAJOR_AMOUNT_LOCAL, sid: sid, content: content};
}
export function on_choose_major_color_local(sid, content) {
    return {type: ON_CHOOSE_MAJOR_COLOR_LOCAL, sid: sid, content: content};
}
export function on_reserve_cards_local(sid, content) {
    return {type: ON_RESERVE_CARDS_LOCAL, sid: sid, content: content};
}
export function on_choose_a_color_local(sid, content) {
    return {type: ON_CHOOSE_A_COLOR_LOCAL, sid: sid, content: content};
}
export function on_play_cards_local(sid, content) {
    return {type: ON_PLAY_CARDS_LOCAL, sid: sid, content: content};
}

//events
export function on_game_start_local(content) {
    return {type: ON_GAME_START_LOCAL, content: content};
}
export function on_win_in_offer_major_amount_local(content) {
    return {type: ON_WIN_IN_OFFER_MAJOR_AMOUNT_LOCAL, content: content};
}
export function on_become_master_local(content) {
    return {type: ON_BECOME_MASTER_LOCAL, content: content};
}
export function on_new_turn_begin_local(content) {
    return {type: ON_NEW_TURN_BEGIN_LOCAL, content: content};
}
export function on_update_cards_in_hand_local(content) {
    return {type: ON_UPDATE_CARDS_IN_HAND_LOCAL, content: content};
}
export function on_become_sub_master_local(content) {
    return {type: ON_BECOME_SUB_MASTER_LOCAL, content: content};
}
export function on_win_in_play_cards_local(content) {
    return {type: ON_WIN_IN_PLAY_CARDS_LOCAL, content: content};
}
export function on_win_reserved_cards_local(content) {
    return {type: ON_WIN_RESERVED_CARDS_LOCAL, content: content};
}
export function on_drop_cards_fail_local(content) {
    return {type: ON_DROP_CARDS_FAIL_LOCAL, content: content};
}
export function on_drop_cards_fail_restore_local(content) {
    return {type: ON_DROP_CARDS_FAIL_RESTORE_LOCAL, content: content};
}
export function on_game_over_local(content) {
    return {type: ON_GAME_OVER_LOCAL, content: content};
}
export function on_level_up_local(content) {
    return {type: ON_LEVEL_UP_LOCAL, content: content};
}
export function on_become_next_master_local(content) {
    return {type: ON_BECOME_NEXT_MASTER_LOCAL, content: content};
}