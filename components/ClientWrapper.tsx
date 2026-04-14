'use client'

import { useEffect, useState } from 'react'
import Tutorial from './Tutorial'

const ONBOARDING_KEY = 'kash:onboarding_done'

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [showTutorial, setShowTutorial] = useState(false)

  useEffect(() => {
    const done = localStorage.getItem(ONBOARDING_KEY)
    if (!done) setShowTutorial(true)
  }, [])

  const handleClose = () => {
    localStorage.setItem(ONBOARDING_KEY, '1')
    setShowTutorial(false)
  }

  return (
    <>
      {children}
      {showTutorial && <Tutorial onClose={handleClose} />}
    </>
  )
}
