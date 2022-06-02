declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'DEV' | 'PROD',
            PORT: number,
            PGHOST: string,
            PGPORT: number,
            PGDATABASE: string,
      
            PG_USER_ADMIN: string,
            PG_PASSWORD_ADMIN: string,
            PG_CONNECTION_TO_ADMIN: number,
            PG_IDLE_TO_ADMIN: number,
            PG_MAX_ADMIN: number,
            PG_EXIT_ON_IDLE_ADMIN: boolean,

            PG_USER_BASIC: string,
            PG_PASSWORD_BASIC: string,
            PG_CONNECTION_TO_BASIC: number,
            PG_IDLE_TO_BASIC: number,
            PG_MAX_BASIC: number,
            PG_EXIT_ON_IDLE_BASIC: boolean,

            PG_USER_NO_AUTH: string,
            PG_PASSWORD_NO_AUTH: string,
            PG_CONNECTION_TO_NO_AUTH: number,
            PG_IDLE_TO_NO_AUTH: number,
            PG_MAX_NO_AUTH: number,
            PG_EXIT_ON_IDLE_NO_AUTH: boolean,
            
            ACCESS_TOKEN_SECRET: string,
            REFRESH_TOKEN_SECRET: string,
            ACCESS_TOKEN_EXPIRATION: string,
            REFRESH_TOKEN_EXPIRATION: string,
        }
    }
}

export {}

