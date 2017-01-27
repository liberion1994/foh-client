/**
 * Created by liboyuan on 2016/12/24.
 */

export const TO_WELCOME_PAGE = 'TO_WELCOME_PAGE';
export const TO_VS_COM_PAGE = 'TO_VS_COM_PAGE';
export const TO_HALL_PAGE = 'TO_HALL_PAGE';
export const TO_GAME_PAGE = 'TO_GAME_PAGE';
export const TO_PLAYERS_PAGE = 'TO_PLAYERS_PAGE';
export const TO_SETTINGS_PAGE = 'TO_SETTINGS_PAGE';

export function to_welcome_page() {
    return {type: TO_WELCOME_PAGE}
}

export function to_vs_com_page() {
    return {type: TO_VS_COM_PAGE}
}

export function to_hall_page() {
    return {type: TO_HALL_PAGE}
}

export function to_game_page() {
    return {type: TO_GAME_PAGE}
}

export function to_players_page() {
    return {type: TO_PLAYERS_PAGE}
}

export function to_settings_page() {
    return {type: TO_SETTINGS_PAGE}
}