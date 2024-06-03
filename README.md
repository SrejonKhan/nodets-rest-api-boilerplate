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
