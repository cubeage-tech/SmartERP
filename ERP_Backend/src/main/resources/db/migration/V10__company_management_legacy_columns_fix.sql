-- ==============================================================================
-- Migration: V10__company_management_legacy_columns_fix.sql
-- Description: Align legacy active columns with JPA entities and V5 schema
-- ==============================================================================

ALTER TABLE company_branches
    ALTER COLUMN active DROP NOT NULL,
    ALTER COLUMN active SET DEFAULT TRUE;

ALTER TABLE company_cost_centers
    ALTER COLUMN active DROP NOT NULL,
    ALTER COLUMN active SET DEFAULT TRUE;

ALTER TABLE company_departments
    ALTER COLUMN active DROP NOT NULL,
    ALTER COLUMN active SET DEFAULT TRUE;
