import { ActiveOnlyComponent, Content, RootLayout, TicketList, Timer } from '@/components'
import { TicketInfo } from '@shared/models'
import { useState } from 'react'

function App(): JSX.Element {
  const [totalTime, setTotalTime] = useState(0)
  const [ticket, setTicket] = useState<TicketInfo | null>(null)

  return (
    <>
      <RootLayout>
        <Content>
          <ActiveOnlyComponent>
            <TicketList setTotalTime={setTotalTime} setTicket={setTicket} />
          </ActiveOnlyComponent>
          <Timer totalTime={totalTime} setTotalTime={setTotalTime} ticket={ticket} />
        </Content>
      </RootLayout>
    </>
  )
}

export default App
