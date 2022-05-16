\c daksh_v2_tag_management_db
CREATE EXTENSION hstore;

CREATE USER avl_readonly WITH PASSWORD 'avl_readonly123!@#';
GRANT CONNECT ON DATABASE daksh_v2_tag_management_db TO avl_readonly;
GRANT USAGE ON SCHEMA public TO avl_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO avl_readonly;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO avl_readonly;