/**
 * Created by liboyuan on 2017/2/3.
 */
import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

export default class ResultDialog extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        let {shown, onClose} = this.props;

        const actions = [
            <FlatButton
                label="Ok"
                primary={true}
                onTouchTap={onClose}
            />,
        ];

        return (
            <Dialog
                title="游戏结束"
                actions={actions}
                modal={true}
                open={shown}
            >
                Only actions can close this dialog.
            </Dialog>
        );
    }
}