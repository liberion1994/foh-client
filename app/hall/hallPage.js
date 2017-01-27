import React from "react";
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import * as HallState from '../redux/states/hallState';

import Table from "./table";


export default class HallPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
        };

    }

    componentDidMount() {
        setTimeout(() => {
            if (this.props.hall.state == HallState.FAILED || this.props.hall.state == HallState.UNFETCHED)
                this.props.loadData()
        }, 1000);
    }

    onToolBarButtonClicked() {
        this.props.onToolBarButtonClicked();
    }

    render() {
        let tables = this.props.hall.content ? this.props.hall.content.tables.map((table) => {
            return <Table
                key={table.id}
                table={table}
                enter={(sid)=> {this.props.onEnterTable({tid: table.id, sid: sid})}}
            />;
        }) : null;
        return (
            <div style={{

            }}>
                <ReactCSSTransitionGroup
                    transitionName="fade"
                    transitionEnterTimeout={300}
                    transitionLeaveTimeout={300}>
                    {tables}
                </ReactCSSTransitionGroup>
            </div>
        )
    }
}
