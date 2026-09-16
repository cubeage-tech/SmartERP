-- V11: Employee Leave Management Schema Enhancements

ALTER TABLE hr_leave_requests
    ADD COLUMN IF NOT EXISTS contact_during_leave VARCHAR(100),
    ADD COLUMN IF NOT EXISTS attachment_url VARCHAR(255),
    ADD COLUMN IF NOT EXISTS applied_on DATE;

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_hr_leave_tenant_emp ON hr_leave_requests(tenant_id, employee_id, status);
CREATE INDEX IF NOT EXISTS idx_hr_leave_tenant_date ON hr_leave_requests(tenant_id, start_date);
CREATE INDEX IF NOT EXISTS idx_hr_leave_balances_emp ON hr_leave_balances(tenant_id, employee_id, year);

-- Seed employee profile for employee@smarterp.ai (user_id = 11, tenant_id = 3) if not present
INSERT INTO hr_employees (
    tenant_id, employee_code, first_name, last_name, email,
    department, designation, branch, joining_date, salary,
    status, user_id, created_at, updated_at
)
SELECT
    3, 'EMP-1001', 'Aditya', 'Kumar', 'employee@smarterp.ai',
    'IT', 'Senior Software Engineer', 'Headquarters', '2024-01-15', 68400.00,
    'ACTIVE', 11, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM hr_employees WHERE tenant_id = 3 AND (email = 'employee@smarterp.ai' OR user_id = 11)
);

-- Seed initial leave balances for 2026: 12 days Casual Leave + 6 days Sick Leave = 18 days total
INSERT INTO hr_leave_balances (
    tenant_id, employee_id, year, leave_type, total_days, used_days, created_at, updated_at
)
SELECT
    e.tenant_id, e.id, 2026, 'CASUAL_LEAVE', 12.0, 0.0, NOW(), NOW()
FROM hr_employees e
WHERE e.tenant_id = 3 AND e.user_id = 11
AND NOT EXISTS (
    SELECT 1 FROM hr_leave_balances b WHERE b.tenant_id = 3 AND b.employee_id = e.id AND b.year = 2026 AND b.leave_type = 'CASUAL_LEAVE'
);

INSERT INTO hr_leave_balances (
    tenant_id, employee_id, year, leave_type, total_days, used_days, created_at, updated_at
)
SELECT
    e.tenant_id, e.id, 2026, 'SICK_LEAVE', 6.0, 0.0, NOW(), NOW()
FROM hr_employees e
WHERE e.tenant_id = 3 AND e.user_id = 11
AND NOT EXISTS (
    SELECT 1 FROM hr_leave_balances b WHERE b.tenant_id = 3 AND b.employee_id = e.id AND b.year = 2026 AND b.leave_type = 'SICK_LEAVE'
);
