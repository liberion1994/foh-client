/**
 * Created by liboyuan on 2016/12/24.
 */
import * as Actions from '../actions/pageLocationAction';
import * as States from '../states/pageLocationState';

export default function pageLocation(state = {state: States.VS_COM}, action) {
    switch (action.type) {
        case Actions.TO_WELCOME_PAGE:
            return { ...state, ...{ state: States.WELCOME } };
        case Actions.TO_VS_COM_PAGE:
            return { ...state, ...{ state: States.VS_COM } };
        case Actions.TO_HALL_PAGE:
            return { ...state, ...{ state: States.HALL } };
        case Actions.TO_GAME_PAGE:
            return { ...state, ...{ state: States.GAME } };
        case Actions.TO_PLAYERS_PAGE:
            return { ...state, ...{ state: States.PLAYERS } };
        case Actions.TO_SETTINGS_PAGE:
            return { ...state, ...{ state: States.SETTINGS } };
        default:
            return state;
    }
}