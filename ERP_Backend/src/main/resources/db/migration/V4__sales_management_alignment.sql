UPDATE sales_orders
SET status = 'IN_PROGRESS'
WHERE status = 'PROCESSING';

UPDATE sales_orders
SET status = 'COMPLETED'
WHERE status = 'FULFILLED';

UPDATE sales_invoices
SET status = 'SENT'
WHERE status = 'ISSUED';

ALTER TABLE sales_orders
    ADD COLUMN actual_delivery_date DATE;

CREATE TABLE sales_document_sequences (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    document_type VARCHAR(20) NOT NULL,
    document_year INTEGER NOT NULL,
    next_value BIGINT NOT NULL,
    version BIGINT,
    CONSTRAINT uk_sales_document_sequence
        UNIQUE (tenant_id, document_type, document_year)
);

CREATE INDEX idx_quotation_tenant_date
    ON quotations (tenant_id, quotation_date);

CREATE INDEX idx_sales_order_tenant_date
    ON sales_orders (tenant_id, order_date);

CREATE INDEX idx_sales_invoice_tenant_date
    ON sales_invoices (tenant_id, issue_date);
