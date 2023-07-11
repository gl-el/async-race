interface Car {
  name: string,
  color: string,
}

interface GarageCar extends Car {
  id: number,
}

type GarageCars = GarageCar[];

interface GarageCarsPerPage {
  total: number,
  cars: GarageCars,
}

type EngineStatus = 'started' | 'stopped' | 'drive';

interface DriveParams {
  velocity: number,
  distance: number,
}

interface DriveStatus {
  success: boolean
}

const API_URL = 'http://localhost:3000';

const MAX_CARS_PER_PAGE = 7;

async function request<T>(url: string, config: RequestInit = {}): Promise<T> {
  const res = await fetch(url, config);
  if (!res.ok) {
    return res.text().then((text) => { throw new Error(text); });
  }
  return await res.json() as T;
}

async function requestWithHeader<T>(
  url: string,
  headerName: string,
): Promise<{ headerData: string, data: T }> {
  const res = await fetch(url);
  if (!res.ok) {
    return res.text().then((text) => { throw new Error(text); });
  }
  return res.json().then((data: T) => ({
    headerData: res.headers.get(headerName) || '',
    data,
  }));
}

async function getCars(): Promise<GarageCars> {
  const cars = await request<GarageCars>(`${API_URL}/garage`);
  return cars;
}

async function getCarsOnPage(page: number): Promise<GarageCarsPerPage> {
  const { headerData, data } = await requestWithHeader<GarageCars>(`${API_URL}/garage?_page=${page}&_limit=${MAX_CARS_PER_PAGE}`, 'X-Total-Count');
  return { total: +headerData, cars: data };
}

async function getCar(id: number): Promise<GarageCar> {
  const car = await request<GarageCar>(`${API_URL}/garage/${id}`);
  return car;
}

async function createCar(name: string, color: string): Promise<Car> {
  const newCar = await request<Car>(`${API_URL}/garage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: `${name}`, color: `${color}` }),
  });
  return newCar;
}

async function deleteCar(id: number): Promise<void> {
  await request<null>(`${API_URL}/garage/${id}`, { method: 'DELETE' });
}

async function updateCar(id: number, name: string, color: string): Promise<GarageCar> {
  const updatedCar = await request<GarageCar>(`${API_URL}/garage/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: `${name}`, color: `${color}` }),
  });
  return updatedCar;
}

async function startStopEngine(id: number, status: EngineStatus): Promise<DriveParams> {
  const carParams = await request<DriveParams>(`${API_URL}/engine?id=${id}&status=${status}`, { method: 'PATCH' });
  return carParams;
}

function isError(err: unknown): err is Error {
  return err instanceof Error;
}

async function driveCar(id: number): Promise<DriveStatus> {
  const status: EngineStatus = 'drive';
  try {
    const carStatus = await request<DriveStatus>(`${API_URL}/engine?id=${id}&status=${status}`, { method: 'PATCH' });
    return carStatus;
  } catch (err) {
    if (isError(err)) {
      console.log(err.message);
    }
    return { success: false };
  }
}
