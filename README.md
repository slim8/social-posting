# Media posting Project
## Laravel + Angular

Requirements

- PHP 8.0
- NodeJs 14.0
- Composer

## First Install

Clone project from git

Install the dependencies and devDependencies and start the server.

```sh
npm install
npm run start:migrate (must be only the first time : Migrate database and Upload required data)
npm run deploy
```
npm run deploy (pull from git + clear Laravel cache + composer install + npm install [Laravel + Angular] + Migrate database)

## Angular FrontEnd Path Source files

```sh
resources/frontend
```

## ENV

Add file .env

Update database connexion on env file

To setup JWT: 
```sh
JWT_SECRET_KEY={secret_key}
JWT_ISSUER_CLAIMER={issuer_claimer}
JWT_AUDIANCE_KLAIMER={audiance_claimer}
JWT_EXPIRATION_TIME={expiration_time_(int seconds)}
JWT_HASH_ALGORITHME={hash_algorithme (eg. HS512)}
```

## Migrate Database

(Update on databse structure OR upload database)


```sh
npm run migrate
```

## Build Project on PROD / Deploy

```sh
npm run deploy
```
## Generate Swagger Documentation

```sh
npm run start:swagger
open /request-docs
```

## Build Angular Language Env

```sh
ng build --configuration="dev,de"
```
