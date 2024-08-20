import { ConfigData } from '@shared/models'
import { useEffect, useState } from 'react'

export const useConfig = () => {
  const [config, setConfig] = useState<ConfigData>({
    domain: '',
    id: '',
    token: '',
    jql: ''
  })

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const config = await window.context.readData()
        setConfig(config)
      } catch (error) {
        console.error('Error fetching config:', error)
      }
    }

    fetchConfig()
  }, [])

  return [config, setConfig] as const
}
