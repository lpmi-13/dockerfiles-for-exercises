# Golang receiving container

This is a very simple golang service that receives connections and responds with a 200. It's main purpose is to simulate a workload on a kubernetes cluster to make sure that various operations (eg, a cluster version upgrade) don't interrupt the workload itself.

It's designed to run on the Iximiuz Labs platform.
