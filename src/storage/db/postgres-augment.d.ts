import postgres from 'postgres';

/**
 * Module augmentation for `postgres`.
 *
 * `TransactionSql` is defined as `Omit<Sql, ...>` which strips the callable
 * (tagged-template) signatures from the interface.  This is a known upstream
 * issue (https://github.com/porsager/postgres/issues/891).
 *
 * We re-declare the two call signatures here so that
 *   `await tr\`SELECT 1\``
 * type-checks correctly.
 */
declare module 'postgres' {
    interface TransactionSql<TTypes extends Record<string, unknown> = {}> {
        <T extends readonly (object | undefined)[]>(
            template: TemplateStringsArray,
            ...parameters: readonly (postgres.ParameterOrFragment<TTypes[keyof TTypes]>)[]
        ): postgres.PendingQuery<T>;

        <T, K extends readonly any[]>(
            first: T,
            ...rest: K
        ): postgres.Helper<T, K>;
    }
}
