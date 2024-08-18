import { useWindowFocus } from '@/hooks/useWindowFocus'
import React from 'react'

interface ActiveOnlyComponentProps {
  children: React.ReactNode
}

export function ActiveOnlyComponent({ children }: ActiveOnlyComponentProps) {
  const isFocused = useWindowFocus()

  if (!isFocused) {
    return null
  }

  return <>{children}</>
}
