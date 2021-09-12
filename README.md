# travel-app

Project demonstrating Webpack, service workers, jest testing and calls to various API to plan travel dates and temperature.

## Setup

- Download repo
- Create a username at `http://www.geonames.org/export/web-services.html`
- Create API keys at `https://www.weatherbit.io/account/create` and `https://pixabay.com/api/docs/`
- Create new file `.env` in your root directory
- Enter your User Name / API keys in the `.env` file
    - GEONAMES_USERNAME={your_GEONAMES_USERNAME}
    - WEATHERBIT_API_KEY={your WEATHERBIT_API_KEY}
    - PIXABAY_API_KEY={your PIXABAY_API_KEY}
- Open terminal at root folder
- Run `npm install`
- Run `npm run build-prod` to generate a production build contained in the `dist` folder
- Run `npm start` to start a server to host the build
- Open browswer and navigate to `http://localhost:8081/`

## Interacting with the app

- Select a travel date, location and add trip. If location can be found, data pertaining to the trip will be displayed to the DOM.
- Save or Cancel the proposed trip.
- Add additional trips, or remove trips already created.