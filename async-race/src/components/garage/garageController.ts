import { ICar } from '../../utils/types';
import { GarageView } from './garageView';
import { garageService, MAX_CARS_PER_PAGE } from '../../api/garage';
import CarController from '../car/carController';
import { GarageModel } from './garageModel';
import { buildName } from '../../utils/buildName';
import { brandNames, modelNames } from '../../assets/carNames';
import { getRandomColor } from '../../utils/buildRandomColor';

export class GarageController {
  private view!: GarageView;

  private model = new GarageModel();

  private page = 1;

  constructor(parent: HTMLElement) {
    this.view = new GarageView(parent);
    this.view.updateBtn.addAsyncClick(this.update);
    this.view.raceBtn.addAsyncClick(this.raceAllCars);
    this.view.resetBtn.addAsyncClick(this.resetAllCars);
    this.view.createBtn.addAsyncClick(this.addCar);
    this.view.genBtn.addAsyncClick(this.addHundredCars);
    this.view.btnNext.addAsyncClick(this.pageNext);
    this.view.btnPrev.addAsyncClick(this.pagePrev);
  }

  public init = async (): Promise<void> => {
    try {
      const { cars, totalCount } = await garageService.getCars(this.page);
      cars.forEach((car) => {
        if (this.model.carsOnPage.find((carOnPage) => carOnPage.getCarId() === car.id)
          || this.model.totalOnPage >= MAX_CARS_PER_PAGE) {
          return;
        }
        const createdCar = new CarController(car);
        createdCar.createCar(this.view.garageContainer.el);
        this.setCallback(createdCar);
        this.model.carsOnPage.push(createdCar);
        this.model.totalOnPage += 1;
      });
      this.model.total = totalCount;
      this.view.setCarsCounter(totalCount);
      this.updatePagination();
    } catch (error) {
      console.log(error);
    }
  };

  public removeCarsFromPage(): void {
    this.model.carsOnPage.forEach((car) => {
      car.destroyCar();
    });
    this.model.carsOnPage = [];
    this.model.totalOnPage = 0;
    this.model.isRace = false;
    this.view.raceBtn.enable();
    this.view.resetUpdate();
  }

  public pageNext = async (): Promise<void> => {
    this.removeCarsFromPage();
    this.page += 1;
    await this.init();
  };

  public pagePrev = async (): Promise<void> => {
    if (this.page === 1) return;
    this.removeCarsFromPage();
    this.page -= 1;
    await this.init();
  };

  public updatePagination(): void {
    this.view.setPagesCounter(this.page);
    if (this.model.total > this.model.totalOnPage) this.view.turnOnBtns(['next']);
    if (this.model.total <= this.page * MAX_CARS_PER_PAGE) this.view.turnOffBtns(['next']);
    if (this.page > 1) this.view.turnOnBtns(['prev']);
    if (this.page === 1) this.view.turnOffBtns(['prev']);
  }

  public setCallback(car: CarController): void {
    car.getSelectBtn().addEventListener('click', () => {
      this.startUpdate(car.getCarParams(), car);
    });
    car.getRemoveBtn().addEventListener('click', () => {
      this.deleteCar(car).catch(() => { });
    });
  }

  public deleteCar = async (car: CarController): Promise<void> => {
    await car.removeCar();
    const index = this.model.carsOnPage.indexOf(car);
    this.model.carsOnPage.splice(index, 1);
    this.model.totalOnPage -= 1;
    await this.init();
    if (this.model.totalOnPage === 0) await this.pagePrev();
  };

  public startUpdate = (params: ICar, car: CarController): void => {
    this.model.setSelectedCar(car);
    this.view.setDataForUpdate(params.name, params.color);
  };

  public update = async (): Promise<void> => {
    try {
      const newName = this.view.updateCarInput.getValue();
      const newColor = this.view.colorPickerUpdate.getValue();
      await this.model.update(newName, newColor);
      this.view.resetUpdate();
      this.view.turnOnBtns(['reset']);
    } catch (err) {
      console.log('failed to update');
    }
  };

  public raceAllCars = async (): Promise<void> => {
    try {
      this.view.turnOffBtns(['race', 'reset', 'create', 'gen', 'next', 'prev']);
      this.model.isRace = true;
      await this.model.resetAllCars();
      await this.model.raceAllCars();
      this.showWinner();
      this.view.turnOnBtns(['reset', 'create', 'gen']);
      this.updatePagination();
    } catch (err) {
      this.updatePagination();
      this.view.turnOnBtns(['race', 'reset', 'create', 'gen', 'next', 'prev']);
    }
  };

  public addCar = async (): Promise<void> => {
    let newName = this.view.newCarInput.getValue();
    if (newName === '') {
      newName = buildName(brandNames, modelNames);
    }
    const newColor = this.view.colorPickerNew.getValue();
    await garageService.createCar({ name: newName, color: newColor });
    this.view.clearCreateInputs();
    await this.init();
  };

  public addHundredCars = async (): Promise<void> => {
    const carsPerClick = 100;
    const promises = [];
    for (let i = 0; i < carsPerClick; i += 1) {
      const newName = buildName(brandNames, modelNames);
      const newColor = getRandomColor();
      promises.push(garageService.createCar({ name: newName, color: newColor }));
    }
    this.view.turnOffBtns(['gen']);
    await Promise.allSettled(promises);
    await this.init();
    this.view.turnOnBtns(['gen']);
  };

  public resetAllCars = async (): Promise<void> => {
    this.model.isRace = false;
    await this.model.resetAllCars();
    this.view.raceBtn.enable();
  };

  public showWinner(): void {
    if (this.model.winner) {
      const name = this.model.winner.getCarName();
      const time = this.model.winner.getTime();
      this.view.modal.setText(`${name} wins in ${time} sec`);
      this.view.modal.showModal();
    }
  }
}
