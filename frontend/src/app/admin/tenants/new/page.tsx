import { Container } from "@/_components/layout/Container"
import { Card } from "@/_components/Card"
import { FormTitle } from "@/_components/FormTitle"
import { AdminAuthWrapper } from "@/_components/AdminAuthWrapper"
import { CreateTenantForm } from "../_components/CreateTenantForm"

export default function CreateTenantPage() {
  return (
    <AdminAuthWrapper>
      <Container>
        <div className="space-y-6">
          <FormTitle>Create New Tenant</FormTitle>

          <Card>
            <div className="px-6 py-4">
              <p className="text-sm text-gray-600 mb-6">
                Create a new tenant with an admin user and default branch. The tenant will get their own isolated environment.
              </p>
              <CreateTenantForm />
            </div>
          </Card>
        </div>
      </Container>
    </AdminAuthWrapper>
  )
}