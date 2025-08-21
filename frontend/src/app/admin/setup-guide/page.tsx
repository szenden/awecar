import { Container } from "@/_components/layout/Container"
import { Card } from "@/_components/Card"
import { FormTitle } from "@/_components/FormTitle"
import { AdminAuthWrapper } from "@/_components/AdminAuthWrapper"

export default function SetupGuidePage() {
  return (
    <AdminAuthWrapper>
      <Container>
      <div className="space-y-6">
        <FormTitle>Multi-Tenant Setup Guide</FormTitle>

        <Card>
          <div className="px-6 py-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">System Admin Workflow</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">1. System Admin Login</h4>
                <div className="text-sm text-gray-600 space-y-2">
                  <p><strong>Default Credentials:</strong></p>
                  <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                    Username: admin<br/>
                    Password: admin123<br/>
                    URL: http://localhost:3000/admin
                  </div>
                  <p className="text-xs text-red-600">⚠️ Change default password in production!</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">2. Create New Tenant</h4>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>As a system admin, you can create new tenants:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Go to <strong>Admin Dashboard</strong> → <strong>Create New Tenant</strong></li>
                    <li>Fill in tenant details (name, subdomain, subscription)</li>
                    <li>Provide admin user details (name, email, password)</li>
                    <li>Configure default branch information</li>
                    <li>Click <strong>"Create Tenant"</strong></li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">3. Access New Tenant Environment</h4>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>After creating a tenant, you have several options:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>Direct Access:</strong> Use the generated tenant URL (e.g., tenant-name.localhost:3000)</li>
                    <li><strong>Impersonation:</strong> Click "Login As" to impersonate the tenant admin</li>
                    <li><strong>Token Access:</strong> Use the generated login token for API access</li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">4. Tenant Login Process</h4>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>Tenant users can log in via:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>Subdomain URL:</strong> https://their-subdomain.yourdomain.com</li>
                    <li><strong>Regular URL:</strong> https://yourdomain.com (with tenant selection)</li>
                    <li>Use the admin credentials provided during tenant creation</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="px-6 py-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Example Tenant Creation</h3>
            
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded">
                <h4 className="font-medium text-blue-900 mb-2">Sample Tenant Data</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Tenant Details:</strong>
                    <div className="font-mono bg-white p-2 mt-1 rounded">
                      Name: ABC Auto Repair<br/>
                      Subdomain: abc-auto<br/>
                      Plan: Premium<br/>
                      Expires: 2025-12-31
                    </div>
                  </div>
                  <div>
                    <strong>Admin User:</strong>
                    <div className="font-mono bg-white p-2 mt-1 rounded">
                      Name: John Smith<br/>
                      Email: john@abcauto.com<br/>
                      Username: john<br/>
                      Password: secure123
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded">
                <h4 className="font-medium text-green-900 mb-2">After Creation</h4>
                <div className="text-sm">
                  <p><strong>Tenant URL:</strong> <span className="font-mono">https://abc-auto.localhost:3000</span></p>
                  <p><strong>Admin Login:</strong> john / secure123</p>
                  <p><strong>Features Available:</strong> Full garage management system with isolated data</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="px-6 py-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Development Setup</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Local Development</h4>
                <div className="bg-gray-100 p-3 rounded font-mono text-sm space-y-1">
                  <div># Update your hosts file (/etc/hosts or C:\Windows\System32\drivers\etc\hosts)</div>
                  <div>127.0.0.1 localhost</div>
                  <div>127.0.0.1 abc-auto.localhost</div>
                  <div>127.0.0.1 another-tenant.localhost</div>
                  <div># Add more subdomains as needed</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Database Setup</h4>
                <div className="text-sm text-gray-600">
                  <p>The system automatically:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                    <li>Creates tenant-specific database schemas</li>
                    <li>Runs migrations for new tenant databases</li>
                    <li>Sets up default data and configurations</li>
                    <li>Creates admin user accounts</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="px-6 py-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">API Endpoints</h3>
            
            <div className="space-y-3">
              <div className="font-mono text-sm space-y-1">
                <div className="font-bold">System Admin Endpoints:</div>
                <div>POST /api/admin/tenants - Create new tenant</div>
                <div>GET /api/admin/tenants - List all tenants</div>
                <div>POST /api/admin/impersonate/{'{tenantId}'} - Impersonate tenant</div>
              </div>
              
              <div className="font-mono text-sm space-y-1">
                <div className="font-bold">Tenant Endpoints:</div>
                <div>GET /api/tenants/{'{id}'} - Get tenant details</div>
                <div>GET /api/branches - List tenant branches</div>
                <div>POST /api/branches - Create new branch</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
      </Container>
    </AdminAuthWrapper>
  )
}