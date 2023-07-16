import { GarageController } from './components/garage/garageController';

// eslint-disable-next-line @typescript-eslint/no-misused-promises
document.addEventListener('DOMContentLoaded', async (): Promise<void> => {
  const controls = new GarageController(document.body);
  try {
    await controls.init();
  } catch (err) {
    console.log(err);
  }
});
