import { Content, RootLayout, TicketList } from '@/components'

function App(): JSX.Element {
  return (
    <>
      <RootLayout>
        <Content>
          <TicketList />
        </Content>
      </RootLayout>
    </>
  )
}

export default App
