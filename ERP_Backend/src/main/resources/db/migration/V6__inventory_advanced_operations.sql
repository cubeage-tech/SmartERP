-- V6: Inventory Advanced Operations (Stock Movements, Stock Takes, Items, Warehouses)

CREATE TABLE IF NOT EXISTS inventory_items (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    sku VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(80) NOT NULL,
    warehouse_code VARCHAR(30) NOT NULL,
    warehouse_name VARCHAR(100) NOT NULL,
    quantity NUMERIC(19, 3) NOT NULL DEFAULT 0,
    minimum_level NUMERIC(19, 3) NOT NULL DEFAULT 0,
    unit VARCHAR(20) NOT NULL,
    cost_price NUMERIC(19, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_inventory_item_tenant_sku UNIQUE (tenant_id, sku)
);

CREATE TABLE IF NOT EXISTS inventory_warehouses (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    code VARCHAR(30) NOT NULL,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(150) NOT NULL,
    area VARCHAR(30) NOT NULL,
    capacity_percent INTEGER NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_inventory_warehouse_tenant_code UNIQUE (tenant_id, code)
);

CREATE TABLE IF NOT EXISTS inventory_stock_movements (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    sku VARCHAR(50) NOT NULL,
    item_name VARCHAR(150) NOT NULL,
    type VARCHAR(20) NOT NULL,
    quantity NUMERIC(19, 3) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    warehouse_code VARCHAR(30) NOT NULL,
    warehouse_name VARCHAR(100) NOT NULL,
    reference VARCHAR(100),
    movement_date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inventory_stock_takes (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    code VARCHAR(50) NOT NULL,
    title VARCHAR(150) NOT NULL,
    warehouse_code VARCHAR(30) NOT NULL,
    warehouse_name VARCHAR(100) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    scheduled_date DATE NOT NULL,
    completed_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_inventory_stock_take_tenant_code UNIQUE (tenant_id, code)
);

CREATE TABLE IF NOT EXISTS inventory_stock_take_items (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    stock_take_id BIGINT NOT NULL REFERENCES inventory_stock_takes(id) ON DELETE CASCADE,
    item_id BIGINT,
    sku VARCHAR(50) NOT NULL,
    item_name VARCHAR(150) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    system_quantity NUMERIC(19, 3) NOT NULL DEFAULT 0,
    counted_quantity NUMERIC(19, 3),
    variance NUMERIC(19, 3) DEFAULT 0,
    notes VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_inv_items_tenant ON inventory_items(tenant_id);
CREATE INDEX IF NOT EXISTS idx_inv_warehouses_tenant ON inventory_warehouses(tenant_id);
CREATE INDEX IF NOT EXISTS idx_inv_movements_tenant ON inventory_stock_movements(tenant_id);
CREATE INDEX IF NOT EXISTS idx_inv_stock_takes_tenant ON inventory_stock_takes(tenant_id);
CREATE INDEX IF NOT EXISTS idx_inv_stock_take_items_take ON inventory_stock_take_items(stock_take_id);
