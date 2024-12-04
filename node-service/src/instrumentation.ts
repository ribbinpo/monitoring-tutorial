/*instrumentation.ts*/
import { NodeSDK } from "@opentelemetry/sdk-node";
import { ConsoleSpanExporter } from "@opentelemetry/sdk-trace-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import {
  PeriodicExportingMetricReader,
  ConsoleMetricExporter,
  MeterProvider,
} from "@opentelemetry/sdk-metrics";
import { diag, DiagConsoleLogger, DiagLogLevel } from "@opentelemetry/api";

import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
// import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
import { PrometheusExporter } from "@opentelemetry/exporter-prometheus";

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

// for console exporter
// const traceExporterConsole = new ConsoleSpanExporter();
const traceExporter = new OTLPTraceExporter({
  url: "http://jaeger:4318/v1/traces", // Replace with your OTLP collector endpoint
  headers: {},
});
// for console exporter
const metricReaderConsole = new PeriodicExportingMetricReader({
  exporter: new ConsoleMetricExporter(), // console exporter for demo purposes
});
// const metricReader = new PeriodicExportingMetricReader({
//   exporter: new OTLPMetricExporter({
//     url: "http://localhost:4318/v1/metrics", // Replace with your OTLP collector endpoint
//     headers: {},
//   }),
// });
const prometheusExporter = new PrometheusExporter({
  // host: 'localhost',
  endpoint: '/metrics',
  port: 9464,
}, () => {
  console.log("prometheusExporter start");
});

const sdk = new NodeSDK({
  serviceName: "node-service",
  traceExporter,
  metricReader: prometheusExporter,
  instrumentations: [getNodeAutoInstrumentations()],
});

export default sdk;

sdk.start();

// process.on("SIGTERM", () => {
//   sdk
//     .shutdown()
//     .then(() => console.log("OpenTelemetry shut down"))
//     .catch((err) => console.error("Error shutting down OpenTelemetry", err))
//     .finally(() => process.exit(0));
// });
