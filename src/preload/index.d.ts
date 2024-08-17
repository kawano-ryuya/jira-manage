import { FetchJiraTickets } from '@shared/types'

declare global {
  interface Window {
    // electron: ElectronAPI
    context: {
      fetchJiraTickets: FetchJiraTickets
    }
  }
}
