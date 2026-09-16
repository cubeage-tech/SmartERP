-- ================================================================
-- V8__document_module_foundation.sql
-- SmartERP Document Management Module Foundation
-- ================================================================

-- 1. Drop existing legacy tables if present (clean slate since row count = 0)
DROP TABLE IF EXISTS document_ocr_extractions CASCADE;
DROP TABLE IF EXISTS document_approvals CASCADE;
DROP TABLE IF EXISTS document_versions CASCADE;
DROP TABLE IF EXISTS document_tags CASCADE;
DROP TABLE IF EXISTS documents CASCADE;

-- 2. Create documents table with standard tenant_id & full metadata
CREATE TABLE documents (
    id                      BIGSERIAL PRIMARY KEY,
    tenant_id               BIGINT NOT NULL,
    document_number         VARCHAR(60) NOT NULL,
    title                   VARCHAR(255) NOT NULL,
    type                    VARCHAR(50) NOT NULL,
    document_date           DATE,
    effective_date          DATE,
    expiry_date             DATE,
    description             TEXT,

    -- File attributes
    original_file_name      VARCHAR(255) NOT NULL,
    stored_file_name        VARCHAR(255) NOT NULL,
    storage_path            VARCHAR(1200) NOT NULL,
    mime_type               VARCHAR(100),
    file_size               BIGINT,
    current_version         INTEGER NOT NULL DEFAULT 1,

    -- Categorization & Organization
    category                VARCHAR(100),
    sub_category            VARCHAR(100),
    company_name            VARCHAR(255),
    branch_name             VARCHAR(255),
    department_name         VARCHAR(255),

    -- Related Entity & Ownership
    related_module          VARCHAR(100),
    related_record          VARCHAR(255),
    vendor_name             VARCHAR(255),
    employee_name           VARCHAR(255),
    document_owner          VARCHAR(255),

    -- OCR Settings & State
    ocr_enabled             BOOLEAN NOT NULL DEFAULT TRUE,
    auto_extract            BOOLEAN NOT NULL DEFAULT TRUE,
    ocr_language            VARCHAR(50) DEFAULT 'English',
    ocr_template            VARCHAR(100),
    ocr_completed           BOOLEAN NOT NULL DEFAULT FALSE,
    ocr_confidence          DOUBLE PRECISION,

    -- Approval Workflow
    approval_required       BOOLEAN NOT NULL DEFAULT FALSE,
    workflow_name           VARCHAR(100),
    approver_name           VARCHAR(255),
    approver_user_id        BIGINT,

    -- Access Control & Permissions
    access_level            VARCHAR(50) DEFAULT 'Public',
    shared_with             VARCHAR(255),
    confidential            BOOLEAN NOT NULL DEFAULT FALSE,
    allow_download          BOOLEAN NOT NULL DEFAULT TRUE,
    allow_print             BOOLEAN NOT NULL DEFAULT FALSE,
    allow_share             BOOLEAN NOT NULL DEFAULT FALSE,

    -- Notes & Status
    internal_notes          TEXT,
    comments                TEXT,
    status                  VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',

    -- Audit
    uploaded_by_user_id     BIGINT,
    uploaded_by_name        VARCHAR(255),
    created_at              TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT uk_documents_tenant_number UNIQUE (tenant_id, document_number)
);

CREATE INDEX idx_documents_tenant ON documents(tenant_id);
CREATE INDEX idx_documents_tenant_status ON documents(tenant_id, status);
CREATE INDEX idx_documents_tenant_type ON documents(tenant_id, type);
CREATE INDEX idx_documents_tenant_category ON documents(tenant_id, category);
CREATE INDEX idx_documents_created_at ON documents(tenant_id, created_at DESC);

-- 3. Create document_tags table
CREATE TABLE document_tags (
    id                      BIGSERIAL PRIMARY KEY,
    tenant_id               BIGINT NOT NULL,
    document_id             BIGINT NOT NULL,
    name                    VARCHAR(100) NOT NULL,
    created_at              TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_document_tags_document FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
    CONSTRAINT uk_document_tags UNIQUE (document_id, name)
);

CREATE INDEX idx_document_tags_tenant ON document_tags(tenant_id);
CREATE INDEX idx_document_tags_name ON document_tags(tenant_id, name);

-- 4. Create document_versions table
CREATE TABLE document_versions (
    id                      BIGSERIAL PRIMARY KEY,
    tenant_id               BIGINT NOT NULL,
    document_id             BIGINT NOT NULL,
    version_number          INTEGER NOT NULL,
    original_file_name      VARCHAR(255) NOT NULL,
    stored_file_name        VARCHAR(255) NOT NULL,
    storage_path            VARCHAR(1200) NOT NULL,
    mime_type               VARCHAR(100),
    file_size               BIGINT,
    uploaded_by_user_id     BIGINT,
    uploaded_by_name        VARCHAR(255),
    change_reason           VARCHAR(1000),
    comments                TEXT,
    created_at              TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_document_versions_document FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
    CONSTRAINT uk_document_versions UNIQUE (document_id, version_number)
);

CREATE INDEX idx_document_versions_tenant ON document_versions(tenant_id);
CREATE INDEX idx_document_versions_doc ON document_versions(document_id, version_number DESC);

-- 5. Create document_approvals table
CREATE TABLE document_approvals (
    id                      BIGSERIAL PRIMARY KEY,
    tenant_id               BIGINT NOT NULL,
    document_id             BIGINT NOT NULL,
    submitted_by_user_id    BIGINT,
    submitted_by_name       VARCHAR(255),
    approver_user_id        BIGINT,
    approver_name           VARCHAR(255),
    due_date                DATE,
    status                  VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    comment                 TEXT,
    acted_at                TIMESTAMP,
    created_at              TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_document_approvals_document FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
);

CREATE INDEX idx_document_approvals_tenant ON document_approvals(tenant_id);
CREATE INDEX idx_document_approvals_status ON document_approvals(tenant_id, status);
CREATE INDEX idx_document_approvals_approver ON document_approvals(tenant_id, approver_user_id, status);

-- 6. Create document_ocr_extractions table
CREATE TABLE document_ocr_extractions (
    id                      BIGSERIAL PRIMARY KEY,
    tenant_id               BIGINT NOT NULL,
    document_id             BIGINT NOT NULL,
    status                  VARCHAR(30) NOT NULL DEFAULT 'QUEUED',
    confidence              DOUBLE PRECISION,
    vendor_name             VARCHAR(255),
    invoice_number          VARCHAR(255),
    invoice_date            VARCHAR(255),
    amount                  NUMERIC(19, 2),
    gstin                   VARCHAR(50),
    hsn_code                VARCHAR(50),
    extracted_text          TEXT,
    auto_posted_to_gl       BOOLEAN NOT NULL DEFAULT FALSE,
    manual_review_required  BOOLEAN NOT NULL DEFAULT FALSE,
    processed_at            TIMESTAMP,
    created_at              TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_document_ocr_document FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
    CONSTRAINT uk_document_ocr UNIQUE (document_id)
);

CREATE INDEX idx_document_ocr_tenant ON document_ocr_extractions(tenant_id);
CREATE INDEX idx_document_ocr_status ON document_ocr_extractions(tenant_id, status);
