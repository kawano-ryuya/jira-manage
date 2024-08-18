import {
  FetchJiraTicket,
  FetchJiraTickets,
  ReadData,
  SaveData,
  UpdateTimespent
} from '@shared/types'

declare global {
  interface Window {
    // electron: ElectronAPI
    context: {
      fetchJiraTickets: FetchJiraTickets
      fetchJiraTicket: FetchJiraTicket
      updateTimespent: UpdateTimespent
      saveData: SaveData
      readData: ReadData
    }
  }
}
