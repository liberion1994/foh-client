/**
 * Created by liboyuan on 2017/2/8.
 */
import React, {Component} from "react";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

export default class CreateRoomDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: randomName(),
            actionTimeLimit: 30
        }
    }

    render() {

        let {shown, onCommit, onClose} = this.props;
        let {name, actionTimeLimit} = this.state;

        const actions = [
            <FlatButton
                label="确定"
                primary={true}
                onTouchTap={() => {onCommit({...this.state}); this.setState({name: randomName(), actionTimeLimit: 30})}}
            />,
            <FlatButton
                label="取消"
                primary={false}
                onTouchTap={() => {onClose(); this.setState({name: randomName(), actionTimeLimit: 30})}}
            />
        ];

        return (
            <Dialog
                title="创建房间"
                actions={actions}
                modal={true}
                open={shown}
            >
                <div>
                    <h3>名字</h3>
                    <TextField
                        id="NameInput"
                        defaultValue={name}
                        onChange={(event, value) => {this.setState({name: value})}}
                    />
                    <h3>操作时限</h3>
                    <SelectField
                        value={actionTimeLimit}
                        onChange={(event, index, value) => {this.setState({actionTimeLimit: value})}}
                        maxHeight={200}>
                        <MenuItem value={15} key={0} primaryText={'15s'} />
                        <MenuItem value={30} key={1} primaryText={'30s'} />
                        <MenuItem value={60} key={2} primaryText={'60s'} />
                    </SelectField>
                </div>
            </Dialog>
        );
    }
}


const owners = ['欧阳', '李豪', '郑琦', '骚包', '小羊', '脸盆', '阿暴', '陆昊', '老僧', '王其欣', '棍哥', '鲁先先'];
const names = ['厕所', '厨房', '卧室', '浴室', '客厅', '花园', '游泳池', '储藏室'];

function randomName() {
    return owners[Math.floor(Math.random() * owners.length)] + '家的' +
        names[Math.floor(Math.random() * names.length)];
}