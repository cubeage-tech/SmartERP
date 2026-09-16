-- ==============================================================================
-- Migration: V12__users_legacy_position_fix.sql
-- Description: Align legacy users position column with JPA User entity
-- ==============================================================================

ALTER TABLE users
    ALTER COLUMN position DROP NOT NULL,
    ALTER COLUMN position SET DEFAULT 'Employee';
