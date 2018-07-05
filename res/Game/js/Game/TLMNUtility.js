var TLMNUtility = {
    HAI: 0,
    DOI: 1,
    BA: 2,
    TUQUY: 3,
    BADOITHONG: 4,
    BONDOITHONG: 5,
    DAY: 6,
    preventable: [
        [1, 3, 4, 5], // chan 2
        [1], // chan doi
        [2], // chan bo ba
        [3, 5], // chan tu quy
        [3, 4, 5], // chan ba doi thong
        [5], //chan bon doi thong
        [6] // chan day
    ],

    getGroupType: function (cards) {
        if (!cards)
            return -1;

        if (cards.length <= 0) {
            return -1; // no suggest
        }
        if (cards.length == 1 && cards[0].rank != 2) {
            return -1; // no suggest
        }
        if (cards.length == 1 && cards[0].rank == 2) {
            return TLMNUtility.HAI;
        }

        if (cards.length == 2 && cards[0].rank == 2 && cards[1].rank == 2) {
            return TLMNUtility.HAI;
        }

        var rankFreq = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var suitFreq = [0, 0, 0, 0];

        for (var i = 0; i < cards.length; i++) {
            rankFreq[cards[i].rank]++;
            suitFreq[cards[i].suit]++;
        }
        rankFreq[14] = rankFreq[1];


        //doi, ba , tu quy
        for (var i = 0; i < rankFreq.length; i++) {
            if (rankFreq[i] == cards.length) {
                switch (cards.length) {
                    case 2 :
                        return TLMNUtility.DOI;
                    case 3:
                        return TLMNUtility.BA;
                    case 4:
                        return TLMNUtility.TUQUY;
                }
            }
        }

        if (cards.length == 6) {
            for (var i = 0; i < rankFreq.length - 2; i++) {
                if (rankFreq[i] == 2 && rankFreq[i + 1] == 2 && rankFreq[i + 2] == 2) {
                    return TLMNUtility.BADOITHONG;
                }
            }
        }

        if (cards.length == 8) {
            for (var i = 0; i < rankFreq.length - 3; i++) {
                if (rankFreq[i] == 2 && rankFreq[i + 1] == 2 &&
                    rankFreq[i + 2] == 2 && rankFreq[i + 3] == 2) {
                    return TLMNUtility.BONDOITHONG;
                }
            }
        }

        var longestStreak = 0;
        var currentStreak = 0;
        for (var i = 0; i < rankFreq.length; i++) {
            if (rankFreq[i] == 1) {
                currentStreak++;
                longestStreak = longestStreak > currentStreak ? longestStreak : currentStreak;
            } else {
                currentStreak = 0;
            }
        }

        if (longestStreak == cards.length && longestStreak >= 3) {
            return TLMNUtility.DAY;
        }

        return -1;
    },

    getSuggestedCards: function (cards, handCards) {
        var suggestGroups = [];
        if (!cards) {
            suggestGroups = suggestGroups.concat(this.findDoiThong(handCards, null, null, 3));
            suggestGroups = suggestGroups.concat(this.findDoiThong(handCards, null, null, 4));
            for (var i = 3; i < 13; i++) {
                suggestGroups = suggestGroups.concat(this.findDay(handCards, null, null, i));
            }
            suggestGroups = suggestGroups.concat(this.findSameCards(handCards, null, null, 2));
            suggestGroups = suggestGroups.concat(this.findSameCards(handCards, null, null, 3));
            suggestGroups = suggestGroups.concat(this.findSameCards(handCards, null, null, 4));

            return suggestGroups;
        }
        var groupType = this.getGroupType(cards);
        if (groupType == -1) {
            return [];
        }

        var rankFreq = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var suitFreq = [0, 0, 0, 0];
        for (var i = 0; i < handCards.length; i++) {
            rankFreq[handCards[i].rank]++;
            suitFreq[handCards[i].suit]++;
        }

        var preventableGroupType = this.preventable[groupType];

        // special handler pair 2
        if (groupType == TLMNUtility.HAI && cards.length == 1) {
            preventableGroupType = [3, 4, 5];
        }

        var minRank = cards[0].rank;
        for (var i = 1; i < cards.length; i++) {
            minRank = cards[i].rank < minRank ? cards[i].rank : minRank;
        }

        for (var i = 0; i < preventableGroupType.length; i++) {
            switch (preventableGroupType[i]) {
                case TLMNUtility.DOI:
                    suggestGroups = suggestGroups.concat(this.findSameCards(handCards, rankFreq, suitFreq, 2, minRank));
                    break;
                case TLMNUtility.BA:
                    suggestGroups = suggestGroups.concat(this.findSameCards(handCards, rankFreq, suitFreq, 3, minRank));
                    break;
                case TLMNUtility.TUQUY:
                    suggestGroups = suggestGroups.concat(this.findSameCards(handCards, rankFreq, suitFreq, 4,
                        groupType == TLMNUtility.TUQUY ? minRank : 0));
                    break;
                case TLMNUtility.BADOITHONG:
                    suggestGroups = suggestGroups.concat(this.findDoiThong(handCards, rankFreq, suitFreq, 3,
                        groupType == TLMNUtility.BADOITHONG ? minRank : 0));
                    break;
                case TLMNUtility.BONDOITHONG:
                    suggestGroups = suggestGroups.concat(this.findDoiThong(handCards, rankFreq, suitFreq, 4,
                        groupType == TLMNUtility.BONDOITHONG ? minRank : 0));
                    break;
                case TLMNUtility.DAY:
                    suggestGroups = suggestGroups.concat(this.findDay(handCards, rankFreq, suitFreq, cards.length,
                        minRank, cards
                    ));
                    break;
            }
        }
        return suggestGroups;
    },

    findDay: function (handCards, rankFreq, suitFreq, length, minRank, source) {
        if (length > handCards.length)
            return [];

        if (length < 3)
            return [];

        if ((!rankFreq) || (!suitFreq)) {
            rankFreq = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            suitFreq = [0, 0, 0, 0];
            for (var i = 0; i < handCards.length; i++) {
                rankFreq[handCards[i].rank]++;
                suitFreq[handCards[i].suit]++;
            }
        }

        var sameCards = [];
        var result = [];
        for (var i = 0; i < handCards.length; i++) {
            if (!sameCards[handCards[i].rank])
                sameCards[handCards[i].rank] = [];
            sameCards[handCards[i].rank].push(handCards[i]);
        }

        rankFreq[14] = rankFreq[1];
        sameCards[14] = sameCards[1];
        for (var i = 3; i <= 15 - length; i++) {
            var isLegal = true;
            for (var j = 0; j < length; j++) {
                if (!rankFreq[i + j]) {
                    isLegal = false;
                    break;
                }
            }

            if (!isLegal)
                continue;

            if (i < minRank)
                continue;

            var fcallStr = "this.getCombination(";
            for (var j = 0; j < length; j++) {
                fcallStr += "sameCards[" + (i + j) + "],"
            }
            fcallStr += ");";
            fcallStr = fcallStr.replace(",)", ")");

            //console.log(fcallStr);
            var groups = eval(fcallStr);
            if (!source) {
                result = result.concat(groups);
            } else {
                for (var j = 0; j < groups.length; j++) {
                    if (this.isGreaterDay(source, groups[j]))
                        result.push(groups[j]);
                }
            }
        }

        return result;
    },

    isGreaterDay: function (source, dest) {
        if (source.length != dest.length)
            return false;

        var comparefn = function (a, b) {
            var cmpRankA = a.rank < 3 ? (a.rank + 13) : a.rank;
            var cmpRankB = b.rank < 3 ? (b.rank + 13) : b.rank;
            return cmpRankA - cmpRankB;
        };
        source.sort(comparefn);

        dest.sort(comparefn);

        if (dest[0].rank > source[0].rank)
            return true;

        if (dest[0].rank < source[0].rank)
            return false;

        return source[source.length - 1].suit < dest[source.length - 1].suit;
    },

    // tim doi, bo ba, tu quy
    findSameCards: function (handCards, rankFreq, suitFreq, length, minRank) {
        if ((!rankFreq) || (!suitFreq)) {
            rankFreq = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            suitFreq = [0, 0, 0, 0];
            for (var i = 0; i < handCards.length; i++) {
                rankFreq[handCards[i].rank]++;
                suitFreq[handCards[i].suit]++;
            }
        }

        var sameCards = [];
        var result = [];
        for (var i = 0; i < handCards.length; i++) {
            if (rankFreq[handCards[i].rank] >= length) {
                if (handCards[i].rank > 2 && handCards[i].rank < minRank)
                    continue;
                if (!sameCards[handCards[i].rank])
                    sameCards[handCards[i].rank] = [];
                sameCards[handCards[i].rank].push(handCards[i]);
            }
        }

        // tach cac bo, them vao ket qua
        for (var i = 0; i < sameCards.length; i++) {
            if ((!sameCards[i]))
                continue;

            // truong hop dung 2 doi cung rank chan nhau, doi chan phai co chat co* ( heart )
            if (length == 2 && sameCards[i][0].suit != 3
                && sameCards[i][1].suit != 3 && i == minRank)
                continue;

            // A 2 la to nhat
            if (minRank <= 2 && i >= 3 && minRank != 0)
                continue;

            for (var j = 0; j <= sameCards[i].length - length; j++) {
                result.push(sameCards[i].slice(j, length + j));
            }
        }

        return result;
    },

    findDoiThong: function (handCards, rankFreq, suitFreq, length, minRank) {
        minRank = minRank || 0;
        if (length != 3 && length != 4) {
            return [];
        }

        if ((!rankFreq) || (!suitFreq)) {
            rankFreq = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            suitFreq = [0, 0, 0, 0];
            for (var i = 0; i < handCards.length; i++) {
                rankFreq[handCards[i].rank]++;
                suitFreq[handCards[i].suit]++;
            }
        }

        var sameCards = [];
        var result = [];
        for (var i = 0; i < handCards.length; i++) {
            if (rankFreq[handCards[i].rank] >= 2) {
                if (!sameCards[handCards[i].rank])
                    sameCards[handCards[i].rank] = [];
                sameCards[handCards[i].rank].push(handCards[i]);
            }
        }

        rankFreq[14] = rankFreq[1];// A
        sameCards[14] = sameCards[1];
        if (length == 3) {
            for (var i = 3; i < 13; i++) {
                if (i < minRank)
                    continue;
                if (rankFreq[i] >= 2 && rankFreq[i + 1] >= 2 && rankFreq[i + 2] >= 2) {
                    var isLegal = i >= minRank;
                    if (i == minRank && isLegal) {
                        isLegal = false;
                        for (var j = 0; j < sameCards[i + 2].length; j++) {
                            isLegal = isLegal || (sameCards[i + 2][j].suit == 3);
                        }
                    }


                    if (!isLegal)
                        continue;
                    result = result.concat(this.getCombination(
                        this.getSubGroup(sameCards[i], 2),
                        this.getSubGroup(sameCards[i + 1], 2),
                        this.getSubGroup(sameCards[i + 2], 2)
                    ));
                }
            }
        }

        if (length == 4) {
            for (var i = 3; i < 12; i++) {
                if (i < minRank)
                    continue;
                if (rankFreq[i] >= 2 && rankFreq[i + 1] >= 2 && rankFreq[i + 2] >= 2 && rankFreq[i + 3] >= 2) {
                    var isLegal = i > minRank;
                    for (var j = 0; j < sameCards[i + 3].length; j++) {
                        isLegal = isLegal || (sameCards[i + 3][j].suit == 3);
                    }
                    if (!isLegal)
                        continue;
                    result = result.concat(this.getCombination(
                        this.getSubGroup(sameCards[i], 2),
                        this.getSubGroup(sameCards[i + 1], 2),
                        this.getSubGroup(sameCards[i + 2], 2),
                        this.getSubGroup(sameCards[i + 3], 2)
                    ));
                }
            }
        }

        return result;
    },

    getCombination: function () {
        var result = [];
        var pre = arguments[0];
        if (arguments.length == 2) {
            var post = arguments[1].length ? arguments[1] : [arguments[1]];
            for (var i = 0; i < pre.length; i++) {
                for (var j = 0; j < post.length; j++) {
                    if (pre[i].length)
                        result.push(pre[i].concat(post[j]));
                    else
                        result.push([pre[i]].concat(post[j]));
                }
            }
            return result;
        }

        var fcallStr = "this.getCombination(";

        //build fcall
        for (var i = 1; i < arguments.length; i++)
            fcallStr += "arguments[" + i + "],";
        fcallStr += ");";
        fcallStr = fcallStr.replace(",)", ")");

        var recursionResult = eval(fcallStr);
        for (var i = 0; i < pre.length; i++) {
            for (var j = 0; j < recursionResult.length; j++) {
                if (pre[i].length)
                    result.push(pre[i].concat(recursionResult[j]));
                else
                    result.push([pre[i]].concat(recursionResult[j]));
            }
        }
        return result;
    },

    getSubGroup: function (group, length) {
        var result = [];
        for (var i = 0; i <= group.length - length; i++)
            result.push(group.slice(i, i + length));
        return result;
    }
};

var handCards = [
    {rank: 3, suit: 0},
    {rank: 3, suit: 1},
    {rank: 4, suit: 0},
    {rank: 4, suit: 1},
    {rank: 5, suit: 0},
    {rank: 5, suit: 1},
    {rank: 6, suit: 0},
    {rank: 6, suit: 1}
];
console.log(TLMNUtility.findDoiThong(handCards, null, null, 3, 0));