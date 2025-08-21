-- Add system admin support

-- Create SystemAdmin table
CREATE TABLE public.SystemAdmin (
    Id uuid PRIMARY KEY,
    Username VARCHAR NOT NULL UNIQUE,
    Email VARCHAR NOT NULL,
    FirstName VARCHAR NOT NULL,
    LastName VARCHAR,
    IsActive BOOLEAN NOT NULL DEFAULT TRUE,
    CreatedAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes
CREATE INDEX idx_SystemAdmin_Username ON public.SystemAdmin(Username);
CREATE INDEX idx_SystemAdmin_Email ON public.SystemAdmin(Email);
CREATE INDEX idx_SystemAdmin_IsActive ON public.SystemAdmin(IsActive);

-- Update User table to support tenant context
ALTER TABLE public.User ADD COLUMN TenantId uuid REFERENCES domain.Tenant(Id);
ALTER TABLE public.User ADD COLUMN IsSystemAdmin BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE public.User ADD COLUMN CreatedAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE public.User ADD COLUMN UpdatedAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Create default system admin user
INSERT INTO public.SystemAdmin (Id, Username, Email, FirstName, LastName, IsActive, CreatedAt, UpdatedAt)
VALUES ('11111111-1111-1111-1111-111111111111', 'admin', 'admin@system.local', 'System', 'Administrator', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Create system admin user account
INSERT INTO public.User (UserName, Password, TenantName, Email, Validated, IsSystemAdmin, CreatedAt, UpdatedAt, EmployeeId)
VALUES ('admin', '$2a$11$dummy.hash.for.password.admin123', 'system', 'admin@system.local', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '11111111-1111-1111-1111-111111111111');

-- Add indexes for new columns
CREATE INDEX idx_User_TenantId ON public.User(TenantId);
CREATE INDEX idx_User_IsSystemAdmin ON public.User(IsSystemAdmin);

-- Create tenant management schema
CREATE SCHEMA tenant_mgmt;

-- Create tenant creation log table
CREATE TABLE tenant_mgmt.TenantCreationLog (
    Id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    TenantId uuid NOT NULL REFERENCES domain.Tenant(Id),
    CreatedBy uuid REFERENCES public.SystemAdmin(Id),
    CreatedAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Status VARCHAR NOT NULL, -- 'created', 'provisioned', 'failed'
    Notes TEXT
);

-- Create tenant access log table  
CREATE TABLE tenant_mgmt.TenantAccessLog (
    Id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    TenantId uuid NOT NULL REFERENCES domain.Tenant(Id),
    UserId VARCHAR NOT NULL,
    AccessType VARCHAR NOT NULL, -- 'login', 'impersonate', 'logout'
    IpAddress INET,
    UserAgent TEXT,
    AccessedAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes
CREATE INDEX idx_TenantCreationLog_TenantId ON tenant_mgmt.TenantCreationLog(TenantId);
CREATE INDEX idx_TenantCreationLog_CreatedBy ON tenant_mgmt.TenantCreationLog(CreatedBy);
CREATE INDEX idx_TenantAccessLog_TenantId ON tenant_mgmt.TenantAccessLog(TenantId);
CREATE INDEX idx_TenantAccessLog_AccessedAt ON tenant_mgmt.TenantAccessLog(AccessedAt);