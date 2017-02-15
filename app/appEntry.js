'use strict';

import React from 'react';

import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

// const events = window.require('events');
// const path = window.require('path');
// const fs = window.require('fs');
//
// const electron = window.require('electron');
// const {ipcRenderer, shell} = electron;
// const {dialog} = electron.remote;

import {createStore, applyMiddleware} from "redux";
import {Provider} from "react-redux";
import reduxThunk from "redux-thunk";
import reduxApp from './redux/reduxApp';
import {connect} from "react-redux";


/****middlewares****/
import io from "socket.io-client";
import {createSocketIoMiddleWare} from './middleware/redux-socketio';

import {Room, SampleAI as AI} from 'foh-core';
import {createLocalGameMiddleWare} from './middleware/redux-localgame';

import createLogger from 'redux-logger';

/****material-ui****/
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

/****custom widgets****/
import AppTopBar from './common/appBar';
import SidePanel from './common/sidePanel';
import LoadingMask from './common/loadingMask';
import LoginDialog from './common/loginDialog';
import WelcomePage from './welcome/welcomePage';
import HallPage from './hall/hallPage';
import GamePage from './game/gamePage';

/****redux****/
import * as AuthAction from './redux/actions/authAction';
import * as AuthState from './redux/states/authState';
import * as SocketState from './redux/states/socketState';
import * as PageLocationAction from './redux/actions/pageLocationAction';
import * as PageLocationState from './redux/states/pageLocationState';

import * as LocalGameAction from './redux/actions/localGameAction';
import * as RemoteGameAction from './redux/actions/remoteGameAction';

import * as HallAction from './redux/actions/hallAction';
import * as Request from './socket/request';
import {errorToAuthTitle} from "./const/authErrors";

const socket = io('http://localhost:3000');
const socketIoMiddleware = createSocketIoMiddleWare(socket);

const room = new Room([new AI(), new AI(), new AI(), new AI(), new AI()]);
const localGameMiddleware = createLocalGameMiddleWare(room);

const logger = createLogger({collapsed: true});

let store = createStore(reduxApp, applyMiddleware(
    reduxThunk,
    socketIoMiddleware,
    localGameMiddleware,
    logger
));

// store.subscribe(()=>{
//     console.log('new client state', store.getState().localGame);
// });

let muiTheme = getMuiTheme({
    fontFamily: 'Noto Sans, sans-serif'
});


class MainWindow extends React.Component {

    constructor(props) {
        super(props);
        injectTapEventPlugin();

        this.state = {
            sidePanelOpen: false,
            loginDialogShown: false,
            register: false,
            logoutDialogShown: false,
            authFailDialogShown: false,
            maskShown: false
        };
    }

    componentWillReceiveProps(nextProps) {
        let {auth, socket} = nextProps;
        if (auth && auth.state == AuthState.AUTHENTICATED)
            this.setState({loginDialogShown: false});
        if (auth && auth.errorCode &&
            auth.state == AuthState.UNAUTHENTICATED &&
            this.props.auth.state != AuthState.UNAUTHENTICATED &&
            !this.state.loginDialogShown) {
            this.setState({authFailDialogShown: true});
        }
        if (socket && socket.state == SocketState.DISCONNECTED &&
            this.props.socket.state == SocketState.CONNECTED) {
            this.setState({maskShown: true});
        } else if (socket && socket.state == SocketState.CONNECTED &&
            this.props.socket.state == SocketState.DISCONNECTED) {
            this.setState({maskShown: false});
        }
    }

    render() {
        let {sidePanelOpen, loginDialogShown, maskShown} = this.state;
        let {dispatch, auth, socket, pageLocation, hall, localGame, remoteGame} = this.props;

        let mask = maskShown ? <LoadingMask message="与服务器失去连接"/> : null;

        let currentPage;
        switch(pageLocation.state) {
            case PageLocationState.VS_COM:
                currentPage = (
                    <GamePage
                        scene={localGame}
                        onEnter={() => {dispatch(LocalGameAction.fetch_game_local())}}
                        prepare={() => {dispatch(LocalGameAction.prepare_game_local())}}
                        unprepare={() => {dispatch(LocalGameAction.unprepare_game_local())}}
                        leave={() => {dispatch(LocalGameAction.leave_game_local())}}
                        offerMajorAmount={x => {dispatch(LocalGameAction.offer_major_amount_local(x))}}
                        chooseMajorColor={x => {dispatch(LocalGameAction.choose_major_color_local(x))}}
                        reserveCards={x => {dispatch(LocalGameAction.reserve_cards_local(x))}}
                        chooseAColor={x => {dispatch(LocalGameAction.choose_a_color_local(x))}}
                        playCards={x => {dispatch(LocalGameAction.play_cards_local(x))}}

                        addRobot={(sid, robot) => {dispatch(LocalGameAction.add_robot_local(sid, robot))}}
                        removeRobot={sid => {dispatch(LocalGameAction.remove_robot_local(sid))}}

                        onMessageDismiss={() => {dispatch(LocalGameAction.on_message_dismiss_local())}}
                        onResultDismiss={() => {dispatch(LocalGameAction.on_result_dismiss_local())}}

                        key={PageLocationState.VS_COM}
                    />);
                break;
            case PageLocationState.HALL:
                currentPage = (
                    <HallPage
                        key={PageLocationState.HALL}
                        hall={hall}
                        load={() => {dispatch(HallAction.fetch_hall())}}
                        createGame={room => {dispatch(HallAction.create_room(room))}}
                        enterRoom={(id, sid) => {dispatch(HallAction.enter_room(id, sid))}}
                    />);
                break;
            case PageLocationState.GAME:
                currentPage = (
                    <GamePage
                        scene={remoteGame}
                        onEnter={() => {dispatch(RemoteGameAction.fetch_game_remote())}}
                        prepare={() => {dispatch(RemoteGameAction.prepare_game_remote())}}
                        unprepare={() => {dispatch(RemoteGameAction.unprepare_game_remote())}}
                        leave={() => {dispatch(RemoteGameAction.leave_game_remote())}}
                        offerMajorAmount={x => {dispatch(RemoteGameAction.offer_major_amount_remote(x))}}
                        chooseMajorColor={x => {dispatch(RemoteGameAction.choose_major_color_remote(x))}}
                        reserveCards={x => {dispatch(RemoteGameAction.reserve_cards_remote(x))}}
                        chooseAColor={x => {dispatch(RemoteGameAction.choose_a_color_remote(x))}}
                        playCards={x => {dispatch(RemoteGameAction.play_cards_remote(x))}}

                        addRobot={(sid, robot) => {dispatch(RemoteGameAction.add_robot_remote(sid, robot))}}
                        removeRobot={sid => {dispatch(RemoteGameAction.remove_robot_remote(sid))}}

                        onMessageDismiss={() => {dispatch(RemoteGameAction.on_message_dismiss_remote())}}
                        onResultDismiss={() => {dispatch(RemoteGameAction.on_result_dismiss_remote())}}

                        key={PageLocationState.GAME}
                    />);
                break;
            case PageLocationState.WELCOME:
                currentPage =
                    <WelcomePage
                        key={PageLocationState.WELCOME}
                        socketState={socket.state}
                        auth={auth}
                        onRemove={(success) => {
                            if (success)
                                dispatch(PageLocationAction.to_hall_page());
                            else
                                dispatch(PageLocationAction.to_vs_com_page());
                        }}
                    />;
                break;
        }

        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div style={styles.root}>
                    <SidePanel
                        onClose={() => {this.setState({sidePanelOpen: !sidePanelOpen})}}
                        online={socket.state == SocketState.CONNECTED && auth.state == AuthState.AUTHENTICATED}
                        currentPage={pageLocation.state}
                        changePage={(index) => {
                            switch (index) {
                                case 0: dispatch(PageLocationAction.to_vs_com_page()); break;
                                case 1: dispatch(PageLocationAction.to_hall_page()); break;
                                case 2: dispatch(PageLocationAction.to_game_page()); break;
                                case 3: dispatch(PageLocationAction.to_settings_page()); break;
                                case 4: dispatch(PageLocationAction.to_players_page()); break;
                                default: break;
                            }
                        }}
                        open={sidePanelOpen}/>
                    <AppTopBar
                        connected={socket.state == SocketState.CONNECTED}
                        username={auth.state == AuthState.AUTHENTICATED ? auth.username : null}
                        onMenuButtonClicked={() => {this.setState({sidePanelOpen: !sidePanelOpen})}}
                        onLogin={() => {this.setState({loginDialogShown: true, register: false})}}
                        onRegister={() => {this.setState({loginDialogShown: true, register: true})}}
                        onLogout={() => {this.setState({logoutDialogShown: true})}}
                    />
                    <div style={styles.content}>
                        <ReactCSSTransitionGroup
                            transitionName="fade"
                            transitionAppear={true}
                            transitionAppearTimeout={600}
                            transitionEnterTimeout={600}
                            transitionLeaveTimeout={600}>
                            {currentPage}
                        </ReactCSSTransitionGroup>
                        <LoginDialog
                            show={loginDialogShown}
                            auth={auth}
                            register={this.state.register}
                            onCommit={(username, password) => {
                                dispatch(AuthAction.authenticate(
                                    {type: this.state.register ?
                                        Request.AUTH_TYPES.REG_AND_LOGIN : Request.AUTH_TYPES.LOGIN,
                                        username: username, password: password}));
                            }}
                            onCancel={() => {this.setState({loginDialogShown: false})}}
                        />
                        <Dialog
                            title="确定要登出吗？"
                            actions={[
                                <FlatButton
                                    label="确定"
                                    primary={true}
                                    onTouchTap={() => {
                                        dispatch(AuthAction.logout());
                                        this.setState({logoutDialogShown: false});
                                    }}
                                />,
                                <FlatButton
                                    label="取消"
                                    primary={false}
                                    onTouchTap={() => {this.setState({logoutDialogShown: false})}}
                                />
                            ]}
                            modal={true}
                            open={this.state.logoutDialogShown}
                        />
                        <Dialog
                            title='验证失败'
                            actions={[
                                <FlatButton
                                    label="确定"
                                    primary={true}
                                    onTouchTap={() => {
                                        dispatch(PageLocationAction.to_welcome_page());
                                        this.setState({authFailDialogShown: false});
                                    }}
                                />
                            ]}
                            modal={true}
                            open={this.state.authFailDialogShown}
                        >
                            <p>{errorToAuthTitle(auth.errorCode)}</p>
                        </Dialog>
                        {mask}
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }

}

const styles = {
    root: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
    },
    content: {
        flex: '1',
        position: 'relative',
        overflow: 'hidden'
    }
};

function select(state) {
    return {
        auth: state.auth,
        socket: state.socket,
        pageLocation: state.pageLocation,
        hall: state.hall,
        localGame: state.localGame,
        remoteGame: state.remoteGame
    }
}

let App = connect(select)(MainWindow);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('content')
);
