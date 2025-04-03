"use client"

import { Button } from '@type/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@type/components/ui/card'

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  isLoading?: boolean
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  isLoading = false
}: DeleteConfirmationModalProps) {
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-destructive">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6">{description}</p>
          <div className="flex gap-3 justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={onConfirm}
              disabled={isLoading}
            >
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 