export type FetchJiraTickets = () => Promise<
  { id: string; key: string; fields: { summary: string } }[]
>
