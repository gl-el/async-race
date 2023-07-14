import { BaseService } from './base-service';
import { BASE_URL } from '../utils/consts';
import { ICar, Endpoints } from '../utils/types';
import { ApiError } from './errors';

export const GarageStatusCode = {
  OK: 200,
  CREATED: 201,
  NOT_FOUND: 404,
};

export const MAX_CARS_PER_PAGE = 7;

class GarageService extends BaseService {
  public async getCars(pageNumber: number): Promise<{ cars: ICar[], totalCount: number }> {
    const url = this.makeUrl(Endpoints.Garage, { _page: pageNumber, _limit: MAX_CARS_PER_PAGE });

    const response = await fetch(url);

    if (!response.ok) {
      throw new ApiError(response.status, response.statusText);
    }
    const cars = await response.json().then((res: ICar[]) => res);

    const totalCount = Number(response.headers.get('X-Total-Count'));

    return { cars, totalCount };
  }

  public async getCar(id: number): Promise<ICar> {
    const url = this.makeUrl(`${Endpoints.Garage}/${id}`);

    const car = await fetch(url).then((response) => {
      if (response.status !== GarageStatusCode.OK) {
        throw new ApiError(response.status, response.statusText);
      }
      return response.json().then((responseJson: ICar) => responseJson);
    });

    return car;
  }

  public async createCar(car: Omit<ICar, 'id'>): Promise<ICar> {
    const url = this.makeUrl(Endpoints.Garage);

    const createdCar = await fetch(url, { method: 'POST', body: JSON.stringify(car), headers: { 'Content-Type': 'application/json' } }).then((response) => {
      if (response.status !== GarageStatusCode.CREATED) {
        throw new ApiError(response.status, response.statusText);
      }
      return response.json().then((responseJson: ICar) => responseJson);
    });

    return createdCar;
  }

  public async deleteCar(id: number): Promise<void> {
    const url = this.makeUrl(`${Endpoints.Garage}/${id}`);

    await fetch(url, { method: 'DELETE' }).then((response) => {
      if (response.status !== GarageStatusCode.OK) {
        throw new ApiError(response.status, response.statusText);
      }
    });
  }

  public async updateCar({ id, name, color }: ICar): Promise<ICar> {
    const url = this.makeUrl(`${Endpoints.Garage}/${id}`);

    const updatedCar = await fetch(url, { method: 'PUT', body: JSON.stringify({ name, color }), headers: { 'Content-Type': 'application/json' } }).then((response) => {
      if (response.status !== GarageStatusCode.OK) {
        throw new ApiError(response.status, response.statusText);
      }
      return response.json().then((responseJson: ICar) => responseJson);
    });

    return updatedCar;
  }
}

export const garageService = new GarageService(BASE_URL);
