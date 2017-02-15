/**
 * Created by liboyuan on 2016/12/22.
 */
import React, {Component} from "react";
import AppBar from "material-ui/AppBar";
import IconButton from "material-ui/IconButton";
import IconMenu from "material-ui/IconMenu";
import MenuItem from "material-ui/MenuItem";
import FlatButton from "material-ui/FlatButton";
import MoreVertIcon from "material-ui/svg-icons/navigation/more-vert";

export default class AppTopBar extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        let {connected, username, onLogout, onLogin, onRegister, onMenuButtonClicked} = this.props;

        let op = !connected ?
            <FlatButton
                label='离线'
                disabled={true}
                style={{minWidth: 0}}
            /> : (username ?
                <FlatButton
                    label={username}
                    onTouchTap={onLogout}
                    style={{minWidth: 0}}
                /> :
                <IconMenu
                    onItemTouchTap={(event, child) => {
                        if (child.props.value == 'login') onLogin();
                        else onRegister();
                    }}
                    iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                    targetOrigin={{horizontal: 'right', vertical: 'top'}}
                    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                >
                    <MenuItem primaryText="登录" value="login"/>
                    <MenuItem primaryText="注册" value="register"/>
                </IconMenu>);


        return (
            <AppBar
                title="五人红五"
                iconElementRight={op}
                onLeftIconButtonTouchTap={onMenuButtonClicked}
            />
        );
    }
}