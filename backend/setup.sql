-- Database setup script for Customer Support Dashboard
-- Run this in psql or pgAdmin before starting the backend

CREATE DATABASE customer_support;

-- The tables are auto-created by SQLAlchemy on backend startup.
-- This script is for manual setup if needed.

-- For n8n integration (future): 
-- Create a read-only user for n8n to query approved drafts:
-- CREATE USER n8n_reader WITH PASSWORD 'secure_password';
-- GRANT CONNECT ON DATABASE customer_support TO n8n_reader;
-- GRANT USAGE ON SCHEMA public TO n8n_reader;
-- GRANT SELECT ON ALL TABLES IN SCHEMA public TO n8n_reader;
