CREATE TABLE approval_workflow_settings (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(120) NOT NULL,
    module VARCHAR(40) NOT NULL,
    trigger_action VARCHAR(80) NOT NULL,
    approval_mode VARCHAR(30) NOT NULL,
    minimum_approvers INTEGER NOT NULL,
    approver_role_ids TEXT NOT NULL,
    status VARCHAR(20) NOT NULL,
    configuration_json TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_approval_workflow_tenant_name UNIQUE (tenant_id, name),
    CONSTRAINT ck_approval_workflow_minimum_approvers CHECK (minimum_approvers > 0)
);

CREATE TABLE backup_settings (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    frequency VARCHAR(20) NOT NULL,
    backup_time TIME NOT NULL,
    retention_days INTEGER NOT NULL,
    encrypted BOOLEAN NOT NULL,
    include_attachments BOOLEAN NOT NULL,
    last_backup_at TIMESTAMPTZ,
    next_backup_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_backup_settings_tenant UNIQUE (tenant_id),
    CONSTRAINT ck_backup_retention_days CHECK (retention_days BETWEEN 1 AND 3650)
);

CREATE TABLE backup_records (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    requested_by BIGINT NOT NULL REFERENCES users(id),
    file_name VARCHAR(255),
    status VARCHAR(20) NOT NULL,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    size_bytes BIGINT,
    error_message VARCHAR(1000),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_backup_record_tenant_created
    ON backup_records (tenant_id, created_at);
