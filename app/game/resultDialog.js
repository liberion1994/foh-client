/**
 * Created by liboyuan on 2017/2/3.
 */
import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {CardGroupView} from '../common/card';

export default class ResultDialog extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        let {shown, onClose, result} = this.props;

        const actions = [
            <FlatButton
                label="确定"
                primary={true}
                onTouchTap={onClose}
            />,
        ];

        if (!result)
            return <Dialog
                title="出错了"
                actions={actions}
                modal={true}
                open={shown}
            >当前没有游戏结果</Dialog>;

        return (
            <Dialog
                title="游戏结束"
                actions={actions}
                modal={true}
                open={shown}
            >
                <h3>{result.winners}获胜</h3>
                <p>闲家得分：{result.slavePoints}，{result.winners}升{result.levelUp}级</p>
                <h3>底牌</h3>
                <div style={{width: '100%', height: 120, position: 'relative'}}>
                    <CardGroupView
                        style={{width: '100%', height: '100%'}}
                        cards={result.reservedCards}
                        choosable={false} singleLined={true} align={'center'}
                        cardsEnterMode={{successive: false}} cardsEnterFrom={'bottom'}/>
                </div>
            </Dialog>
        );
    }
}