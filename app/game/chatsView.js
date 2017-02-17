/**
 * Created by liboyuan on 2017/2/16.
 */
import React, {Component} from "react";
import Popover from "material-ui/Popover";
import TextField from "material-ui/TextField";
import IconButton from "material-ui/IconButton";
import Avatar from 'material-ui/Avatar';
import EditorInsertEmoticon from "material-ui/svg-icons/editor/insert-emoticon";
import ContentSend from "material-ui/svg-icons/content/send";
import CommunicationCallMade from "material-ui/svg-icons/communication/call-made";
import NavigationArrowForward from "material-ui/svg-icons/navigation/arrow-forward";
import NavigationArrowBack from "material-ui/svg-icons/navigation/arrow-back";

import ReactTooltip from 'react-tooltip'

import {default as SvgIcon} from "react-svg-icons";

import {fullWhite, grey100, grey700, cyan200, cyan500, amber600} from "material-ui/styles/colors";

class EmotionPicker extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {onChosenEmotions} = this.props;
        let emotions = [];
        for (let i = 1; i <= 36; i ++) {
            emotions.push(
                <span
                    key={i}
                    onTouchTap={() => {onChosenEmotions(i)}}
                    style={{margin: 3, cursor: 'pointer'}}>
                    <SvgIcon name={'Expression_' + i} width={24} height={24}/>
                </span>
            );
        }
        return (
            <div style={{width: 180, padding: '3px 0'}}>
                {emotions}
            </div>
        );
    }
}

class InputArea extends Component {
    constructor(props) {
        super(props);

        this.state = {
            inputText: '',
            pickerShown: false,
            hintText: '在这里输入聊天内容'
        };

    }

    componentWillReceiveProps(nextProps) {
    }

    componentDidMount() {

    }

    render() {
        let {style, mySid, sendChat} = this.props;

        return (
            <div style={{...style, ...{display: 'flex', padding: 4}}}>

                <IconButton
                    onTouchTap={event => {
                        event.preventDefault();
                        this.setState({pickerShown: true, anchorEl: event.currentTarget});
                    }}
                    style={{width: 48, height: 48}}
                    tooltipPosition="top-center"
                    tooltip="表情"
                >
                    <EditorInsertEmoticon color={amber600} />
                </IconButton>
                <Popover
                    open={this.state.pickerShown}
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                    targetOrigin={{horizontal: 'left', vertical: 'bottom'}}
                    onRequestClose={() => {this.setState({pickerShown: false})}}
                    useLayerForClickAway={false}
                >
                    <EmotionPicker onChosenEmotions={number => {
                        this.setState({
                            inputText: this.state.inputText + '[:exp' + number + ']'
                        })
                    }}/>
                </Popover>
                <TextField
                    id={"chatInput"}
                    key={"chatInput"}
                    style={{flex: 1}}
                    hintText={this.state.hintText}
                    value={this.state.inputText}
                    onChange={event => {
                        this.setState({
                            inputText: event.target.value
                        })
                    }}
                />
                <IconButton
                    onTouchTap={event => {
                        if (this.state.inputText == '') {
                            this.setState({hintText: '发送内容不能为空'});
                        } else {
                            sendChat({sid: mySid, type: 'text', content: this.state.inputText});
                        }
                        this.setState({inputText: ''});
                    }}
                    style={{width: 48, height: 48}}
                    tooltipPosition="top-center"
                    tooltip="发送"
                >
                    <ContentSend color={cyan500}/>
                </IconButton>
            </div>
        );
    }
}

class ChatsDisplayArea extends Component {

    constructor(props) {
        super(props);

        this.state = {};

    }


    componentWillReceiveProps(nextProps) {
    }

    componentDidMount() {

    }

    render() {
        let {style, mySid, playerNames, chats} = this.props;

        let bubbles = chats.map((chat, index) => {
            if (chat.sid != mySid) {
                return (
                    <div key={index} style={{width: '100%', display: 'flex', marginBottom: 10}}>
                        <Avatar
                            data-tip data-for={'' + index} size={32}
                            style={{marginRight: 5, cursor: 'pointer', boxShadow: '1px 1px 3px #aaaaaa'}}
                        >
                            {avatars[(chat.sid + 5 - mySid) % 5]}
                        </Avatar>
                        <ReactTooltip id={'' + index} place={"right"} effect="solid">
                            <div style={{minWidth: 90, textAlign: 'center'}}>{playerNames[chat.sid]}</div>
                        </ReactTooltip>
                        <div style={{flex: 1}}>
                            <div style={{
                                display: 'inline-block', position: 'relative',
                                background: fullWhite, color: grey700,
                                padding: 5, borderRadius: 10, boxShadow: '1px 1px 3px #aaaaaa',
                                fontSize: 16, lineHeight: '20px'
                            }}>
                                {mapTextToEmotion(chat.content, 20)}
                            </div>
                        </div>
                        <div style={{width: 32, marginLeft: 5}}></div>
                    </div>
                );
            } else {
                return (
                    <div key={index} style={{width: '100%', display: 'flex', marginBottom: 10}}>
                        <div style={{width: 32, marginRight: 5}}></div>
                        <div style={{flex: 1}}>
                            <div style={{
                                float: 'right',
                                display: 'inline-block', position: 'relative',
                                background: cyan200, color: fullWhite,
                                padding: 5, borderRadius: 10, boxShadow: '1px 1px 3px #aaaaaa',
                                fontSize: 16, lineHeight: '20px'
                            }}>
                                {mapTextToEmotion(chat.content, 20)}
                            </div>
                        </div>
                        <Avatar
                            data-tip data-for={'' + index} size={32}
                            style={{marginLeft: 5, cursor: 'pointer', boxShadow: '1px 1px 3px #aaaaaa'}}
                        >
                            {avatars[0]}
                        </Avatar>
                        <ReactTooltip id={'' + index} place={"left"} effect="solid">
                            <div style={{minWidth: 90, textAlign: 'center'}}>{playerNames[chat.sid]}</div>
                        </ReactTooltip>
                    </div>
                );
            }
        });

        return (
            <div style={style}>
                <div style={{width: '100%', height: '100%', padding: 2, overflow: 'scroll'}}>
                    <ReactTooltip id={'' + 1} place={"left"} effect="solid">
                        <div style={{minWidth: 90, textAlign: 'center'}}>"asd"</div>
                    </ReactTooltip>
                    {bubbles}
                </div>
            </div>
        );
    }
}

export default class ChatsView extends Component {

    constructor(props) {
        super(props);

        this.state = {
        };

    }

    componentWillReceiveProps(nextProps) {
    }

    componentDidMount() {

    }

    render() {
        let {style, sendChat, playerNames, mySid, chats} = this.props;
        return (
            <div style={{...style, ...{position: 'relative'}}}>
                <ChatsDisplayArea
                    mySid={mySid}
                    playerNames={playerNames}
                    chats={chats}
                    style={{width: '100%', height: '100%', padding: 12, paddingBottom: 60, boxSizing: 'border-box'}}/>
                <InputArea
                    mySid={mySid}
                    sendChat={sendChat}
                    style={{position: 'absolute', bottom: 0, left: 0, right: 0, background: grey100}}/>

            </div>
        );
    }
}

function mapTextToEmotion(text, size) {
    const regex = /\[:exp\d+\]/g;
    let exps = text.match(regex);
    if (!exps)
        return [text];
    let texts = text.split(regex);
    let len = exps.length;
    let ret = [];
    for (let i = 0; i < len; i ++) {
        if (texts[i] != '')
            ret.push(texts[i]);
        let ind = exps[i].slice(5, -1);
        if (isEmotionIndex(ind))
            ret.push(<SvgIcon style={{verticalAlign: 'text-bottom'}} key={i} name={'Expression_' + ind} width={size} height={size}/>);
        else
            ret.push(exps[i]);
    }
    if (texts[len] != '') {
        ret.push(texts[len]);
    }
    return ret;
}

function isEmotionIndex(ind) {
    let num = parseInt(ind);
    return (num > 0 && num < 37);
}

const avatars = [
    '我',
    <NavigationArrowForward color={fullWhite}/>,
    <CommunicationCallMade color={fullWhite}/>,
    <CommunicationCallMade color={fullWhite} style={{transform: 'rotateY(180deg)'}}/>,
    <NavigationArrowBack color={fullWhite}/>
];

// const mySid = 2;
// const playerNames = ['机智的王其欣', '机智的其欣', '智的王其欣', '机的王其欣', '机智王其欣'];
// const chats = [
//     {sid: 0, type: 'text', content: '[:exp1]哈哈哈'},
//     {sid: 1, type: 'text', content: '[:exp1]哈哈哈'},
//     {sid: 2, type: 'text', content: '[:exp1]哈哈哈'},
//     {sid: 3, type: 'text', content: '[:exp1]哈哈哈'},
//     {sid: 4, type: 'text', content: '[:exp1]哈哈哈'},
//     {sid: 0, type: 'text', content: '[:exp1]哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈'},
//     {sid: 0, type: 'text', content: '[:exp1]哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈'},
//     {sid: 0, type: 'text', content: '[:exp1]哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈'},
//     {sid: 0, type: 'text', content: '[:exp1]哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈'},
//     {sid: 0, type: 'text', content: '[:exp1]哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈'},
//     {sid: 0, type: 'text', content: '[:exp1]哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈'},
//     {sid: 0, type: 'text', content: '[:exp1]哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈'},
//     {sid: 0, type: 'text', content: '[:exp1]哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈'}
// ];