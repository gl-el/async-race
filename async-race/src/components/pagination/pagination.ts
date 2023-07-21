import './pagination.css';
import ElementBuilder from '../../common/elementBuilder';
import BtnBuilder from '../../common/btnBuilder';

export class Pagination {
  public btnNext = new BtnBuilder('btn pagination__btn btn-next', '>', true);

  public btnPrev = new BtnBuilder('btn pagination__btn btn-prev', '<', true);

  public pageCounter = new ElementBuilder({ tag: 'div', classNames: 'pagination__counter' });

  private paginationContainer = new ElementBuilder({ tag: 'div', classNames: 'pagination' });

  private carsCounter = new ElementBuilder({ tag: 'div', classNames: 'options__counter' });

  private max = 0;

  constructor(max: number) {
    this.max = max;
    this.paginationContainer.addInner(
      this.btnPrev,
      this.pageCounter,
      this.btnNext,
      this.carsCounter,
    );
  }

  public render(parent: HTMLElement): void {
    parent.before(this.paginationContainer.createElement());
  }

  public updatePagination(total: number, totalOnPage: number, page: number): void {
    this.setCounters(page, total);
    if (total > totalOnPage) this.btnNext.enable();
    if (total <= page * this.max) this.btnNext.disable();
    if (page > 1) this.btnPrev.enable();
    if (page === 1) this.btnPrev.disable();
  }

  private setCounters(page: number, total: number): void {
    this.pageCounter.addText(`Page: ${page}`);
    this.carsCounter.addText(`Total cars: ${total}`);
  }

  public toggleBtns(status: 'enable' | 'disable'): void {
    switch (status) {
      case 'enable':
        this.btnNext.enable();
        this.btnPrev.enable();
        break;
      case 'disable':
        this.btnNext.disable();
        this.btnPrev.disable();
        break;
      // no default
    }
  }

  public next(callback: () => void): void {
    this.btnNext.addClick(callback);
  }

  public prev(callback: () => void): void {
    this.btnPrev.addClick(callback);
  }
}
