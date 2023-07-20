import { ICar } from '../../utils/types';
import CarModel from './carModel';
import CarView from './carView';
import { isError } from '../../utils/isError';

export default class CarController {
  private model!: CarModel;

  private view!: CarView;

  constructor(newCar: ICar) {
    this.model = new CarModel(newCar.name, newCar.color, newCar.id);
    this.view = new CarView(this.model.getName(), this.model.getColor());
    this.view.startBtn.addAsyncClick(this.driveCar);
  }

  public isStarted(): boolean {
    return this.model.isStarted;
  }

  public getCarId(): number {
    return this.model.getId();
  }

  public getCarName(): string {
    return this.model.getName();
  }

  public getCarParams(): ICar {
    return this.model.getCar();
  }

  public setName(name: string): void {
    this.model.setName(name);
    this.view.setName(this.model.getName());
  }

  public setColor(color: string): void {
    this.model.setColor(color);
    this.view.setColor(this.model.getColor());
  }

  public driveCar = async (isRace = false): Promise<void> => {
    this.view.turnOffBtns(['start', 'select', 'remove']);
    await this.model.startEngine();
    this.view.moveToFinish(this.model.getAnimationTime());
    if (!isRace) this.view.turnOnBtns(['stop']);
    await this.model.startDrive();
    this.view.turnOnBtns(['select', 'remove']);
    if (this.model.isBroken && this.model.isStarted) {
      this.view.movePause();
      this.view.setBroken();
      this.view.turnOnBtns(['select', 'remove']);
      if (!isRace) this.view.turnOnBtns(['stop']);
      throw new Error();
    }
  };

  public stopCar = async (isStarted = true): Promise<void> => {
    this.view.turnOffBtns(['stop', 'select', 'remove']);
    try {
      this.view.movePause();
      await this.model.stopEngine();
      this.view.moveToStart();
      this.view.turnOnBtns(['start', 'select', 'remove']);
    } catch (err) {
      if (!isStarted) this.view.turnOnBtns(['stop']);
      this.view.turnOnBtns(['select', 'remove']);
    }
  };

  public destroyCar(): void {
    this.view.destroy();
  }

  public createCar(parent: HTMLElement): void {
    this.view.render(parent);
  }

  public removeCar = async (): Promise<void> => {
    try {
      await this.model.removeCar();
      this.destroyCar();
    } catch (err) {
      if (isError(err)) console.log(err.message);
    }
  };

  public getSelectBtn(): HTMLElement {
    return this.view.selectBtn.el;
  }

  public getRemoveBtn(): HTMLElement {
    return this.view.removeBtn.el;
  }

  public getStopBtn(): HTMLElement {
    return this.view.stopBtn.el;
  }

  public updateCar(params: ICar): void {
    this.setName(params.name);
    this.setColor(params.color);
  }

  public getTime(): number {
    return Math.round((this.model.getAnimationTime() / 1000) * 100) / 100;
  }

  public turnOffStopBtn(): void {
    this.view.turnOffBtns(['stop']);
  }
}
