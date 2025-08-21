import { Container } from "@/_components/layout/Container"
import { Card } from "@/_components/Card"
import { FormTitle } from "@/_components/FormTitle"
import { BranchForm } from "../_components/BranchForm"

export default function NewBranchPage() {
  return (
    <Container>
      <div className="space-y-6">
        <FormTitle>Add New Branch</FormTitle>

        <Card>
          <div className="px-6 py-4">
            <BranchForm />
          </div>
        </Card>
      </div>
    </Container>
  )
}