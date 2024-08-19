type TimerDisplayProps = {
  time: number
  setTime: (time: number) => void
  totalTime: number
}

export const TimerDisplay = ({ time, setTime, totalTime }: TimerDisplayProps) => {
  const formatTime = (time: number) => {
    const getSeconds = `0${time % 60}`.slice(-2)
    const minutes = Math.floor(time / 60)
    const getMinutes = `0${minutes % 60}`.slice(-2)
    const getHours = `00${Math.floor(time / 3600)}`.slice(-3)
    return `${getHours}:${getMinutes}:${getSeconds}`
  }

  return (
    <div className="flex flex-col w-[55%] gap-2 bg-gray-100  justify-center items-center text-2xl">
      <div className="flex items-center gap-2">
        <p className="text-sm font-bold text-center w-[50px]">total</p>
        <p className="w-32 text-center bg-white">{formatTime(totalTime)}</p>
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
          className="w-32 text-center"
        />
      </div>
    </div>
  )
}
