import { Config } from '@/components'
import { ConfigData, TicketInfo } from '@shared/models'
import { SetStateAction, useEffect, useState } from 'react'

type TicketListProps = {
  setTotalTime: (time: number) => void
  setTicket: (ticket: TicketInfo | null) => void
}

export const TicketList = ({ setTotalTime, setTicket }: TicketListProps) => {
  const [tickets, setTickets] = useState<TicketInfo[]>([])
  const [selectedTicket, setSelectedTicket] = useState('')
  const [isFetching, setIsFetching] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [config, setConfig] = useState<ConfigData>({
    domain: '',
    id: '',
    token: '',
    jql: ''
  })

  useEffect(() => {
    if (!isOpen) {
      fetchConfig()
    }
    if (!config.jql) {
      setConfig({ ...config, jql: 'assignee=currentuser()' })
    }
  }, [isOpen])

  const fetchConfig = async () => {
    try {
      const config = await window.context.readData()
      setConfig(config)
    } catch (error) {
      console.error('Error fetching config:', error)
    }
  }

  useEffect(() => {
    if (selectedTicket) {
      console.log('selectedTicket', selectedTicket)
      const key = selectedTicket.split(':')[0].trim()
      const ticket = tickets.find((ticket) => ticket.key === key)
      if (ticket) setTicket(ticket)
      if (ticket && ticket.fields.timespent) {
        setTotalTime(ticket.fields.timespent)
      } else {
        setTotalTime(0)
      }
    }
  }, [selectedTicket])

  const fetchTickets = async () => {
    try {
      setTickets([])
      setSelectedTicket('')
      setIsFetching(true)
      setTotalTime(0)
      const fetchedTickets = await window.context.fetchJiraTickets()
      fetchedTickets.sort((a, b) => a.key.localeCompare(b.key))
      setTickets(fetchedTickets)
    } catch (error) {
      console.error('Error fetching tickets:', error)
    } finally {
      setIsFetching(false)
    }
  }

  const handleSelectChange = (event: { target: { value: SetStateAction<string> } }) => {
    setSelectedTicket(event.target.value)
  }

  return (
    <>
      <Config
        config={config}
        setConfig={setConfig}
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        onOk={() => setIsOpen(false)}
      />
      <div className="p-2 bg-blue-400 h-1/2">
        <div className="flex gap-2">
          <select
            className="w-[264px] p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 truncate"
            value={selectedTicket}
            onChange={handleSelectChange}
          >
            <option value="">
              {isFetching
                ? 'データ取得中...'
                : tickets.length !== 0
                  ? 'Select a ticket'
                  : !config.domain || !config.id || !config.token
                    ? '設定を行ってください'
                    : '取得ボタンでチケットを取得'}
            </option>
            {tickets.map((ticket: TicketInfo) => (
              <option key={ticket.id} value={`${ticket.key}: ${ticket.fields.summary}`}>
                {`${ticket.key}: ${ticket.fields.summary}`}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <button
              onClick={fetchTickets}
              disabled={isFetching || !config.domain || !config.id || !config.token}
              className={`${isFetching || !config.domain || !config.id || !config.token
                  ? 'bg-gray-300'
                  : 'bg-red-500 hover:bg-red-400'
                } text-white text-sm px-2 py-2 rounded`}
            >
              取得
            </button>
            <button
              onClick={() => setIsOpen(true)}
              className="bg-green-500 hover:bg-green-400 text-white text-sm px-2 py-2 rounded"
            >
              設定
            </button>
          </div>
        </div>
        <div className="mt-2 p-2 bg-gray-100 rounded-md h-15">
          <h3 className="font-bold">Selected Ticket:</h3>
          <p className="truncate">{selectedTicket}</p>
        </div>
      </div>
    </>
  )
}
