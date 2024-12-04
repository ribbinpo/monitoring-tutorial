import sdk from "./instrumentation";

import express from "express";
import "dotenv/config";
import prometheus from "prom-client";
import { trace } from '@opentelemetry/api';

const tracer = trace.getTracer('node-service-tracer');

const collectDefaultMetrics = prometheus.collectDefaultMetrics;
const register = new prometheus.Registry();

const oddCounter = new prometheus.Counter({
  name: "node_service_odd_counter",
  help: "Counts the number of odd requests",
  registers: [register],
});

const evenCounter = new prometheus.Counter({
  name: "node_service_even_counter",
  help: "Counts the number of even requests",
  registers: [register],
});

collectDefaultMetrics({
  prefix: "node_service_",
  labels: { app: "node-service" },
  gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5],
  register,
});

const app = express();

app.get("/", (req, res) => {
  res.send("Hello from Node.js!");
});

app.get("/random/:time", (req, res) => {
  const span = tracer.startSpan('node-service-span');
  const time = parseInt(req.params.time);
  let _evenCounter = 0;
  let _oddCounter = 0;
  for (let i = 0; i < time; i++) {
    const random = Math.floor(Math.random() * 100);
    if (random % 2 === 0) {
      evenCounter.inc();
      _evenCounter++;
    } else {
      oddCounter.inc();
      _oddCounter++;
    }
  }
  span.end();
  res.json({
    message: `Random number generated: ${time} \n Odd: ${_oddCounter} \n Even: ${_evenCounter}`,
  });
});

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

const port = process.env.PORT || 4000;

const server = app.listen(port, () => {
  console.log(`Node.js app listening on port ${port}`);
});

const shutdown = () => {
  console.log("Received shutdown signal, closing server...");
  sdk
    .shutdown()
    .then(() => console.log("OpenTelemetry shut down"))
    .catch((err) => console.error("Error shutting down OpenTelemetry", err))
    .finally(() => process.exit(0));
  server.close((err) => {
    if (err) {
      console.error("Error during shutdown:", err);
      process.exit(1);
    }
    console.log("Server closed gracefully");
    process.exit(0);
  });
};

// Listen for termination signals
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
