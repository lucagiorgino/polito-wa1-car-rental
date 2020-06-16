# Exam #1: "Noleggio veicoli"
## Student: s280074 GIORGINO LUCA 

## React client application routes

- Route `/`: page content and purpose
- Route `/something/:param`: page content and purpose, param specification
- ...

## REST API server

- POST `/login`
  - request parameters and request body content
  - response body content
- GET `/api/something`
  - request parameters
  - response body content
- POST `/api/something`
  - request parameters and request body content
  - response body content
- ...

## Server database

- Table `Users` - contains: username(PK), hash
- Table `Vehicles` - contains: license plate, category, brand, model
- Table `Rentals` - contains: license plate(PK,FK), start date(PK), end date, user(FK)

## Main React Components

- `ListOfSomething` (in `List.js`): component purpose and main functionality
- `GreatButton` (in `GreatButton.js`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)

## Screenshot

![Configurator Screenshot](./img/screenshot.jpg)

## Test users

* dev, enter
* enrico, masala
* luigi, derussis (frequent customer)
* luca, giorgino
* voto, trenta? (frequent customer)
