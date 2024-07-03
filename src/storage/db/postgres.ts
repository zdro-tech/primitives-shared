import postgres, { Sql } from 'postgres';
import { SpanStatusCode } from '@opentelemetry/api';
import { tracer } from '../../tracing/tracer.js';

export interface ClientConfig {
    host: string;
    user: string;
    password: string;
    database?: string;
}

export interface TracedClient {
    client: Sql<any>;
    tracedClient: Sql<any>
}

export const createClient = async ({ host, user, password, database }: ClientConfig): Promise<TracedClient> => {
    const rawClient: Sql<any> = postgres({
        host,
        user,
        password,
        database,
        transform: {
            column: { to: postgres.fromCamel, from: postgres.toCamel },
            undefined: null,
        },
    });

    const tracedClient: Sql<any> = new Proxy(rawClient, {
        get(target, prop, receiver) {
            const targetAny = target as any;
            if (typeof targetAny[prop] === 'function') {
                return traceQuery(target, prop, receiver);
            }
            if (prop === 'begin') {
                return (...args: any[]) => traceTransactionBegin(target, ...args);
            } else
                return Reflect.get(target, prop, receiver);
        },
    });


    function traceQuery(target: any, propKey: PropertyKey, receiver: any) {
        return (...args: any[]) => {
            const span = tracer.startSpan('SQL Query');
            try {
                const result = Reflect.apply(target[propKey], receiver, args);
                span.setStatus({ code: SpanStatusCode.OK });
                return result;
            } catch (error: any) {
                span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
                throw error;
            } finally {
                span.end();
            }
        };
    }

    async function traceTransactionBegin(target: any, options?: string) {
        const span = tracer.startSpan('SQL Transaction');
        try {
            const transactionFunc = async (sql: Sql<any>) => {
                const tracedSql = new Proxy(sql, {
                    apply: (target, thisArg, argArray) => traceQuery(target, 'query', sql)(...argArray),
                });
                return tracedSql;
            };
            const result = await target.begin(transactionFunc, options);
            span.setStatus({ code: SpanStatusCode.OK });
            return result;
        } catch (error: any) {
            span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
            throw error;
        } finally {
            span.end();
        }
    }

    return {
        client: rawClient,
        tracedClient,
    };
};