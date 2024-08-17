/* eslint-disable prettier/prettier */
import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import axios from 'axios'
import { BrowserWindow, app, ipcMain, shell } from 'electron'
import { join } from 'path'
import icon from '../../resources/icon.png?asset'

function createWindow(): void {
  // ブラウザウィンドウを作成
  const mainWindow = new BrowserWindow({
    width: 400,
    height: 300,
    show: false,
    //背景色を透過
    // transparent: true,
    // frame: false,
    autoHideMenuBar: true, // メニューバーを非表示
    ...(process.platform === 'linux' ? { icon } : {}), // Linuxの場合はアイコンを設定
    // メインプロセスのコードで使用するエイリアスを設定
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'), // プリロードスクリプトを設定。これにより、レンダラープロセスでNode.jsのAPIを使用できる
      sandbox: true, // サンドボックスモードを有効にする。これにより、レンダラープロセスがファイルシステムにアクセスできなくなる
      contextIsolation: true // コンテキスト分離を有効にする。これにより、レンダラープロセスからメインプロセスのAPIに直接アクセスできなくなる
    }
  })

  // レンダラープロセスに渡すデータを設定
  mainWindow.on('ready-to-show', () => { // ウィンドウが表示される準備ができたときに発生
    mainWindow.show() // ウィンドウを表示
  })

  // レンダラープロセスからのメッセージを受信
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url) // レンダラープロセスからのリンクをブラウザで開く
    return { action: 'deny' } // リンクを開かない
  })

  // electron-vite cliをベースにしたレンダラーのHMR
  // 開発時はリモートURLを読み込み、本番時はローカルのHTMLファイルを読み込む
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) { // 開発時かつELECTRON_RENDERER_URLが設定されている場合
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']) // レンダラープロセスのURLを設定
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html')) // レンダラープロセスのファイルを設定
  }
}

// このメソッドはElectronが初期化を終え、ブラウザウィンドウを作成する準備ができたときに呼び出されます。
// ブラウザウィンドウを作成する準備ができたときに呼び出されます。
// このイベントが発生した後にのみ、一部のAPIを使用できます。
app.whenReady().then(() => { // WindowsのアプリケーションユーザーモデルIDを設定
  electronApp.setAppUserModelId('com.electron') // アプリケーションのユーザーモデルIDを設定

  // 開発時にF12でDevToolsを開いたり閉じたりする
  // 本番環境ではCommandOrControl + Rを無視する
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => { // ブラウザウィンドウが作成されたときに発生
    optimizer.watchWindowShortcuts(window) // ウィンドウのショートカットを監視
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong')) // pingを受信したらpongを出力

  ipcMain.handle('fetch-jira-tickets', async () => {
    try {
      const response = await axios.get('https://panasonic-connect.atlassian.net/rest/api/3/search', {
        params: {
          jql: 'assignee=currentuser() AND project=KPASC'
        },
        auth: {
          username: 'kawano.ryuya@jp.panasonic.com',
          password: 'ATATT3xFfGF068wN_yT4ADOnpyCEMd9pcqDMm_tmhfZnewDZxOoCjVzuz1Sy_lviacnCXoGUqOnCL5U5mLNVrvKIvgQu6Oev61f2fPP_Me98TW3PdKK1eoatY1ix6B_irNt_VzQf5h4UrkTAa4lj5axcaOCYSvgn1W4NgU92hQuLf8IP4j4Hm4c=CE928D15'
        }
      });
      return response.data.issues;
    } catch (error) {
      console.error('Error fetching tickets:', error);
      throw error;
    }
  });


  createWindow() // ウィンドウを作成

  app.on('activate', function () {
    // macOSでは、アプリケーション内にウィンドウがないときにdockアイコンがクリックされると、ウィンドウを再作成するのが一般的です。
    if (BrowserWindow.getAllWindows().length === 0) createWindow() // ウィンドウがない場合はウィンドウを作成
  })
})

// すべてのウィンドウが閉じられたときに終了しますが、macOSでは一般的に、
// ユーザーがCmd + Qを押すまでアクティブなままにするため、アプリケーションとメニューバーがアクティブなままになります。
app.on('window-all-closed', () => { // すべてのウィンドウが閉じられたときに発生
  // eslint-disable-next-line prettier/prettier
  if (process.platform !== 'darwin') { // macOS以外の場合
    app.quit() // アプリケーションを終了
  }
})

// このファイルには、アプリケーションの残りのメインプロセス固有のコードを含めることができます。
// それらを別々のファイルに配置し、ここでrequireすることもできます。
