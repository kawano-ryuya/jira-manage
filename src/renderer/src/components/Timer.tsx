import { TimerButtons, TimerDisplay } from '@/components'
import { useTimer } from '@/hooks/useTimer'
import { TicketInfo } from '@shared/models'

type TimerProps = {
  totalTime: number
  setTotalTime: (time: number) => void
  ticket: TicketInfo | null
}

export const Timer = ({ totalTime, setTotalTime, ticket }: TimerProps) => {
  const { time, isActive, startTimer, stopTimer, resetTimer, handleSubmit, setTime } = useTimer(
    ticket,
    setTotalTime
  )

  return (
    <div className="flex h-1/2">
      {/* タイマー表示エリア */}
      <TimerDisplay time={time} setTime={setTime} totalTime={totalTime} />
      {/* ボタンエリア */}
      <TimerButtons
        startTimer={startTimer}
        stopTimer={stopTimer}
        resetTimer={resetTimer}
        handleSubmit={handleSubmit}
        time={time}
      />
    </div>
  )
}
