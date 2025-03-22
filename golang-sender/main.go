package main

import (
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

var (
	// Prometheus metrics
	httpRequestsTotal = promauto.NewCounterVec(
		prometheus.CounterOpts{
			Name: "requests_to_receiver",
			Help: "Total number of HTTP requests",
		},
		[]string{"endpoint", "status_code"},
	)

	httpRequestDuration = promauto.NewHistogramVec(
		prometheus.HistogramOpts{
			Name:    "http_request_duration_seconds",
			Help:    "Duration of HTTP requests",
			Buckets: prometheus.DefBuckets,
		},
		[]string{"endpoint"},
	)
)

func main() {
	endpoint := os.Getenv("TARGET_ENDPOINT")
	if endpoint == "" {
		log.Fatal("TARGET_ENDPOINT environment variable must be set")
	}

	prometheusPort := os.Getenv("PROMETHEUS_PORT")
	if prometheusPort == "" {
		log.Fatal("PROMETHEUS_PORT environment variable must be set")
	}

	requestIntervalStr := os.Getenv("REQUEST_INTERVAL")
	if requestIntervalStr == "" {
		log.Fatal("REQUEST_INTERVAL environment variable must be set")
	}

	var requestInterval int

	requestInterval, err := strconv.Atoi(requestIntervalStr)
	if err != nil {
		log.Fatalf("requestInterval %v not correct", requestInterval)
	}

	// Start periodic HTTP request
	go func() {
		for {
			makeHTTPRequest(endpoint)
			time.Sleep(time.Duration(requestInterval) * time.Millisecond)
		}
	}()

	// Expose Prometheus metrics endpoint
	http.Handle("/metrics", promhttp.Handler())
	log.Printf("Starting metrics server on :%s", prometheusPort)
	log.Fatal(http.ListenAndServe(":"+prometheusPort, nil))
}

func makeHTTPRequest(endpoint string) {
	// Start timer for request duration
	start := time.Now()

	// Send HTTP request
	resp, err := http.Get(endpoint)
	if err != nil {
		log.Printf("Error making request to %s: %v", endpoint, err)

		// Record failed request metric
		httpRequestsTotal.WithLabelValues(endpoint, "error").Inc()
		return
	}
	defer resp.Body.Close()

	// Calculate request duration
	duration := time.Since(start)

	// Convert status code to string
	statusCode := strconv.Itoa(resp.StatusCode)

	// Record metrics
	httpRequestsTotal.WithLabelValues(endpoint, statusCode).Inc()
	httpRequestDuration.WithLabelValues(endpoint).Observe(duration.Seconds())

	log.Printf("Request to %s completed with status %d", endpoint, resp.StatusCode)
}
