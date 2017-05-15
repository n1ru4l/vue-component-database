# Vue Component Database

![Preview Image](./preview.jpg)

A web application for sharing and editing vue single-file components.

Features:
- GitHub Authentication
- Create and edit Vue Single File Components
- Write ES2015 Code

# Setup

## Manual

Copy `.env.example` to `.env` and adjust the environment variables.

```bash
yarn install
```

```bash
yarn run build
yarn run migrate:db
yarn run start
```

## Docker

Soon :)

# Development Stuff


## Running the tests


Execute tests with:

```bash
yarn test
```

## Contributing

1. Fork this repo!

2. Clone your fork!

3. Install dependencies

```bash
yarn install
```

4. Generate the graphql schema `graphql.schema.json` file.

```bash
yarn run generate:schema
```

5. Implement feature!

6. Write Tests! (`yarn test`)

7. Lint the code (`yarn run lint`)

48. Create a pull request :)
