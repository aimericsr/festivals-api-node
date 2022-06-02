import { Pool } from 'pg';

enum POSTGRES_USERS {
    ADMIN,
    BASIC,
    NO_AUTH,
}

interface ConnectionCredentials {
    host: string,
    port: number,
    database: string
    user: string
    password: string
    connectionTimeoutMillis: number,
    idleTimeoutMillis: number,
    max: number,
    allowExitOnIdle: boolean
}

interface PoolConnection {
    PG_USER: POSTGRES_USERS,
    POOL: Pool
}

export {
    POSTGRES_USERS,
    ConnectionCredentials,
    PoolConnection
}