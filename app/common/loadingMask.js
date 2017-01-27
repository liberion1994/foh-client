import React from "react";
import CircularProgress from 'material-ui/CircularProgress';

export default class LoadingMask extends React.Component {

    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div
                style={{
                    animation: 'maskIn .3s ease',
                    position: 'fixed',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    zIndex: 9998
                }}
            >
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        background: '#080808',
                        opacity: '0.6'
                    }}
                >
                </div>
                <div style={{
                    left: '50%',
                    top: '50%',
                    position: 'absolute',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    color: 'white',
                    zIndex: 9999,
                    opacity: '1'
                }}>
                    <CircularProgress />
                    <div>{this.props.message}</div>
                </div>
            </div>
        )
    }
}
