# Express-Typescript API Boilerplate

**A great Express boilerplate architectured to build large scale REST apis with Express and Typescript**

## Characteristics

- General
  * Mongo DB with Mongoose as ODM
  * Docker based
  * Cache response with Redis as temporal DB
  * Dotenv and configuration module
  * Custom ApiError extende from native js error object
  * Custom error handler based on the NodeJs best practices
  * Base Service and Controller clases to avoid code repetition. These clases are configurables.

- Performance
  * Compression middleware
  * Total async code

- Security
  * Mongo sanitize to avoid Mongo directives injection
  * Security headers with helmet
  * Cors enabled
  * Input validation (Check the type and restrict obly to allowed fields)
  * Authentication based on JWT of short live duration with refresh token schema.
  * Authentication and Authorization middlewares
  * Request limiter middleware

- Test
  * tests template with jets


## Usage

#### Instalation

```bash
git clone git@github.com:emanuelosva/express-typescript-boilerplate.git <your-app-name>

cd <your-app-name>

cp .env.example .env.production
cp .env.example .env.development

yarn or npm install
```

#### Run the project

First fill all the env vars needed in the .env files

```bash

# --- Docker ---
yarn docker:build
yarn docker:dev

# or
npm run docker:build
npm run docker:dev

# --- In local node ---
yarn dev
```

#### Test

```bash
yarn docker:test

# or

yarn test
```


#### Lint

```bash
yarn lint

# Or

yarn lint:fix
```

## Contributing

* If you want to add some feature only fork this repository and send a pull request.

## Author

Emanuel Osorio <emanuelosva@gmail.com>
