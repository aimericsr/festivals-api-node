import { Pool } from 'pg';
import { ConnectionCredentials, PoolConnection, POSTGRES_USERS } from './DBConnection-interface';
import 'dotenv/config';

export class DBConnectionHandler {
    private poolConnections: PoolConnection[] = [];
    private static instance: DBConnectionHandler;

    public get getAdminPoolConnection(): Pool {
        const connPoolAdmin = this.poolConnections.find(connPool => connPool.PG_USER === POSTGRES_USERS.ADMIN);
        if (connPoolAdmin){
            return connPoolAdmin.POOL;
        }
        throw Error('Unable to connect to the server !');
    }

    public get getBasicPoolConnection(): Pool {
        const connPoolBasic = this.poolConnections.find(connPool => connPool.PG_USER === POSTGRES_USERS.BASIC);
        if (connPoolBasic){
            return connPoolBasic.POOL;
        }
        throw Error('Unable to connect to the server !');
    }

    public get getNoAuthPoolConnection(): Pool {
        const connPoolNoAuth = this.poolConnections.find(connPool => connPool.PG_USER === POSTGRES_USERS.NO_AUTH);
        if (connPoolNoAuth){
            return connPoolNoAuth.POOL;
        }
        throw Error('Unable to connect to the server !');
    }

    constructor(){
        const adminPoolConnection = this.getPoolConnection({
            host : process.env.PGHOST,
            port: process.env.PGPORT,
            database: process.env.PGDATABASE,
            user: process.env.PG_USER_ADMIN,
            password: process.env.PG_PASSWORD_ADMIN,
            connectionTimeoutMillis: process.env.PG_CONNECTION_TO_ADMIN,
            idleTimeoutMillis: process.env.PG_IDLE_TO_ADMIN,
            max: process.env.PG_MAX_ADMIN,
            allowExitOnIdle: process.env.PG_EXIT_ON_IDLE_ADMIN
        })
        const basicPoolConnection = this.getPoolConnection({
            host : process.env.PGHOST,
            port: process.env.PGPORT,
            database: process.env.PGDATABASE,
            user: process.env.PG_USER_BASIC,
            password: process.env.PG_PASSWORD_BASIC,
            connectionTimeoutMillis: process.env.PG_CONNECTION_TO_BASIC,
            idleTimeoutMillis: process.env.PG_IDLE_TO_BASIC,
            max: process.env.PG_MAX_BASIC,
            allowExitOnIdle: process.env.PG_EXIT_ON_IDLE_BASIC
        })
        const noAuthPoolConnection = this.getPoolConnection({
            host : process.env.PGHOST,
            port: process.env.PGPORT,
            database: process.env.PGDATABASE,
            user: process.env.PG_USER_NO_AUTH,
            password: process.env.PG_PASSWORD_NO_AUTH,
            connectionTimeoutMillis: process.env.PG_CONNECTION_TO_NO_AUTH,
            idleTimeoutMillis: process.env.PG_IDLE_TO_NO_AUTH,
            max: process.env.PG_MAX_NO_AUTH,
            allowExitOnIdle: process.env.PG_EXIT_ON_IDLE_NO_AUTH
        })
        this.poolConnections.push({PG_USER: POSTGRES_USERS.ADMIN, POOL: adminPoolConnection});
        this.poolConnections.push({PG_USER: POSTGRES_USERS.BASIC, POOL: basicPoolConnection});
        this.poolConnections.push({PG_USER: POSTGRES_USERS.NO_AUTH, POOL: noAuthPoolConnection});
    }

    public static getInstance(): DBConnectionHandler {
        if (!DBConnectionHandler.instance) {
            DBConnectionHandler.instance = new DBConnectionHandler();
        }
        return DBConnectionHandler.instance;
    }     

    private getPoolConnection(connCred: ConnectionCredentials): Pool {
        return new Pool({
            host: connCred.host,
            port: connCred.port,
            database: connCred.database,
            user: connCred.user,
            password: connCred.password,
            connectionTimeoutMillis: connCred.connectionTimeoutMillis,
            idleTimeoutMillis: connCred.idleTimeoutMillis,
            max: connCred.max,
            allowExitOnIdle: connCred.allowExitOnIdle
        })
    }
}