import React, {Component} from "react";
import Paper from 'material-ui/Paper';
import InformationColumn from "./informationColumn";
import GameColumn from "./gameColumn";

export default class GamePage extends Component {

    constructor(props) {
        super(props);

        this.state = {
        };

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
            reserveCards, chooseAColor, playCards} = this.props;
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