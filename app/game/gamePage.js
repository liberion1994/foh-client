import React, {Component} from "react";
import Measure from "react-measure";

import Paper from 'material-ui/Paper';
import Snackbar from 'material-ui/Snackbar';

import InformationColumn from "./informationColumn";
import GameColumn from "./gameColumn";
import ResultDialog from './resultDialog';
import RobotPickDialog from './robotPickDialog';

export default class GamePage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            dimensions: {
                width: -1,
                height: -1
            },
            snackbarShown: false,
            message: '',

            resultShown: false,
            result: null,

            robotPickerShown: false,
            robotSid: -1,
        };

    }

    componentWillReceiveProps(nextProps) {
        let newMessage = nextProps.scene.message;
        if (newMessage) {
            this.setState({message: newMessage, snackbarShown: true});
        }
        let result;
        if (nextProps.scene && nextProps.scene.room && nextProps.scene.room.game)
            result = nextProps.scene.room.game.result;
        if (result) {
            this.setState({result: result, resultShown: true});
            nextProps.onResultDismiss();
        }
    }

    componentDidMount() {
        let {scene, onEnter} = this.props;
        if (!scene.synchronized)
            onEnter();
    }

    onToolBarButtonClicked() {
        this.props.onToolBarButtonClicked();
    }

    render() {

        let {width, height} = this.state.dimensions;

        if (width <= 0 || height <= 0)
            return <Measure includeMargin={false} onMeasure={(dimensions) => {
                this.setState({dimensions})}} >
                <div style={styles.root} />
            </Measure>;

        let {
            scene,
            prepare, unprepare, leave, offerMajorAmount, chooseMajorColor,
            reserveCards, chooseAColor, playCards, onMessageDismiss,
            addRobot, removeRobot
        } = this.props;

        let leftWidth = height * 0.8;
        let rightWidth = width - 45 - leftWidth;
        if (leftWidth > width - 30)
            leftWidth = width - 30;


        let leftStyle = {
            width: leftWidth,
            height: height - 30,
            margin: 15
        };

        let rightStyle = {
            position: 'absolute',
            left: leftWidth + 30,
            top: 15,
            right: 15,
            bottom: 15,
            overflow: 'hidden'
        };

        if (scene.room) {
            return (
                <Measure includeMargin={false} onMeasure={(dimensions) => {
                    this.setState({dimensions})}} >
                <div style={styles.root}>
                        <GameColumn
                            style={leftStyle}
                            room={scene.room}

                            height={height}
                            width={leftWidth}
                            prepare={prepare}
                            unprepare={unprepare}
                            leave={leave}
                            offerMajorAmount={offerMajorAmount}
                            chooseMajorColor={chooseMajorColor}
                            reserveCards={reserveCards}
                            chooseAColor={chooseAColor}
                            playCards={playCards}
                            addRobot={sid => {this.setState({robotSid: sid, robotPickerShown: true})}}
                            removeRobot={removeRobot}
                        />
                    <Paper zDepth={1} style={rightStyle}>
                        <InformationColumn/>
                    </Paper>
                    <Snackbar
                        open={this.state.snackbarShown}
                        message={this.state.message}
                        bodyStyle={{textAlign: 'center'}}
                        autoHideDuration={2000}
                        onRequestClose={() => {this.setState({snackbarShown: false}); onMessageDismiss();}}
                    />
                    <ResultDialog
                        shown={this.state.resultShown}
                        result={this.state.result}
                        onClose={() => {this.setState({resultShown: false})}}
                    />
                    <RobotPickDialog
                        shown={this.state.robotPickerShown}
                        onCommit={(info) => {
                            addRobot(this.state.robotSid, info);
                            this.setState({robotPickerShown: false, robotSid: -1})
                        }}
                        onClose={() => {this.setState({robotPickerShown: false})}}
                    />
                </div>
                </Measure>
            )
        } else {
            return (
                <div style={styles.root}>
                    <h1>找不到房间</h1>
                </div>
            );
        }
    }
}

const styles = {
    root: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden'
    }
};