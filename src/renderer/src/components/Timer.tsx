import { TicketInfo } from '@shared/models'
import { useRef, useState } from 'react'

type TimerProps = {
  totalTime: number
  setTotalTime: (time: number) => void
  ticket: TicketInfo | null
}

export const Timer = ({ totalTime, setTotalTime, ticket }: TimerProps) => {
  const [time, setTime] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | number>(0)

  const formatTime = (time) => {
    const getSeconds = `0${time % 60}`.slice(-2)
    const minutes = Math.floor(time / 60)
    const getMinutes = `0${minutes % 60}`.slice(-2)
    const getHours = `0${Math.floor(time / 3600)}`.slice(-2)
    return `${getHours}:${getMinutes}:${getSeconds}`
  }

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
    console.log('updateTimespent')
    await window.context.updateTimespent(ticket!.key, time)
    const updatedTicket = await window.context.fetchJiraTicket(ticket!.key)
    setTotalTime(updatedTicket.fields.timespent)
  }

  return (
    <div className="flex h-1/2">
      {/* タイマー表示エリア */}
      <div className="flex flex-col flex-1 gap-2 bg-gray-100  justify-center items-center text-2xl">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-center w-[50px]">total</p>
          <p className="w-28 text-center bg-white">{formatTime(totalTime)}</p>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-center w-[50px]">current</p>
          <input
            type="text"
            value={formatTime(time)}
            onChange={(e) => {
              const parts = e.target.value.split(':')
              const hours = parseInt(parts[0]) || 0
              const minutes = parseInt(parts[1]) || 0
              const seconds = parseInt(parts[2]) || 0
              const totalSeconds = hours * 3600 + minutes * 60 + seconds
              setTime(totalSeconds)
            }}
            className="w-28 text-center"
          />
        </div>
      </div>

      {/* ボタンエリア */}
      <div className="flex-1 bg-gray-200 flex flex-col justify-center gap-4 pl-5">
        <div className="space-x-4">
          <button
            onClick={startTimer}
            className="bg-green-500 hover:bg-green-400 text-white text-sm px-2 py-2 rounded"
          >
            スタート
          </button>
          <button
            onClick={stopTimer}
            className="bg-red-500 hover:bg-red-400 text-white text-sm px-2 py-2 rounded"
          >
            ストップ
          </button>
        </div>
        <div className="space-x-4">
          <button
            onClick={resetTimer}
            className="bg-blue-500 hover:bg-blue-400 text-white text-sm px-2 py-2 rounded"
          >
            リセット
          </button>
          <button
            onClick={handleSubmit}
            disabled={time < 60}
            className={`${time < 60 ? 'bg-gray-400' : 'bg-yellow-500 hover:bg-yellow-400'} text-white text-sm px-2 py-2 rounded`}
          >
            工数入力
          </button>
        </div>
      </div>
    </div>
  )
}
