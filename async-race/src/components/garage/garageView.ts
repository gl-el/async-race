import './garage.css';
import BtnBuilder from '../../common/btnBuilder';
import ElementBuilder from '../../common/elementBuilder';
import InputBuilder from '../../common/inputBuilder';
import { ModalWindow } from '../modal/modal';

export class GarageView {
  public newCarInput = new InputBuilder('text', 'options__input-text text-new');

  public colorPickerNew = new InputBuilder('color', 'options__color color-new');

  public createBtn = new BtnBuilder('options__btn btn-create', 'Create');

  public updateCarInput = new InputBuilder('text', 'options__input-text text-upd', true);

  public colorPickerUpdate = new InputBuilder('color', 'options__color color-upd', true);

  public updateBtn = new BtnBuilder('options__btn btn-update', 'Update', true);

  public raceBtn = new BtnBuilder('options__btn btn-race', 'Race');

  public resetBtn = new BtnBuilder('options__btn btn-reset', 'Reset');

  public genBtn = new BtnBuilder('options__btn btn-gen', 'Generate 100 cars');

  public carsCounter = new ElementBuilder({ tag: 'div', classNames: 'options__counter' });

  public garageContainer = new ElementBuilder({ tag: 'div', classNames: 'cars' });

  public btnNext = new BtnBuilder('pagination__btn btn-next', '>', true);

  public btnPrev = new BtnBuilder('pagination__btn btn-prev', '<', true);

  public pageCounter = new ElementBuilder({ tag: 'div', classNames: 'pagination__counter' });

  public modal!: ModalWindow;

  constructor(parent: HTMLElement) {
    const garage = new ElementBuilder({ tag: 'div', classNames: 'garage' });
    const garageControls = new ElementBuilder({ tag: 'div', classNames: 'garage__options' });
    const paginationContainer = new ElementBuilder({ tag: 'div', classNames: 'pagination' });
    this.modal = new ModalWindow(garage.el);
    garageControls.addInner(
      this.newCarInput,
      this.colorPickerNew,
      this.createBtn,
      this.updateCarInput,
      this.colorPickerUpdate,
      this.updateBtn,
      this.raceBtn,
      this.resetBtn,
      this.genBtn,
    );
    paginationContainer.addInner(this.btnPrev, this.pageCounter, this.btnNext, this.carsCounter);
    garage.addInner(garageControls, paginationContainer, this.garageContainer);
    parent.append(garage.createElement());
  }

  public setDataForUpdate(name: string, color: string): void {
    this.updateCarInput.setValue(name);
    this.colorPickerUpdate.setValue(color);
    this.updateCarInput.enable();
    this.colorPickerUpdate.enable();
    this.updateBtn.enable();
  }

  public turnOffBtns(btnNames: string[]): void {
    btnNames.forEach((btnName) => {
      switch (btnName) {
        case 'create':
          this.createBtn.disable();
          break;
        case 'update':
          this.updateBtn.disable();
          break;
        case 'gen':
          this.genBtn.disable();
          break;
        case 'race':
          this.raceBtn.disable();
          break;
        case 'reset':
          this.resetBtn.disable();
          break;
        case 'next':
          this.btnNext.disable();
          break;
        case 'prev':
          this.btnPrev.disable();
          break;
        // no default
      }
    });
  }

  public turnOnBtns(btnNames: string[]): void {
    btnNames.forEach((btnName) => {
      switch (btnName) {
        case 'create':
          this.createBtn.enable();
          break;
        case 'update':
          this.updateBtn.enable();
          break;
        case 'gen':
          this.genBtn.enable();
          break;
        case 'race':
          this.raceBtn.enable();
          break;
        case 'reset':
          this.resetBtn.enable();
          break;
        case 'next':
          this.btnNext.enable();
          break;
        case 'prev':
          this.btnPrev.enable();
          break;
        // no default
      }
    });
  }

  public clearCreateInputs(): void {
    this.newCarInput.setValue('');
    this.colorPickerNew.setValue('#000000');
  }

  public resetUpdate(): void {
    this.updateCarInput.setValue('');
    this.colorPickerUpdate.setValue('#000000');
    this.updateCarInput.disable();
    this.colorPickerUpdate.disable();
    this.updateBtn.disable();
  }

  public setCarsCounter(counter: number): void {
    this.carsCounter.addText(`Total cars: ${counter}`);
  }

  public setPagesCounter(counter: number): void {
    this.pageCounter.addText(`Page: ${counter}`);
  }
}
