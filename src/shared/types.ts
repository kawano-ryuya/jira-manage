export type FetchJiraTickets = () => Promise<{ id: string; fields: { summary: string } }[]>
