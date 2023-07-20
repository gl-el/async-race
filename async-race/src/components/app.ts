import { GarageController } from './garage/garageController';
import { Winners } from './winners/winners';
import BtnBuilder from '../common/btnBuilder';
import ElementBuilder from '../common/elementBuilder';

export class App {
  private nav = new ElementBuilder({ tag: 'nav', classNames: 'pages-nav' });

  private btnToWinners = new BtnBuilder('btn nav__btn', 'To Winners');

  private btnToGarage = new BtnBuilder('btn nav__btn', 'To garage', true);

  public init(): void {
    this.nav.addInner(this.btnToGarage, this.btnToWinners);
    document.body.append(this.nav.createElement());
    const garage = new GarageController(document.body);
    const winners = new Winners(document.body);
    garage.init().catch(() => {});
    garage.show();
    const showWinner = winners.show;
    const hideWinner = winners.hide;
    const showGarage = garage.show;
    const hideGarage = garage.hide;
    this.btnToWinners.addClick(() => {
      hideGarage();
      winners.init().catch(() => { });
      showWinner();
      this.btnToGarage.enable();
      this.btnToWinners.disable();
    });

    this.btnToGarage.addClick(() => {
      hideWinner();
      showGarage();
      this.btnToGarage.disable();
      this.btnToWinners.enable();
    });
  }
}
