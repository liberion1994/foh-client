/**
 * Created by liboyuan on 2017/1/24.
 */

import update from "react-addons-update";
import * as Actions from "../actions/remoteGameAction";
import {Types} from "foh-core";

export default function remoteGame(state = {
    synchronized: false,
    message: null,
    histories: [],
    chats: []
}, action) {
    switch (action.type) {
        case Actions.NO_LONGER_SYNCHRONIZED_REMOTE_GAME:
            return {...state, ...{synchronized: false}};
        case Actions.ON_MESSAGE_DISMISS_REMOTE:
            return {...state, ...{message: null}};
        case Actions.ON_RESULT_DISMISS_REMOTE:
            let cur = update(state, {room: {game: {$set: null}}});
            for (let i = 0; i < 5; i ++) {
                cur = update(cur, {room: {seats: {[i]: {prepared: {$set: false}}}}});
            }
            return cur;
        case Actions.ON_ERROR_REMOTE:
            return {...state, ...{message: '错误：' + action.info}};
        case Actions.ON_SYNCHRONIZE_REMOTE:
            return {...state, ...{synchronized: true, room: action.room, message: '已重新同步'}};
        case Actions.ON_HEART_BEAT_REMOTE:

            return update(state, {room: {countDown: {$set: action.countDown}}});
        case Actions.ON_CHAT_REMOTE:
            return update(state, {chats: {$push: [action.chat]}});
        /*******action*******/
        case Actions.ON_NEW_ACTION_REMOTE:
            return update(state, {room: {eid: {$apply: x => (x+1)}}});
        case Actions.ON_ENTER_GAME_REMOTE:
            return update(state, {room: {seats: {[action.sid]: {$set: {
                playerName: action.content.playerName,
                majorNumber: action.content.majorNumber,
                prepared: false
            }}}}});
        case Actions.ON_PREPARE_GAME_REMOTE:
            return update(state, {room: {seats: {[action.sid]: {prepared: {$set: true}}}}});
        case Actions.ON_UNPREPARE_GAME_REMOTE:
            return update(state, {room: {seats: {[action.sid]: {prepared: {$set: false}}}}});
        case Actions.ON_LEAVE_GAME_REMOTE:
            return update(state, {room: {seats: {[action.sid]: {$set: null}}}});
        case Actions.ON_OFFER_MAJOR_AMOUNT_REMOTE:
            const tmp1_0 = update(state, {room: {game: {currentTurn: {remainedSid: {$splice: [[0, 1]]}}}}});
            return update(tmp1_0, {room: {game: {currentTurn: {done: {$unshift: [{
                sid: action.sid,
                action: Types.GameAction.OFFER_MAJOR_AMOUNT,
                content: action.content
            }]}}}}});
        case Actions.ON_CHOOSE_MAJOR_COLOR_REMOTE:
            const tmp2_0 = update(state, {room: {game: {currentTurn: {remainedSid: {$splice: [[0, 1]]}}}}});
            const tmp2_1 = update(tmp2_0, {room: {game: {currentTurn: {done: {$unshift: [{
                sid: action.sid,
                action: Types.GameAction.CHOOSE_MAJOR_COLOR,
                content: action.content
            }]}}}}});
            return update(tmp2_1, {room: {game: {majorColor: {$set: action.content.color}}}});
        case Actions.ON_RESERVE_CARDS_REMOTE:
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
        case Actions.ON_CHOOSE_A_COLOR_REMOTE:
            const tmp4_0 = update(state, {room: {game: {currentTurn: {remainedSid: {$splice: [[0, 1]]}}}}});
            const tmp4_1 = update(tmp4_0, {room: {game: {currentTurn: {done: {$unshift: [{
                sid: action.sid,
                action: Types.GameAction.CHOOSE_A_COLOR,
                content: action.content
            }]}}}}});
            return update(tmp4_1, {room: {game: {aColor: {$set: action.content.color}}}});
        case Actions.ON_PLAY_CARDS_REMOTE:
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
        case Actions.ON_GAME_START_REMOTE:
            const tmp11_0 = {...state, ...{message: '游戏开始！'}};
            return update(tmp11_0, {room: {game: {$set: action.content.game}}});
        case Actions.ON_WIN_IN_OFFER_MAJOR_AMOUNT_REMOTE:
            let done = state.room.game.currentTurn.done;
            let ind;
            for (let i = 0; i < done.length; i ++) {
                if (done[i].sid == action.content.sid) { ind = i; break; }
            }
            const tmp12_0 = update(state, {room: {game: {currentTurn: {maxSid: {$set: action.content.sid}}}}});
            return update(tmp12_0, {room: {game: {currentTurn: {done: {[ind]: {
                content: {majorShown: {$set: action.content.majors}}}}}}}});
        case Actions.ON_BECOME_MASTER_REMOTE:
            const tmp13_0 = {...state, ...{message: state.room.seats[action.content.sid].playerName + '成为了庄家'}};
            return update(tmp13_0, {room: {game: {masterSid: {$set: action.content.sid}}}});
        case Actions.ON_NEW_TURN_BEGIN_REMOTE:
            const tmp14_0 = update(state, {histories: {$push: [state.room.game.currentTurn]}});
            return update(tmp14_0, {room: {game: {currentTurn: {$set: action.content.turn}}}});
        case Actions.ON_UPDATE_CARDS_IN_HAND_REMOTE:
            return update(state, {room: {game: {cards: {$set: action.content.cards}}}});
        case Actions.ON_BECOME_SUB_MASTER_REMOTE:
            const tmp16_0 = {...state, ...{message: state.room.seats[action.content.sid].playerName + '成为了副庄'}};
            return update(tmp16_0, {room: {game: {subMasterSid: {$set: action.content.sid}}}});
        case Actions.ON_WIN_IN_PLAY_CARDS_REMOTE:
            let totalScore = 0;
            for (let i = 0; i < action.content.scores.length; i ++)
                totalScore += action.content.scores[i];
            const tmp17_0 = update(state, {room: {game: {currentTurn: {maxSid: {$set: action.content.sid}}}}});
            const tmp17_1 = update(tmp17_0, {room: {game: {points: {[action.content.sid]: {$apply: x => x + totalScore}}}}});
            return update(tmp17_1, {room: {game: {caught5Heart: {[action.content.sid]: {$push: action.content.fohs}}}}});
        case Actions.ON_WIN_RESERVED_CARDS_REMOTE:
            return update(state, {room: {game: {points: {[action.content.sid]: {$apply: x => x + action.content.score}}}}});
        case Actions.ON_DROP_CARDS_FAIL_REMOTE:
            return update(state, {room: {game: {currentTurn: {done: {[0]: {
                content: {cards: {$set: action.content.originPlayed}}}}}}}});
        case Actions.ON_DROP_CARDS_FAIL_RESTORE_REMOTE:
            return update(state, {room: {game: {currentTurn: {done: {[0]: {
                content: {cards: {$set: action.content.actuallyPlayed}}}}}}}});
        case Actions.ON_GAME_OVER_REMOTE:
            const tmp21_0 = {...state, ...{histories: []}};
            return update(tmp21_0, {room: {game: {result: {$set: action.content.result}}}});
        case Actions.ON_LEVEL_UP_REMOTE:
            let cur1 = state;
            for (let i = 0; i < 5; i ++) {
                cur1 = update(cur1, {room: {seats: {[i]: {majorNumber: {$set: action.content.majorNumbers[i]}}}}});
            }
            return cur1;
        case Actions.ON_BECOME_NEXT_MASTER_REMOTE:
            return update(state, {room: {nextMaster: {$set: action.content.sid}}});
        default:
            return state;

    }
}
