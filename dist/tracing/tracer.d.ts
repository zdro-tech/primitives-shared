import * as opentelemetry from '@opentelemetry/api';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { Span } from '@opentelemetry/api';
export declare const defaultAttributes: opentelemetry.Attributes;
export declare const defaultHook: (span: Span, hookInfo: any) => void;
export declare const traceProvider: NodeTracerProvider;
export declare const tracer: opentelemetry.Tracer;
export declare const withTracing: <T, Args extends any[]>(fn: (...args: Args) => Promise<T>) => (...args: Args) => Promise<T>;
//# sourceMappingURL=tracer.d.ts.map