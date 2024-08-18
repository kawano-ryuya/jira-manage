export type TicketInfo = {
  id: string
  key: string
  fields: {
    summary: string
  }
}

export type ConfigData = {
  domain: string
  id: string
  token: string
  jql: string
}
