import postgres from 'postgres';
import { SpanStatusCode } from '@opentelemetry/api';
import { tracer } from '../../tracing/tracer.js';
export const createClient = async ({ host, user, password, database }) => {
    const rawClient = postgres({
        host,
        user,
        password,
        database,
        transform: {
            column: { to: postgres.fromCamel, from: postgres.toCamel },
            undefined: null,
        },
    });
    const tracedClient = new Proxy(rawClient, {
        apply(target, thisArg, args) {
            const span = tracer.startSpan('SQL Query');
            try {
                const result = Reflect.apply(target, thisArg, args);
                span.setStatus({ code: SpanStatusCode.OK });
                return result;
            }
            catch (error) {
                span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
                throw error;
            }
            finally {
                span.end();
            }
        },
        get(target, prop, receiver) {
            const targetAny = target;
            if (typeof targetAny[prop] === 'function') {
                return (...args) => {
                    const span = tracer.startSpan('SQL Query');
                    try {
                        const result = Reflect.apply(targetAny[prop], receiver, args);
                        span.setStatus({ code: SpanStatusCode.OK });
                        return result;
                    }
                    catch (error) {
                        span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
                        throw error;
                    }
                    finally {
                        span.end();
                    }
                };
            }
            return Reflect.get(target, prop, receiver);
        },
    });
    return {
        client: rawClient,
        tracedClient,
    };
};
