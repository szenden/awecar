import { Container } from "@/_components/layout/Container"
import { Card } from "@/_components/Card"
import { FormTitle } from "@/_components/FormTitle"
import { TenantForm } from "../_components/TenantForm"

export default async function EditTenantPage() {
  // This would typically fetch tenant data from the API
  const tenant = {
    id: "1",
    name: "Default Tenant",
    subdomain: "default",
    subscriptionPlan: "Premium",
    subscriptionExpiresAt: "2099-12-31",
    isActive: true
  }

  return (
    <Container>
      <div className="space-y-6">
        <FormTitle>Edit Tenant</FormTitle>

        <Card>
          <div className="px-6 py-4">
            <TenantForm initialData={tenant} />
          </div>
        </Card>
      </div>
    </Container>
  )
}