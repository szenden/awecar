import { Container } from "@/_components/layout/Container"
import { Card } from "@/_components/Card"
import { PrimaryButton } from "@/_components/PrimaryButton"
import { FormTitle } from "@/_components/FormTitle"
import Link from "next/link"

export default async function BranchesPage() {
  // This would typically fetch branch data from the API
  const branches = [
    {
      id: "1",
      name: "Main Branch",
      address: "123 Main Street",
      phone: "+1234567890",
      email: "main@example.com",
      isActive: true,
      createdAt: "2024-01-01"
    },
    {
      id: "2", 
      name: "Secondary Branch",
      address: "456 Oak Avenue",
      phone: "+1234567891",
      email: "secondary@example.com",
      isActive: true,
      createdAt: "2024-01-15"
    }
  ]

  return (
    <Container>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <FormTitle>Branch Management</FormTitle>
          <Link href="/home/branches/new">
            <PrimaryButton>Add New Branch</PrimaryButton>
          </Link>
        </div>

        <div className="space-y-4">
          {branches.map((branch) => (
            <Card key={branch.id}>
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <h3 className="text-lg font-medium text-gray-900">{branch.name}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        branch.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {branch.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <strong>Address:</strong> {branch.address || 'Not specified'}
                      </div>
                      <div>
                        <strong>Phone:</strong> {branch.phone || 'Not specified'}
                      </div>
                      <div>
                        <strong>Email:</strong> {branch.email || 'Not specified'}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Link href={`/home/branches/edit/${branch.id}`}>
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Edit
                      </button>
                    </Link>
                    <Link href={`/home/branches/${branch.id}`}>
                      <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                        View
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {branches.length === 0 && (
            <Card>
              <div className="px-6 py-8 text-center">
                <div className="text-gray-500 mb-4">No branches found</div>
                <Link href="/home/branches/new">
                  <PrimaryButton>Create First Branch</PrimaryButton>
                </Link>
              </div>
            </Card>
          )}
        </div>
      </div>
    </Container>
  )
}