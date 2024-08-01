# NodeTs Rest API Boilerplate

A REST API based Backend (ExpressJs) Boilerplate. Suitable for both Monolith and Microservice application. It utilizes Asymmetric JWT Authentication, that is suitable for any cases (condition applies).

The Readme isn't complete properly, yet. There are some works need to be polished, specially documention and some scripts to automate the process of bootstrapping. If you are too tech savvy to deep dive into a codebase of stranger, you are good to go for now, haha.

Features or Technologies, whatever you say:

- NodeTs
- Express
- PrismaORM
- SQL
- Zod Schema
- RabbitMQ
- Logger (Winston)
- Logstash Support (Elastic Stack not implemented)
- Swagger Docs (Auto Generation)
- Docker, Docker Compose
- CI/CD (Upcoming)
- You are not stricted with non-sense styling rules, uses Prettier.

## Services

Available service(s) when ran with `npm run docker:dev`:

| Service       | Port | URL                          |
| ------------- | ---- | ---------------------------- |
| API V1        | 2222 | http://localhost:2222/api/v1 |
| Swagger       | 8080 | http://localhost:8080        |
| Prisma Studio | 5555 | http://localhost:5555        |

## Commands

`npm run dev`: Run the App for developement environment, Postgres must be running on port 5432 beforehand. Otherwise, it will fail.

`npm run docker:dev`: Run the App in Docker Container. No need to run any DB or install deps. Docker will automatically handle that. Volumes are set properly for hot reload.

`npm run generate-swagger`: Generate `docs/api/openapi-docs.yml`, with no `HOST` specified.

`npm run generate-swagger:docker`: Generate `docs/api/openapi-docs.yml`, with `HOST=http://localhost:2222` specified. Use this command when running the app with docker and want to update swagger file.

`npm run db-push`: Run `primsa db push` to push the Prisma schema state to the database.

## How to Run?

- Duplicate `.env.example` and rename to `.env`.
- Update `.env` file with relevate values. If you are a maintainer, please contact to get developer env values.
- Run `npm run docker:dev` in your terminal. Make sure you have Docker installed locally.
- If you want to develop locally, make sure to run `npm i` and `npx prisma generate`.
