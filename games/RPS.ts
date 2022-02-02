import type { Game, Move, PlayerID } from "boardgame.io";
import { ActivePlayers, INVALID_MOVE, PlayerView } from 'boardgame.io/core';

export enum RPSMove {
  ROCK = "ROCK",
  PAPER = "PAPER",
  SCISSORS = "SCISSORS",
  NONE = "NONE"
}

export interface RPSState {
  playerInfo: {
    [playerID: string]: { ready: boolean };
  }
  // aka 'G', your game's state
  players: {
    [playerID: string]: {
      chosenMove: RPSMove;
    }
  }
  scores: {
    [playerID: string]: number
  }

}

const move: Move<RPSState> = (G, ctx) => { };

export const RPS: Game<RPSState> = {
  name: "ultimate-rps",
  minPlayers: 2,
  maxPlayers: 2,
  playerView: (G, ctx, playerID) => {
    if (Object.values(G.players).every(p => p.chosenMove !== RPSMove.NONE)) {
      return G;
    }
    const pid = parseInt(playerID as string);
    let state: typeof G = {
      playerInfo: G.playerInfo, players: {
        [playerID as string]: G.players[playerID as string],
        [(1 - pid).toString()]: { chosenMove: RPSMove.NONE }
      },
      scores: G.scores
    }
    return state
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
          ctx.events?.setActivePlayers({ all: "setup" })
        },
        stages: {
          setup: {
            moves: {
              startMatch: (G, ctx) => {
                if (ctx.playerID !== "0") {
                  return INVALID_MOVE;
                }

                if (Object.values(G.playerInfo).some((info) => !info.ready)) {
                  return INVALID_MOVE;
                }
                ctx.events?.endPhase();
              },
              setReady: (G, ctx, playerID: PlayerID, ready: boolean) => {
                G.playerInfo[playerID].ready = ready;
              }
            }
          }
        }
      }

    },
    play: {

      turn: {
        activePlayers: ActivePlayers.ALL,
        onBegin: (G, ctx) => {
          ctx.events?.setActivePlayers({ all: "choosing" })
          if (!ctx.activePlayers) return G;

          Object.keys(ctx.activePlayers).forEach(p => {
            G.players[p] = { ...G.players[p], chosenMove: RPSMove.NONE }
          })
        },

        stages: {

          choosing: {
            next: "chosen",
            moves: {
              Rock: {
                move: function (G, ctx) {
                  if (ctx.playerID)
                    G.players[ctx.playerID].chosenMove = RPSMove.ROCK;
                  ctx.events?.endStage();

                }, client: false
              },
              Paper: {
                move: function (G, ctx) {
                  if (ctx.playerID)
                    G.players[ctx.playerID].chosenMove = RPSMove.PAPER;
                  ctx.events?.endStage();
                }, client: false
              },
              Scissors: {
                move: function (G, ctx) {
                  if (ctx.playerID)
                    G.players[ctx.playerID].chosenMove = RPSMove.SCISSORS;
                  ctx.events?.endStage();
                }, client: false
              }
            },

          },
          chosen: {
            moves: {
              nextTurn: (G, ctx) => {
                ctx.events?.endTurn()
              }
            },
          }
        },
        onEnd: (G, ctx) => {
          let moveOne = G.players["0"].chosenMove
          let moveTwo = G.players["1"].chosenMove
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



