CREATE TABLE tenants (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(255),
    status VARCHAR(30) NOT NULL,
    plan VARCHAR(30) NOT NULL,
    max_users INTEGER NOT NULL,
    currency VARCHAR(10) NOT NULL,
    timezone VARCHAR(60) NOT NULL,
    trial_ends_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_tenant_code UNIQUE (code)
);

CREATE TABLE branches (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id),
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    currency VARCHAR(255),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT uk_branch_tenant_name UNIQUE (tenant_id, name)
);

CREATE TABLE departments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id),
    name VARCHAR(255) NOT NULL,
    branch_id BIGINT NOT NULL REFERENCES branches(id),
    parent_department_id BIGINT REFERENCES departments(id),
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE permissions (
    id BIGSERIAL PRIMARY KEY,
    module VARCHAR(255) NOT NULL,
    action VARCHAR(30) NOT NULL,
    scope VARCHAR(30) NOT NULL,
    CONSTRAINT uk_permission UNIQUE (module, action, scope)
);

CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id),
    name VARCHAR(255) NOT NULL,
    system_role BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT uk_role_tenant_name UNIQUE (tenant_id, name)
);

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    branch_id BIGINT REFERENCES branches(id),
    department_id BIGINT REFERENCES departments(id),
    CONSTRAINT uk_user_tenant_email UNIQUE (tenant_id, email)
);

CREATE TABLE role_permissions (
    role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id BIGINT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE user_roles (
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE tenant_domains (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    domain VARCHAR(255) NOT NULL,
    primary_domain BOOLEAN NOT NULL DEFAULT FALSE,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_tenant_domain UNIQUE (domain)
);

CREATE TABLE tenant_modules (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    module_key VARCHAR(255) NOT NULL,
    status VARCHAR(30) NOT NULL,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_tenant_module UNIQUE (tenant_id, module_key)
);

CREATE TABLE tenant_subscriptions (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    plan VARCHAR(30) NOT NULL,
    amount NUMERIC(19,2) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    auto_renew BOOLEAN NOT NULL,
    active BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tenant_users (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(30) NOT NULL,
    owner BOOLEAN NOT NULL DEFAULT FALSE,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_tenant_user UNIQUE (tenant_id, user_id)
);

CREATE TABLE general_settings (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255),
    tax_id VARCHAR(255),
    currency VARCHAR(10) NOT NULL,
    timezone VARCHAR(60) NOT NULL,
    locale VARCHAR(20) NOT NULL,
    date_format VARCHAR(30) NOT NULL,
    fiscal_year_start_month INTEGER NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_general_settings_tenant UNIQUE (tenant_id)
);

CREATE TABLE notification_preferences (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(30) NOT NULL,
    email_enabled BOOLEAN NOT NULL,
    in_app_enabled BOOLEAN NOT NULL,
    sms_enabled BOOLEAN NOT NULL,
    CONSTRAINT uk_notification_preference UNIQUE (tenant_id, user_id, type)
);

CREATE TABLE integration_settings (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    type VARCHAR(40) NOT NULL,
    name VARCHAR(255) NOT NULL,
    config_json TEXT,
    status VARCHAR(30) NOT NULL,
    enabled BOOLEAN NOT NULL,
    last_checked_at TIMESTAMPTZ,
    last_error VARCHAR(255),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_integration_setting UNIQUE (tenant_id, type, name)
);

CREATE TABLE module_settings (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    module VARCHAR(40) NOT NULL,
    enabled BOOLEAN NOT NULL,
    config_json TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_module_setting UNIQUE (tenant_id, module)
);

CREATE TABLE security_settings (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    mfa_required BOOLEAN NOT NULL,
    minimum_password_length INTEGER NOT NULL,
    password_expiry_days INTEGER NOT NULL,
    max_login_attempts INTEGER NOT NULL,
    session_timeout_minutes INTEGER NOT NULL,
    ip_restriction_enabled BOOLEAN NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_security_setting_tenant UNIQUE (tenant_id)
);

CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    actor_user_id BIGINT,
    action VARCHAR(255) NOT NULL,
    module VARCHAR(255) NOT NULL,
    entity_type VARCHAR(255),
    entity_id VARCHAR(255),
    details TEXT,
    ip_address VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_audit_tenant_created ON audit_logs (tenant_id, created_at);

CREATE TABLE subscriptions (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    plan VARCHAR(30) NOT NULL,
    status VARCHAR(30) NOT NULL,
    amount NUMERIC(19,2) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    auto_renew BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE billing_history (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    subscription_id BIGINT NOT NULL REFERENCES subscriptions(id),
    invoice_number VARCHAR(255) NOT NULL UNIQUE,
    amount NUMERIC(19,2) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    status VARCHAR(30) NOT NULL,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE quotations (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id),
    quotation_number VARCHAR(255) NOT NULL,
    customer_id BIGINT NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    status VARCHAR(30) NOT NULL,
    quotation_date DATE NOT NULL,
    valid_until DATE NOT NULL,
    subtotal NUMERIC(19,2) NOT NULL,
    tax_amount NUMERIC(19,2) NOT NULL,
    total_amount NUMERIC(19,2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_quotation_number UNIQUE (tenant_id, quotation_number)
);

CREATE TABLE quotation_items (
    id BIGSERIAL PRIMARY KEY,
    quotation_id BIGINT NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
    product_id BIGINT,
    description VARCHAR(255) NOT NULL,
    quantity NUMERIC(19,3) NOT NULL,
    unit_price NUMERIC(19,2) NOT NULL,
    tax_rate NUMERIC(7,3) NOT NULL,
    line_total NUMERIC(19,2) NOT NULL
);

CREATE TABLE sales_orders (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id),
    order_number VARCHAR(255) NOT NULL,
    quotation_id BIGINT,
    customer_id BIGINT NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    status VARCHAR(30) NOT NULL,
    order_date DATE NOT NULL,
    expected_delivery_date DATE,
    subtotal NUMERIC(19,2) NOT NULL,
    tax_amount NUMERIC(19,2) NOT NULL,
    total_amount NUMERIC(19,2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_sales_order_number UNIQUE (tenant_id, order_number)
);

CREATE TABLE sales_order_items (
    id BIGSERIAL PRIMARY KEY,
    sales_order_id BIGINT NOT NULL REFERENCES sales_orders(id) ON DELETE CASCADE,
    product_id BIGINT,
    description VARCHAR(255) NOT NULL,
    quantity NUMERIC(19,3) NOT NULL,
    unit_price NUMERIC(19,2) NOT NULL,
    tax_rate NUMERIC(7,3) NOT NULL,
    line_total NUMERIC(19,2) NOT NULL
);

CREATE TABLE sales_invoices (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id),
    invoice_number VARCHAR(255) NOT NULL,
    sales_order_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    status VARCHAR(30) NOT NULL,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    subtotal NUMERIC(19,2) NOT NULL,
    tax_amount NUMERIC(19,2) NOT NULL,
    total_amount NUMERIC(19,2) NOT NULL,
    paid_amount NUMERIC(19,2) NOT NULL,
    balance_due NUMERIC(19,2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_sales_invoice_number UNIQUE (tenant_id, invoice_number)
);

CREATE TABLE sales_invoice_items (
    id BIGSERIAL PRIMARY KEY,
    invoice_id BIGINT NOT NULL REFERENCES sales_invoices(id) ON DELETE CASCADE,
    product_id BIGINT,
    description VARCHAR(255) NOT NULL,
    quantity NUMERIC(19,3) NOT NULL,
    unit_price NUMERIC(19,2) NOT NULL,
    tax_rate NUMERIC(7,3) NOT NULL,
    line_total NUMERIC(19,2) NOT NULL
);

CREATE TABLE sales_payments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id),
    invoice_id BIGINT NOT NULL REFERENCES sales_invoices(id),
    amount NUMERIC(19,2) NOT NULL,
    method VARCHAR(30) NOT NULL,
    reference VARCHAR(255) NOT NULL,
    paid_at TIMESTAMPTZ NOT NULL,
    notes VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_sales_payment_reference UNIQUE (tenant_id, reference)
);
