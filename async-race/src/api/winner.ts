import { BaseService } from './base-service';
import { BASE_URL } from '../utils/consts';
import {
  IWinner, Endpoints, WinnerSort, OrderSort,
} from '../utils/types';
import { ApiError } from './errors';

export const WinnerStatusCode = {
  OK: 200,
  CREATED: 201,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

const MAX_CARS_PER_PAGE = 10;

class WinnerService extends BaseService {
  public async getWinners(
    pageNumber: number,
    sort: WinnerSort,
    order: OrderSort = OrderSort.ASC,
  ): Promise<{ winners: IWinner[], totalCount: number }> {
    const url = this.makeUrl(Endpoints.Winners, {
      _page: pageNumber, _limit: MAX_CARS_PER_PAGE, _sort: sort, _order: order,
    });

    const response = await fetch(url);

    if (!response.ok) {
      throw new ApiError(response.status, response.statusText);
    }
    const winners = await response.json().then((res: IWinner[]) => res);

    const totalCount = Number(response.headers.get('X-Total-Count'));

    return { winners, totalCount };
  }

  public async getWinner(id: number): Promise<IWinner> {
    const url = this.makeUrl(`${Endpoints.Winners}/${id}`);

    const winner = await fetch(url).then((response) => {
      if (response.status !== WinnerStatusCode.OK) {
        throw new ApiError(response.status, response.statusText);
      }
      return response.json().then((responseJson: IWinner) => responseJson);
    });

    return winner;
  }

  public async createWinner(winner: IWinner): Promise<IWinner> {
    const url = this.makeUrl(`${Endpoints.Winners}`);

    const createdCar = await fetch(url, { method: 'POST', body: JSON.stringify(winner), headers: { 'Content-Type': 'application/json' } }).then((response) => {
      if (response.status !== WinnerStatusCode.CREATED) {
        throw new ApiError(response.status, response.statusText);
      }
      return response.json().then((responseJson: IWinner) => responseJson);
    });

    return createdCar;
  }

  public async deleteCar(id: number): Promise<void> {
    const url = this.makeUrl(`${Endpoints.Winners}/${id}`);

    await fetch(url, { method: 'DELETE' }).then((response) => {
      if (response.status !== WinnerStatusCode.OK) {
        throw new ApiError(response.status, response.statusText);
      }
    });
  }

  public async updateWinner({ id, wins, time }: IWinner): Promise<IWinner> {
    const url = this.makeUrl(`${Endpoints.Winners}/${id}`);

    const updatedWinner = await fetch(url, { method: 'PUT', body: JSON.stringify({ wins, time }), headers: { 'Content-Type': 'application/json' } }).then((response) => {
      if (response.status !== WinnerStatusCode.OK) {
        throw new ApiError(response.status, response.statusText);
      }
      return response.json().then((responseJson: IWinner) => responseJson);
    });

    return updatedWinner;
  }
}

export const winnerService = new WinnerService(BASE_URL);
