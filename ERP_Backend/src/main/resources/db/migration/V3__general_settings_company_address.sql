ALTER TABLE general_settings
    RENAME COLUMN tax_id TO gstin;

ALTER TABLE general_settings
    ADD COLUMN pan VARCHAR(10),
    ADD COLUMN industry VARCHAR(255),
    ADD COLUMN street_address VARCHAR(255),
    ADD COLUMN city VARCHAR(100),
    ADD COLUMN state VARCHAR(100),
    ADD COLUMN pin_code VARCHAR(10);
