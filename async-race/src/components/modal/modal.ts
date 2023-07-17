import './modal.css';
import ElementBuilder from '../../common/elementBuilder';
import BtnBuilder from '../../common/btnBuilder';

export class ModalWindow {
  private modalWindow = new ElementBuilder({ tag: 'div', classNames: 'modal' });

  private modalText = new ElementBuilder({ tag: 'p', classNames: 'modal__text' });

  private background = new ElementBuilder({ tag: 'div', classNames: 'background' });

  constructor(parent: HTMLElement) {
    const btnClose = new BtnBuilder('btn modal__btn', 'Close');
    btnClose.addClick(this.hideModal);
    this.background.el.addEventListener('click', this.hideModal);
    this.modalWindow.addInner(this.modalText, btnClose);
    parent.append(this.background.createElement());
    parent.append(this.modalWindow.createElement());
  }

  public setText(text: string): void {
    this.modalText.addText(text);
  }

  private hideModal = (): void => {
    this.modalWindow.el.classList.remove('modal_active');
    this.background.el.classList.remove('background_active');
  };

  public showModal(): void {
    this.modalWindow.addClass('modal_active');
    this.background.addClass('background_active');
  }
}
