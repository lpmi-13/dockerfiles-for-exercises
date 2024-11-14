package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

// Define metrics
var (
	httpRequestsTotal = prometheus.NewCounterVec(
		prometheus.CounterOpts{
			Name: "http_requests_total",
			Help: "Total number of HTTP requests",
		},
		[]string{"method", "endpoint", "status"},
	)

	httpRequestDuration = prometheus.NewHistogramVec(
		prometheus.HistogramOpts{
			Name:    "http_request_duration_seconds",
			Help:    "HTTP request duration in seconds",
			Buckets: prometheus.DefBuckets,
		},
		[]string{"method", "endpoint"},
	)
)

func init() {
	// Register metrics with Prometheus
	prometheus.MustRegister(httpRequestsTotal)
	prometheus.MustRegister(httpRequestDuration)
}

func main() {
	// Create Gin router for main application
	r := gin.Default()

	// Define a route for the root path
	r.GET("/", func(c *gin.Context) {
		// Record metrics
		httpRequestsTotal.WithLabelValues("GET", "/", "200").Inc()
		c.String(200, "OK")
	})

	// Create a new HTTP server for metrics
	go func() {
		metricsRouter := gin.New()
		metricsRouter.GET("/metrics", gin.WrapH(promhttp.Handler()))

		log.Printf("Starting metrics server on :5000")
		if err := metricsRouter.Run(":5000"); err != nil {
			log.Fatalf("Error starting metrics server: %v", err)
		}
	}()

	// Start main application
	log.Printf("Starting application server on :8000")
	if err := r.Run(":8000"); err != nil {
		log.Fatalf("Error starting application server: %v", err)
	}
}
