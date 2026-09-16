CREATE TABLE companies (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(160) NOT NULL,
    code VARCHAR(30) NOT NULL,
    company_type VARCHAR(60),
    industry VARCHAR(255),
    registration_number VARCHAR(80),
    gst_number VARCHAR(20),
    pan VARCHAR(15),
    cin VARCHAR(30),
    website VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(30),
    address_line_1 VARCHAR(255),
    address_line_2 VARCHAR(255),
    country VARCHAR(255),
    state VARCHAR(255),
    city VARCHAR(255),
    pin_code VARCHAR(12),
    currency VARCHAR(60),
    timezone VARCHAR(80),
    financial_year VARCHAR(40),
    logo_url VARCHAR(500),
    founded_on DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_company_tenant_code UNIQUE (tenant_id, code)
);

CREATE TABLE company_branches (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    company_id BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(140) NOT NULL,
    code VARCHAR(30) NOT NULL,
    branch_type VARCHAR(60) NOT NULL,
    manager_name VARCHAR(255),
    contact_number VARCHAR(30) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address_line_1 VARCHAR(255) NOT NULL,
    address_line_2 VARCHAR(255),
    country VARCHAR(80) NOT NULL,
    state VARCHAR(80) NOT NULL,
    city VARCHAR(80) NOT NULL,
    pin_code VARCHAR(12) NOT NULL,
    gst_number VARCHAR(20),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_company_branch_code UNIQUE (company_id, code)
);

CREATE TABLE company_cost_centers (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    company_id BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    code VARCHAR(30) NOT NULL,
    name VARCHAR(140) NOT NULL,
    description VARCHAR(500),
    budget NUMERIC(19,2),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_company_cost_center_code UNIQUE (company_id, code)
);

CREATE TABLE company_departments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    company_id BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    branch_id BIGINT NOT NULL REFERENCES company_branches(id),
    cost_center_id BIGINT REFERENCES company_cost_centers(id),
    name VARCHAR(140) NOT NULL,
    code VARCHAR(30) NOT NULL,
    head_name VARCHAR(255),
    department_type VARCHAR(80) NOT NULL,
    description VARCHAR(500),
    employee_count INTEGER NOT NULL DEFAULT 0 CHECK (employee_count >= 0),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_company_department_code UNIQUE (company_id, code)
);

CREATE TABLE company_holidays (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    company_id BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(140) NOT NULL,
    holiday_date DATE NOT NULL,
    holiday_type VARCHAR(60) NOT NULL,
    applies_to VARCHAR(240) NOT NULL,
    optional BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_company_holiday_name_date UNIQUE (company_id, name, holiday_date)
);

CREATE TABLE company_approval_workflows (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    company_id BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    title VARCHAR(140) NOT NULL,
    trigger_expression VARCHAR(240) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_company_workflow_title UNIQUE (company_id, title)
);

CREATE TABLE company_approval_workflow_steps (
    workflow_id BIGINT NOT NULL REFERENCES company_approval_workflows(id) ON DELETE CASCADE,
    step_order INTEGER NOT NULL,
    step_name VARCHAR(100) NOT NULL,
    PRIMARY KEY (workflow_id, step_order)
);

CREATE TABLE company_management_settings (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    company_id BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    general_json TEXT,
    localization_json TEXT,
    work_schedule_json TEXT,
    leave_holidays_json TEXT,
    notifications_json TEXT,
    system_preferences_json TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_company_management_settings_company UNIQUE (company_id)
);

CREATE INDEX idx_company_tenant ON companies (tenant_id);
CREATE INDEX idx_company_branch_tenant_company ON company_branches (tenant_id, company_id);
CREATE INDEX idx_company_department_tenant_company ON company_departments (tenant_id, company_id);
CREATE INDEX idx_company_holiday_tenant_date ON company_holidays (tenant_id, company_id, holiday_date);
