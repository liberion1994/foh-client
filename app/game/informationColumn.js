/**
 * Created by liboyuan on 2017/1/23.
 */
import React, {Component} from "react";
import {Tabs, Tab} from "material-ui/Tabs";

const styles = {
    headline: {
        fontSize: 24,
        paddingTop: 16,
        marginBottom: 12,
        fontWeight: 400,
    },
    slide: {
        padding: 10,
    },
};

export default class InformationColumn extends Component {

    constructor(props) {
        super(props);
        this.state = {
            slideIndex: 0
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(value) {
        this.setState({
            slideIndex: value,
        });
    }

    render() {
        return (
            <div
                style={this.props.style}
            >
                <Tabs
                    onChange={this.handleChange}
                    value={this.state.slideIndex}
                >
                    <Tab label="聊天" value={0} >
                        <div style={{textAlign: 'center'}}>
                            <h1>开发中...</h1>
                        </div>
                    </Tab>
                    <Tab label="事件" value={1} >
                        <div style={{textAlign: 'center'}}>
                            <h1>请等待...</h1>
                        </div>
                    </Tab>
                    <Tab label="画板" value={2}>
                        <div style={{textAlign: 'center'}}>
                            <h1>别看了..!</h1>
                        </div>
                    </Tab>
                </Tabs>
            </div>
        );
    }
}