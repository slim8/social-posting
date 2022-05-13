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
npm run start:build
```
npm run start:build (pull from git + clear Laravel cache + composer install + npm install [Laravel + Angular])

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

(Update on databse structure OR upload database) [This can delete your data] => TO BE FIXED


```sh
npm run start:migrate
```
## Build Project on DEV

```sh
npm run start:dev
```

## Build Project on PROD

```sh
npm run start:build
```