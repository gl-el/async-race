import { DriveParams, ICar } from '../../utils/types';
import { engineService } from '../../api/engine';
import { garageService } from '../../api/garage';
import { ApiError } from '../../api/errors';

export default class CarModel {
  private velocity!: number;

  private distance!: number;

  private time = NaN;

  constructor(
    private name: ICar['name'],
    private color: ICar['color'],
    private id: ICar['id'],
    public isStarted = false,
    public isBroken = false,
    public state = 'ok',
  ) { }

  public setName(name: string): void {
    this.name = name;
  }

  public getName(): string {
    return this.name;
  }

  public setColor(newColor: string): void {
    this.color = newColor;
  }

  public getColor(): string {
    return this.color;
  }

  public getId(): number {
    return this.id;
  }

  public getCar(): ICar {
    return { name: this.name, color: this.color, id: this.id };
  }

  public getTime(): number {
    return this.time;
  }

  public setDriveParams(params: DriveParams): void {
    this.velocity = params.velocity;
    this.distance = params.distance;
  }

  public getAnimationTime(): number {
    return Math.round(this.distance / this.velocity);
  }

  public async startEngine(): Promise<void> {
    try {
      const params = await engineService.startEngine(this.id);
      this.setDriveParams(params);
      this.isStarted = true;
    } catch (error) {
      this.velocity = 0;
      this.distance = 0;
      this.isStarted = false;
    }
  }

  public async stopEngine(): Promise<void> {
    if (!this.isStarted) return;
    await engineService.stopEngine(this.id);
    this.isBroken = false;
    this.isStarted = false;
    this.velocity = 0;
    this.distance = 0;
  }

  public async startDrive(): Promise<void> {
    try {
      if (!this.isStarted) return;
      await engineService.driveEngine(this.id);
      this.time = this.getAnimationTime();
    } catch (err) {
      if (err instanceof ApiError && err.status === 500) this.isBroken = true;
    }
  }

  public async removeCar(): Promise<void> {
    return garageService.deleteCar(this.id);
  }
}
