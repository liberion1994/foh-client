/**
 * Created by liboyuan on 2017/2/4.
 */
import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

export default class RobotPickDialog extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: randomName(),
            type: 'MonkeyRobot',
            majorNumber: 2
        }
    }

    render() {

        let {shown, onClose, onCommit} = this.props;
        let {name, type, majorNumber} = this.state;

        const actions = [
            <FlatButton
                label="确定"
                primary={true}
                onTouchTap={() => {onCommit({...this.state}); this.setState({name: randomName()})}}
            />,
            <FlatButton
                label="取消"
                primary={false}
                onTouchTap={() => {onClose(); this.setState({name: randomName()})}}
            />
        ];

        return (
            <Dialog
                title="选择机器人"
                actions={actions}
                modal={true}
                autoScrollBodyContent={true}
                open={shown}
            >
                <div>
                    <h3>名字</h3>
                    <TextField
                        id="NameInput"
                        defaultValue={name}
                        onChange={(event, value) => {this.setState({name: value})}}
                    />
                    <h3>型号</h3>
                    <RadioButtonGroup
                        name="ai_type"
                        defaultSelected={type}
                        onChange={(event, value) => {this.setState({type: value})}}
                    >
                        <RadioButton
                            value="MonkeyRobot"
                            label="Monkey Robot"
                            style={styles.radioButton}
                        />
                        <RadioButton
                            value="CleverRobot"
                            label="Clever Robot"
                            style={styles.radioButton}
                        />
                    </RadioButtonGroup>
                    <h3>当前主</h3>
                    <SelectField
                        value={majorNumber - 2}
                        onChange={(event, index, value) => {this.setState({majorNumber: index + 2})}}
                        maxHeight={200}>
                        {availableNumbers.map((num, index) => <MenuItem value={index} key={index} primaryText={num} />)}
                    </SelectField>
                </div>
            </Dialog>
        );
    }
}

const availableNumbers = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

const decorators = ['机智', '阳刚', '妖艳', '修长', '圆润', '霸道', '俊俏', '端庄', '腼腆'];
const names = ['欧阳', '李豪', '郑琦', '骚包', '小羊', '脸盆', '阿暴', '陆昊', '老僧', '王其欣', '棍哥', '鲁先先'];

function randomName() {
    return decorators[Math.floor(Math.random() * decorators.length)] + '的' +
        names[Math.floor(Math.random() * names.length)];
}

const styles = {
    radioButton: {
        marginBottom: 16,
    },
};
