import { ConfigData, TicketInfo } from '@shared/models'
import { useState } from 'react'

export const useTickets = (_config: ConfigData) => {
  const [tickets, setTickets] = useState<TicketInfo[]>([])
  const [selectedTicket, setSelectedTicket] = useState('')
  const [isFetching, setIsFetching] = useState(false)

  const fetchTickets = async () => {
    try {
      setTickets([])
      setSelectedTicket('')
      setIsFetching(true)
      const fetchedTickets = await window.context.fetchJiraTickets()
      fetchedTickets.sort((a, b) => a.key.localeCompare(b.key))
      setTickets(fetchedTickets)
    } catch (error) {
      console.error('Error fetching tickets:', error)
    } finally {
      setIsFetching(false)
    }
  }

  return {
    tickets,
    selectedTicket,
    setSelectedTicket,
    isFetching,
    fetchTickets
  }
}
