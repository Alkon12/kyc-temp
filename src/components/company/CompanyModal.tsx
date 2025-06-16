"use client"

import { useState, useEffect } from 'react'
import { Button } from '@type/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@type/components/ui/card'
import { Input } from '@type/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from '@type/components/ui/form'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { RefreshCcw } from 'lucide-react'

const formSchema = z.object({
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  apiKey: z.string().optional(),
  callbackUrl: z.string().url({ message: "Must be a valid URL" }).optional().or(z.literal('')),
  redirectUrl: z.string().url({ message: "Must be a valid URL" }).optional().or(z.literal('')),
})

type FormValues = z.infer<typeof formSchema>

interface CompanyModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: FormValues) => void
  onRegenerateApiKey?: (companyId: string) => void
  initialData?: {
    id?: string
    companyName?: string
    apiKey?: string
    callbackUrl?: string
    redirectUrl?: string
  }
  title: string
  actionLabel: string
}

export default function CompanyModal({
  isOpen,
  onClose,
  onSubmit,
  onRegenerateApiKey,
  initialData,
  title,
  actionLabel,
}: CompanyModalProps) {
  
  const [isLoading, setIsLoading] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const isEditMode = !!initialData?.id
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: initialData?.companyName || '',
      apiKey: initialData?.apiKey || undefined,
      callbackUrl: initialData?.callbackUrl || '',
      redirectUrl: initialData?.redirectUrl || '',
    },
  })
  
  useEffect(() => {
    if (initialData) {
      form.reset({
        companyName: initialData.companyName || '',
        apiKey: initialData.apiKey || undefined,
        callbackUrl: initialData.callbackUrl || '',
        redirectUrl: initialData.redirectUrl || '',
      })
    } else {
      form.reset({
        companyName: '',
        apiKey: undefined,
        callbackUrl: '',
        redirectUrl: '',
      })
    }
  }, [initialData, form, isOpen])
  
  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      setIsLoading(true)
      await onSubmit(data)
      onClose()
      form.reset()
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  })
  
  const handleRegenerateApiKey = async () => {
    if (!initialData?.id || !onRegenerateApiKey) return
    
    try {
      setIsRegenerating(true)
      await onRegenerateApiKey(initialData.id)
      toast.success("API Key regenerated successfully")
    } catch (error) {
      toast.error("Failed to regenerate API Key")
    } finally {
      setIsRegenerating(false)
    }
  }
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter company name" 
                        disabled={isLoading} 
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              {isEditMode && (
                <FormItem>
                  <FormLabel>API Key</FormLabel>
                  <div className="flex items-center gap-2">
                    <Input 
                      value={initialData?.apiKey || 'Not generated yet'} 
                      disabled={true}
                      className="font-mono text-sm"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={handleRegenerateApiKey}
                      disabled={isLoading || isRegenerating}
                    >
                      <RefreshCcw className={`h-4 w-4 ${isRegenerating ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                  <FormDescription>
                    API Keys are generated automatically. Click the refresh button to generate a new one.
                  </FormDescription>
                </FormItem>
              )}
              
              <FormField
                control={form.control}
                name="callbackUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Callback URL (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://example.com/callback" 
                        disabled={isLoading} 
                        {...field} 
                        value={field.value || ''}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="redirectUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Redirect URL (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://example.com/kyc-complete" 
                        disabled={isLoading} 
                        {...field} 
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      URL donde se redirige al usuario al completar el proceso de KYC
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              <div className="flex gap-3 justify-end">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {actionLabel}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
} 