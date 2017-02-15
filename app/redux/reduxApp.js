/**
 * Created by liboyuan on 2016/12/23.
 */
import { combineReducers } from 'redux'

import socket from './reducers/socket';
import auth from './reducers/auth';
import pageLocation from './reducers/pageLocation';
import hall from './reducers/hall';
import localGame from './reducers/localGame';
import remoteGame from './reducers/remoteGame';

const reduxApp = combineReducers({
    socket,
    auth,
    pageLocation,
    hall,
    localGame,
    remoteGame
});

export default reduxApp;