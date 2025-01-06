# Otel Server With Clickhouse

This is a dockerfile to be used in a remote environment connecting to a clickhouse collector. The idea is to instrument a bunch of the endpoints to send back structured logs and see what o11y 2.0 looks like in practice.

## Local dev

You can run it locally via `docker compose up --build` if you want to tweak some of the aspects of this configuration.

## Running in k3s

Because you can't build a local container with k3s, we need to push an image to pull. You can do this yourself, or just use `leskis/otel-express-app`, which is built off of the local Dockerfile.

You can run the script `setup.sh` to apply the manifests in the expected order. When you're done, just run the `teardown.sh` script.

> NB: still a work in progress

Once the k3s cluster is up and running, you can manually build and run the superset container via the following commands:

```sh
docker build -t superset -f Dockerfile.superset .
docker run -it --rm -p 8088:8088 --name supe --add-host clickhouse:IP_ADDRESS_FROM_CLICKHOUSE_SVC superset
```

This still uses the host networking and the direct service endpoint from the k3s cluster because that actual pod isn't running yet in the cluster.
