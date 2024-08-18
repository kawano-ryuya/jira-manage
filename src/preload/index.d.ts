import { FetchJiraTickets, ReadData, SaveData } from '@shared/types'

declare global {
  interface Window {
    // electron: ElectronAPI
    context: {
      fetchJiraTickets: FetchJiraTickets
      saveData: SaveData
      readData: ReadData
    }
  }
}
