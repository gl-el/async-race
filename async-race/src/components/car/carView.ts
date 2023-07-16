import './car.css';
import colorizeCar from './colorizeCar';
import { ICar } from '../../utils/types';
import BtnBuilder from '../../common/btnBuilder';
import ElementBuilder from '../../common/elementBuilder';
import { CAR_WIDTH } from '../../utils/consts';

export default class CarView {
  public selectBtn = new BtnBuilder('btn options__select', 'Select');

  public removeBtn = new BtnBuilder('btn options__remove', 'Remove');

  public startBtn = new BtnBuilder('btn options__start', 'Start');

  public stopBtn = new BtnBuilder('btn options__stop', 'Stop', true);

  private car = new ElementBuilder({ tag: 'div', classNames: 'car' });

  private carContainer = new ElementBuilder({ tag: 'div', classNames: 'car__container' });

  private carOptions = new ElementBuilder({ tag: 'div', classNames: 'car__options' });

  private road = new ElementBuilder({ tag: 'div', classNames: 'road' });

  private carName = new ElementBuilder({ tag: 'p', classNames: 'options__name' });

  private animationDrive!: Animation;

  constructor(name: ICar['name'], color: ICar['color']) {
    this.car.el.innerHTML = colorizeCar(color);
    this.setName(name);
    this.carOptions.addInner(
      this.selectBtn,
      this.removeBtn,
      this.startBtn,
      this.stopBtn,
      this.carName,
    );
    this.road.addInner(this.car);
    this.carContainer.addInner(this.carOptions, this.road);
  }

  public setName(name: ICar['name']): void {
    this.carName.addText(name);
  }

  public setColor(color: ICar['color']): void {
    this.car.el.innerHTML = colorizeCar(color);
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

  public destroy = (): void => {
    this.carContainer.el.remove();
  };

  public turnOffBtns(btnNames: string[]): void {
    btnNames.forEach((btnName) => {
      switch (btnName) {
        case 'stop':
          this.stopBtn.disable();
          break;
        case 'start':
          this.startBtn.disable();
          break;
        case 'select':
          this.selectBtn.disable();
          break;
        case 'remove':
          this.removeBtn.disable();
          break;
        // no default
      }
    });
  }

  public turnOnBtns(btnNames: string[]): void {
    btnNames.forEach((btnName) => {
      switch (btnName) {
        case 'stop':
          this.stopBtn.enable();
          break;
        case 'start':
          this.startBtn.enable();
          break;
        case 'select':
          this.selectBtn.enable();
          break;
        case 'remove':
          this.removeBtn.enable();
          break;
        // no default
      }
    });
  }
}
