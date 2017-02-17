/**
 * Created by liboyuan on 2017/1/23.
 */
import React, {Component} from "react";
import {Tabs, Tab} from "material-ui/Tabs";
import SwipeableViews from 'react-swipeable-views';
import HistoriesView from "./historiesView";
import ChatsView from "./chatsView";

const styles = {
    headline: {
        fontSize: 24,
        paddingTop: 16,
        marginBottom: 12,
        fontWeight: 400,
    },
    slide: {
        padding: 10,
    },
};

export default class InformationColumn extends Component {

    constructor(props) {
        super(props);
        this.state = {
            slideIndex: 0
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(value) {
        this.setState({
            slideIndex: value,
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        let a = nextProps.scene, b = this.props.scene;
        return !(
            a.room.seats == b.room.seats &&
            a.room.sid == b.room.sid &&
            a.histories == b.histories &&
            a.chats == b.chats &&
            a.sendChat == b.sendChat &&
            nextState == this.state
        );
    }


    render() {

        let {style, scene, sendChat} = this.props;

        let playerNames = scene.room.seats.map(seat => seat ? seat.playerName : '未知玩家');

        return (
            <div
                style={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column'}}
            >
                <Tabs
                    onChange={this.handleChange}
                    value={this.state.slideIndex}
                >
                    <Tab label="历史" value={0} />
                    <Tab label="聊天" value={1} />
                    <Tab label="画板" value={2} />
                </Tabs>
                <SwipeableViews
                    style={{flex: 1}}
                    containerStyle={{width: '100%', height: '100%'}}
                    index={this.state.slideIndex}
                    onChangeIndex={this.handleChange}
                >
                    <HistoriesView
                        style={{width: '100%', height: '100%', overflow: 'scroll'}}
                        histories={scene.histories}
                        playerNames={playerNames}
                    />
                    <ChatsView
                        playerNames={playerNames}
                        chats={scene.chats}
                        mySid={scene.room.sid}
                        sendChat={sendChat}
                        style={{width: '100%', height: '100%', overflow: 'hidden'}}
                    />
                    <div style={{textAlign: 'center'}}>
                        <h1>别看了..!</h1>
                    </div>
                </SwipeableViews>
            </div>
        );
    }
}