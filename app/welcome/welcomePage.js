/**
 * Created by liboyuan on 2017/1/19.
 */
import React, {Component} from "react";
import Paper from "material-ui/Paper";
import CircularProgress from "material-ui/CircularProgress";
import * as SocketState from "../redux/states/socketState";
import * as AuthState from "../redux/states/authState";
import {CardGroupView} from "../common/card";
import {CardUtil} from "foh-core";

export default class WelcomePage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            waiting: false,
            timeout: false,
            randomCards: null
        };

        this.cardUtil = new CardUtil.CardUtil(2);
    }

    getRandomCardSet() {
        this.setState({randomCards: this.cardUtil.getSortedCards(this.cardUtil.getShuffledCards().slice(0, 31))});
    }

    componentDidMount() {
        let {minDisplayDuration, timeoutDuration, maxDisplayDuration} = this.props;

        this.getRandomCardSet();

        this.minDisplayDurationTimer = setTimeout(() => {
            let {socketState} = this.props;
            this.setState({waiting: true});
            if (socketState != SocketState.CONNECTED) {
                this.timeoutDurationTimer = setTimeout(() => {
                    let {socketState} = this.props;
                    if (socketState != SocketState.CONNECTED) {
                        this.setState({timeout: true});
                    }
                }, timeoutDuration - minDisplayDuration);
            }
        }, minDisplayDuration);
    }

    componentWillUnmount() {
        if (this.minDisplayDurationTimer)
            clearTimeout(this.minDisplayDurationTimer);
        if (this.timeoutDurationTimer)
            clearTimeout(this.timeoutDurationTimer);
    }

    render() {

        let {waiting, timeout, randomCards} = this.state;
        let {auth, socketState} = this.props;
        let waitingTip =
            <div style={{
                opacity: waiting || timeout ? 1 : 0,
                transition: 'all 1s ease',
                position: 'relative', height: 80,
                marginBottom: 30, marginLeft: 30, marginRight: 30}}>
                <Paper zDepth={1} style={{
                    padding:10, position: 'absolute', bottom: 0, left: 0, right: 0
                }}>
                    {socketState != SocketState.CONNECTED ?
                        (<div><CircularProgress/><div>{timeout ? '网络似乎有问题' : '连接中...'}</div></div>) :
                        (<div>{auth.state == AuthState.AUTHENTICATED ? '已登录' : '尚未登录'}</div>)
                    }
                </Paper>
            </div>;
        return (
            <div style={styles.root}>
                <div style={styles.title}>
                    <Paper zDepth={1} style={{padding: 10}}>手气如何？</Paper>
                </div>
                <div style={styles.remaining}>
                    <CardGroupView style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        right: 0,
                        bottom: 0
                    }} cards={randomCards || []} choosable={false} singleLined={false}/>
                </div>
                {waitingTip}
            </div>
        );
    }
};

const styles = {
    root: {
        textAlign: 'center',
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
    },
    title: {
        paddingTop: 30,
        paddingLeft: 30,
        paddingRight: 30,
        fontSize: '24pt'
    },
    remaining: {
        position: 'relative',
        flex: 1,
        margin: '30px 50px'
    }
};

WelcomePage.defaultProps = {
    minDisplayDuration: 3000,
    timeoutDuration: 10000,
    maxDisplayDuration: 15000
};
