type TimerButtonsProps = {
  startTimer: () => void
  stopTimer: () => void
  resetTimer: () => void
  handleSubmit: () => void
  time: number
}

export const TimerButtons = ({
  startTimer,
  stopTimer,
  resetTimer,
  handleSubmit,
  time
}: TimerButtonsProps) => {
  return (
    <div className="w-[45%] bg-gray-200 flex flex-col justify-center gap-2 items-center">
      <div className="space-x-4">
        <button
          onClick={startTimer}
          className="bg-green-500 hover:bg-green-400 text-white text-sm px-1 py-1 rounded"
        >
          スタート
        </button>
        <button
          onClick={stopTimer}
          className="bg-red-500 hover:bg-red-400 text-white text-sm px-1 py-1 rounded"
        >
          ストップ
        </button>
      </div>
      <div className="space-x-4">
        <button
          onClick={resetTimer}
          className="bg-blue-500 hover:bg-blue-400 text-white text-sm px-1 py-1 rounded"
        >
          リセット
        </button>
        <button
          onClick={handleSubmit}
          disabled={time < 60}
          className={`${time < 60 ? 'bg-gray-400' : 'bg-yellow-500 hover:bg-yellow-400'} text-white text-sm px-1 py-1 rounded`}
        >
          工数入力
        </button>
      </div>
    </div>
  )
}
