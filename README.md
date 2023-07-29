# Async race [Deploy](https://gl-el.github.io/async-race/)

### Educational project at [RSschool Stage 2](https://rs.school/) 

SPA to practise working with server and async methods.

Before checking the deploy, you have to:
- clone [the repo with server](https://github.com/mikhama/async-race-api), 
- install dependencies: ```$ npm install```
- start server: ```$ npm start```.

Implemented:
- [x] Typescript usage;
- [x] Fetch with different HTTP methods for creating/updating/deleting/sorting cars;
- [x] Error catching;
- [x] Usage of ESLint air-bnb-base & airbnb-typescript configs;

![image](https://github.com/gl-el/async-race/assets/118758307/5f324ec9-6144-4e75-b0b4-d392b305f0c5)

Functional requirements:
- [x] User can create a new car, delete or update a selected one. When car is updated or deleted on the garage page, it also updates or deletes from the winners page;
- [x] User can generate 100 cars with random name and color;
- [x] There is pagination on the "Garage" view (7 cars per one page).
- [x] When user clicks to the engine start button -> UI is waiting for car's velocity answer -> animate the car and makes another request to drive. In case api returned 500 error car animation should be stopped;
- [x] When user clicks to the engine stop button -> UI is waiting for answer for stopping engine -> car returned to it's initial place;
- [x] Start engine button is disabled in case car is already in driving mode. As well as stop engine button is disabled when car is on it's initial place;
- [x] When user clicks race button all the cars on the current page start driving.
- [x] When user clicks reset button all the cars return to it's initial places.
- [x] After some car finishes first user should see the message contains car's name that shows which one has won.
- [x] After some car wins it is displayed at the "Winners view" table.
- [x] User can sort cars by wins number and by best time (ASC, DESC).
- [x] There is pagination (10 winners per one page).
