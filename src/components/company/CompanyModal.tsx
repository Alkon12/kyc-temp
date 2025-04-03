"use client"

import { useState, useEffect } from 'react'
import { Button } from '@type/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@type/components/ui/card'
import { Input } from '@type/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@type/components/ui/form'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const formSchema = z.object({
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  apiKey: z.string().min(8, {
    message: "API Key must be at least 8 characters.",
  }),
  callbackUrl: z.string().url({ message: "Must be a valid URL" }).optional().or(z.literal('')),
})

type FormValues = z.infer<typeof formSchema>

interface CompanyModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: FormValues) => void
  initialData?: {
    id?: string
    companyName?: string
    apiKey?: string
    callbackUrl?: string
  }
  title: string
  actionLabel: string
}

export default function CompanyModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title,
  actionLabel,
}: CompanyModalProps) {
  
  const [isLoading, setIsLoading] = useState(false)
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: initialData?.companyName || '',
      apiKey: initialData?.apiKey || '',
      callbackUrl: initialData?.callbackUrl || '',
    },
  })
  
  useEffect(() => {
    if (initialData) {
      form.reset({
        companyName: initialData.companyName || '',
        apiKey: initialData.apiKey || '',
        callbackUrl: initialData.callbackUrl || '',
      })
    } else {
      form.reset({
        companyName: '',
        apiKey: '',
        callbackUrl: '',
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
              
              <FormField
                control={form.control}
                name="apiKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API Key</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter API key" 
                        disabled={isLoading} 
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
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