import React from "react";


export default class Table extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
        };
    }

    render() {
        let seats = this.props.table.seatsOccupied.map((occupied, index) => {
            let st1 = occupied ? styles.seatOccupied : styles.seatEmpty;
            let st2 = styles['seat' + (index + 1)];
            return <div
                key={index + 1}
                style={{...styles.seat, ...st1, ...st2}}
                onClick={() => {if (!occupied) this.props.enter(index)}}
            >
            </div>;
        });
        return (
            <div style={styles.wrapper}>
                <div style={styles.table}>第{this.props.table.id}桌</div>
                {seats}
            </div>
        )
    }
}

const styles = {
    wrapper: {
        width: '20vw',
        height: '20vw',
        position: 'relative',
        display: 'inline-block',
        textAlign: 'center',
        fontSize: '2vw',
        lineHeight: '11vw'
    },
    table: {
        position: 'absolute',
        width: '60%',
        height: '60%',
        top: '20%',
        left: '20%',
        borderRadius: '50%',
        color: '#00BCD4',
        background: 'white',
        boxSizing: 'border-box',
        border: 'solid 4px #00BCD4',
        boxShadow: '2px 2px 2px #aaaaaa'
    },
    seat: {
        transform: 'translate(0px, 0px)',
        position: 'absolute',
        width: '15%',
        height: '15%',
        borderRadius: '50%',
        background: 'white',
        boxSizing: 'border-box'
    },
    seatEmpty: {
        border: 'solid 3px #00BCD4',
        cursor: 'pointer',
        boxShadow: '2px 2px 2px #aaaaaa'
    },
    seatOccupied: {
        border: 'solid 3px #9E9E9E',
        boxShadow: '1px 1px 2px #aaaaaa'
    },
    seat1: {
        left: '42.5%',
        top: '2.5%'
    },
    seat2: {
        left: '2.5%',
        top: '32.5%'
    },
    seat3: {
        right: '2.5%',
        top: '32.5%'
    },
    seat4: {
        left: '20%',
        bottom: '7.5%'
    },
    seat5: {
        right: '20%',
        bottom: '7.5%'
    }

};
