import './car.css';
import colorizeCar from './colorizeCar';
import { GarageCar } from '../../utils/types';
import BtnBuilder from '../../common/btnBuilder';
import ElementBuilder from '../../common/elementBuilder';

const CAR_WIDTH = 150;

export default class CarView {
  public selectBtn = new BtnBuilder('btn car__controls_select', 'Select');

  public removeBtn = new BtnBuilder('btn car__controls_remove', 'Remove');

  public startBtn = new BtnBuilder('btn car__controls_start', 'Start');

  public stopBtn = new BtnBuilder('btn car__controls_stop', 'Stop', true);

  private car = new ElementBuilder({ tag: 'div', classNames: 'car' });

  private carContainer = new ElementBuilder({ tag: 'div', classNames: 'car__container' });

  private carControls = new ElementBuilder({ tag: 'div', classNames: 'car__controls' });

  private road = new ElementBuilder({ tag: 'div', classNames: 'road' });

  private carName = new ElementBuilder({ tag: 'p', classNames: 'car__name' });

  private animationDrive!: Animation;

  constructor(name: GarageCar['name'], color: GarageCar['color']) {
    this.car.el.innerHTML = colorizeCar(color);
    this.setName(name);
    this.carControls.addInner(this.selectBtn, this.removeBtn, this.startBtn, this.stopBtn);
    this.road.addInner(this.car);
    this.carControls.addInner(this.selectBtn, this.removeBtn, this.startBtn, this.stopBtn);
    this.carContainer.addInner(this.carName, this.carControls, this.road);
  }

  public setName(name: GarageCar['name']): void {
    this.carName.addText(name);
  }

  public moveToFinish(time: number): void {
    const length = this.carContainer.el.offsetWidth - CAR_WIDTH;
    const carMove = [{ transform: 'translateX(0)' },
      { transform: `translateX(${length}px)` },
    ];
    this.animationDrive = this.car.el.animate(carMove, { duration: time, iterations: 1, fill: 'forwards' });
  }

  public moveToStart(): void {
    this.car.el.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(0)' }], { duration: 1, iterations: 1, fill: 'forwards' });
  }

  public movePause(): void {
    this.animationDrive.pause();
  }

  public render(parent: HTMLElement): void {
    parent.append(this.carContainer.createElement());
  }
}
