import { BaseService } from './base-service';
import { BASE_URL } from '../utils/consts';
import {
  DriveParams,
  DriveStatus,
  Endpoints,
  EngineStatus,
} from '../utils/types';
import { ApiError } from './errors';

export const EngineStatusCode = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
};

class EngineService extends BaseService {
  public async startEngine(carId: number): Promise<{ velocity: number, distance: number }> {
    const url = this.makeUrl(Endpoints.Engine, { id: carId, status: EngineStatus.Start });

    const driveParams = await fetch(url, { method: 'PATCH' }).then((response) => {
      if (response.status !== EngineStatusCode.OK) {
        throw new ApiError(response.status, response.statusText);
      }
      return response.json().then((responseJson: DriveParams) => responseJson);
    });

    return driveParams;
  }

  public async stopEngine(carId: number): Promise<void> {
    const url = this.makeUrl(Endpoints.Engine, { id: carId, status: EngineStatus.Stop });

    await fetch(url, { method: 'PATCH' }).then((response) => {
      if (response.status !== EngineStatusCode.OK) {
        throw new ApiError(response.status, response.statusText);
      }
    });
  }

  public async driveEngine(carId: number): Promise<DriveStatus> {
    const url = this.makeUrl(Endpoints.Engine, { id: carId, status: EngineStatus.Drive });

    const driveStatus = await fetch(url, { method: 'PATCH' }).then((response) => {
      if (response.status !== EngineStatusCode.OK) {
        throw new ApiError(response.status, response.statusText);
      }
      return response.json().then((responseJSON: DriveStatus) => responseJSON);
    });

    return driveStatus;
  }
}

export const engineService = new EngineService(BASE_URL);
