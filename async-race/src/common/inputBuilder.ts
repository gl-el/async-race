import ElementBuilder from './elementBuilder';

export default class InputBuilder extends ElementBuilder {
  constructor(inputType: string, className: string, isDisabled = false) {
    super({
      tag: 'input',
      classNames: className,
      attr: { type: inputType },
    });
    if (isDisabled) {
      this.disable();
    } else {
      this.enable();
    }
  }

  public setValue = (value: string): void => {
    (this.el as HTMLInputElement).value = value;
  };

  public getValue(): string {
    return (this.el as HTMLInputElement).value;
  }

  public handleChange(callback: () => void):void {
    this.el.addEventListener('change', callback);
  }

  public disable(): void {
    (this.el as HTMLInputElement).disabled = true;
  }

  public enable(): void {
    (this.el as HTMLInputElement).disabled = false;
  }
}
