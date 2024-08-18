export type TicketInfo = {
  id: string
  key: string
  fields: {
    summary: string
    timespent: number
  }
}

export type ConfigData = {
  domain: string
  id: string
  token: string
  jql: string
}
