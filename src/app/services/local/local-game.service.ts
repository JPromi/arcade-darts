import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { UserList } from '../../dtos/settings';
import { Observable } from 'rxjs';
import { LocalGame } from '../../dtos/local';
import { GameInformation, Player } from '../../dtos/play';

@Injectable({
  providedIn: 'root'
})
export class LocalGameService {

  constructor(
    private db: NgxIndexedDBService
  ) { }

  /*
  new game
  end game
  get game
  add throw
  undo throw
  */

  newGame(players: UserList[], mode: string, checkout: string): Observable<any> {
    return this.db.add('game', { players: players, mode: mode, checkout: checkout, ended: false, date: new Date(), throws: [] });
  }

  currentGame(): Promise<LocalGame | null> {
    return this.db.getAll<LocalGame>('game').toPromise().then(
      (games) => {
        if (games && games.length > 0) {
          return games[games.length - 1];
        } else {
          return null;
        }
      }
    );
  }

  endGame(): Promise<any> {
    return this.currentGame().then(
      (game) => {
        if (game) {
          game.ended = true;
          return this.db.update('game', game).toPromise();
        } else {
          return Promise.reject('No game found');
        }
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  addPoint(playerId: number, points: string): Promise<any> {
    return this.currentGame().then(
      (game) => {
        if (game) {
          var throws = game.throws;
          var currentThrow = throws.find((throw_) => throw_.playerId === playerId && throw_.throw3 === "");
          var gameMapped = this.gameAsGame(game);
          var currentPlayer = gameMapped.player.find((player) => player.current);

          if (currentThrow) {
            if (currentThrow.throw1 === "") {
              currentThrow.throw1 = points;
            } else if (currentThrow.throw2 === "") {
              currentThrow.throw2 = points;
            } else if (currentThrow.throw3 === "") {
              currentThrow.throw3 = points;
            }

            var throughtScore = 0;
            throughtScore += this.scoreMap(currentThrow.throw1);
            throughtScore += this.scoreMap(currentThrow.throw2);
            throughtScore += this.scoreMap(currentThrow.throw3);

            if(game.checkout == "double") {
              if(currentPlayer) {
                if(currentPlayer.score - throughtScore == 0) {
                  if(
                    (currentThrow.throw1.substring(0, 1) == "D" && currentThrow.throw2 == "") ||
                    (currentThrow.throw2.substring(0, 1) == "D" && currentThrow.throw3 == "") ||
                    (currentThrow.throw3.substring(0, 1) == "D")
                  ) {
                    game.ended = true;
                  }
                } else if(currentPlayer.score - throughtScore <= 1 && currentPlayer.score - throughtScore != 0) {
                  if(currentThrow.throw1 == "") {
                    currentThrow.throw1 = "abort";
                  }
                  if(currentThrow.throw2 == "") {
                    currentThrow.throw2 = "abort";
                  }
                  if(currentThrow.throw3 == "") {
                    currentThrow.throw3 = "abort";
                  }

                }
              }
            } else {

            }

            
            game.throws = throws;
            return this.db.update('game', game).toPromise();
          } else {
            var throwNow = { playerId: playerId, throw1: points, throw2: "", throw3: "" };
            if(currentPlayer) {
              if(currentPlayer.score - this.scoreMap(points) == 0 && points.substring(0, 1) == "D") {
                game.ended = true;
              } else {
                if(currentPlayer.score - this.scoreMap(points) <= 1) {
                  if(throwNow.throw1 == "") {
                    throwNow.throw1 = "abort";
                  }
                  if(throwNow.throw2 == "") {
                    throwNow.throw2 = "abort";
                  }
                  if(throwNow.throw3 == "") {
                    throwNow.throw3 = "abort";
                  }
                }
              }
            }
            throws.push(throwNow);
            return this.db.update('game', game).toPromise();
          }
        } else {
          return Promise.reject('No game found');
        }
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  undoThrow(): Promise<any> {
    return this.currentGame().then(
      (game) => {
        if (game) {
          var throws = game.throws;
          var currentThrow = throws.find((throw_) => throw_.throw3 !== "");
          if (currentThrow) {
            if (currentThrow.throw3 !== "") {
              currentThrow.throw3 = "";
            } else if (currentThrow.throw2 !== "") {
              currentThrow.throw2 = "";
            } else if (currentThrow.throw1 !== "") {
              currentThrow.throw1 = "";
            }
            return this.db.update('game', game).toPromise();
          } else {
            return Promise.reject('No throw found');
          }
        } else {
          return Promise.reject('No game found');
        }
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }  

  gameAsGame(game: LocalGame): GameInformation {
    var gameInfo = new GameInformation(game.gameId, game.mode, game.checkout);
  
    game.players.forEach((player, index) => {
      var _player = new Player();
      _player.playerId = player.userId;
      _player.name = player.username;
      _player.number = index + 1;
      _player.score = game.mode === '501' ? 501 : 301;
  
      // throws
      game.throws.forEach((throws) => {
        if (throws.playerId === player.userId) {
          _player.throws.throw1 = throws.throw1;
          _player.throws.throw2 = throws.throw2;
          _player.throws.throw3 = throws.throw3;
  
          var currentThrow = 0;
          currentThrow += this.scoreMap(throws.throw1);
          currentThrow += this.scoreMap(throws.throw2);
          currentThrow += this.scoreMap(throws.throw3);
          if (game.checkout == "double") {
            if (_player.score - currentThrow > 1) {
              _player.score -= currentThrow;
            } else if (_player.score - currentThrow == 0) {
              if (
                (throws.throw1.substring(0, 1) == "D" && throws.throw2 == "") ||
                (throws.throw2.substring(0, 1) == "D" && throws.throw3 == "") ||
                (throws.throw3.substring(0, 1) == "D")
              ) {
                _player.score -= currentThrow;
              }
            }
          } else if (game.checkout == "single") {
            if (_player.score - currentThrow > 1) {
              _player.score -= currentThrow;
            } else if (_player.score - currentThrow == 0) {
              _player.score -= currentThrow;
            }
          }
  
          if (currentThrow > _player.highscore) {
            _player.highscore = currentThrow;
          }
        }
      });
      
      gameInfo.player.push(_player);
    });
  
    // current player logic
    const lastThrow = game.throws[game.throws.length - 1];
    var currentPlayerFound = false;
    if (lastThrow) {
      gameInfo.player.forEach((playerInfo) => {
        if (lastThrow.playerId === playerInfo.playerId) {
          if (lastThrow.throw1 && lastThrow.throw2 && lastThrow.throw3) {
            playerInfo.current = false;
          } else {
            playerInfo.current = true;
            currentPlayerFound = true;
          }
        } else {
          playerInfo.current = false;
        }
      });
  
      if (lastThrow.throw1 && lastThrow.throw2 && lastThrow.throw3) {
        for (let key = 0; key < gameInfo.player.length; key++) {
          const _player = gameInfo.player[key];
          if (_player.playerId === lastThrow.playerId) {
            let nextPlayer;
            if (key + 1 === gameInfo.player.length) {
              nextPlayer = gameInfo.player[0];
            } else {
              nextPlayer = gameInfo.player[key + 1];
            }
  
            if (nextPlayer.playerId === game.players[0].userId) {
              gameInfo.player[0].current = true;
            } else {
              nextPlayer.current = true;
            }
            currentPlayerFound = true;
          }
        }
      }
    } else {
      if (game.throws.length === 0 && game.players.length === 1) {
        gameInfo.player[0].current = true;
      } else {
        gameInfo.player.forEach((playerInfo) => {
          playerInfo.current = false;
        });
      }
    }
  
    if (!currentPlayerFound) {
      gameInfo.player[0].current = true;
    }
  
    // reset throws on current player
    gameInfo.player.forEach((playerInfo) => {
      if (playerInfo.current && playerInfo.throws.throw3) {
        playerInfo.throws.throw1 = '';
        playerInfo.throws.throw2 = '';
        playerInfo.throws.throw3 = '';
      }
    });
  
    return gameInfo;
  }
  

  private scoreMap(scoreThrow: string): number {
    scoreThrow = scoreThrow.toUpperCase();
    if(scoreThrow == "MISS" || scoreThrow == "ABORT" || scoreThrow == "") {
      return 0;
    } else {
      var prefix = scoreThrow.substring(0, 1);
      switch (prefix) {
        case "D":
          return parseInt(scoreThrow.substring(1)) * 2;
          break;

        case "T":
          return parseInt(scoreThrow.substring(1)) * 3;
          break;
      
        default:
          return parseInt(scoreThrow);
          break;
      }
    }
  }
}
