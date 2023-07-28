import './garage.css';
import BtnBuilder from '../../common/btnBuilder';
import ElementBuilder from '../../common/elementBuilder';
import InputBuilder from '../../common/inputBuilder';
import { ModalWindow } from '../modal/modal';

const DEFAULT_COLOR = '#000000';

export class GarageView {
  public garageContainer = new ElementBuilder({ tag: 'div', classNames: 'garage' });

  public newCarInput = new InputBuilder('text', 'options__input-text text-new');

  public colorPickerNew = new InputBuilder('color', 'options__color color-new');

  public createBtn = new BtnBuilder('btn options__btn btn-create', 'Create');

  public updateCarInput = new InputBuilder('text', 'options__input-text text-upd', true);

  public colorPickerUpdate = new InputBuilder('color', 'options__color color-upd', true);

  public updateBtn = new BtnBuilder('btn options__btn btn-update', 'Update', true);

  public raceBtn = new BtnBuilder('btn options__btn btn-race', 'Race');

  public resetBtn = new BtnBuilder('btn options__btn btn-reset', 'Reset');

  public genBtn = new BtnBuilder('btn options__btn btn-gen', 'Generate 100 cars');

  public carsContainer = new ElementBuilder({ tag: 'div', classNames: 'cars' });

  public modal!: ModalWindow;

  constructor(parent: HTMLElement) {
    const garageControls = new ElementBuilder({ tag: 'div', classNames: 'garage__options' });
    this.modal = new ModalWindow(this.garageContainer.el);
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
    this.garageContainer.addInner(garageControls, this.carsContainer);
    parent.append(this.garageContainer.createElement());
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
        // no default
      }
    });
  }

  public clearCreateInputs(): void {
    this.newCarInput.setValue('');
    this.colorPickerNew.setValue(DEFAULT_COLOR);
  }

  public resetUpdate(): void {
    this.updateCarInput.setValue('');
    this.colorPickerUpdate.setValue(DEFAULT_COLOR);
    this.updateCarInput.disable();
    this.colorPickerUpdate.disable();
    this.updateBtn.disable();
  }
}
