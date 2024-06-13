import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { GameSettings } from '../../dtos/settings';
import { GameInformation, Player } from '../../dtos/play';
import { LocalDarts, LocalDartsPlayer } from '../../dtos/localDb';
import { LocalPlayerService } from './local-player.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalGameService {

  constructor(
    private dbService: NgxIndexedDBService,
    private localPlayerService: LocalPlayerService
  ) { }

  // game
  public async startGame(gameSettings: GameSettings): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      // set Darts object
      const darts: LocalDarts = new LocalDarts();
      darts.mode = gameSettings.mode;
      darts.checkout = gameSettings.checkout;
      darts.date = new Date().toISOString();
      darts.throws = [];
      darts.ended = false;

      // set players
      darts.players = [];
      var playerOrder: number = 0;
      for (const player of gameSettings.players) {
        const playerObj = await firstValueFrom(this.localPlayerService.getPlayerById(player));
        if (playerObj) {
          const localPlayer = new LocalDartsPlayer();
          localPlayer.playerId = player;
          localPlayer.username = playerObj.name;
          localPlayer.order = playerOrder++;
          darts.players.push(localPlayer);
        }
      }
      // save
      this.dbService.add('darts', darts).subscribe(() => {
        resolve(true);
      }, (error) => {
        console.error('Error starting game:', error);
        resolve(false);
      });
    });
  }

  public async getGame(): Promise<GameInformation | null> {
    try {
      var entries = await this.dbService.getAll<GameInformation>('darts').toPromise();
      if (!Array.isArray(entries) || entries.length === 0) {
        return null;
      } else {
        return entries[entries.length - 1];
      }
    } catch (error) {
      console.error('Error getting game:', error);
      return null;
    }
  }

  public async cancelGame() {
    try {
      const currentGame = await this.getGame();
      if (currentGame) {
        await this.dbService.delete('darts', currentGame.gameId).toPromise();
        console.log('Game cancelled');
      }
    } catch (error) {
      console.error('Error cancelling game:', error);
    }
  }

  // player

  // active game
  private getCurrentPlayer(game: GameInformation): number {
    return 0;
  }
}