'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

const events = window.require('events');
const path = window.require('path');
const fs = window.require('fs');

const electron = window.require('electron');
const {ipcRenderer, shell} = electron;
const {dialog} = electron.remote;

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

/****custom widgets****/
import WelcomePage from './welcome/welcomePage';
import AppTopBar from './common/appBar';
import SidePanel from './common/sidePanel';
import HallPage from './hall/hallPage';
import GamePage from './game/gamePage';

/****redux****/
import * as AuthAction from './redux/actions/authAction';
import * as AuthState from './redux/states/authState';
import * as SocketState from './redux/states/socketState';
import * as PageLocationAction from './redux/actions/pageLocationAction';
import * as PageLocationState from './redux/states/pageLocationState';

import * as GameAction from './redux/actions/localGameAction';

import * as HallAction from './redux/actions/hallAction';
import * as HallState from './redux/states/hallState';
import * as Request from './socket/request';

// const socket = io('http://localhost:3000');
// const socketIoMiddleware = createSocketIoMiddleWare(socket);

const room = new Room([new AI(), new AI(), new AI(), new AI(), new AI()]);
const localGameMiddleware = createLocalGameMiddleWare(room);

const logger = createLogger({collapsed: true});

let store = createStore(reduxApp, applyMiddleware(
    reduxThunk,
    // socketIoMiddleware,
    localGameMiddleware,
    logger
));


// store.subscribe(()=>{
//     console.log('new client state', store.getState().localGame);
// });


let muiTheme = getMuiTheme();


class MainWindow extends React.Component {

    constructor(props) {
        super(props);
        injectTapEventPlugin();

        this.state = {
            userName: null,
            password: null,
            sidePanelOpen: false
        };
    }

    render() {
        let {sidePanelOpen} = this.state;
        let {dispatch, auth, socket, pageLocation, hall, localGame} = this.props;

        let currentPage;
        switch(pageLocation.state) {
            case PageLocationState.VS_COM:
                currentPage = (
                    <GamePage
                        scene={localGame}
                        onEnter={() => {dispatch(GameAction.fetch_game_local())}}
                        prepare={() => {dispatch(GameAction.prepare_game_local())}}
                        unprepare={() => {dispatch(GameAction.unprepare_game_local())}}
                        leave={() => {dispatch(GameAction.leave_game_local())}}
                        offerMajorAmount={x => {dispatch(GameAction.offer_major_amount_local(x))}}
                        chooseMajorColor={x => {dispatch(GameAction.choose_major_color_local(x))}}
                        reserveCards={x => {dispatch(GameAction.reserve_cards_local(x))}}
                        chooseAColor={x => {dispatch(GameAction.choose_a_color_local(x))}}
                        playCards={x => {dispatch(GameAction.play_cards_local(x))}}

                        onMessageDismiss={() => {dispatch(GameAction.on_message_dismiss())}}
                        onResultDismiss={() => {dispatch(GameAction.on_result_dismiss())}}

                        key={pageLocation}
                    />);
                break;
            case PageLocationState.HALL:
                currentPage = (
                    <HallPage
                        key={pageLocation}
                        hall={hall}
                        loadData={() => {
                            if (hall.state != HallState.FETCHED)
                                dispatch(HallAction.get_tables());
                        }}
                        onEnterTable={(content) => {
                            dispatch(HallAction.enter_table(content))
                        }}
                    />);
                break;
            case PageLocationState.GAME:
                currentPage = (
                    <GamePage
                        key={pageLocation}
                    />);
                break;
            case PageLocationState.WELCOME:
                currentPage =
                    <WelcomePage
                        socketState={socket.state}
                        auth={auth}
                        requestLogin={(username, password) => {
                            dispatch(AuthAction.authenticate(
                                {type: Request.AUTH_TYPES.LOGIN, username: username, password: password}));
                        }}
                        requestRegister={(username, password) => {
                            dispatch(AuthAction.authenticate(
                                {type: Request.AUTH_TYPES.REG_AND_LOGIN, username: username, password: password}));
                        }}
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
                        onMenuButtonClicked={() => {this.setState({sidePanelOpen: !sidePanelOpen})}}
                    />
                    <div style={styles.content}>
                        {currentPage}
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
        localGame: state.localGame
    }
}

let App = connect(select)(MainWindow);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('content')
);
