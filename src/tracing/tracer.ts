import * as opentelemetry from '@opentelemetry/api';
import { Resource } from '@opentelemetry/resources';
import { SEMRESATTRS_SERVICE_NAME, SEMRESATTRS_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
import { NodeTracerProvider, NoopSpanProcessor, SimpleSpanProcessor, SpanProcessor } from '@opentelemetry/sdk-trace-node';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { Span, SpanStatusCode } from '@opentelemetry/api';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { TraceExporter } from '@google-cloud/opentelemetry-cloud-trace-exporter';
import { SocketIoInstrumentation } from '@opentelemetry/instrumentation-socket.io';

const appName: string = process.env.K_SERVICE || 'local';
const appVersion: string = process.env.K_REVISION || 'local';

export const defaultAttributes: opentelemetry.Attributes = {
  [SEMRESATTRS_SERVICE_NAME]: appName,
  [SEMRESATTRS_SERVICE_VERSION]: appVersion,
};

export const defaultHook: (span: Span, hookInfo: any) => void = (span, hookInfo) => {
  span.setAttributes(defaultAttributes);
};

export const traceProvider: NodeTracerProvider = new NodeTracerProvider({
  resource: new Resource(defaultAttributes),
});

const getSpanProcessor = (): SpanProcessor => {
  if (process.env.NODE_ENV === 'production') {
    return new SimpleSpanProcessor(new TraceExporter());
  }
  return new NoopSpanProcessor();
};

traceProvider.addSpanProcessor(getSpanProcessor());
traceProvider.register();

registerInstrumentations({
  instrumentations: [
    new ExpressInstrumentation({ requestHook: defaultHook }),
    new SocketIoInstrumentation({ emitHook: defaultHook }),
  ],
});

export const tracer: opentelemetry.Tracer = opentelemetry.trace.getTracer(appName, appVersion);

export const withTracing = <T, Args extends any[]>(fn: (...args: Args) => Promise<T>): (...args: Args) => Promise<T> => {
  return async (...args: Args): Promise<T> => {
    const span: Span = tracer.startSpan(fn.name, { attributes: defaultAttributes });
    try {
      const result: T = await fn(...args);
      return result;
    } catch (error: any) {
      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
      throw error;
    } finally {
      span.end();
    }
  };
}