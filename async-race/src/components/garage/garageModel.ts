import { garageService } from '../../api/garage';
import CarController from '../car/carController';
import { winnerService } from '../../api/winner';
import { ApiError } from '../../api/errors';

export class GarageModel {
  private selectedCar!: CarController;

  public carsOnPage: CarController[] = [];

  public winner!: CarController | null;

  public totalOnPage = 0;

  public total = 0;

  public isRace = false;

  public setSelectedCar(selectedCar: CarController): void {
    this.selectedCar = selectedCar;
  }

  public async update(newName: string, newColor: string): Promise<void> {
    try {
      if (!this.carsOnPage.includes(this.selectedCar)) return;
      const recievedCar = await garageService.updateCar({
        id: Number(this.selectedCar.getCarId()),
        name: newName,
        color: newColor,
      });
      this.selectedCar.updateCar(recievedCar);
    } catch (err) {
      throw new Error('failed to update');
    }
  }

  public raceAllCars = async (): Promise<void> => {
    const promises: Promise<string | void>[] = [];
    this.carsOnPage.forEach((car) => {
      car.turnOffStopBtn();
      promises.push(car.driveCar(true)
        .then(() => String(car.getCarId())));
    });
    await Promise.any(promises)
      .then((value) => {
        const winner = this.carsOnPage.find((car) => String(car.getCarId()) === value);
        if (winner) this.winner = winner;
      })
      .catch(() => {
        this.winner = null;
        console.error('No winners');
      });
    if (!this.isRace) return;
    await this.uploadWinner();
  };

  public uploadWinner = async (): Promise<void> => {
    try {
      if (this.winner) {
        const winnerReceived = await winnerService.getWinner(Number(this.winner?.getCarId()));
        const winnerId = winnerReceived.id;
        const updatedWins = winnerReceived.wins + 1;
        const winnertime = this.winner.getTime();
        console.log('update', winnerId, updatedWins, winnertime);
        await winnerService.updateWinner({ id: winnerId, wins: updatedWins, time: winnertime })
          .catch(() => {});
      }
    } catch (err) {
      if (err instanceof ApiError) {
        if (this.winner) {
          const winnerId = Number(this.winner?.getCarId());
          const winsCount = 1;
          const winnertime = this.winner.getTime();
          console.log('new', winnerId, winsCount, winnertime);
          await winnerService.createWinner({ id: winnerId, wins: winsCount, time: winnertime })
            .catch(() => {});
        }
      }
    }
  };

  public resetAllCars = async (): Promise<void> => {
    const promises: Promise<string | void>[] = [];
    this.carsOnPage.forEach((car) => {
      promises.push(car.stopCar());
    });
    await Promise.allSettled(promises);
  };
}
