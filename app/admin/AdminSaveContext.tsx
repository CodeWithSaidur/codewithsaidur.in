"use client"

import React, { createContext, useContext, useState, useCallback } from "react"

interface AdminSaveContextType {
  registerSaveAction: (action: (() => Promise<void>) | null) => void
  triggerSave: () => Promise<void>
  isSaving: boolean
  setIsSaving: (loading: boolean) => void
  hasSaveAction: boolean
}

const AdminSaveContext = createContext<AdminSaveContextType | undefined>(undefined)

export function AdminSaveProvider({ children }: { children: React.ReactNode }) {
  const [saveAction, setSaveAction] = useState<(() => Promise<void>) | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const registerSaveAction = useCallback((action: (() => Promise<void>) | null) => {
    setSaveAction(() => action)
  }, [])

  const triggerSave = useCallback(async () => {
    if (saveAction) {
      setIsSaving(true)
      try {
        await saveAction()
      } finally {
        setIsSaving(false)
      }
    }
  }, [saveAction])

  return (
    <AdminSaveContext.Provider
      value={{
        registerSaveAction,
        triggerSave,
        isSaving,
        setIsSaving,
        hasSaveAction: saveAction !== null,
      }}
    >
      {children}
    </AdminSaveContext.Provider>
  )
}

export function useAdminSave() {
  const context = useContext(AdminSaveContext)
  if (context === undefined) {
    throw new Error("useAdminSave must be used within an AdminSaveProvider")
  }
  return context
}
