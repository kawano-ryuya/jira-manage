import { ConfigData, TicketInfo } from './models'
export type FetchJiraTickets = () => Promise<TicketInfo[]>
export type SaveData = (data: ConfigData) => Promise<void>
export type ReadData = () => Promise<ConfigData>
