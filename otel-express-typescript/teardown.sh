for resource in deploy svc cm pvc; do
    kubectl delete $resource --all
done;

