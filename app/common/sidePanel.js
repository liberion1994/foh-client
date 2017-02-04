/**
 * Created by liboyuan on 2017/1/23.
 */
import React, {Component} from 'react';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

import * as PageLocationState from '../redux/states/pageLocationState';

const iconHide = <IconButton><FontIcon className="material-icons">chevron_left</FontIcon></IconButton>;
const vsComIcon = <FontIcon className="material-icons">computer</FontIcon>;
const hallIcon = <FontIcon className="material-icons">home</FontIcon>;
const settingsIcon = <FontIcon className="material-icons">settings</FontIcon>;
const gameIcon = <FontIcon className="material-icons">videogame_asset</FontIcon>;
const statisticsIcon = <FontIcon className="material-icons">insert_chart</FontIcon>;

export default class SidePanel extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let {currentPage, onClose, changePage, open} = this.props;
        return (
            <Drawer width={200} open={open} >
                <AppBar title="导航"
                        style={{overflow: 'hidden'}}
                        iconElementLeft={iconHide}
                        onLeftIconButtonTouchTap={() => {onClose()}}
                />
                <Menu
                    autoWidth={false}
                    width={200}
                    value={currentPage}
                    selectedMenuItemStyle={{color: '#00BCD4'}}
                    onItemTouchTap={(event, menuItem, index) => {
                        if (currentPage == menuItem.props.value)
                            return;
                        changePage(index);
                        onClose();
                    }}
                >
                    <MenuItem primaryText="单人" leftIcon={vsComIcon} disabled={false}
                              value={PageLocationState.VS_COM}/>
                    <MenuItem primaryText="大厅" leftIcon={hallIcon} disabled={true}
                              value={PageLocationState.HALL}/>
                    <MenuItem primaryText="游戏" leftIcon={gameIcon} disabled={true}
                              value={PageLocationState.GAME}/>
                    <MenuItem primaryText="设置" leftIcon={settingsIcon} disabled={true}
                              value={PageLocationState.SETTINGS}/>
                    <MenuItem primaryText="数据" leftIcon={statisticsIcon} disabled={true}
                              value={PageLocationState.PLAYERS}/>
                </Menu>
            </Drawer>
        );
    }
}

SidePanel.defaultProps = {
    open: false
};