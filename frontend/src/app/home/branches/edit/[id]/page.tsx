import { Container } from "@/_components/layout/Container"
import { Card } from "@/_components/Card"
import { FormTitle } from "@/_components/FormTitle"
import { BranchForm } from "../../_components/BranchForm"

interface EditBranchPageProps {
  params: { id: string }
}

export default async function EditBranchPage({ params }: EditBranchPageProps) {
  // This would typically fetch branch data from the API
  const branch = {
    id: params.id,
    name: "Main Branch",
    address: "123 Main Street",
    phone: "+1234567890",
    email: "main@example.com",
    isActive: true
  }

  return (
    <Container>
      <div className="space-y-6">
        <FormTitle>Edit Branch</FormTitle>

        <Card>
          <div className="px-6 py-4">
            <BranchForm initialData={branch} />
          </div>
        </Card>
      </div>
    </Container>
  )
}