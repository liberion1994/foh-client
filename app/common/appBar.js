/**
 * Created by liboyuan on 2016/12/22.
 */
import React, {Component} from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

const iconAccount = <IconButton><FontIcon className="material-icons">account_circle</FontIcon></IconButton>;

export default class AppTopBar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AppBar
                title="五人红五"
                iconElementRight={iconAccount}
                onLeftIconButtonTouchTap={() => {this.props.onMenuButtonClicked()}}
                onRightIconButtonTouchTap={() => {this.props.onAccountButtonClicked()}}
            />
        );
    }
}