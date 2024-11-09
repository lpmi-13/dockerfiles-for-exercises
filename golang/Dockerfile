FROM golang:1.22-alpine AS builder

WORKDIR /app

COPY . /app

RUN CGO_ENABLED=0 go build -ldflags "-w -s" -o /app/server

FROM alpine:latest

# We need this so we can test out network connectivity
RUN apk add --no-cache curl

COPY --from=builder /app/server /server

EXPOSE 8000

CMD ["/server"]
