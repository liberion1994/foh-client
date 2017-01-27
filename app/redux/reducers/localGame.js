/**
 * Created by liboyuan on 2017/1/24.
 */

import update from 'react-addons-update';

import * as Actions from '../actions/localGameAction';
import {Types, Properties, Events} from 'foh-core';

export default function localGame(state = {
    synchronized: false
}, action) {
    switch (action.type) {
        case Actions.ON_SYNCHRONIZE_LOCAL:
            return {...state, ...{synchronized: true, room: action.room}};

        /*******action*******/
        case Actions.ON_NEW_ACTION_LOCAL:
            return update(state, {room: {eid: {$apply: x => (x+1)}}});
        case Actions.ON_ENTER_GAME_LOCAL:
            return update(state, {room: {seats: {[action.sid]: {$set: {
                playerName: action.content.playerName,
                    majorNumber: action.content.majorNumber,
                prepared: false
            }}}}});
        case Actions.ON_PREPARE_GAME_LOCAL:
            return update(state, {room: {seats: {[action.sid]: {prepared: {$set: true}}}}});
        case Actions.ON_UNPREPARE_GAME_LOCAL:
            return update(state, {room: {seats: {[action.sid]: {prepared: {$set: false}}}}});
        case Actions.ON_OFFER_MAJOR_AMOUNT_LOCAL:
            const tmp1_0 = update(state, {room: {game: {currentTurn: {remainedSid: {$splice: [[0, 1]]}}}}});
            return update(tmp1_0, {room: {game: {currentTurn: {done: {$unshift: [{
                sid: action.sid,
                action: Types.GameAction.OFFER_MAJOR_AMOUNT,
                content: action.content
            }]}}}}});
        case Actions.ON_CHOOSE_MAJOR_COLOR_LOCAL:
            const tmp2_0 = update(state, {room: {game: {currentTurn: {remainedSid: {$splice: [[0, 1]]}}}}});
            const tmp2_1 = update(tmp2_0, {room: {game: {currentTurn: {done: {$unshift: [{
                sid: action.sid,
                action: Types.GameAction.CHOOSE_MAJOR_COLOR,
                content: action.content
            }]}}}}});
            return update(tmp2_1, {room: {game: {majorColor: {$set: action.content.color}}}});
        case Actions.ON_RESERVE_CARDS_LOCAL:
            const tmp3_0 = update(state, {room: {game: {currentTurn: {remainedSid: {$splice: [[0, 1]]}}}}});
            const tmp3_1 = update(tmp3_0, {room: {game: {currentTurn: {done: {$unshift: [{
                sid: action.sid,
                action: Types.GameAction.RESERVE_CARDS,
                content: action.content
            }]}}}}});
            if (action.content.cards == null) {
                return tmp3_1;
            } else {
                const tmp3_2 = update(tmp3_1, {room: {game: {reservedCards: {$set: action.content.cards}}}});
                return update(tmp3_2, {room: {game: {cards: {$set: action.content.inHand}}}});
            }
        case Actions.ON_CHOOSE_A_COLOR_LOCAL:
            const tmp4_0 = update(state, {room: {game: {currentTurn: {remainedSid: {$splice: [[0, 1]]}}}}});
            const tmp4_1 = update(tmp4_0, {room: {game: {currentTurn: {done: {$unshift: [{
                sid: action.sid,
                action: Types.GameAction.CHOOSE_A_COLOR,
                content: action.content
            }]}}}}});
            return update(tmp4_1, {room: {game: {aColor: {$set: action.content.color}}}});
        case Actions.ON_PLAY_CARDS_LOCAL:
            //TODO 这里有一点和远端不同步，即没有更新当前最大牌，不过目前这对于前端显示没有作用（如果有必要也可以在前端更新）
            const tmp5_0 = update(state, {room: {game: {currentTurn: {remainedSid: {$splice: [[0, 1]]}}}}});
            const tmp5_1 = update(tmp5_0, {room: {game: {currentTurn: {done: {$unshift: [{
                sid: action.sid,
                action: Types.GameAction.PLAY_CARDS,
                content: action.content
            }]}}}}});
            if (action.content.inHand) {
                return update(tmp5_1, {room: {game: {cards: {$set: action.content.inHand}}}});
            } else {
                return tmp5_1;
            }

        /*******event*******/
        case Actions.ON_GAME_START_LOCAL:
            return update(state, {room: {game: {$set: action.content.room}}});
        case Actions.ON_WIN_IN_OFFER_MAJOR_AMOUNT_LOCAL:
            let done = state.room.game.currentTurn.done;
            let ind;
            for (let i = 0; i < done.length; i ++) {
                if (done[i].sid == action.content.sid) { ind = i; break; }
            }
            return update(state, {room: {game: {currentTurn: {done: {[ind]: {
                content: {majorShown: {$set: action.content.majors}}}}}}}});
        case Actions.ON_BECOME_MASTER_LOCAL:
            return update(state, {room: {game: {masterSid: {$set: action.content.sid}}}});
        case Actions.ON_NEW_TURN_BEGIN_LOCAL:
            return update(state, {room: {game: {currentTurn: {$set: action.content.turn}}}});
        case Actions.ON_UPDATE_CARDS_IN_HAND_LOCAL:
            return update(state, {room: {game: {cards: {$set: action.content.cards}}}});
        default:
            return state;

    }
}
