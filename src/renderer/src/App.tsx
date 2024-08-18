import { Content, RootLayout, TicketList, Timer } from '@/components'

function App(): JSX.Element {
  return (
    <>
      <RootLayout>
        <Content>
          <TicketList />
          <Timer />
        </Content>
      </RootLayout>
    </>
  )
}

export default App
