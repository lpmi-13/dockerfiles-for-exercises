# Golang sending container

A simple container that sends a request to a target endpoint every so often. It's configured via the following environment variables:

-   `TARGET_ENDPOINT`
-   `PROMETHEUS_PORT`
-   `REQUEST_INTERVAL`

This is intended for use with Iximiuz labs challenges. It exposes a metrics endpoint for prometheus to scrape on port 5000.
