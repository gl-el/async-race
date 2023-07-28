import './winners.css';
import ElementBuilder from '../../common/elementBuilder';
import {
  ICar, IWinner, WinnerSort, OrderSort,
} from '../../utils/types';
import colorizeCar from '../car/colorizeCar';

export class WinnersView {
  public table = new ElementBuilder({ tag: 'div', classNames: 'winners__table' });

  public headerWinCounter = new ElementBuilder({ tag: 'div', text: 'Wins', classNames: 'row__item header__wins' });

  public headerTime = new ElementBuilder({ tag: 'div', text: 'Best time', classNames: 'row__item header__time' });

  private counter = 1;

  public rowsMap: Map<number, ElementBuilder> = new Map();

  public winnersContainer = new ElementBuilder({ tag: 'div', classNames: 'winners' });

  constructor(parent: HTMLElement) {
    const header = new ElementBuilder({ tag: 'div', classNames: 'table__row table__header' });
    const headerNumber = new ElementBuilder({ tag: 'div', text: '№', classNames: 'row__item header__number' });
    const headerCar = new ElementBuilder({ tag: 'div', text: 'Car', classNames: 'row__item header__car' });
    const headerName = new ElementBuilder({ tag: 'div', text: 'Name', classNames: 'row__item header__name' });
    header.addInner(headerNumber, headerCar, headerName, this.headerWinCounter, this.headerTime);
    this.table.addInner(header);
    this.winnersContainer.addInner(this.table);
    parent.append(this.winnersContainer.createElement());
  }

  public render(parent: HTMLElement): void {
    parent.append(this.table.createElement());
  }

  public addRow(winner: ICar, winnerParams: IWinner): void {
    const row = new ElementBuilder({ tag: 'div', classNames: 'table__row' });
    const carNumber = new ElementBuilder({ tag: 'div', text: `${this.counter}`, classNames: 'row__item item__number' });
    const car = new ElementBuilder({ tag: 'div', classNames: 'row__item item_car' });
    car.el.innerHTML = (colorizeCar(winner.color));
    const name = new ElementBuilder({ tag: 'div', text: winner.name, classNames: 'row__item item__name' });
    const winsCounter = new ElementBuilder({ tag: 'div', text: `${winnerParams.wins}`, classNames: 'row__item item__wins' });
    const time = new ElementBuilder({ tag: 'div', text: `${winnerParams.time}`, classNames: 'row__item item__time' });
    row.addInner(carNumber, car, name, winsCounter, time);
    this.counter += 1;
    this.rowsMap.set(winner.id, row);
    this.table.el.append(row.createElement());
  }

  public removeCar(id: number): void {
    if (!this.rowsMap.has(id)) return;
    this.rowsMap.get(id)?.destroy();
    this.rowsMap.delete(id);
  }

  public removeAllCars(): void {
    this.rowsMap.forEach((row) => row.destroy());
    this.rowsMap.clear();
    this.counter = 1;
  }

  public handleSortWins(callback: () => void): void {
    this.headerWinCounter.el.addEventListener('click', callback);
  }

  public handleSortTime(callback: () => void): void {
    this.headerTime.el.addEventListener('click', callback);
  }

  public disableSorting(): void {
    this.headerWinCounter.addClass('header__wins_disabled');
    this.headerTime.addClass('header__time_disabled');
  }

  public enableSorting(): void {
    this.headerWinCounter.removeClass('header__wins_disabled');
    this.headerTime.removeClass('header__time_disabled');
  }

  private removeArrows(): void {
    this.headerTime.removeClass('arrow_asc');
    this.headerTime.removeClass('arrow_desc');
    this.headerWinCounter.removeClass('arrow_asc');
    this.headerWinCounter.removeClass('arrow_desc');
  }

  public addArrow(sorting: WinnerSort, order: OrderSort): void {
    this.removeArrows();
    if (sorting === WinnerSort.wins) {
      if (order === OrderSort.ASC) {
        this.headerWinCounter.addClass('arrow_asc');
      } else {
        this.headerWinCounter.addClass('arrow_desc');
      }
    }
    if (sorting === WinnerSort.time) {
      if (order === OrderSort.DESC) {
        this.headerTime.addClass('arrow_asc');
      } else {
        this.headerTime.addClass('arrow_desc');
      }
    }
  }
}
