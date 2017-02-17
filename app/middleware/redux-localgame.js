/**
 * Created by liboyuan on 2017/1/24.
 */

import {Types, Properties, Events, Errors} from 'foh-core';
import * as GameActions from "../redux/actions/localGameAction";

export const createLocalGameMiddleWare = room => store => {

    let playerSid = -1;
    let playerName = '单机玩家';

    /*
     * 因为有些状态不能马上更新
     * 例如新的一轮开始，如果直接交给redux，会导致看不清前一轮最后一个人的动作
     * 因此需要一个pending队列
     */
    let pending = false;
    let pendingQueue = [];

    let robots = [null, null, null, null];

    room.registerActionListener((action, events, eid) => {

        processAction(action);
        let len = events.length;
        for (let i = 0; i < len; i ++)
            processEvent(events[i]);

        /****ai****/
        if (room.game && !room.game.result && robots[room.game.currentTurn.remainedSid[0]]) {
            setTimeout(() => {room.autoPlay()}, 2000);
        }
        for (let i = 0; i < len; i ++) {
            if (events[i].type == Events.GameOver) {
                setTimeout(() => {
                    for (let i = 0; i < Properties.GamePlayers; i++) {
                        if (robots[i]) {
                            room.onAction(i, Types.RoomAction.PREPARE, {playerName: robots[i].name});
                        }
                    }
                }, 2000);
                break;
            }
        }
        /*****Remote above*****/


        /***simulate net transport*****/
        let receivedAction = JSON.parse(JSON.stringify(action)),
            receivedEvents = JSON.parse(JSON.stringify(events));

        /*****Local*****/
        if (eid != store.getState().localGame.room.eid + 1) {
            fetchGame();
        } else {
            parseAndDispatch(receivedAction, receivedEvents);
        }

    });
    room.registerErrorListener(errorCode => {
        store.dispatch(GameActions.on_error_local(Errors.toText(errorCode)));
    });

    /**
     * 远端处理action，不是所有的action都能直接传给redux（例如别人埋底）
     * 这里看到把手牌也传过来了，可能显得有点冗余，这主要是踩了mutable的坑，下次最好用一下Immutable库
     * @param action
     */
    function processAction(action) {
        switch (action.action) {
            case Types.GameAction.RESERVE_CARDS:
                if (playerSid != action.sid)
                    action.content.cards = null;
                else
                    action.content.inHand = room.game.cards[action.sid];
                break;
            case Types.GameAction.PLAY_CARDS:
                if (playerSid == action.sid && room.game)
                    action.content.inHand = room.game.cards[action.sid];
                break;
        }
    }

    /**
     * 远端处理event
     * @param event
     */
    function processEvent(event) {
        switch (event.type) {
            case Events.GameStart:
                event.content = {game: room.game.snapshot(playerSid)};
                break;
            case Events.UpdateCardsInHand:
                event.content.cards = event.content.cardSets[playerSid];
                event.content.cardSets = null;
                break;
            default:
                break;
        }
    }
    
    function parseAndDispatch(action, events) {

        store.dispatch(GameActions.on_new_action_local());

        parseAndDispatchAction(action, false);
        let len = events.length;
        for (let i = 0; i < len; i ++)
            parseAndDispatchEvent(events[i], false);
    }


    function handlePendings() {
        let len = pendingQueue.length;

        for (let i = 0; i < len; i ++) {
            let target = pendingQueue.shift();
            if (target.isAction) {
                parseAndDispatchAction(target.content, false);
            } else {
                parseAndDispatchEvent(target.content, false);
            }
        }
    }

    function enQueue(target, isAction) {
        pendingQueue.push({isAction: isAction, content: target});
    }

    function postpone(target, isAction, delay) {
        pending = true;
        setTimeout(() => {
            pending = false;
            if (isAction)
                parseAndDispatchAction(target, true);
            else
                parseAndDispatchEvent(target, true);
            handlePendings();
        }, delay);
    }
    
    function parseAndDispatchAction(action, force) {
        if (pending) {
            enQueue(action, true);
            return;
        }

        switch (action.action) {
            case Types.RoomAction.ENTER:
                store.dispatch(GameActions.on_enter_game_local(action.sid, action.content));
                break;
            case Types.RoomAction.PREPARE:
                store.dispatch(GameActions.on_prepare_game_local(action.sid, action.content));
                break;
            case Types.RoomAction.UNPREPARE:
                store.dispatch(GameActions.on_unprepare_game_local(action.sid, action.content));
                break;
            case Types.RoomAction.LEAVE:
                store.dispatch(GameActions.on_leave_game_local(action.sid, action.content));
                break;
            case Types.GameAction.OFFER_MAJOR_AMOUNT:
                store.dispatch(GameActions.on_offer_major_amount_local(action.sid, action.content));
                break;
            case Types.GameAction.CHOOSE_MAJOR_COLOR:
                store.dispatch(GameActions.on_choose_major_color_local(action.sid, action.content));
                break;
            case Types.GameAction.RESERVE_CARDS:
                store.dispatch(GameActions.on_reserve_cards_local(action.sid, action.content));
                break;
            case Types.GameAction.CHOOSE_A_COLOR:
                store.dispatch(GameActions.on_choose_a_color_local(action.sid, action.content));
                break;
            case Types.GameAction.PLAY_CARDS:
                store.dispatch(GameActions.on_play_cards_local(action.sid, action.content));
                break;
        }
    }

    function parseAndDispatchEvent(event, force) {
        if (pending) {
            enQueue(event, false);
            return;
        }

        switch (event.type) {
            case Events.GameStart:
                store.dispatch(GameActions.on_game_start_local(event.content));
                break;
            case Events.WinInOfferMajorAmount:
                store.dispatch(GameActions.on_win_in_offer_major_amount_local(event.content));
                break;
            case Events.BecomeMaster:
                store.dispatch(GameActions.on_become_master_local(event.content));
                break;
            case Events.NewTurnBegin:
                if (!force) {
                    switch (event.content.turn.action) {
                        case Types.GameAction.CHOOSE_MAJOR_COLOR:
                            postpone(event, false, 3000); break;
                        case Types.GameAction.RESERVE_CARDS:
                        case Types.GameAction.PLAY_CARDS:
                            postpone(event, false, 2000); break;
                        case Types.GameAction.CHOOSE_A_COLOR:
                        default:
                            store.dispatch(GameActions.on_new_turn_begin_local(event.content)); break;
                    }
                } else {
                    store.dispatch(GameActions.on_new_turn_begin_local(event.content));
                }
                break;
            case Events.UpdateCardsInHand:
                store.dispatch(GameActions.on_update_cards_in_hand_local(event.content));
                break;
            case Events.BecomeSubMaster:
                store.dispatch(GameActions.on_become_sub_master_local(event.content));
                break;
            case Events.WinInPlayCards:
                store.dispatch(GameActions.on_win_in_play_cards_local(event.content));
                break;
            case Events.WinReservedCards:
                store.dispatch(GameActions.on_win_reserved_cards_local(event.content));
                break;
            case Events.DropCardsFail:
                if (!force) {
                    store.dispatch(GameActions.on_drop_cards_fail_local(event.content));
                    postpone(event, false, 1500);
                } else {
                    store.dispatch(GameActions.on_drop_cards_fail_restore_local(event.content));
                }
                break;
            case Events.GameOver:
                if (!force) {
                    postpone(event, false, 2000); break;
                } else {
                    store.dispatch(GameActions.on_game_over_local(event.content));
                }
                break;
            case Events.LevelUp:
                store.dispatch(GameActions.on_level_up_local(event.content));
                break;
            case Events.BecomeNextMaster:
                store.dispatch(GameActions.on_become_next_master_local(event.content));
                break;
            default:
                break;

        }
    }


    function fetchGame() {
        if (playerSid != -1)
            store.dispatch(GameActions.on_synchronize_local(JSON.parse(JSON.stringify(room.info(playerSid)))));
        else
            enterGame(0);
    }

    function enterGame(sid) {
        playerSid = sid;
        store.dispatch(GameActions.on_synchronize_local(JSON.parse(JSON.stringify(room.info(sid)))));
        room.onAction(sid, Types.RoomAction.ENTER, {playerName: playerName, majorNumber: 2});
    }

    function prepareGame() {
        room.onAction(playerSid, Types.RoomAction.PREPARE, {playerName: playerName});
    }

    function unprepareGame() {
        room.onAction(playerSid, Types.RoomAction.UNPREPARE, {playerName: playerName});
    }

    function offerMajorAmount(amount) {
        room.onAction(playerSid, Types.GameAction.OFFER_MAJOR_AMOUNT, {amount: amount})
    }

    function chooseMajorColor(color) {
        room.onAction(playerSid, Types.GameAction.CHOOSE_MAJOR_COLOR, {color: color})
    }

    function reserveCards(cards) {
        room.onAction(playerSid, Types.GameAction.RESERVE_CARDS, {cards: cards})
    }

    function chooseAColor(color) {
        room.onAction(playerSid, Types.GameAction.CHOOSE_A_COLOR, {color: color})
    }

    function playCards(cards) {
        room.onAction(playerSid, Types.GameAction.PLAY_CARDS, {cards: cards})
    }

    function addRobot(sid, robot) {
        if (room.seats[sid]) return;
        robots[sid] = robot;
        room.onAction(sid, Types.RoomAction.ENTER, {playerName: robot.name, majorNumber: robot.majorNumber});
        room.onAction(sid, Types.RoomAction.PREPARE, {playerName: robot.name});
    }

    function removeRobot(sid) {
        if (!room.seats[sid] || !robots[sid] || room.game) return;
        let name = robots[sid].name;
        robots[sid] = null;
        room.onAction(sid, Types.RoomAction.LEAVE, {playerName: name});
    }

    return next => action => {

        switch (action.type) {
            case GameActions.FETCH_GAME_LOCAL:
                fetchGame(); break;
            case GameActions.PREPARE_GAME_LOCAL:
                prepareGame(); break;
            case GameActions.UNPREPARE_GAME_LOCAL:
                unprepareGame(); break;
            case GameActions.LEAVE_GAME_LOCAL:
                store.dispatch(GameActions.on_error_local('无法离开本地房间')); break;
            case GameActions.OFFER_MAJOR_AMOUNT_LOCAL:
                offerMajorAmount(action.amount); break;
            case GameActions.CHOOSE_MAJOR_COLOR_LOCAL:
                chooseMajorColor(action.color); break;
            case GameActions.RESERVE_CARDS_LOCAL:
                reserveCards(action.cards); break;
            case GameActions.CHOOSE_A_COLOR_LOCAL:
                chooseAColor(action.color); break;
            case GameActions.PLAY_CARDS_LOCAL:
                playCards(action.cards); break;
            case GameActions.ADD_ROBOT_LOCAL:
                addRobot(action.sid, action.robot); break;
            case GameActions.REMOVE_ROBOT_LOCAL:
                removeRobot(action.sid); break;
            default:
                next(action); break;
        }

    };
};