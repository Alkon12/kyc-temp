"use client"

import { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { Button } from '@type/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@type/components/ui/card'
import { toast } from 'sonner'
import CompanyModal from './CompanyModal'
import DeleteConfirmationModal from './DeleteConfirmationModal'
import { GET_ALL_COMPANIES } from '@/app/lib/graphql/company-queries'
import { 
  CREATE_COMPANY, 
  UPDATE_COMPANY, 
  DELETE_COMPANY,
  UPDATE_COMPANY_STATUS,
  GENERATE_COMPANY_API_KEY
} from '@/app/lib/graphql/company-mutations'

type Company = {
  id: string
  companyName: string
  apiKey: string
  callbackUrl?: string
  redirectUrl?: string
  status: string
}

export default function CompanyManager() {
  // States for modals
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  
  // Apollo queries and mutations
  const { data, loading, refetch } = useQuery(GET_ALL_COMPANIES)
  
  const [createCompany] = useMutation(CREATE_COMPANY, {
    onCompleted: (data) => {
      toast.success('Company created successfully')
      refetch()
    },
    onError: (error) => {
      toast.error(`Failed to create company: ${error.message}`)
    }
  })
  
  const [updateCompany] = useMutation(UPDATE_COMPANY, {
    onCompleted: () => {
      toast.success('Company updated successfully')
      refetch()
    },
    onError: (error) => {
      toast.error(`Failed to update company: ${error.message}`)
    }
  })
  
  const [deleteCompany, { loading: deleteLoading }] = useMutation(DELETE_COMPANY, {
    onCompleted: () => {
      toast.success('Company deleted successfully')
      refetch()
    },
    onError: (error) => {
      toast.error(`Failed to delete company: ${error.message}`)
    }
  })
  
  const [updateCompanyStatus] = useMutation(UPDATE_COMPANY_STATUS, {
    onCompleted: () => {
      toast.success('Company status updated successfully')
      refetch()
    },
    onError: (error) => {
      toast.error(`Failed to update company status: ${error.message}`)
    }
  })
  
  const [generateApiKey] = useMutation(GENERATE_COMPANY_API_KEY, {
    onCompleted: (data) => {
      // Actualizar el selectedCompany con el nuevo API Key
      if (selectedCompany && data.generateCompanyApiKey) {
        setSelectedCompany({
          ...selectedCompany,
          apiKey: data.generateCompanyApiKey.apiKey
        })
      }
      refetch()
    },
    onError: (error) => {
      toast.error(`Failed to generate API Key: ${error.message}`)
    }
  })
  
  // Event handlers
  const handleCreateSubmit = async (data: any) => {
    await createCompany({
      variables: {
        input: {
          companyName: data.companyName,
          callbackUrl: data.callbackUrl || undefined,
          redirectUrl: data.redirectUrl || undefined
        }
      }
    })
  }
  
  const handleEditSubmit = async (data: any) => {
    if (!selectedCompany) return
    
    await updateCompany({
      variables: {
        companyId: selectedCompany.id,
        input: {
          companyName: data.companyName,
          callbackUrl: data.callbackUrl || undefined,
          redirectUrl: data.redirectUrl || undefined
        }
      }
    })
  }
  
  const handleRegenerateApiKey = async (companyId: string) => {
    await generateApiKey({
      variables: {
        companyId
      }
    })
  }
  
  const handleDeleteConfirm = async () => {
    if (!selectedCompany) return
    
    await deleteCompany({
      variables: {
        companyId: selectedCompany.id
      }
    })
    
    setDeleteModalOpen(false)
  }
  
  const handleStatusToggle = async (company: Company) => {
    const newStatus = company.status === 'active' ? 'inactive' : 'active'
    
    await updateCompanyStatus({
      variables: {
        companyId: company.id,
        status: newStatus
      }
    })
  }
  
  // Open modal handlers
  const openEditModal = (company: Company) => {
    setSelectedCompany(company)
    setEditModalOpen(true)
  }
  
  const openDeleteModal = (company: Company) => {
    setSelectedCompany(company)
    setDeleteModalOpen(true)
  }
  
  const companies = data?.getAllCompanies || []
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Company Management</h1>
        <Button onClick={() => setCreateModalOpen(true)}>Add Company</Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center p-8">
          <p>Loading companies...</p>
        </div>
      ) : companies.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No companies found. Create your first company by clicking "Add Company".</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {companies.map((company: Company) => (
            <Card key={company.id} className={company.status === 'inactive' ? 'opacity-60' : ''}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{company.companyName}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">API Key:</p>
                  <p className="font-mono text-sm truncate">{company.apiKey}</p>
                </div>
                
                {company.callbackUrl && (
                  <div>
                    <p className="text-sm text-muted-foreground">Callback URL:</p>
                    <p className="text-sm truncate">{company.callbackUrl}</p>
                  </div>
                )}
                
                {company.redirectUrl && (
                  <div>
                    <p className="text-sm text-muted-foreground">Redirect URL:</p>
                    <p className="text-sm truncate">{company.redirectUrl}</p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm text-muted-foreground">Status:</p>
                  <div className="flex items-center gap-2">
                    <span className={`inline-block w-2 h-2 rounded-full ${
                      company.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <span className="capitalize">{company.status}</span>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleStatusToggle(company)}
                  >
                    {company.status === 'active' ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => openEditModal(company)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => openDeleteModal(company)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Create Company Modal */}
      <CompanyModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
        title="Create New Company"
        actionLabel="Create"
      />
      
      {/* Edit Company Modal */}
      <CompanyModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        initialData={selectedCompany || undefined}
        onRegenerateApiKey={handleRegenerateApiKey}
        title="Edit Company"
        actionLabel="Update"
      />
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Company"
        description={`Are you sure you want to delete ${selectedCompany?.companyName}? This action cannot be undone.`}
        isLoading={deleteLoading}
      />
    </div>
  )
} 