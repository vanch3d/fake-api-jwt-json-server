# JSONServer + JWT Auth

A Fake REST API using json-server with JWT authentication. 

- Implemented End-points: login,register

- Changing the content of the payload to match the following pattern: 

```json
{
  "iat": 1581308591,
  "exp": 1581308591,
  "jti": "e82f4dd9-7bad-4d5b-94b6-2fd8acea5da0",
  "aud": [
    "my.audience.id"
  ],
  "user_name": "my.user.name",
  "scope": [
    "my.scope.one",
    "my.scope.two"
  ],
  "authorities": [
    "my.first.user.type",
    "my.second.user.type"
  ],
  "client_id": "my.client.id"
}
```

## Install

```bash
$ npm install
$ npm run start-auth
```

Might need to run
```
npm audit fix
```

## How to login/register?

You can login/register by sending a POST request to

```
POST http://localhost:8000/auth/login
POST http://localhost:8000/auth/register
```
with the following data 

```
{
  "email": "nilson@email.com",
  "password":"nilson"
}
```

You should receive an access token with the following format 

```
{
   "access_token": "<ACCESS_TOKEN>"
}
```


You should send this authorization with any request to the protected endpoints

```
Authorization: Bearer <ACCESS_TOKEN>
```

Check out these tutorials:

- [Mocking a REST API Back-End for Your Angular App with JSON-Server and Faker.js](https://www.techiediaries.com/angular-mock-backend)
- [Building a Fake and JWT Protected REST API with json-server](https://www.techiediaries.com/fake-api-jwt-json-server)
- [Angular 9 Tutorial: Build an Example App with Angular CLI, Angular Router, HttpClient & Angular Material](https://www.shabang.dev/angular-tutorial-build-an-example-app-with-angular-cli-router-httpclient-and-angular-material/)



