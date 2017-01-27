/**
 * Created by liboyuan on 2017/1/24.
 */
import * as SocketActions from "../redux/actions/socketAction";
import * as AuthActions from "../redux/actions/authAction";
import * as Requests from "../socket/request";

export const createSocketIoMiddleWare = socket => store => {

    socket.on('connect', () => {
        store.dispatch(SocketActions.socket_ready());
        if (localStorage.authenticationCode) {
            store.dispatch(AuthActions.authenticate({
                type: Requests.AUTH_TYPES.AUTH_CODE,
                authenticationCode: localStorage.authenticationCode
            }));
        }
    });

    /**
     * 这些操作需要写在外面
     * socket.io存在一个bug，当连接断开后，会再次调用on connect，导致又一次注册事件，
     * 这就会导致server发一个消息，client作出多次响应，很糟糕
     */

    socket.on('disconnect', () => {
        store.dispatch(SocketActions.socket_disconnect());
    });

    return next => action => {

        if (false) {
            //TODO code here
        } else {
            next(action);
        }
    };
};