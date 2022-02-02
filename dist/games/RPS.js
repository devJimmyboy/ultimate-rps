"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RPS = exports.RPSMove = void 0;
const core_1 = require("boardgame.io/core");
var RPSMove;
(function (RPSMove) {
    RPSMove["ROCK"] = "ROCK";
    RPSMove["PAPER"] = "PAPER";
    RPSMove["SCISSORS"] = "SCISSORS";
    RPSMove["NONE"] = "NONE";
})(RPSMove = exports.RPSMove || (exports.RPSMove = {}));
const move = (G, ctx) => { };
exports.RPS = {
    name: "ultimate-rps",
    minPlayers: 2,
    maxPlayers: 2,
    playerView: (G, ctx, playerID) => {
        if (Object.values(G.players).every(p => p.chosenMove !== RPSMove.NONE)) {
            return G;
        }
        const pid = parseInt(playerID);
        let state = {
            playerInfo: G.playerInfo, players: {
                [playerID]: G.players[playerID],
                [(1 - pid).toString()]: { chosenMove: RPSMove.NONE }
            },
            scores: G.scores
        };
        return state;
    },
    setup: () => ({
        playerInfo: {
            "0": { ready: false },
            "1": { ready: false },
        },
        players: {
            "0": { chosenMove: RPSMove.NONE }, "1": { chosenMove: RPSMove.NONE }
        },
        scores: {
            "0": 0, "1": 0
        }
    }),
    phases: {
        setup: {
            start: true,
            next: "play",
            turn: {
                onBegin: (G, ctx) => {
                    var _a;
                    (_a = ctx.events) === null || _a === void 0 ? void 0 : _a.setActivePlayers({ all: "setup" });
                },
                stages: {
                    setup: {
                        moves: {
                            startMatch: (G, ctx) => {
                                var _a;
                                if (ctx.playerID !== "0") {
                                    return core_1.INVALID_MOVE;
                                }
                                if (Object.values(G.playerInfo).some((info) => !info.ready)) {
                                    return core_1.INVALID_MOVE;
                                }
                                (_a = ctx.events) === null || _a === void 0 ? void 0 : _a.endPhase();
                            },
                            setReady: (G, ctx, playerID, ready) => {
                                G.playerInfo[playerID].ready = ready;
                            }
                        }
                    }
                }
            }
        },
        play: {
            turn: {
                activePlayers: core_1.ActivePlayers.ALL,
                onBegin: (G, ctx) => {
                    var _a;
                    (_a = ctx.events) === null || _a === void 0 ? void 0 : _a.setActivePlayers({ all: "choosing" });
                    if (!ctx.activePlayers)
                        return G;
                    Object.keys(ctx.activePlayers).forEach(p => {
                        G.players[p] = Object.assign(Object.assign({}, G.players[p]), { chosenMove: RPSMove.NONE });
                    });
                },
                stages: {
                    choosing: {
                        next: "chosen",
                        moves: {
                            Rock: {
                                move: function (G, ctx) {
                                    var _a;
                                    if (ctx.playerID)
                                        G.players[ctx.playerID].chosenMove = RPSMove.ROCK;
                                    (_a = ctx.events) === null || _a === void 0 ? void 0 : _a.endStage();
                                }, client: false
                            },
                            Paper: {
                                move: function (G, ctx) {
                                    var _a;
                                    if (ctx.playerID)
                                        G.players[ctx.playerID].chosenMove = RPSMove.PAPER;
                                    (_a = ctx.events) === null || _a === void 0 ? void 0 : _a.endStage();
                                }, client: false
                            },
                            Scissors: {
                                move: function (G, ctx) {
                                    var _a;
                                    if (ctx.playerID)
                                        G.players[ctx.playerID].chosenMove = RPSMove.SCISSORS;
                                    (_a = ctx.events) === null || _a === void 0 ? void 0 : _a.endStage();
                                }, client: false
                            }
                        },
                    },
                    chosen: {
                        moves: {
                            nextTurn: (G, ctx) => {
                                var _a;
                                (_a = ctx.events) === null || _a === void 0 ? void 0 : _a.endTurn();
                            }
                        },
                    }
                },
                onEnd: (G, ctx) => {
                    let moveOne = G.players["0"].chosenMove;
                    let moveTwo = G.players["1"].chosenMove;
                    switch (moveOne) {
                        case RPSMove.PAPER:
                            if (moveTwo === RPSMove.SCISSORS)
                                G.scores["1"]++;
                            else if (moveTwo === RPSMove.ROCK)
                                G.scores["0"]++;
                            break;
                        case RPSMove.ROCK:
                            if (moveTwo === RPSMove.PAPER)
                                G.scores["1"]++;
                            else if (moveTwo === RPSMove.SCISSORS)
                                G.scores["0"]++;
                            break;
                        case RPSMove.SCISSORS:
                            if (moveTwo === RPSMove.ROCK)
                                G.scores["1"]++;
                            else if (moveTwo === RPSMove.PAPER)
                                G.scores["0"]++;
                            break;
                    }
                }
            },
        }
    },
    endIf: (G, ctx) => {
        if (G.scores[ctx.currentPlayer] >= 2) {
            return { winner: ctx.currentPlayer };
        }
    }
};
