import { ConfigData } from '@shared/models'
import { useEffect, useState } from 'react'

export type ModalProps = {
  config: ConfigData
  setConfig: (config: ConfigData) => void
  open: boolean
  onCancel: () => void
  onOk: () => void
}

export const Config = (props: ModalProps) => {
  const [config, setConfig] = useState<ConfigData>(props.config)
  useEffect(() => {
    setConfig(props.config)
  }, [props.config])
  const handleSave = async () => {
    console.log('save', config)
    await window.context.saveData(config)
    console.log('saved')
    props.onOk()
  }
  return props.open ? (
    <>
      <div className="bg-white  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-60 p-5 flex flex-col items-start absolute z-20">
        <h1 className="text-xl font-bold">Config</h1>
        <div className="flex gap-2 mt-2">
          <label className="text-lg inline-block w-[60px]">domain</label>
          <input
            type="text"
            placeholder="ドメインを入力"
            className="border px-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 truncate"
            value={config.domain}
            onChange={(e) => setConfig({ ...config, domain: e.target.value })}
          />
        </div>
        <div className="flex gap-2 mt-2">
          <label className="text-lg inline-block w-[60px]">ID</label>
          <input
            type="text"
            placeholder="メールアドレスを入力"
            className="border px-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 truncate"
            value={config.id}
            onChange={(e) => setConfig({ ...config, id: e.target.value })}
          />
        </div>
        <div className="flex gap-2 mt-2">
          <label className="text-lg inline-block w-[60px]">token</label>
          <input
            type="password"
            placeholder="JIRA API tokenを入力"
            className="border px-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 truncate"
            value={config.token}
            onChange={(e) => setConfig({ ...config, token: e.target.value })}
          />
        </div>
        <div className="flex gap-2 mt-2">
          <label className="text-lg inline-block w-[60px]">JQL</label>
          <input
            type="text"
            placeholder="JQLを入力"
            className="border px-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 truncate"
            value={config.jql}
            onChange={(e) => setConfig({ ...config, jql: e.target.value })}
          />
        </div>
        <div className="flex mt-2 w-full">
          <button
            className="bg-slate-900 hover:bg-slate-700 text-white py-1 mx-auto w-[100px] "
            onClick={handleSave}
          >
            保存
          </button>
          <button
            className="bg-slate-900 hover:bg-slate-700 text-white py-1 mx-auto w-[100px] "
            onClick={() => props.onCancel()}
          >
            cancel
          </button>
        </div>
      </div>
      <div
        className="fixed bg-black bg-opacity-50 w-full h-full z-10"
        onClick={() => props.onCancel()}
      ></div>
    </>
  ) : (
    <></>
  )
}
