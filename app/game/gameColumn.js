/**
 * Created by liboyuan on 2017/1/23.
 */
import React, {Component} from "react";
import Measure from "react-measure";
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import FlatButton from 'material-ui/FlatButton';
import {CardGroupView} from '../common/card';
import {blue50, red500, white} from "material-ui/styles/colors";
import FontAwesome from 'react-fontawesome';

import Immutable from 'immutable';

import ActionAssignmentInd from 'material-ui/svg-icons/action/assignment-ind';
import ActionAssignmentLate from 'material-ui/svg-icons/action/assignment-late';
import ActionAssignmentTurnedIn from 'material-ui/svg-icons/action/assignment-turned-in';
import ToggleStar from 'material-ui/svg-icons/toggle/star';
import ToggleStarBorder from 'material-ui/svg-icons/toggle/star-border';
import ToggleStarHalf from 'material-ui/svg-icons/toggle/star-half';

import {Types, CardUtil} from 'foh-core';

const iconPrepared = <ActionAssignmentTurnedIn/>;
const iconNotPrepared = <ActionAssignmentInd/>;
const iconEmpty = <ActionAssignmentLate/>;
const iconMaster = <ToggleStar/>;
const iconSubMaster = <ToggleStarHalf/>;
const iconSlave = <ToggleStarBorder/>;

class SeatArea extends Component {

    constructor(props) {
        super(props);

    }

    render() {

        let {style, align, labelBottom, rotated,
            sid, seat, gameStarted} = this.props;

        let chipStyle;
        switch (align) {
            case 'left': chipStyle = {margin: 0}; break;
            case 'right': chipStyle = {marginLeft: 'auto'}; break;
            default: chipStyle = {margin: '0 auto'}; break;
        }

        let icon = !seat ? iconEmpty : (
            gameStarted ? (
                seat.role == 'master' ? iconMaster : (
                    seat.role == 'subMaster' ? iconSubMaster : iconSlave
                )
            ) : (
                seat.prepared ? iconPrepared : iconNotPrepared
            ));

        let enterFrom = labelBottom ? 'bottom' : 'top';

        let actionDisplay;
        if (seat && seat.done) {
            const innerStyle = {margin: 5, position: 'absolute', left: 0, top: 0, right: 0, bottom: 0};
            switch(seat.done.action) {
                case Types.GameAction.OFFER_MAJOR_AMOUNT:
                    if (seat.done.content.majorShown) {
                        //which means it's already time to show winners' majors
                        actionDisplay = <CardGroupView style={innerStyle}
                                                       cards={seat.done.content.majorShown}
                                                       choosable={false} align={align} rotated={rotated}
                                                       cardsEnterFrom={enterFrom}/>;
                    } else {
                        let number = seat.done.content.amount;
                        let tmpStyle = labelBottom ?
                        {position: 'absolute', fontSize: 20, left: 0, right: 0, bottom: 0} :
                        {position: 'absolute', fontSize: 20, left: 0, right: 0, top: 0};
                        actionDisplay =
                            <div style={{...innerStyle, ...{textAlign: align}}}>
                                <div style={tmpStyle}>{number}</div>
                            </div>;
                    }
                    break;
                case Types.GameAction.CHOOSE_MAJOR_COLOR:
                case Types.GameAction.CHOOSE_A_COLOR:
                    let tmpStyle2 = labelBottom ?
                    {position: 'absolute', fontSize: 20, left: 0, right: 0, bottom: 0} :
                    {position: 'absolute', fontSize: 20, left: 0, right: 0, top: 0};
                    let color = seat.done.content.color;
                    let inner = (color == '♥' || color == '♦') ?
                        <span style={{color: 'red'}}>{color}</span> :
                        <span style={{color: 'black'}}>{color}</span>;
                    actionDisplay =
                        <div style={{...innerStyle, ...{textAlign: align}}}>
                            <div style={tmpStyle2}>{inner}</div>
                        </div>;
                    break;
                case Types.GameAction.PLAY_CARDS:
                    actionDisplay = <CardGroupView style={innerStyle}
                                                   cards={seat.done.content.cards}
                                                   choosable={false} align={align} rotated={rotated}
                                                   cardsEnterFrom={enterFrom}/>;
                    break;
                case Types.GameAction.RESERVE_CARDS:
                default:
                    break;
            }
        }

        let div1 =
                <Chip
                    style={chipStyle}>
                    <Avatar size={32} icon={icon} />
                    <span>{seat ? seat.playerName : '空座位'}</span>
                </Chip>,
            div2 =
                <div style={{flex: 1, position: 'relative'}}>
                    {actionDisplay}
                </div>;
        return (
            <div
                style={{...style, ...styles.seatArea}}
            >
                {labelBottom ? div2 : div1}
                {labelBottom ? div1 : div2}
            </div>
        );
    }
}

class TableArea extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let {style, room} = this.props;
        let seats = [];
        for (let i = 0; i < 5; i ++) {
            if (room.seats[i]) seats[i] = {...room.seats[i]};
            else seats[i] = null;
        }

        let mySid = room.sid;

        let gameStarted = false;
        if (room.game) {
            gameStarted = true;

            let done = room.game.currentTurn.done;
            for (let i = 0; i < done.length; i ++)
                seats[done[i].sid].done = done[i];

            let master = room.game.masterSid;
            let submaster = room.game.subMasterSid;
            for (let i = 0; i < 5; i ++) {
                seats[i].role = (i == master) ? 'master' : (
                    (i == submaster) ? 'subMaster' : 'slave'
                );
                seats[i].points = room.game.points[i];
                seats[i].caught5Heart = room.game.caught5Heart.length;
            }
        }

        let sids = [];
        for (let i = 0; i < 5; i ++)
            sids[i] = (mySid + i) % 5;

        return (
            <div style={{ ...style, ...styles.tableArea }}>
                <SeatArea style={{
                    position: 'absolute', left: 0, top: 0, right: '50%', bottom: '66.7%'
                }} sid={sids[3]} seat={seats[sids[3]]} gameStarted={gameStarted}/>

                <SeatArea style={{
                    position: 'absolute', left: '50%', top: 0, right: 0, bottom: '66.7%'
                }} sid={sids[2]} seat={seats[sids[2]]} gameStarted={gameStarted}/>

                <SeatArea style={{
                    transform : 'rotate(90deg)', transformOrigin: 'left bottom',
                    position: 'absolute', left: 0, top: 0, right: '50%', bottom: '66.7%'
                }} labelBottom={true} rotated={true}
                          sid={sids[4]} seat={seats[sids[4]]} gameStarted={gameStarted}/>

                <SeatArea style={{
                    transform : 'rotate(-90deg)', transformOrigin: 'right bottom',
                    position: 'absolute', left: '50%', top: 0, right: 0, bottom: '66.7%'
                }} labelBottom={true} rotated={true}
                          sid={sids[1]} seat={seats[sids[1]]} gameStarted={gameStarted}/>

                <SeatArea style={{
                    position: 'absolute', left: '25%', top: '66.7%', right: '25%', bottom: 0
                }} labelBottom={true}
                          sid={sids[0]} seat={seats[sids[0]]} gameStarted={gameStarted}/>
            </div>
        );
    }

}

class ColorPicker extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        let {style, onChosen} = this.props;
        return (
            <span style={style}>
                <FlatButton style={{minWidth: 10}} labelStyle={{color: 'red'}}
                            onClick={() => {onChosen("♥")}} label="♥"/>
                <FlatButton style={{minWidth: 10}} labelStyle={{color: 'black'}}
                            onClick={() => {onChosen("♠")}} label="♠"/>
                <FlatButton style={{minWidth: 10}} labelStyle={{color: 'red'}}
                            onClick={() => {onChosen("♦")}} label="♦"/>
                <FlatButton style={{minWidth: 10}} labelStyle={{color: 'black'}}
                            onClick={() => {onChosen("♣")}} label="♣"/>
            </span>
        );
    }
}

class NumberPicker extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        let {style, maxNum, onChosen} = this.props;
        let numList = [];
        for (let i = 0; i <= maxNum; i ++)
            numList[i] = i;
        return (
            <span style={style}>
                {numList.map(i =>
                    <FlatButton
                        key={i}
                        style={{minWidth: 10}}
                        labelStyle={{color: 'black', padding: '0 8px'}}
                        onClick={() => {onChosen(i)}}
                        label={('' + i)}/>
                )}
            </span>
        );
    }
}

class OperationArea extends Component {

    constructor(props) {
        super(props);

        this.state = {
            chosenCards: Immutable.Set()
        };

    }

    render() {
        let {style,
            cards, stage, prepared, accessToReservedCards, isCurrent, majorNumber,
            prepare, unprepare, leave, offerMajorAmount, chooseMajorColor,
            reserveCards, chooseAColor, playCards} = this.props;
        let {chosenCards} = this.state;
        let controls = [];

        if (!stage) {
            controls.push(<FlatButton label="离开" onClick={leave} key={0}/>);
            if (!prepared)
                controls.push(<FlatButton label="准备" primary={true} onClick={prepare} key={1}/>);
            else
                controls.push(<FlatButton label="取消" onClick={unprepare} key={1}/>);
        } else {
            if (isCurrent) {
                //TODO FUNCS HERE
                const labelStyle = {
                    paddingRight: 16,
                    fontSize: 14,
                    cursor: 'default',
                    WebkitUserSelect: 'none'
                };
                switch (stage) {
                    case Types.GameAction.OFFER_MAJOR_AMOUNT:
                        let cardUtil = new CardUtil.CardUtil(majorNumber);
                        let num = cardUtil.getAbsoluteMajorSum(cards);
                        controls.push(<span key={0} style={labelStyle}>真主数</span>);
                        controls.push(<NumberPicker key={1} maxNum={num} onChosen={offerMajorAmount}/>);
                        break;
                    case Types.GameAction.CHOOSE_MAJOR_COLOR:
                        controls.push(<span key={0} style={labelStyle}>主花色</span>);
                        controls.push(<ColorPicker key={1} onChosen={chooseMajorColor}/>);
                        break;
                    case Types.GameAction.RESERVE_CARDS:
                        controls.push(<FlatButton label="埋底" primary={true} key={0} onClick={() => {
                            reserveCards(chosenCards.toArray());
                            this.setState({chosenCards: chosenCards.clear()});
                        }} />);
                        break;
                    case Types.GameAction.CHOOSE_A_COLOR:
                        controls.push(<span key={0} style={labelStyle}>Ace花色</span>);
                        controls.push(<ColorPicker key={1} onChosen={chooseAColor}/>);
                        break;
                    case Types.GameAction.PLAY_CARDS:
                        controls.push(<FlatButton label="出牌" primary={true} key={0} onClick={() => {
                            playCards(chosenCards.toArray());
                            this.setState({chosenCards: chosenCards.clear()});
                        }}/>);
                        if (accessToReservedCards)
                            controls.push(<FlatButton label="底牌" key={1}/>);
                        break;
                    default:
                        break;
                }

            } else {
                //TODO show reserved cards function
                if (accessToReservedCards)
                    controls.push(<FlatButton label="底牌" key={0}/>);
                else
                    controls.push(<FlatButton label=" " key={0} style={{visibility: 'hidden'}}/>); // 占位用
            }
        }
        return (
            <div style={{ ...style, ...styles.operationArea }}>
                <div style={{margin: '0 auto', padding: 3}}>
                    {controls}
                </div>
                <div style={{flex: 1, position: 'relative'}}>
                    <CardGroupView style={{
                        position: 'absolute', left: 0, top: 0, right: 0, bottom: 0
                    }} cards={cards} choosable={true} singleLined={false} chosenCards={chosenCards} onChosen={(card, chosen) => {
                        if (chosen)
                            this.setState({chosenCards: chosenCards.add(card)});
                        else
                            this.setState({chosenCards: chosenCards.delete(card)});
                    }}/>
                </div>
            </div>
        );
    }

}

export default class GameColumn extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dimensions: {
                width: -1,
                height: -1
            }
        };

    }

    render() {
        let {width, height} = this.state.dimensions;
        const {style,
            room,
            prepare, unprepare, leave, offerMajorAmount, chooseMajorColor,
            reserveCards, chooseAColor, playCards} = this.props;

        if (width <= 0 || height <= 0)
            return <Measure includeMargin={false} onMeasure={(dimensions) => {
                this.setState({dimensions})}} >
                <div style={{ ...style, ...styles.root }} />
            </Measure>;

        let tableWidth = width;
        let tableHeight = width * 0.75;

        /****for operation area****/
        let stage = room.game ? room.game.currentTurn.action : null;
        let sid = room.sid;
        let isCurrent = !room.game ? false : room.game.currentTurn.remainedSid[0] == sid;
        let prepared = room.seats[sid].prepared;
        let accessToReservedCards = room.game ? (room.game.reservedCards ? true : false) : false;
        let majorNumber = room.game ? room.game.majorNumber : null;
        let inHand = room.game ? room.game.cards : [];

        return (
            <Measure includeMargin={false} onMeasure={(dimensions) => {
                this.setState({dimensions})}} >
                <div style={{ ...style, ...styles.root }}>
                    <TableArea
                        room={room}
                        style={{
                            width: tableWidth,
                            height: tableHeight
                        }}
                    />
                    <OperationArea
                        style={{flex: 1}}

                        cards={inHand}
                        stage={stage}
                        isCurrent={isCurrent}
                        prepared={prepared}
                        accessToReservedCards={accessToReservedCards}
                        majorNumber={majorNumber}

                        prepare={prepare}
                        unprepare={unprepare}
                        leave={leave}
                        offerMajorAmount={offerMajorAmount}
                        chooseMajorColor={chooseMajorColor}
                        reserveCards={reserveCards}
                        chooseAColor={chooseAColor}
                        playCards={playCards}
                    />
                </div>
            </Measure>
        );
    }
}

SeatArea.defaultProps = {
    align: 'center',
    labelBottom: false,
    rotated: false
};

const styles = {
    root: {
        position: 'absolute', left: 0, top: 0, right: 0, bottom: 0,
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden'
    },
    seatArea: {
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
    },
    tableArea: {
        position: 'relative'
    },
    operationArea: {
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
    }
};