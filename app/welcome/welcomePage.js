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
        let {minDisplayDuration, timeoutDuration, maxDisplayDuration, tryAutoLogin} = this.props;

        this.getRandomCardSet();

        this.minDisplayDurationTimer = setTimeout(() => {
            let {auth, socketState, onRemove} = this.props;
            if (auth.state == AuthState.AUTHENTICATED &&
                socketState == SocketState.CONNECTED) {
                onRemove(true);
            } else if (socketState != SocketState.CONNECTED) {
                this.setState({waiting: true});
                this.timeoutDurationTimer = setTimeout(() => {
                    let {socketState} = this.props;
                    if (socketState != SocketState.CONNECTED) {
                        this.setState({timeout: true});
                        this.maxDisplayDurationTimer = setTimeout(() =>{
                            let {socketState, onRemove} = this.props;
                            if (socketState != SocketState.CONNECTED)
                                onRemove(false);
                        }, maxDisplayDuration - timeoutDuration);
                    }
                }, timeoutDuration - minDisplayDuration);
            }
        }, minDisplayDuration);
    }

    componentWillReceiveProps(nextProps) {
        let {socketState} = nextProps;
        if (socketState == SocketState.CONNECTED)
            this.setState({waiting: false, timeout: false});
    }

    componentWillUnmount() {
        if (this.minDisplayDurationTimer)
            clearTimeout(this.minDisplayDurationTimer);
        if (this.timeoutDurationTimer)
            clearTimeout(this.timeoutDurationTimer);
        if (this.maxDisplayDurationTimer)
            clearTimeout(this.maxDisplayDurationTimer);
    }

    render() {

        let {waiting, timeout, randomCards} = this.state;
        let waitingTip =
            <div style={{
                opacity: waiting || timeout ? 1 : 0,
                transition: 'all 1s ease',
                paddingBottom: 30, paddingLeft: 30, paddingRight: 30}}>
                <Paper zDepth={1} style={{padding: 10}}>
                    <CircularProgress/>
                    <div>{timeout ? '网络似乎有问题' : '连接中...'}</div>
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
