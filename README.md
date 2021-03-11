# This app tracks Covid-19 cases

I'm using React-Leaflet to render the map and an API to add graph data into the app.

## What I use for the app:
- Material UI
- Firebase Google
- Numeral
- React-Chart
- Leaflet.js
- React-Leaflet
    * an update in the react-leaflet library changes how we set state and re-render the immutable MapContainer. Used the provided useMap() hook from react-leaflet for it to function.

    * https://react-leaflet.js.org/docs/example-layers-control for how to fill circle colors with the new update

## API
- disease.sh