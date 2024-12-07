kubectl apply -f express-app-deployment.yaml
kubectl apply -f express-app-service.yaml

kubectl apply -f clickhouse-data-persistentvolumeclaim.yaml
kubectl apply -f clickhouse-deployment.yaml
kubectl apply -f clickhouse-service.yaml

kubectl apply -f otel-collector-deployment.yaml
kubectl apply -f otel-collector-service.yaml
kubectl apply -f otel-collector-cm0-configmap.yaml
