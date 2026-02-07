import * as opentelemetry from '@opentelemetry/api';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
import { NodeTracerProvider, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-node';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { SpanStatusCode } from '@opentelemetry/api';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { TraceExporter } from '@google-cloud/opentelemetry-cloud-trace-exporter';
import { SocketIoInstrumentation } from '@opentelemetry/instrumentation-socket.io';
const appName = process.env.K_SERVICE || 'local';
const appVersion = process.env.K_REVISION || 'local';
export const defaultAttributes = {
    [ATTR_SERVICE_NAME]: appName,
    [ATTR_SERVICE_VERSION]: appVersion,
};
export const defaultHook = (span, hookInfo) => {
    span.setAttributes(defaultAttributes);
};
const getSpanProcessors = () => {
    if (process.env.NODE_ENV === 'production') {
        return [new SimpleSpanProcessor(new TraceExporter())];
    }
    return [];
};
export const traceProvider = new NodeTracerProvider({
    resource: resourceFromAttributes(defaultAttributes),
    spanProcessors: getSpanProcessors(),
});
traceProvider.register();
registerInstrumentations({
    instrumentations: [
        new ExpressInstrumentation({ requestHook: defaultHook }),
        new SocketIoInstrumentation({ emitHook: defaultHook }),
    ],
});
export const tracer = opentelemetry.trace.getTracer(appName, appVersion);
export const withTracing = (fn) => {
    return async (...args) => {
        const span = tracer.startSpan(fn.name, { attributes: defaultAttributes });
        try {
            const result = await fn(...args);
            return result;
        }
        catch (error) {
            span.recordException(error);
            span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
            throw error;
        }
        finally {
            span.end();
        }
    };
};
