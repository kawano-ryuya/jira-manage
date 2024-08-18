import { Content, RootLayout, TicketList, Timer } from '@/components'
import { useWindowFocus } from '@/hooks/useWindowFocus'
import { TicketInfo } from '@shared/models'
import { useState } from 'react'

function App(): JSX.Element {
  const [totalTime, setTotalTime] = useState(0)
  const [ticket, setTicket] = useState<TicketInfo | null>(null)
  const isFocused = useWindowFocus()

  return (
    <>
      <RootLayout>
        <Content>
          <div className={`${!isFocused && 'hidden'}`}>
            <TicketList setTotalTime={setTotalTime} setTicket={setTicket} />
          </div>
          <Timer totalTime={totalTime} setTotalTime={setTotalTime} ticket={ticket} />
        </Content>
      </RootLayout>
    </>
  )
}

export default App
