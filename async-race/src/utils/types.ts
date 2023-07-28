export interface Params {
  tag: string,
  classNames?: string,
  text?: string,
  attr?: { [key: string]: string },
}

export interface ICar {
  name: string,
  color: string,
  id: number,
}

export interface IWinner {
  id: number,
  wins: number,
  time: number,
}

export enum EngineStatus { Start = 'started', Stop = 'stopped', Drive = 'drive' }

export interface DriveParams {
  velocity: number,
  distance: number,
}

export interface DriveStatus {
  success: boolean
}

export interface IQueries {
  [query: string]: number | string;
}

export enum Endpoints { Garage = '/garage', Engine = '/engine', Winners = '/winners' }

export enum WinnerSort { id = 'id', wins = 'wins', time = 'time' }

export enum OrderSort { ASC = 'ASC', DESC = 'DESC' }

export enum PageDirection { NEXT = 'next', PREV = 'prev' }
