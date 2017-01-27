/**
 * Created by liboyuan on 16/8/28.
 */

import {Types, Properties} from 'foh-core';

export default class NaiveAI {
    
    constructor(game) {
        this.game = game;
    }

    makeAction () {
        let sid = this.game.currentTurn.remainedSid[0];
        switch (this.game.currentTurn.action) {
            case Types.GameAction.OFFER_MAJOR_AMOUNT:
                return this.offerMajorAmount(sid);
            case Types.GameAction.CHOOSE_MAJOR_COLOR:
                return this.chooseMajorColor(sid);
            case Types.GameAction.RESERVE_CARDS:
                return this.reserveCards(sid);
            case Types.GameAction.CHOOSE_A_COLOR:
                return this.chooseAColor(sid);
            case Types.GameAction.PLAY_CARDS:
                return this.playCards(sid);
        }
    }

    offerMajorAmount (sid) {
        let realSum = this.game.cardUtil.getAbsoluteMajorSum(this.game.cards[sid]);
        return {sid: sid, action: Types.GameAction.OFFER_MAJOR_AMOUNT, content: {amount: realSum}};
    };

    chooseMajorColor (sid) {
        return {sid: sid, action: Types.GameAction.CHOOSE_MAJOR_COLOR, content: {color: '♥'}};
    };

    reserveCards (sid) {
        let cards = this.game.cards[sid];
        let len = cards.length;
        let res = [];
        for (let i = len - Properties.ReservedCardSum; i < len; i ++) {
            res.push(cards[i]);
        }
        return {sid: sid, action: Types.GameAction.RESERVE_CARDS, content: {cards: res}};
    };

    chooseAColor (sid) {
        return {sid: sid, action: Types.GameAction.CHOOSE_A_COLOR, content: {color: '♣'}};
    };

    playCards (sid) {
        let cards = this.game.cards[sid];
        let res = [];
        if (sid == this.game.currentTurn.startSid) {
            res.push(cards[0]);
        } else {
            res = this.game.cardUtil.getCardsWithLimitation(cards,
                this.game.cardUtil.getLimitation(this.game.currentTurn.done[0].content.cards, cards));
            console.log('>>played', res);
            console.log('||inhand', cards);
        }
        return {sid: sid, action: Types.GameAction.PLAY_CARDS, content: {cards: res}};
    };

}
