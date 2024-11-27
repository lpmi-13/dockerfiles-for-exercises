# Otel Server With Clickhouse

This is a dockerfile to be used in a remote environment connecting to a clickhouse collector. The idea is to instrument a bunch of the endpoints to send back structured logs and see what o11y 2.0 looks like in practice.

## Local dev

You can run it locally via `docker compose up --build` if you want to tweak some of the aspects of this configuration.
