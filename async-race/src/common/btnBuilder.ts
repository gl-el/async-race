import ElementBuilder from './elementBuilder';

export default class BtnBuilder extends ElementBuilder {
  constructor(className: string, text: string, isDisabled = false) {
    super({
      tag: 'button',
      classNames: className,
      text: `${text}`,
    });
    if (isDisabled) {
      this.disable();
    } else {
      this.enable();
    }
  }

  public addClick(callback: () => void): void {
    this.el.addEventListener('click', callback);
  }

  public addAsyncClick(callback: () => Promise<void>, options = {}): void {
    this.el.addEventListener('click', () => {
      callback().catch(() => {});
    }, options);
  }

  public disable(): void {
    (this.el as HTMLButtonElement).disabled = true;
  }

  public enable(): void {
    (this.el as HTMLButtonElement).disabled = false;
  }
}
