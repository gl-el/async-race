import { garageService } from '../../api/garage';
import { WinnersModel } from './winnersModel';
import { WinnersView } from './winnersView';
import {
  ICar, WinnerSort, OrderSort, PageDirection,
} from '../../utils/types';
import { Pagination } from '../pagination/pagination';

const MAX_CARS_PER_WINNERS_PAGE = 10;

export class Winners {
  private view!: WinnersView;

  private model = new WinnersModel();

  private pagination = new Pagination(MAX_CARS_PER_WINNERS_PAGE);

  constructor(parent: HTMLElement) {
    this.view = new WinnersView(parent);
    this.view.handleSortWins(() => this.sort(WinnerSort.wins));
    this.view.handleSortTime(() => this.sort(WinnerSort.time));
    this.pagination.render(this.view.table.el);
    this.pagination.next(() => { this.changePage(PageDirection.NEXT); });
    this.pagination.prev(() => { this.changePage(PageDirection.PREV); });
  }

  public init = async (): Promise<void> => {
    try {
      await this.model.getWinners();
      const promises: Promise<ICar>[] = [];
      this.model.winnersOnPage.forEach((winner) => {
        promises.push(garageService.getCar(winner.id).then((value) => value));
      });
      const responses = await Promise.allSettled(promises);
      responses.forEach((resp, index) => {
        if (resp.status === 'rejected') return;
        this.view.addRow(resp.value, this.model.winnersOnPage[index]);
      });
      this.pagination.updatePagination(this.model.total, this.model.totalOnPage, this.model.page);
    } catch (error) {
      console.log(error);
    }
  };

  private sort = (sorting: WinnerSort): void => {
    if (this.model.sort !== sorting) {
      this.model.order = OrderSort.ASC;
      this.model.sort = sorting;
    } else {
      this.model.order = this.model.order === OrderSort.ASC ? OrderSort.DESC : OrderSort.ASC;
    }
    this.view.addArrow(sorting, this.model.order);
    this.updateTable();
  };

  private changePage(direction: PageDirection): void {
    this.pagination.toggleBtns('disable');
    switch (direction) {
      case PageDirection.NEXT:
        this.model.page += 1;
        break;
      case PageDirection.PREV:
        if (this.model.page === 1) return;
        this.model.page -= 1;
        break;
      // no default
    }
    this.updateTable();
  }

  private updateTable(): void {
    this.view.disableSorting();
    this.model.winnersOnPage = [];
    this.model.totalOnPage = 0;
    this.view.table.addClass('winners__table_hide');
    this.view.table.el.addEventListener('transitionend', () => {
      this.view.removeAllCars();
      this.init().catch(() => {});
      this.view.table.removeClass('winners__table_hide');
      this.view.enableSorting();
    }, { once: true });
  }

  public hide = (): void => {
    this.view.disableSorting();
    this.view.removeAllCars();
    this.model.winnersOnPage = [];
    this.model.totalOnPage = 0;
    this.view.winnersContainer.removeClass('winners_active');
  };

  public show = (): void => {
    this.view.winnersContainer.addClass('winners_active');
    this.view.enableSorting();
  };
}
