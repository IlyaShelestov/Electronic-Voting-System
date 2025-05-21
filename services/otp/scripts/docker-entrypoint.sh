#!/usr/bin/env sh
until nc -z "$DB_HOST" "$DB_PORT"; do
  echo "Waiting for postgres at $DB_HOST:$DB_PORT…"
  sleep 1
done

npm run migrate
npm run migrate:populate

exec npm start
