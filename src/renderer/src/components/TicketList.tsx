import { useEffect, useState } from 'react';

export const TicketList = () => {
  const [tickets, setTickets] = useState<
    { id: string; key: string; fields: { summary: string } }[]
  >([])
  const [selectedTicket, setSelectedTicket] = useState('')

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      const fetchedTickets = await window.context.fetchJiraTickets()
      setTickets(fetchedTickets)
    } catch (error) {
      console.error('Error fetching tickets:', error)
    }
  }

  const handleSelectChange = (event) => {
    setSelectedTicket(event.target.value)
  }

  return (
    <div className="p-4 bg-blue-400">
      <select
        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={selectedTicket}
        onChange={handleSelectChange}
      >
        <option value="">Select a ticket</option>
        {tickets.map((ticket: { id: string; key: string; fields: { summary: string } }) => (
          <option key={ticket.id} value={ticket.fields.summary}>
            {`${ticket.key}: ${ticket.fields.summary}`}
          </option>
        ))}
      </select>
      {selectedTicket && (
        <div className="mt-4 p-2 bg-gray-100 rounded-md">
          <h3 className="font-bold">Selected Ticket:</h3>
          <p>{selectedTicket}</p>
        </div>
      )}
    </div>
  )
}
