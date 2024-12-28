# Monitoring Tool POC

This project is a Proof of Concept (POC) for a monitoring tool that demonstrates observability using OpenTelemetry, Jaeger, Prometheus, and Grafana. It includes a single node service that showcases metrics, tracing, and logging capabilities.

## Overview

The monitoring tool POC is designed to help developers understand and implement observability in their applications. It leverages the following technologies:

- **OpenTelemetry**: For collecting and exporting telemetry data (metrics, traces, and logs).
- **Jaeger**: For distributed tracing and performance monitoring.
- **Prometheus**: For metrics collection and alerting.
- **Grafana**: For visualizing metrics and logs.

## Components

1. **Node Service**: A simple Node.js service that generates telemetry data.
2. **OpenTelemetry**: Integrated into the Node service to collect and export data.
3. **Jaeger**: Used to visualize and analyze traces.
4. **Prometheus**: Collects metrics from the Node service.
5. **Grafana**: Provides dashboards for visualizing metrics and logs.

## Getting Started

### Prerequisites

- Node.js installed on your machine.
- Docker (optional, for running Jaeger, Prometheus, and Grafana).

### Running the Service and Monitoring Stack

```bash
docker compose up -d
```

### Accessing the Tools

- **Jaeger UI**: [http://localhost:16686](http://localhost:16686)
- **Prometheus UI**: [http://localhost:9090](http://localhost:9090)
- **Grafana UI**: [http://localhost:3000](http://localhost:3000)
