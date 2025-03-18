FROM golang:1.22-alpine AS builder

WORKDIR /app

COPY go.mod main.go /app

RUN CGO_ENABLED=0 go build -ldflags="-w -s" -o /app/receiver

RUN go build -o /app/receiver

FROM scratch

WORKDIR /app

COPY --from=BUILDER /app/receiver /app/receiver

EXPOSE 8080

ENTRYPOINT ["/app/receiver"]
