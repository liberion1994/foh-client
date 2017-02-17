/**
 * Created by liboyuan on 2017/2/15.
 */
import React, {Component} from "react";
import ReactDOM from 'react-dom';

import {Step, Stepper, StepButton, StepContent} from 'material-ui/Stepper';
import {cyan500, grey500} from "material-ui/styles/colors";

import {Types} from "foh-core";

export default class HistoriesView extends Component {

    constructor(props) {
        super(props);

        this.state = {
            stepIndex: 0
        };

    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.histories.length < this.props.histories.length) {
            this.setState({stepIndex: 0});
            ReactDOM.findDOMNode(this).scrollTop = 0;
        }
    }

    componentDidMount() {

    }

    render() {
        let {style, histories, playerNames} = this.props;
        let {stepIndex} = this.state;

        let len = histories.length;
        return (
            <div style={style}>
                <Stepper
                    activeStep={stepIndex}
                    linear={false}
                    orientation="vertical"
                >
                    {histories.slice(0).reverse().map((turn, index) =>
                        <Step key={len - index}>
                            <StepButton
                                completed={true}
                                onTouchTap={() => this.setState({stepIndex: index})}>
                                {turn.action + '轮'}
                            </StepButton>
                            <StepContent>
                                <div style={{fontSize: 14, paddingTop: 20, paddingBottom: 3}}>
                                {turn.done.slice(0).reverse().map((action, index) => {
                                    let inner;
                                    switch(turn.action) {
                                        case Types.GameAction.OFFER_MAJOR_AMOUNT:
                                            inner = <span style={cardStyle}>{action.content.amount}</span>;
                                            break;
                                        case Types.GameAction.CHOOSE_MAJOR_COLOR:
                                        case Types.GameAction.CHOOSE_A_COLOR:
                                            let majorColor = toColorText(action.content.color);
                                            inner = <span>{majorColor}</span>;
                                            break;
                                        case Types.GameAction.RESERVE_CARDS:
                                        case Types.GameAction.PLAY_CARDS:
                                            let reservedCards = action.content.cards ?
                                                action.content.cards.map((card, index) => toCardText(card, index)) : '不得而知';
                                            inner = <span>{reservedCards}</span>;
                                            break;
                                    }
                                    return (
                                        <div key={index} style={{paddingTop: 3}}>
                                            <span style={{
                                                display: 'inline-block', width: 120,
                                                color:
                                                    turn.action == Types.GameAction.CHOOSE_MAJOR_COLOR ||
                                                    turn.action == Types.GameAction.RESERVE_CARDS ||
                                                    turn.action == Types.GameAction.CHOOSE_A_COLOR ||
                                                    turn.maxSid == action.sid ? cyan500 : grey500
                                            }}>
                                                {playerNames[action.sid]}
                                            </span>
                                            {inner}
                                        </div>);
                                })}
                                </div>
                            </StepContent>
                        </Step>
                    )}
                </Stepper>
            </div>
        );
    }
}

function toCardText(card, index) {
    let color = card.color;
    let number = card.number;
    switch (number) {
        case 10:
            number = 0; break;
        case 11:
            number = 'J'; break;
        case 12:
            number = 'Q'; break;
        case 13:
            number = 'K'; break;
        case 14:
            number = 'A'; break;
        default:
            break;
    }
    switch (color) {
        case 'J':
            if (number == 0)
                return <span key={index} style={{...cardStyle, ...{color: 'black'}}}>Jk</span>;
            else
                return <span key={index} style={{...cardStyle, ...{color: 'red'}}}>Jk</span>;
        case '♥':
        case '♦':
            return <span key={index} style={{...cardStyle, ...{color: 'red'}}}>{color + number}</span>;
        default:
            return <span key={index} style={{...cardStyle, ...{color: 'black'}}}>{color + number}</span>;
    }
}

function toColorText(color) {
    switch (color) {
        case '♥':
        case '♦':
            return <span style={{...cardStyle, ...{color: 'red'}}}>{color}</span>;
        default:
            return <span style={{...cardStyle, ...{color: 'black'}}}>{color}</span>;
    }
}

const cardStyle = {
    display: 'inline-block',
    width: 24,
    borderRadius: '1px',
    boxShadow: '1px 1px 3px #aaaaaa',
    textAlign: 'center'
};