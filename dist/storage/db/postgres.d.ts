import { Sql } from 'postgres';
export interface ClientConfig {
    host: string;
    user: string;
    password: string;
    database?: string;
}
export interface TracedClient {
    client: Sql<any>;
    tracedClient: Sql<any>;
}
export declare const createClient: ({ host, user, password, database }: ClientConfig) => Promise<TracedClient>;
//# sourceMappingURL=postgres.d.ts.map