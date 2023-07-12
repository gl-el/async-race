import { DriveParams, GarageCar } from '../../utils/types';

const API_URL = 'http://localhost:3000';

export default class CarModel {
  private velocity!: number;

  private distance!: number;

  constructor(private name: GarageCar['name'], private color: GarageCar['color'], private id: GarageCar['id'], private started = false) {}

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

  public setDriveParams(params: DriveParams): void {
    this.velocity = params.velocity;
    this.distance = params.distance;
  }

  public getAnimationTime(): number {
    return Math.round(this.distance / this.velocity);
  }

  public startEngine(): void {
    this.started = true;
  }

  public stopEngine(): void {
    this.started = false;
  }

  public startDrive(): void {
    if (!this.started) throw new Error('Start engine first!');
  }
}
