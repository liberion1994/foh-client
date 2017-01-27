/**
 * Created by liboyuan on 2017/1/24.
 */


let GameSceneExample = {
    synchronized: true,

    room: {
        sid: 0,
        eid: 91,
        seats: [],

        game: {
            currentTurn: {},

            masterSid: 1,
            majorNumber: 3,
            majorColor: '♠',
            subMasterSid: 2,
            aColor: '♦',
            result: null,

            points: [0, 10, 0, 5, 20],
            caught5Heart: [],

            cards: [],
            reservedCards: null
        }
    }

};