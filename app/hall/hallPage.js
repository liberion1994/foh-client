import React, {Component} from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import {Card, CardActions, CardHeader, CardText} from "material-ui/Card";
import FlatButton from "material-ui/FlatButton";
import {List, ListItem} from "material-ui/List";
import FloatingActionButton from "material-ui/FloatingActionButton";
import ContentAdd from "material-ui/svg-icons/content/add";
import ActionHome from "material-ui/svg-icons/action/home";
import HardwareVideogameAsset from "material-ui/svg-icons/hardware/videogame-asset";
import {cyan300, cyan500, fullWhite} from "material-ui/styles/colors";
import CreateRoomDialog from "./createRoomDialog";

const iconEnter = <ContentAdd color={cyan300}/>;
const iconHome = <ActionHome/>;
const iconInGame = <HardwareVideogameAsset/>;

class Room extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        let {room, enterRoom} = this.props;

        let buttons = room.content.seats.map((seat, index) => seat ?
            <FlatButton
                key={index}
                style={{marginTop: 8, minWidth: 150, color: fullWhite}}
                label={seat.playerName}
                backgroundColor={cyan300}
                hoverColor={cyan500}
                labelPosition="before"
                icon={iconInGame}
                disabled={true}
            /> :
            <FlatButton
                style={{marginTop: 8, minWidth: 150, color: cyan300}}
                key={index}
                label='空座位'
                labelPosition="before"
                icon={iconEnter}
                onTouchTap={() => {enterRoom(index)}}
            />
        );

        return (
            <Card style={{marginBottom: 10}}>
                <CardHeader
                    title={room.name}
                    subtitle={(room.content.inGame ? '游戏中' : '未开始') + ' 操作时限：' + room.actionTimeLimit}
                />
                <CardActions>
                    {buttons}
                </CardActions>
            </Card>
        );
    }

}

export default class HallPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            createRoomShown: false
        };

    }

    componentDidMount() {
        let {hall, load} = this.props;
        if (!hall.synchronized) {
            load();
        }
    }

    onToolBarButtonClicked() {
        this.props.onToolBarButtonClicked();
    }

    render() {

        let {hall, createGame, enterRoom} = this.props;
        if (!hall.synchronized)
            return <div style={styles.root}><h1>同步中</h1></div>;

        let createBtn =
            <FloatingActionButton
                style={{position: 'absolute', left: 20, bottom: 20}}
                onTouchTap={() => {this.setState({createRoomShown: true})}}
            >
                <ContentAdd />
            </FloatingActionButton>;

        let roomViews = hall.content.rooms.map(room => {
            return <Room
                key={room.id}
                room={room}
                enterRoom={sid => {enterRoom(room.id, sid)}}
            />;
        });

        let userViews = hall.content.onlineUsers.map(user => {
            return <ListItem
                key={user.username}
                primaryText={user.username}
                rightIcon={user.roomId == null ? iconHome : iconInGame}
                disabled={true}
            />
        });

        return (
            <div style={styles.root}>
                <div style={styles.left}>
                    <ReactCSSTransitionGroup
                        transitionName="fade"
                        transitionAppear={true}
                        transitionAppearTimeout={300}
                        transitionEnterTimeout={300}
                        transitionLeaveTimeout={300}>
                        {roomViews}
                    </ReactCSSTransitionGroup>
                    {createBtn}
                </div>
                <div style={styles.right}>
                    <Card style={{width: '100%', height: '100%'}}
                          containerStyle={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column'}}>
                        <CardHeader
                            title='在线玩家'
                        />
                        <CardText style={{flex: 1, overflow: 'scroll'}}>
                            <List>
                                <ReactCSSTransitionGroup
                                    transitionName="fade"
                                    transitionAppear={true}
                                    transitionAppearTimeout={300}
                                    transitionEnterTimeout={300}
                                    transitionLeaveTimeout={300}>
                                    {userViews}
                                </ReactCSSTransitionGroup>
                            </List>
                        </CardText>
                    </Card>
                </div>
                <CreateRoomDialog
                    shown={this.state.createRoomShown}
                    onClose={() => {this.setState({createRoomShown: false})}}
                    onCommit={room => {this.setState({createRoomShown: false}); createGame(room)}}
                />
            </div>
        )
    }
}

const styles = {
    root: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'row'
    },
    left: {
        height: '100%',
        flex: 1,
        overflow: 'scroll',
        paddingTop: 15,
        paddingLeft: 15,
        paddingBottom: 15,
        paddingRight: 7.5,
        boxSizing: 'border-box'
    },
    right: {
        height: '100%',
        paddingTop: 15,
        paddingLeft: 7.5,
        paddingBottom: 15,
        paddingRight: 15,
        boxSizing: 'border-box'
    }
};
