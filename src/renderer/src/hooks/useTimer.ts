import { TicketInfo } from '@shared/models'
import { useRef, useState } from 'react'

export const useTimer = (ticket: TicketInfo | null, setTotalTime: (time: number) => void) => {
  const [time, setTime] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | number>(0)

  const startTimer = () => {
    if (!isActive) {
      setIsActive(true)
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1)
      }, 1000)
    }
  }

  const stopTimer = () => {
    if (isActive) {
      clearInterval(timerRef.current)
      setIsActive(false)
    }
  }

  const resetTimer = () => {
    clearInterval(timerRef.current)
    setIsActive(false)
    setTime(0)
  }

  const handleSubmit = async () => {
    await updateTimespent()
    resetTimer()
  }

  const updateTimespent = async () => {
    if (ticket) {
      await window.context.updateTimespent(ticket.key, time)
      const updatedTicket = await window.context.fetchJiraTicket(ticket.key)
      setTotalTime(updatedTicket.fields.timespent)
    }
  }

  return {
    time,
    isActive,
    startTimer,
    stopTimer,
    resetTimer,
    handleSubmit,
    setTime
  }
}
