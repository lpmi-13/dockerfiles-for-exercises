FROM golang:1.22-alpine AS builder

WORKDIR /app

COPY . /app

RUN CGO_ENABLED=0 go build -ldflags "-w -s" -o /app/server

FROM alpine:latest

COPY --from=builder /app/server /server

CMD ["/server"]
