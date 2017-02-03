import React, {Component} from "react";
import Paper from 'material-ui/Paper';
import Snackbar from 'material-ui/Snackbar';
import InformationColumn from "./informationColumn";
import GameColumn from "./gameColumn";
import ResultDialog from './resultDialog';

export default class GamePage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            snackbarShown: false,
            message: '',
            resultShown: false,
            result: null
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

        let {scene,
            prepare, unprepare, leave, offerMajorAmount, chooseMajorColor,
            reserveCards, chooseAColor, playCards, onMessageDismiss} = this.props;
        if (scene.room) {
            return (
                <div style={styles.root}>
                    <div style={styles.left}>
                        <GameColumn
                            room={scene.room}

                            prepare={prepare}
                            unprepare={unprepare}
                            leave={leave}
                            offerMajorAmount={offerMajorAmount}
                            chooseMajorColor={chooseMajorColor}
                            reserveCards={reserveCards}
                            chooseAColor={chooseAColor}
                            playCards={playCards}
                        />
                    </div>
                    <Paper zDepth={1} style={styles.right}>
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
                </div>
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
    },
    left: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: '50%',
        bottom: 0,
        marginLeft: 30,
        marginTop: 30,
        marginBottom: 30,
        marginRight: 15,
        overflow: 'hidden'
    },
    right: {
        position: 'absolute',
        left: '50%',
        top: 0,
        right: 0,
        bottom: 0,
        marginLeft: 15,
        marginTop: 30,
        marginBottom: 30,
        marginRight: 30,
        overflow: 'hidden'
    }
};