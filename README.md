# Dockerfiles for Exercises

Since there are no longer any Docker images you can just pull that run django/rails/etc by default, I needed a repo where I could build and push my own. This is mostly so I can use pre-built images in micromaterials platforms like https://labs.iximiuz.com/.

## golang

published as `leskis/default-go`

This is a very basic webserver image using gin that responds with a 200 to the root path, and also has curl installed so we can test network connectivity heading out from this container.
