import { contextBridge, ipcRenderer } from 'electron'

// contextIsolationが有効であることを確認
if (!process.contextIsolated) {
  throw new Error('contextIsolationを有効にしてください')
}

try {
  // メインプロセスのAPIをレンダラープロセスに公開
  contextBridge.exposeInMainWorld('context', {
    fetchJiraTickets: () => ipcRenderer.invoke('fetch-jira-tickets')
  })
} catch (error) {
  // エラーが発生した場合にログを出力
  console.error(error)
}
