import { GarageCar } from '../../utils/types';
import CarModel from './carModel';
import CarView from './carView';
import { startStopEngine, startDrive, isError } from '../../api';

export default class CarController {
  private model!: CarModel;

  private view!: CarView;

  constructor(name: GarageCar['name'], color: GarageCar['color'], id: GarageCar['id'], parent: HTMLElement) {
    this.model = new CarModel(name, color, id);
    this.view = new CarView(this.model.getName(), this.model.getColor());
    this.view.startBtn.addClick(this.driveCar);
    this.view.stopBtn.addClick(this.stopCar);
    this.view.render(parent);
  }

  public getCarName(): string {
    return this.model.getName();
  }

  public setName(name: string): void {
    this.model.setName(name);
    this.view.setName(this.model.getName());
  }

  public driveCar = async (): Promise<void> => {
    this.view.startBtn.disable();
    try {
      const driveParams = await startStopEngine(this.model.getId(), 'started');
      this.model.setDriveParams(driveParams);
      this.model.startEngine();
      this.model.startDrive();
      this.view.moveToFinish(this.model.getAnimationTime());
      this.view.stopBtn.enable();
      await startDrive(this.model.getId());
    } catch (err) {
      if (isError(err)) {
        console.log(err.message);
        if (err.cause === 500) this.view.movePause();
      }
    }
  };

  public stopCar = async (): Promise<void> => {
    this.view.stopBtn.disable();
    try {
      this.view.movePause();
      await startStopEngine(this.model.getId(), 'stopped');
      this.model.stopEngine();
      this.view.moveToStart();
      this.view.startBtn.enable();
    } catch (err) {
      if (isError(err)) {
        console.log(err.message);
      }
    }
  };
}
