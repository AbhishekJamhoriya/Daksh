\c postgres
--CREATE EXTENSION postgres;

do $$
begin
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE  rolname = 'postgres') THEN
    CREATE USER postgres WITH PASSWORD 'postgres';
    END IF;

  GRANT CONNECT ON DATABASE postgres TO postgres;
  GRANT USAGE ON SCHEMA public TO postgres;
  GRANT SELECT ON ALL TABLES IN SCHEMA public TO postgres;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO postgres;
end
$$

-- \c daksh_api_db
-- CREATE EXTENSION hstore;
--
-- CREATE USER avl_readonly WITH PASSWORD 'avl_readonly123!@#';
-- GRANT CONNECT ON DATABASE daksh_api_db TO avl_readonly;
-- GRANT USAGE ON SCHEMA public TO avl_readonly;
-- GRANT SELECT ON ALL TABLES IN SCHEMA public TO avl_readonly;
-- ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO avl_readonly;
