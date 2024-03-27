# HDFZ App
Canary Deployments using Istio

# Build Images
## Login to ghcr.io
```
docker login ghcr.io
```

## Build Images
```
docker build -t ghcr.io/jameelkaisar/hdfz-app/frontend:v1 frontend-v1
docker build -t ghcr.io/jameelkaisar/hdfz-app/frontend:v2 frontend-v2
docker build -t ghcr.io/jameelkaisar/hdfz-app/backend:v1 backend-v1
docker build -t ghcr.io/jameelkaisar/hdfz-app/backend:v2 backend-v2
```

## Push Images
```
docker push ghcr.io/jameelkaisar/hdfz-app/frontend:v1
docker push ghcr.io/jameelkaisar/hdfz-app/frontend:v2
docker push ghcr.io/jameelkaisar/hdfz-app/backend:v1
docker push ghcr.io/jameelkaisar/hdfz-app/backend:v2
```

# Setup Istio
## Download istioctl
```
curl -L https://istio.io/downloadIstio | ISTIO_VERSION=1.21.0 sh -
```

## Install Istio
- Normal Method
```
istioctl install --revision=hdfz --set profile=demo -y
```

- Operator Method
```
# Install Istio Operator
istioctl operator init --revision=hdfz

# Create Istio Control Plane
kubectl apply -f - <<EOF
apiVersion: install.istio.io/v1alpha1
kind: IstioOperator
metadata:
  namespace: istio-system
  name: hdfz-istiocontrolplane
spec:
  revision: hdfz
  profile: demo
EOF
```

## Create hdfz-app Namespace
```
kubectl create namespace hdfz-app
```

## Enable Sidecar Injection
```
kubectl label namespace hdfz-app istio-injection=enabled
```

# Deploy Initial Version
## Deploy HDFZ App
```
kubectl apply -f hdfz-app-init.yaml
```

## Access HDFZ App
- Enable Port Forwarding
```
kubectl port-forward service/istio-ingressgateway 8080:80 -n istio-system
```

- Open http://localhost:8080 in Web Browser.

- Test HDFZ App
```
# Test Frontend Server
curl -sI http://localhost:8080 | grep -i version

# Test Backend Server
curl -sI http://localhost:8080/api/balance | grep -i version
```

# Deploy v2 for Backend
## Deploy HDFZ App
```
kubectl apply -f hdfz-app-backend.yaml
```

## Access HDFZ App
- Enable Port Forwarding
```
kubectl port-forward service/istio-ingressgateway 8080:80 -n istio-system
```

- Open http://localhost:8080 in Web Browser.

- Test Backend Server
```
curl -sI http://localhost:8080/api/balance | grep -i version
```

# Deploy v2 for Frontend
## Deploy HDFZ App
```
kubectl apply -f hdfz-app-frontend.yaml
```

## Access HDFZ App
- Enable Port Forwarding
```
kubectl port-forward service/istio-ingressgateway 8080:80 -n istio-system
```

- Open http://localhost:8080 in Web Browser to See Sticky Sessions in Action. Try Deleting user-session Cookie to Switch Versions.

- Test Frontend Server
```
# Test Frontend Cookie
curl -sI http://localhost:8080 | grep -i -e version -e set-cookie
curl -sI -H 'Cookie: user-session="ededac18288479d2";' http://localhost:8080 | grep -i -e version -e set-cookie

# Test Dark Deployment
curl -sI -H "x-user: dev" http://localhost:8080 | grep -i version
```

# Observability Addons
## Kiali
### Install Kiali
```
kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.21/samples/addons/kiali.yaml
```

### Access Kiali
```
istioctl dashboard kiali
```

## Prometheus
### Install Prometheus
```
kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.21/samples/addons/prometheus.yaml
```

### Access Prometheus
```
istioctl dashboard prometheus
```
```
# Example Query
  istio_request_duration_milliseconds_sum{destination_service="hdfz-backend.hdfz-app.svc.cluster.local",response_code="200",response_flags="-",version=~"v1|v2"}
/
  istio_request_duration_milliseconds_count{destination_service="hdfz-backend.hdfz-app.svc.cluster.local",response_code="200",response_flags="-",version=~"v1|v2"}
```

## Grafana
### Install Grafana
```
kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.21/samples/addons/grafana.yaml
```

### Access Grafana
```
istioctl dashboard grafana
```
```
# Example Dashboard

# Query
  istio_request_duration_milliseconds_sum{destination_service="hdfz-backend.hdfz-app.svc.cluster.local",response_code="200",response_flags="-",version=~"v1|v2"}
/
  istio_request_duration_milliseconds_count{destination_service="hdfz-backend.hdfz-app.svc.cluster.local",response_code="200",response_flags="-",version=~"v1|v2"}

# Legend: {{version}}
```

## Jaeger
### Install Jaeger
```
kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.21/samples/addons/jaeger.yaml
```

### Access Jaeger
```
istioctl dashboard jaeger
```

# Cleanup
## Delete Observability Addons
```
# Delete Kiali
kubectl delete -f https://raw.githubusercontent.com/istio/istio/release-1.21/samples/addons/kiali.yaml

# Delete Prometheus
kubectl delete -f https://raw.githubusercontent.com/istio/istio/release-1.21/samples/addons/prometheus.yaml

# Delete Grafana
kubectl delete -f https://raw.githubusercontent.com/istio/istio/release-1.21/samples/addons/grafana.yaml

# Delete Jaeger
kubectl delete -f https://raw.githubusercontent.com/istio/istio/release-1.21/samples/addons/jaeger.yaml
```

## Delete HDFZ App
```
# Delete HDFZ App
kubectl delete -f hdfz-app-frontend.yaml

# Disable Sidecar Injection
kubectl label namespace hdfz-app istio-injection-

# Delete hdfz-app Namespace
kubectl delete namespace hdfz-app
```

## Delete Istio
- Normal Method
```
istioctl uninstall --revision=hdfz -y
kubectl delete namespace istio-system
```

- Operator Method
```
# Delete Istio Control Plane
kubectl delete istiooperators.install.istio.io -n istio-system hdfz-istiocontrolplane

# Delete Istio Operator
istioctl operator remove --revision=hdfz -y

# Delete Namespaces
kubectl delete namespace istio-system istio-operator
```
