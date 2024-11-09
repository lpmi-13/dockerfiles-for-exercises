package main

import (
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// Define a route for the root path
	r.GET("/", func(c *gin.Context) {
		c.String(200, "OK")
	})

	r.Run(":8000")
}
