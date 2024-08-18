import { ConfigData, TicketInfo } from './models'
export type FetchJiraTickets = () => Promise<TicketInfo[]>
export type FetchJiraTicket = (key: string) => Promise<TicketInfo>
export type UpdateTimespent = (key: string, time: number) => Promise<void>
export type SaveData = (data: ConfigData) => Promise<void>
export type ReadData = () => Promise<ConfigData>
