--création des roles
--role pour tous les utilisateurs liée à une API
CREATE ROLE group_api NOCREATEDB NOCREATEROLE NOREPLICATION NOLOGIN;

--role spécific pour l'api festivals ADMIN
CREATE ROLE api_festivals_user_admin WITH LOGIN
ENCRYPTED PASSWORD 'Im@PIUseR#34'
VALID UNTIL '2023-01-01'
CONNECTION LIMIT 20
IN ROLE group_api;

--role spécific pour l'api festivals BASIC
CREATE ROLE api_festivals_user_basic WITH LOGIN
ENCRYPTED PASSWORD 'Im@BasicPIUseR#34'
VALID UNTIL '2023-01-01'
CONNECTION LIMIT 20
IN ROLE group_api;

--role spécific pour l'api festivals quand la requete ne requiere pas d'auth
CREATE ROLE api_festivals_user_no_auth WITH LOGIN
ENCRYPTED PASSWORD 'NoAuthUs@er3'
VALID UNTIL '2023-01-01'
CONNECTION LIMIT 20
IN ROLE group_api;

--création de la base et des permissions
CREATE DATABASE sql_festivals;

--restriction des droits sauf propriétaires, admin et superuser de la BDD
REVOKE ALL ON DATABASE sql_festivals FROM PUBLIC ;

--autorisation de se connecter à la base de données festivals sans pouvoir ajouter de schéma
GRANT CONNECT ON DATABASE sql_festivals TO api_festivals_user_admin;
GRANT CONNECT ON DATABASE sql_festivals TO api_festivals_user_basic;
GRANT CONNECT ON DATABASE sql_festivals TO api_festivals_user_no_auth;


--se connecter à la base sql_festivals
DROP SCHEMA public ;

--de base les users n'ont aucun droits sur les schéma créer
CREATE SCHEMA mobile_app;
SET SEARCH_PATH = mobile_app;

--set default schema
--de base le user ne peut pas créer de shéma
ALTER USER api_festivals_user_admin SET SEARCH_PATH = mobile_app;
ALTER USER api_festivals_user_basic SET SEARCH_PATH = mobile_app;
ALTER USER api_festivals_user_no_auth SET SEARCH_PATH = mobile_app;

--le user ne peut pas voir les tables présentes dans ce shéma avant cette commande: \dt ne donne aucun résultat
--même si il y a des tables présentes dans le shéma
--voir les tables présents mais pas d'actions possibles sur les tables ou leurs créations
GRANT USAGE ON SCHEMA mobile_app TO api_festivals_user_admin ;
GRANT USAGE ON SCHEMA mobile_app TO api_festivals_user_basic ;
GRANT USAGE ON SCHEMA mobile_app TO api_festivals_user_no_auth ;


--permet les opérations CRUD sur toutes les tables, à relancer lors de l'ajout de nouvelles tables
GRANT SELECT ON ALL TABLES IN SCHEMA mobile_app TO api_festivals_user_admin;
GRANT INSERT ON ALL TABLES IN SCHEMA mobile_app TO api_festivals_user_admin;
GRANT UPDATE ON ALL TABLES IN SCHEMA mobile_app TO api_festivals_user_admin;
--vérifier au niveau de l'api pour refuser de tous supprimer
--ex : delete from event where 1=1;
GRANT DELETE ON ALL TABLES IN SCHEMA mobile_app TO api_festivals_user_admin;

GRANT SELECT ON ALL TABLES IN SCHEMA mobile_app TO api_festivals_user_basic;
GRANT INSERT ON TABLE mobile_app.follow_artist TO api_festivals_user_basic;
GRANT INSERT ON TABLE mobile_app.follow_event TO api_festivals_user_basic;

GRANT SELECT ON TABLE mobile_app.roles TO api_festivals_user_no_auth;

GRANT INSERT ON TABLE mobile_app.users TO api_festivals_user_no_auth;
GRANT SELECT ON TABLE mobile_app.users TO api_festivals_user_no_auth;

GRANT INSERT ON TABLE mobile_app.refresh_token TO api_festivals_user_no_auth;
GRANT SELECT ON TABLE mobile_app.refresh_token TO api_festivals_user_no_auth;
GRANT DELETE ON TABLE mobile_app.refresh_token TO api_festivals_user_no_auth;




--create function
CREATE OR REPLACE FUNCTION function_set_timestamp_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE ROLES
(
    id   UUID UNIQUE        NOT NULL DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
	description VARCHAR(100) UNIQUE NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id)
);

CREATE TABLE USERS
(
    id         UUID UNIQUE        NOT NULL DEFAULT uuid_generate_v4(),
    username   VARCHAR(50) UNIQUE NOT NULL,
    password   VARCHAR(100)       NOT NULL,
    email      VARCHAR(50) UNIQUE NOT NULL,
    role       UUID               NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id),
    FOREIGN KEY (role) REFERENCES ROLES (id)
);

CREATE TABLE ARTISTS
(
    id           UUID               NOT NULL DEFAULT uuid_generate_v4(),
    name         VARCHAR(50) UNIQUE NOT NULL,
    nationality  VARCHAR(50)        NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id)
);

CREATE TABLE MUSIC_STYLES
(
	id           UUID               NOT NULL DEFAULT uuid_generate_v4(),
    styles_name         VARCHAR(50) UNIQUE NOT NULL,
    description  VARCHAR(200)       UNIQUE NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id)
);

CREATE TABLE HAS_STYLE
(
	artist_id  UUID NOT NULL,
    music_style_id UUID NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (artist_id) REFERENCES ARTISTS (id) ON DELETE CASCADE,
    FOREIGN KEY (music_style_id) REFERENCES MUSIC_STYLES (id) ON DELETE CASCADE,
    PRIMARY KEY (artist_id, music_style_id)
);

CREATE TABLE EVENTS
(
    id           UUID               NOT NULL DEFAULT uuid_generate_v4(),
    name         VARCHAR(50) UNIQUE NOT NULL,
    location     VARCHAR(100)       NOT NULL,
    started_date timestamp          NOT NULL,
    finish_date  timestamp          NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id)
);


--insert into points(name, description, location) values ('main scene','most known people will be here',point(48.862725,2.287592));
CREATE TABLE POINTS
(
    id           UUID               NOT NULL DEFAULT uuid_generate_v4(),
    name         VARCHAR(50) UNIQUE NOT NULL,
    description  VARCHAR(200)       UNIQUE NOT NULL,
    location point NOT NULL,
    event_id  UUID NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (event_id) REFERENCES EVENTS (id) ON DELETE CASCADE,
    PRIMARY KEY (id)
);

CREATE TABLE FOLLOW_EVENT
(
    user_id  UUID NOT NULL,
    event_id UUID NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES USERS (id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES EVENTS (id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, event_id)
);

CREATE TABLE FOLLOW_ARTIST
(
    user_id   UUID NOT NULL,
    artist_id UUID NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES USERS (id) ON DELETE CASCADE,
    FOREIGN KEY (artist_id) REFERENCES ARTISTS (id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, artist_id)
);

CREATE TABLE PERFORMING_EVENT
(
    artist_id UUID NOT NULL,
    event_id  UUID NOT NULL,
    FOREIGN KEY (artist_id) REFERENCES ARTISTS (id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES EVENTS (id) ON DELETE CASCADE,
    PRIMARY KEY (artist_id, event_id)
);

CREATE TABLE REFRESH_TOKEN
(
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    token_value VARCHAR(500) NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id)
);

CREATE TRIGGER roles_set_timestamp
BEFORE UPDATE ON roles
FOR EACH ROW
EXECUTE PROCEDURE function_set_timestamp_update();

CREATE TRIGGER users_set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE function_set_timestamp_update();

CREATE TRIGGER artists_set_timestamp
BEFORE UPDATE ON artists
FOR EACH ROW
EXECUTE PROCEDURE function_set_timestamp_update();

CREATE TRIGGER music_styles_set_timestamp
BEFORE UPDATE ON music_styles
FOR EACH ROW
EXECUTE PROCEDURE function_set_timestamp_update();

CREATE TRIGGER events_set_timestamp
BEFORE UPDATE ON events
FOR EACH ROW
EXECUTE PROCEDURE function_set_timestamp_update();


INSERT INTO mobile_app.roles(name, description)
VALUES ('ADMIN','admin user with all the permissions on the database');
INSERT INTO mobile_app.roles(name, description)
VALUES ('BASIC','basic user with no advanced permissions');

INSERT INTO mobile_app.music_styles(
	styles_name, description)
	VALUES ('Techno','music originally created in germany, with an important use a bases');

INSERT INTO mobile_app.music_styles(
	styles_name, description)
	VALUES ('Classical','Classical music generally refers to the formal musical tradition of the Western world');
