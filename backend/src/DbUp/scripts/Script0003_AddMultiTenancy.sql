-- Add Tenant and Branch tables for multi-tenancy support

-- Create Tenant table
CREATE TABLE domain.Tenant (
    Id uuid PRIMARY KEY,
    Name VARCHAR NOT NULL,
    Subdomain VARCHAR NOT NULL UNIQUE,
    SubscriptionPlan VARCHAR,
    SubscriptionExpiresAt TIMESTAMP WITH TIME ZONE NOT NULL,
    IsActive BOOLEAN NOT NULL DEFAULT TRUE,
    CreatedAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Branch table
CREATE TABLE domain.Branch (
    Id uuid PRIMARY KEY,
    Name VARCHAR NOT NULL,
    Address VARCHAR,
    Phone VARCHAR,
    Email VARCHAR,
    TenantId uuid NOT NULL REFERENCES domain.Tenant(Id),
    IsActive BOOLEAN NOT NULL DEFAULT TRUE,
    CreatedAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes
CREATE INDEX idx_Tenant_Subdomain ON domain.Tenant(Subdomain);
CREATE INDEX idx_Tenant_IsActive ON domain.Tenant(IsActive);
CREATE INDEX idx_Branch_TenantId ON domain.Branch(TenantId);
CREATE INDEX idx_Branch_IsActive ON domain.Branch(IsActive);

-- Create a default tenant for existing data
INSERT INTO domain.Tenant (Id, Name, Subdomain, SubscriptionPlan, SubscriptionExpiresAt, IsActive, CreatedAt, UpdatedAt)
VALUES ('00000000-0000-0000-0000-000000000001', 'Default Tenant', 'default', 'Premium', '2099-12-31 23:59:59+00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Create a default branch for the default tenant
INSERT INTO domain.Branch (Id, Name, Address, Phone, Email, TenantId, IsActive, CreatedAt, UpdatedAt)
VALUES ('00000000-0000-0000-0000-000000000001', 'Main Branch', 'Default Address', '+1234567890', 'main@example.com', '00000000-0000-0000-0000-000000000001', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Add tenant_id and branch_id columns to existing tables
ALTER TABLE domain.Employee ADD COLUMN TenantId uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001' REFERENCES domain.Tenant(Id);
ALTER TABLE domain.Employee ADD COLUMN BranchId uuid DEFAULT '00000000-0000-0000-0000-000000000001' REFERENCES domain.Branch(Id);

ALTER TABLE domain.Vehicle ADD COLUMN TenantId uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001' REFERENCES domain.Tenant(Id);
ALTER TABLE domain.Vehicle ADD COLUMN BranchId uuid DEFAULT '00000000-0000-0000-0000-000000000001' REFERENCES domain.Branch(Id);

ALTER TABLE domain.Client ADD COLUMN TenantId uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001' REFERENCES domain.Tenant(Id);
ALTER TABLE domain.Client ADD COLUMN BranchId uuid DEFAULT '00000000-0000-0000-0000-000000000001' REFERENCES domain.Branch(Id);

ALTER TABLE domain.Storage ADD COLUMN TenantId uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001' REFERENCES domain.Tenant(Id);
ALTER TABLE domain.Storage ADD COLUMN BranchId uuid DEFAULT '00000000-0000-0000-0000-000000000001' REFERENCES domain.Branch(Id);

ALTER TABLE domain.SparePart ADD COLUMN TenantId uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001' REFERENCES domain.Tenant(Id);
ALTER TABLE domain.SparePart ADD COLUMN BranchId uuid DEFAULT '00000000-0000-0000-0000-000000000001' REFERENCES domain.Branch(Id);

ALTER TABLE domain.Work ADD COLUMN TenantId uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001' REFERENCES domain.Tenant(Id);
ALTER TABLE domain.Work ADD COLUMN BranchId uuid DEFAULT '00000000-0000-0000-0000-000000000001' REFERENCES domain.Branch(Id);

ALTER TABLE domain.Pricing ADD COLUMN TenantId uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001' REFERENCES domain.Tenant(Id);
ALTER TABLE domain.Pricing ADD COLUMN BranchId uuid DEFAULT '00000000-0000-0000-0000-000000000001' REFERENCES domain.Branch(Id);

-- Add indexes for tenant filtering
CREATE INDEX idx_Employee_TenantId ON domain.Employee(TenantId);
CREATE INDEX idx_Employee_BranchId ON domain.Employee(BranchId);
CREATE INDEX idx_Vehicle_TenantId ON domain.Vehicle(TenantId);
CREATE INDEX idx_Vehicle_BranchId ON domain.Vehicle(BranchId);
CREATE INDEX idx_Client_TenantId ON domain.Client(TenantId);
CREATE INDEX idx_Client_BranchId ON domain.Client(BranchId);
CREATE INDEX idx_Storage_TenantId ON domain.Storage(TenantId);
CREATE INDEX idx_Storage_BranchId ON domain.Storage(BranchId);
CREATE INDEX idx_SparePart_TenantId ON domain.SparePart(TenantId);
CREATE INDEX idx_SparePart_BranchId ON domain.SparePart(BranchId);
CREATE INDEX idx_Work_TenantId ON domain.Work(TenantId);
CREATE INDEX idx_Work_BranchId ON domain.Work(BranchId);
CREATE INDEX idx_Pricing_TenantId ON domain.Pricing(TenantId);
CREATE INDEX idx_Pricing_BranchId ON domain.Pricing(BranchId);

-- Remove defaults after migration (optional - for future inserts to be explicit)
-- ALTER TABLE domain.Employee ALTER COLUMN TenantId DROP DEFAULT;
-- ALTER TABLE domain.Vehicle ALTER COLUMN TenantId DROP DEFAULT;
-- ALTER TABLE domain.Client ALTER COLUMN TenantId DROP DEFAULT;
-- ALTER TABLE domain.Storage ALTER COLUMN TenantId DROP DEFAULT;
-- ALTER TABLE domain.SparePart ALTER COLUMN TenantId DROP DEFAULT;
-- ALTER TABLE domain.Work ALTER COLUMN TenantId DROP DEFAULT;
-- ALTER TABLE domain.Pricing ALTER COLUMN TenantId DROP DEFAULT;