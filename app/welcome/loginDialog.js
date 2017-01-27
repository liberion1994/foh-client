/**
 * Created by liboyuan on 2016/12/22.
 */
import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import Avatar from 'material-ui/Avatar';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {errorToAuthTitle} from '../socket/error';
import * as AuthState from "../redux/states/authState";

export default class LoginDialog extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userName: '',
            password: ''
        };

        this.handleLogin = this.handleLogin.bind(this);
        this.handleRegistry = this.handleRegistry.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        // if (nextProps.auth.userName !== this.state.userName) {
        //     this.setState({ userName: nextProps.auth.userName });
        // }
        // if (nextProps.auth.password !== this.state.password) {
        //     this.setState({ password: nextProps.auth.password });
        // }
    }

    handleLogin() {

        if (this.state.userName && this.state.userName != '' && this.state.password && this.state.password != '')
            this.props.requestLogin(this.state.userName, this.state.password);
        else {

        }
    }

    handleRegistry() {
    }

    render() {
        let errorInfo = "";
        if (this.props.auth.state == AuthState.REQUESTED) {
            errorInfo = "请求中";
        } else if (this.props.auth.state == AuthState.FAILED) {
            errorInfo = errorToAuthTitle(this.props.auth.errorCode);
        }
        return (
            <Dialog
                modal={true}
                open={this.props.show}>
                <div style={styles.content}>
                    <h1>请登录或注册</h1>
                    <h3>{errorInfo}</h3>
                    <TextField
                        hintText='请输入用户名'
                        value={this.state.userName}
                        onChange={(event) => {this.setState({userName: event.target.value})}}/>
                    <TextField
                        hintText='请输入密码'
                        type='password'
                        value={this.state.password}
                        onChange={(event) => {this.setState({password: event.target.value})}}/>

                    <div style={styles.buttons_container}>
                        <RaisedButton
                            label="登录" primary={true}
                            onClick={this.handleLogin}/>
                        <RaisedButton
                            label="注册" primary={false} style={{marginLeft: 60}}
                            onClick={this.handleRegistry}/>
                    </div>
                </div>
            </Dialog>
        );
    }
}

const styles = {
    content: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttons_container: {
        paddingTop: 30,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    }
};