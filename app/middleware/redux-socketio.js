/**
 * Created by liboyuan on 2017/1/24.
 */
import * as SocketActions from "../redux/actions/socketAction";
import * as AuthActions from "../redux/actions/authAction";
import * as HallActions from "../redux/actions/hallAction";
import * as GameActions from '../redux/actions/remoteGameAction';
import * as Requests from "../socket/request";
import * as PageLocationActions from "../redux/actions/pageLocationAction";
import {Types, Events, Errors} from "foh-core";

export const createSocketIoMiddleWare = socket => store => {

    let pending = false;
    let pendingQueue = [];
    
    function invalidateStatus() {
        store.dispatch(HallActions.no_longer_synchronized_hall());
        store.dispatch(GameActions.no_longer_synchronized_remote_game());
    }

    socket.on('connect', () => {
        store.dispatch(SocketActions.socket_ready());
        store.dispatch(PageLocationActions.to_welcome_page());
        if (localStorage.authenticationCode) {
            store.dispatch(AuthActions.authenticate({
                type: Requests.AUTH_TYPES.AUTH_CODE,
                authenticationCode: localStorage.authenticationCode
            }));
        }
    });

    /**
     * 这些操作需要写在外面
     * socket.io连接断开后再连接后，会再次调用on connect，导致又一次注册事件，
     * 这就会导致server发一个消息，client作出多次响应，很糟糕
     */

    socket.on('disconnect', () => {
        store.dispatch(SocketActions.socket_disconnect());
        invalidateStatus();
    });

    socket.on(AuthActions.ON_AUTH_SUCCESS, content => {
        store.dispatch(AuthActions.on_auth_success(content.username));
        localStorage.authenticationCode = content.authenticationCode;
    });

    socket.on(AuthActions.ON_AUTH_FAILURE, content => {
        store.dispatch(AuthActions.on_auth_failure(content));
        invalidateStatus();
    });

    socket.on(AuthActions.ON_AUTH_LOGOUT, () => {
        store.dispatch(AuthActions.on_auth_logout());
        invalidateStatus();
        store.dispatch(PageLocationActions.to_welcome_page());
        localStorage.authenticationCode = null;
    });

    // socket.on(AuthActions.ON_FORCED_LOGOUT, () => {
    //     store.dispatch(AuthActions.on_auth_failure(Error.FORCED_LOGOUT));
    //     invalidateStatus();
    // });

    socket.on(HallActions.ON_SYNCHRONIZE_HALL, content => {
        store.dispatch(HallActions.on_synchronize_hall(content));
    });

    socket.on(HallActions.ON_CREATE_ROOM, content => {
        if (!store.getState().hall.synchronized)
            return;
        if (content.eid != store.getState().hall.content.eid + 1) {
            fetchHall();
        } else {
            store.dispatch(HallActions.on_new_event_hall());
            store.dispatch(HallActions.on_create_room(content));
        }
    });

    socket.on(HallActions.ON_REMOVE_ROOM, content => {
        if (!store.getState().hall.synchronized)
            return;
        if (content.eid != store.getState().hall.content.eid + 1) {
            fetchHall();
        } else {
            store.dispatch(HallActions.on_new_event_hall());
            store.dispatch(HallActions.on_remove_room(content));
        }
    });

    socket.on(HallActions.ON_USER_ONLINE, content => {
        if (!store.getState().hall.synchronized)
            return;
        if (content.eid != store.getState().hall.content.eid + 1) {
            fetchHall();
        } else {
            store.dispatch(HallActions.on_new_event_hall());
            store.dispatch(HallActions.on_user_online(content));
        }
    });

    socket.on(HallActions.ON_USER_OFFLINE, content => {
        if (!store.getState().hall.synchronized)
            return;
        if (content.eid != store.getState().hall.content.eid + 1) {
            fetchHall();
        } else {
            store.dispatch(HallActions.on_new_event_hall());
            store.dispatch(HallActions.on_user_offline(content));
        }
    });

    socket.on(HallActions.ON_ENTER_ROOM, content => {
        if (!store.getState().hall.synchronized)
            return;
        if (content.eid != store.getState().hall.content.eid + 1) {
            fetchHall();
        } else {
            store.dispatch(HallActions.on_new_event_hall());
            store.dispatch(HallActions.on_enter_room(content));
            if (content.username == store.getState().auth.username)
                store.dispatch(PageLocationActions.to_game_page());
        }
    });

    socket.on(HallActions.ON_LEAVE_ROOM, content => {
        if (!store.getState().hall.synchronized)
            return;
        if (content.eid != store.getState().hall.content.eid + 1) {
            fetchHall();
        } else {
            store.dispatch(HallActions.on_new_event_hall());
            store.dispatch(HallActions.on_leave_room(content));
        }
    });

    socket.on(HallActions.ON_GAME_START_ROOM, content => {
        if (!store.getState().hall.synchronized)
            return;
        if (content.eid != store.getState().hall.content.eid + 1) {
            fetchHall();
        } else {
            store.dispatch(HallActions.on_new_event_hall());
            store.dispatch(HallActions.on_game_start_room(content));
        }
    });

    socket.on(HallActions.ON_GAME_OVER_ROOM, content => {
        if (!store.getState().hall.synchronized)
            return;
        if (content.eid != store.getState().hall.content.eid + 1) {
            fetchHall();
        } else {
            store.dispatch(HallActions.on_new_event_hall());
            store.dispatch(HallActions.on_game_over_room(content));
        }
    });

    /***All game actions***/
    socket.on(GameActions.ON_SYNCHRONIZE_REMOTE, content => {
        store.dispatch(GameActions.on_synchronize_remote(content));
    });

    socket.on(GameActions.ON_ERROR_REMOTE, errorCode => {
        store.dispatch(GameActions.on_error_remote(Errors.toText(errorCode)));
    });

    socket.on(GameActions.ON_CHAT_REMOTE, content => {
        store.dispatch(GameActions.on_chat_remote(content.chat));
    });


    socket.on(GameActions.ON_HEART_BEAT_REMOTE, content => {
        if (!store.getState().remoteGame.synchronized)
            return;
        if (content.eid != store.getState().remoteGame.room.eid) {
            fetchGame();
        } else {
            store.dispatch(GameActions.on_heart_beat_remote(content.countDown));
        }
    });

    socket.on(GameActions.ON_GAME_ACTION_REMOTE, content => {
        if (!store.getState().remoteGame.synchronized)
            return;
        let {action, events, eid} = content;
        if (eid != store.getState().remoteGame.room.eid + 1) {
            fetchGame();
        } else {
            parseAndDispatch(action, events);
        }
    });

    function parseAndDispatch(action, events) {

        store.dispatch(GameActions.on_new_action_remote());

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
                store.dispatch(GameActions.on_enter_game_remote(action.sid, action.content));
                break;
            case Types.RoomAction.PREPARE:
                store.dispatch(GameActions.on_prepare_game_remote(action.sid, action.content));
                break;
            case Types.RoomAction.UNPREPARE:
                store.dispatch(GameActions.on_unprepare_game_remote(action.sid, action.content));
                break;
            case Types.RoomAction.LEAVE:
                if (action.sid == store.getState().remoteGame.room.sid) {
                    store.dispatch(GameActions.no_longer_synchronized_remote_game());
                    store.dispatch(PageLocationActions.to_hall_page());
                } else {
                    store.dispatch(GameActions.on_leave_game_remote(action.sid, action.content));
                }
                break;
            case Types.GameAction.OFFER_MAJOR_AMOUNT:
                store.dispatch(GameActions.on_offer_major_amount_remote(action.sid, action.content));
                break;
            case Types.GameAction.CHOOSE_MAJOR_COLOR:
                store.dispatch(GameActions.on_choose_major_color_remote(action.sid, action.content));
                break;
            case Types.GameAction.RESERVE_CARDS:
                store.dispatch(GameActions.on_reserve_cards_remote(action.sid, action.content));
                break;
            case Types.GameAction.CHOOSE_A_COLOR:
                store.dispatch(GameActions.on_choose_a_color_remote(action.sid, action.content));
                break;
            case Types.GameAction.PLAY_CARDS:
                store.dispatch(GameActions.on_play_cards_remote(action.sid, action.content));
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
                store.dispatch(GameActions.on_game_start_remote(event.content));
                break;
            case Events.WinInOfferMajorAmount:
                store.dispatch(GameActions.on_win_in_offer_major_amount_remote(event.content));
                break;
            case Events.BecomeMaster:
                store.dispatch(GameActions.on_become_master_remote(event.content));
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
                            store.dispatch(GameActions.on_new_turn_begin_remote(event.content)); break;
                    }
                } else {
                    store.dispatch(GameActions.on_new_turn_begin_remote(event.content));
                }
                break;
            case Events.UpdateCardsInHand:
                store.dispatch(GameActions.on_update_cards_in_hand_remote(event.content));
                break;
            case Events.BecomeSubMaster:
                store.dispatch(GameActions.on_become_sub_master_remote(event.content));
                break;
            case Events.WinInPlayCards:
                store.dispatch(GameActions.on_win_in_play_cards_remote(event.content));
                break;
            case Events.WinReservedCards:
                store.dispatch(GameActions.on_win_reserved_cards_remote(event.content));
                break;
            case Events.DropCardsFail:
                if (!force) {
                    store.dispatch(GameActions.on_drop_cards_fail_remote(event.content));
                    postpone(event, false, 1500);
                } else {
                    store.dispatch(GameActions.on_drop_cards_fail_restore_remote(event.content));
                }
                break;
            case Events.GameOver:
                if (!force) {
                    postpone(event, false, 2000); break;
                } else {
                    store.dispatch(GameActions.on_game_over_remote(event.content));
                }
                break;
            case Events.LevelUp:
                store.dispatch(GameActions.on_level_up_remote(event.content));
                break;
            case Events.BecomeNextMaster:
                store.dispatch(GameActions.on_become_next_master_remote(event.content));
                break;
            default:
                break;

        }
    }


    /**
     *
     *
     * 以上操作来自远端，dispatch给redux
     *
     *
     * 以下操作来自本地（拦截自中间件），发向远端
     *
     *
     */

    /** auth **/
    function requestLogin(content) {
        socket.emit(AuthActions.AUTHENTICATE, content);
    }
    function logout() {
        socket.emit(AuthActions.LOGOUT);
    }

    /** hall **/
    function fetchHall() {
        socket.emit(HallActions.FETCH_HALL);
    }
    function createRoom(room) {
        socket.emit(HallActions.CREATE_ROOM, {room: room});
    }
    function enterRoom(id, sid) {
        socket.emit(HallActions.ENTER_ROOM, {id: id, sid: sid});
    }

    /** game **/
    function fetchGame() {
        socket.emit(GameActions.FETCH_GAME_REMOTE);
    }

    function prepareGame() {
        socket.emit(GameActions.PREPARE_GAME_REMOTE);
    }

    function unprepareGame() {
        socket.emit(GameActions.UNPREPARE_GAME_REMOTE);
    }

    function leaveGame() {
        socket.emit(GameActions.LEAVE_GAME_REMOTE);
    }

    function offerMajorAmount(amount) {
        socket.emit(GameActions.OFFER_MAJOR_AMOUNT_REMOTE, {amount: amount});
    }

    function chooseMajorColor(color) {
        socket.emit(GameActions.CHOOSE_MAJOR_COLOR_REMOTE, {color: color});
    }

    function reserveCards(cards) {
        socket.emit(GameActions.RESERVE_CARDS_REMOTE, {cards: cards});
    }

    function chooseAColor(color) {
        socket.emit(GameActions.CHOOSE_A_COLOR_REMOTE, {color: color});
    }

    function playCards(cards) {
        socket.emit(GameActions.PLAY_CARDS_REMOTE, {cards: cards});
    }

    function addRobot(sid, robot) {
        socket.emit(GameActions.ADD_ROBOT_REMOTE, {sid: sid, robot: robot});
    }

    function removeRobot(sid) {
        socket.emit(GameActions.REMOVE_ROBOT_REMOTE, {sid: sid});
    }

    function sendChat(chat) {
        socket.emit(GameActions.SEND_CHAT_REMOTE, {chat: chat});
    }

    return next => action => {

        switch (action.type) {
            /***Authentication***/
            case AuthActions.AUTHENTICATE:
                requestLogin(action.content); break;
            case AuthActions.LOGOUT:
                logout(); break;
            /***Hall***/
            case HallActions.FETCH_HALL:
                fetchHall(); break;
            case HallActions.CREATE_ROOM:
                createRoom(action.room); break;
            case HallActions.ENTER_ROOM:
                enterRoom(action.id, action.sid); break;
            /***Remote Game***/
            case GameActions.FETCH_GAME_REMOTE:
                fetchGame(); break;
            case GameActions.PREPARE_GAME_REMOTE:
                prepareGame(); break;
            case GameActions.UNPREPARE_GAME_REMOTE:
                unprepareGame(); break;
            case GameActions.LEAVE_GAME_REMOTE:
                leaveGame(); break;
            case GameActions.OFFER_MAJOR_AMOUNT_REMOTE:
                offerMajorAmount(action.amount); break;
            case GameActions.CHOOSE_MAJOR_COLOR_REMOTE:
                chooseMajorColor(action.color); break;
            case GameActions.RESERVE_CARDS_REMOTE:
                reserveCards(action.cards); break;
            case GameActions.CHOOSE_A_COLOR_REMOTE:
                chooseAColor(action.color); break;
            case GameActions.PLAY_CARDS_REMOTE:
                playCards(action.cards); break;
            case GameActions.ADD_ROBOT_REMOTE:
                addRobot(action.sid, action.robot); break;
            case GameActions.REMOVE_ROBOT_REMOTE:
                removeRobot(action.sid); break;
            case GameActions.SEND_CHAT_REMOTE:
                sendChat(action.chat); break;
                
            default:
                next(action); break;
        }
    };
};