import * as opentelemetry from '@opentelemetry/api';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
import { NodeTracerProvider, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-node';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { Span, SpanStatusCode } from '@opentelemetry/api';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { GoogleAuth } from 'google-auth-library';
import { SocketIoInstrumentation } from '@opentelemetry/instrumentation-socket.io';

const appName: string = process.env.K_SERVICE || 'local';
const appVersion: string = process.env.K_REVISION || 'local';

export const defaultAttributes: opentelemetry.Attributes = {
  [ATTR_SERVICE_NAME]: appName,
  [ATTR_SERVICE_VERSION]: appVersion,
};

export const defaultHook: (span: Span, hookInfo: any) => void = (span, hookInfo) => {
  span.setAttributes(defaultAttributes);
};

const isProduction: boolean = process.env.NODE_ENV === 'production';
const auth = new GoogleAuth({ scopes: 'https://www.googleapis.com/auth/cloud-platform' });

const getSpanProcessors = () => {
  if (isProduction) {
    return [new SimpleSpanProcessor(new OTLPTraceExporter({
      url: 'https://telemetry.googleapis.com/v1/traces',
      headers: async () => Object.fromEntries((await auth.getRequestHeaders()).entries()),
    }))];
  }
  return [];
};

const getResourceAttributes = () => {
  if (isProduction) {
    return { ...defaultAttributes, 'gcp.project_id': auth.getProjectId().catch(() => undefined) };
  }
  return defaultAttributes;
};

export const traceProvider: NodeTracerProvider = new NodeTracerProvider({
  resource: resourceFromAttributes(getResourceAttributes()),
  spanProcessors: getSpanProcessors(),
});

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
