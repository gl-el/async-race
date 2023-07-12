export interface Params {
  tag: string,
  classNames?: string,
  text?: string,
  attr?: { [key: string]: string },
}

export interface Car {
  name: string,
  color: string,
}

export interface GarageCar extends Car {
  id: number,
}

export interface GarageCarsPerPage {
  total: number,
  cars: GarageCar[],
}

export type EngineStatus = 'started' | 'stopped' | 'drive';

export interface DriveParams {
  velocity: number,
  distance: number,
}

export interface DriveStatus {
  success: boolean
}
