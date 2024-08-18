import { useRef, useState } from 'react'

export const Timer = () => {
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

  const handleSubmit = () => {
    resetTimer()
    // 任意処理: 送信ボタンが押された時に実行するロジック
    console.log('Timer sent')
  }

  return (
    <div className="flex h-1/2">
      {/* タイマー表示エリア */}
      <div className="flex-1 bg-gray-100 flex items-center justify-center text-2xl">
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
          className="w-32 text-center p-2"
        />
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
            className="bg-purple-500 hover:bg-purple-400 text-white text-sm px-2 py-2 rounded"
          >
            工数入力
          </button>
        </div>
      </div>
    </div>
  )
}
