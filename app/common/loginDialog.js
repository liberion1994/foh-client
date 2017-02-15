/**
 * Created by liboyuan on 2016/12/22.
 */
import React, {Component} from "react";
import Dialog from "material-ui/Dialog";
import TextField from "material-ui/TextField";
import FlatButton from "material-ui/FlatButton";
import {errorToAuthTitle} from "../const/authErrors";
import * as AuthState from "../redux/states/authState";

export default class LoginDialog extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            repeatPassword: '',
            userNameError: null,
            passwordError: null,
            repeatPasswordError: null
        };

        this.checkUsername = this.checkUsername.bind(this);
        this.checkPassword = this.checkPassword.bind(this);
        this.checkRepeatPassword = this.checkRepeatPassword.bind(this);
    }

    checkUsername() {
        if (!isUsername(this.state.username))
            this.setState({userNameError: '用户名不合规范：' + usernameReg});
        else
            this.setState({userNameError: null});
    }

    checkPassword() {
        if (!isPassword(this.state.password))
            this.setState({passwordError: '密码不合规范：' + passwordReg});
        else
            this.setState({passwordError: null});
    }

    checkRepeatPassword() {
        if (this.state.password != this.state.repeatPassword)
            this.setState({repeatPasswordError: '两次输入的密码不一致'});
        else
            this.setState({repeatPasswordError: null});
    }

    render() {

        let {register, onCommit, onCancel, auth, show} = this.props;
        let {
            userNameError, passwordError, repeatPasswordError
        } = this.state;

        let errorInfo = register ? '请注册' : '请登陆';
        if (auth.errorCode) {
            errorInfo = errorToAuthTitle(this.props.auth.errorCode);
        }

        return (
            <Dialog
                onRequestClose={() => {this.setState({
                    username: '',
                    password: '',
                    repeatPassword: '',
                    userNameError: null,
                    passwordError: null,
                    repeatPasswordError: null
                }); onCancel(); }}
                autoScrollBodyContent={true}
                actions={[
                    <FlatButton
                        label="确定"
                        primary={true}
                        onTouchTap={() => {
                            if (register)
                                this.checkRepeatPassword();
                            this.checkUsername();
                            this.checkPassword();
                            if (this.state.userNameError || this.state.passwordError || this.state.repeatPasswordError)
                                return;
                            onCommit(this.state.username, this.state.password);
                        }}
                    />
                ]}
                open={show}>
                <div style={styles.content}>
                    <h1>{register? '注册并登录' : '登录'}</h1>
                    <p style={{
                        opacity: auth.state == AuthState.UNAUTHENTICATED && !auth.errorCode ? 0 : 1,
                        transition: 'all 1s ease'
                    }}>{errorInfo}</p>
                    <TextField
                        onBlur={this.checkUsername}
                        errorText={userNameError}
                        hintText='请输入用户名'
                        onChange={(event) => {this.setState({username: event.target.value})}}/><br/>
                    <TextField
                        errorText={passwordError}
                        hintText='请输入密码'
                        type='password'
                        onBlur={this.checkPassword}
                        onChange={(event) => {this.setState({password: event.target.value})}}/><br/>
                    {register ? <TextField
                        errorText={repeatPasswordError}
                        hintText='请再次输入密码'
                        type='password'
                        onBlur={this.checkRepeatPassword}
                        onChange={(event) => {this.setState({repeatPassword: event.target.value})}}/> : null
                    }
                    <br/>
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
    }
};

const usernameReg = /^[\u4E00-\u9FA5A-Za-z][\u4E00-\u9FA5A-Za-z0-9]{0,5}$/;
const passwordReg = /^[A-Za-z0-9!@#$%^&*()_]{6,20}$/;


function isUsername(str) {
    return str && (typeof str === 'string') && usernameReg.test(str);
}

function isPassword(str) {
    return str && (typeof str === 'string') && passwordReg.test(str);
}