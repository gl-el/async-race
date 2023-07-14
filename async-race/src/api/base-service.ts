import { IQueries } from '../utils/types';

export abstract class BaseService {
  constructor(private baseUrl: string = '') {}

  public makeUrl(endpoint: string, options: IQueries = {}): string {
    let url = `${this.baseUrl}${endpoint}?`;

    Object.keys(options).forEach((key) => {
      url += `${key}=${options[key]}&`;
    });

    return url.slice(0, -1);
  }
}
