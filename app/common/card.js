/**
 * Created by liboyuan on 2017/1/20.
 */
import React, {Component} from "react";
import ReactTransitionGroup from 'react-addons-transition-group'
import Measure from "react-measure";

class Card extends Component {

    constructor(props) {
        super(props);

        this.state = {
            chosen: false,
            hover: false,
            dynamicStyle: {},
        };

    }

    componentWillAppear(callback) {
        const {enteringDelay, enteringDuration, enteringStyle} = this.props;
        this.setState({dynamicStyle: enteringStyle});
        setTimeout(() => {
            this.setState({dynamicStyle: {transition: 'all ' + enteringDuration / 1000 + 's ease'}});
            setTimeout(callback, enteringDuration);
        }, enteringDelay);
    }

    componentDidAppear() {
        this.setState({dynamicStyle: {}});
    }

    componentWillEnter(callback) {
        const {enteringDelay, enteringDuration, enteringStyle} = this.props;
        this.setState({dynamicStyle: enteringStyle});
        setTimeout(() => {
            this.setState({dynamicStyle: {transition: 'all ' + enteringDuration / 1000 + 's ease'}});
            setTimeout(callback, enteringDuration);
        }, enteringDelay);
    }

    componentDidEnter() {
        this.setState({dynamicStyle: {}});
    }

    componentWillLeave(callback) {
        const {leavingDelay, leavingDuration, leavingStyle} = this.props;
        setTimeout(() => {
            this.setState({dynamicStyle: { ...leavingStyle, transition: 'all ' + leavingDuration / 1000 + 's ease'}});
            setTimeout(callback, leavingDuration);
        }, leavingDelay);
    }

    componentDidLeave() {
        this.setState({dynamicStyle: {}});
    }

    cardText() {
        let color = this.props.color;
        let number = this.props.number;
        switch (number) {
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
                    return <span style={{color: 'black'}}>J<br/>k</span>;
                else
                    return <span style={{color: 'red'}}>J<br/>k</span>;
            case '♥':
            case '♦':
                return <span style={{color: 'red'}}>{color}<br/>{number}</span>;
            default:
                return <span style={{color: 'black'}}>{color}<br/>{number}</span>;
        }
    }

    centerText() {
        let color = this.props.color;
        let number = this.props.number;
        switch (color) {
            case 'J':
                if (number == 0)
                    return <span style={{color: 'black'}}>J</span>;
                else
                    return <span style={{color: 'red'}}>J</span>;
            case '♥':
            case '♦':
                return <span style={{color: 'red'}}>{color}</span>;
            default:
                return <span style={{color: 'black'}}>{color}</span>;
        }
    }

    render() {
        let { choosable, transX, transY, transYChosen, style, borderWidth,
            background, borderColor, chosenBorderColor, hoverBorderColor, onChosen } = this.props;

        let chosen = onChosen ? this.props.chosen : this.state.chosen;

        let height = parseFloat(style.height);
        let border = borderWidth + 'px solid ';
        if (!choosable) {
            border += borderColor;
        } else {
            if (chosen)
                border += chosenBorderColor;
            else if (this.state.hover)
                border += hoverBorderColor;
            else
                border += borderColor;
        }
        if (chosen && choosable) {
            transY += transYChosen;
        }
        let transform = 'translate(' + transX + 'px,' + transY + 'px)';
        let cursor = choosable ? 'pointer' : 'default';

        let _style = { ...style, ...{
            cursor: cursor,
            WebkitUserSelect: 'none',
            background: background,
            border: border,
            borderRadius: '5px',
            boxShadow: '1px 1px 3px #aaaaaa',
            transform: transform,
            boxSizing: 'border-box'
        }, ...this.state.dynamicStyle};

        return (
            <div
                style={_style}
                onMouseOver={() => {this.setState({hover: true})}}
                onMouseOut={() => {this.setState({hover: false})}}
                onClick={() => {
                    if (!choosable)
                        return;
                    if (onChosen) {
                        onChosen(!chosen);
                    } else {
                        this.setState({chosen: !chosen});
                    }
                }}
            >
                <div
                    style={{
                        position: 'absolute', top: 0, left: 0, right: 0,
                        textAlign: 'left', paddingLeft: '2px',
                        fontSize: height/6, lineHeight: '100%'
                    }}
                >{this.cardText()}</div>
                <div
                    style={{
                        position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
                        textAlign: 'center', fontSize: height/2, lineHeight: height + 'px'
                    }}
                >{this.centerText()}</div>
                <div
                    style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        textAlign: 'left', paddingLeft: '2px',
                        fontSize: height/6, lineHeight: '100%',
                        transform: 'rotate(180deg)'
                    }}
                >{this.cardText()}</div>
            </div>
        )
    }
}

export class CardGroupView extends Component {

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
        let { width, height } = this.state.dimensions;
        if (width <= 0 || height <= 0)
            return <Measure includeMargin={false} onMeasure={(dimensions) => {
                this.setState({dimensions})}} >
                <div style={this.props.style}>
                    <ReactTransitionGroup />
                </div>
            </Measure>;
        let { style, choosable, cards, maxCardDisXRate, cardsEnterDelay, cardsEnterFrom,
            cardsEnterMode, singleLined, rotated, align, chosenCards, onChosen } = this.props;
        if (rotated) {
            let tmp = width;
            width = height;
            height = tmp;
        }
        let cardWidth = height / (singleLined ? (choosable ? 1.75 : 1.5) : (choosable ? 2.5 : 2.25));
        let cardHeight = cardWidth * 1.5;
        let cardTop = choosable ? cardHeight/6 : 0;
        let cardSize = cards.length;

        let line1Size = Math.ceil(cardSize/2);
        let xDis = 0;

        if (singleLined) {
            line1Size = cardSize;
            if (line1Size > 1)
                xDis = (width - cardWidth) / (line1Size - 1);
            if (xDis > cardWidth * maxCardDisXRate)
                xDis = cardWidth * maxCardDisXRate;
        } else {
            let minLineSize = Math.floor((width - cardWidth) / (cardWidth * maxCardDisXRate)) + 1;
            if (minLineSize > cardSize)
                minLineSize = cardSize;
            if (line1Size < minLineSize) {
                xDis = maxCardDisXRate * cardWidth;
                line1Size = minLineSize;
            } else {
                xDis = (width - cardWidth) / (line1Size - 1);
            }
        }

        let enteringDelays = [];
        if (cardsEnterMode.successive) {
            for (let i = 0; i < cardSize; i ++)
                enteringDelays[i] = i * cardsEnterDelay;
            if (cardsEnterMode.random)
                shuffle(enteringDelays);
        } else {
            for (let i = 0; i < cardSize; i ++)
                enteringDelays[i] = cardsEnterDelay;
        }

        let line1Off = 0, line2Off = 0;
        if (align != 'left') {
            line1Off = width - (cardWidth + xDis * (line1Size - 1));
            if (line1Size < cardSize)
                line2Off = width - (cardWidth + xDis * (cardSize - line1Size - 1));
            if (align == 'center') {
                line1Off /= 2; line2Off /= 2;
            }
        }

        let cardsView = cards.map((card, index) => {
            let xOff = index < line1Size ? index * xDis + line1Off: (index - line1Size) * xDis + line2Off;
            let yOff = index < line1Size ? 0 : cardHeight/2;
            let xOffEnter = xOff, yOffEnter = yOff;
            switch (cardsEnterFrom) {
                case 'top': yOffEnter -= cardHeight; break;
                case 'bottom': yOffEnter += cardHeight; break;
                case 'left': xOffEnter -= cardWidth; break;
                case 'right': xOffEnter += cardWidth; break;
                default: break;
            }
            return (
                <Card key={card.id}
                      color={card.color} number={card.number} choosable={choosable}
                      transX={xOff}
                      transY={yOff}
                      transYChosen={-cardHeight/6}
                      chosen={chosenCards ? (chosenCards.has(card)) : null}
                      onChosen={onChosen ? (x => {onChosen(card, x)}) : null}
                      style={{
                          width: cardWidth, height: cardHeight,
                          position: 'absolute', top: cardTop, left: 0,
                          transition: 'transform .5s ease, border .5s ease'
                      }}
                      enteringStyle={{
                          transform: 'translate(' + xOffEnter + 'px,' + yOffEnter + 'px)',
                          opacity: 0
                      }}
                      leavingStyle={{
                          transform: 'translate(' + xOffEnter + 'px,' + yOffEnter + 'px)',
                          opacity: 0
                      }}
                      enteringDelay={enteringDelays[index]}
                />
            );
        });

        return (
            <Measure
                includeMargin={false}
                onMeasure={(dimensions) => {
                    this.setState({dimensions})
                }}
            >
                <div style={style}>
                    <ReactTransitionGroup>
                        {cardsView}
                    </ReactTransitionGroup>
                </div>
            </Measure>
        )
    }
}

Card.defaultProps = {
    leavingStyle: {opacity: 0},
    leavingDuration: 500,
    leavingDelay: 0,
    enteringStyle: {opacity: 0},
    enteringDuration: 500,
    enteringDelay: 0,

    chose: null,
    onChosen: null,

    background: 'white',
    borderColor: 'white',
    chosenBorderColor: 'dodgerblue',
    hoverBorderColor: '#00BCD4',
    borderWidth: 3
};

CardGroupView.defaultProps = {
    cardsEnterDelay: 30,
    cardsEnterMode: {
        successive: true,
        random: true
    },
    cardsEnterFrom: 'top',
    choosable: false,
    singleLined: true,
    rotated: false,
    align: 'left',
    maxCardDisXRate: 0.6,

    chosenCards: null,
    onChosen: null
};

function shuffle(a) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
}