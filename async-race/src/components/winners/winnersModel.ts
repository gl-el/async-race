import { IWinner, WinnerSort, OrderSort } from '../../utils/types';
import { winnerService } from '../../api/winner';

const MAX_CARS_PER_WINNERS_PAGE = 10;

export class WinnersModel {
  public total = 0;

  public totalOnPage = 0;

  public winnersOnPage: IWinner[] = [];

  public page = 1;

  public order = OrderSort.ASC;

  public sort = WinnerSort.time;

  public async getWinners(): Promise<void> {
    try {
      const { winners, totalCount } = await winnerService.getWinners(
        this.page,
        this.sort,
        this.order,
      );
      this.total = totalCount;
      winners.forEach((winner) => {
        if (this.winnersOnPage.find((winnerSaved) => winnerSaved.id === winner.id)
          || this.totalOnPage >= MAX_CARS_PER_WINNERS_PAGE) return;
        this.winnersOnPage.push(winner);
        this.totalOnPage += 1;
      });
    } catch (err) {
      console.log(err);
    }
  }
}
