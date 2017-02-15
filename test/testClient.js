/**
 * Created by liboyuan on 2017/2/8.
 */

'use strict';

let io = require("socket.io-client");
let ioreq = require('socket.io-request');
let Requests = require("../app/socket/request");
let socket = io('http://localhost:3000');
let readline = require("readline");

let rl = readline.createInterface(process.stdin, process.stdout);

let connected = false;

socket.on('connect', () => {
    connected = true;
});

socket.on('disconnect', () => {
    connected = false;
});

function login() {
    ioreq(socket).request(Requests.AUTH, {
        type: Requests.AUTH_TYPES.LOGIN,
        username: '测试用户',
        password: '00000000'
    }).then(res => {
        if (!res.success) {

        } else {
            console.log('login done');
        }
    }).catch(err => {

    });
}

rl.on("line", inp => {
    if (!connected) return;
    let params = inp.split(' ');
    let cmd = params[0];
    switch (cmd) {
        case 'i':
            login(); break;
    }
});