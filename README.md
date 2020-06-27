# Exam #1: "Noleggio veicoli"
## Student: s280074 GIORGINO LUCA 

## React client application routes

- Route `/`: redirect to login or to protected page (if authenticated)
- Route `/login`: page to handle the login 
- Route `/public/vehicles`: public page
- Route `/protected/rent`: page to choose 
- Route `/protected/history`: this page show the user rentals (past and active)
- Route `/protected/future`:  this page show the user future reservations

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
- Table `Vehicles` - contains: license plate(PK), category, brand, model
- Table `Rentals` - contains: license plate(PK,FK), start date(PK), end date, user(FK)

## Main React Components

-
- `LoginPage` (in `LoginPage.js`): component purpose and main functionality
- `ProtectedPage` (in `ProtectedPage.js`): component purpose and main functionality
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
