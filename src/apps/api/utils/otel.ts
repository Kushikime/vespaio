import {Resource} from '@opentelemetry/resources';
import {ATTR_SERVICE_NAME} from '@opentelemetry/semantic-conventions';
import {diag, DiagConsoleLogger, DiagLogLevel} from '@opentelemetry/api';
import {OTLPTraceExporter} from '@opentelemetry/exporter-trace-otlp-http';
const {
  BasicTracerProvider,
  ConsoleSpanExporter,
  SimpleSpanProcessor,
} = require('@opentelemetry/sdk-trace-base');
// const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-proto');

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

const exporter = new OTLPTraceExporter({
  url: 'http://docker.host.internal:4318/v1/traces',
  // headers: {
  //   foo: 'bar'
  // },
});

const provider = new BasicTracerProvider({
  resource: new Resource({[ATTR_SERVICE_NAME]: 'vespa-api'}),
  spanProcessors: [
    new SimpleSpanProcessor(exporter),
    new SimpleSpanProcessor(new ConsoleSpanExporter()),
  ],
});
provider.register();

// Create a span. A span must be closed.
// const parentSpan = tracer.startSpan('main');
// for (let i = 0; i < 10; i += 1) {
//   doWork(parentSpan);
// }
// Be sure to end the span.
// parentSpan.end();`
