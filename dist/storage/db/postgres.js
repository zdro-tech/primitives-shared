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
        get(target, prop, receiver) {
            const targetAny = target;
            if (typeof targetAny[prop] === 'function') {
                return traceQuery(target, prop, receiver);
            }
            if (prop === 'begin') {
                return (...args) => traceTransactionBegin(target, ...args);
            }
            else
                return Reflect.get(target, prop, receiver);
        },
    });
    function traceQuery(target, propKey, receiver) {
        return (...args) => {
            const span = tracer.startSpan('SQL Query');
            try {
                const result = Reflect.apply(target[propKey], receiver, args);
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
    async function traceTransactionBegin(target, options) {
        const span = tracer.startSpan('SQL Transaction');
        try {
            const transactionFunc = async (sql) => {
                const tracedSql = new Proxy(sql, {
                    apply: (target, thisArg, argArray) => traceQuery(target, 'query', sql)(...argArray),
                });
                return tracedSql;
            };
            const result = await target.begin(transactionFunc, options);
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
    }
    return {
        client: rawClient,
        tracedClient,
    };
};
