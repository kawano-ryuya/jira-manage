/* eslint-disable prettier/prettier */
import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { ConfigData } from '@shared/models'
import axios from 'axios'
import { app, BrowserWindow, ipcMain, Menu, shell, Tray } from 'electron'
import ElectronStore from 'electron-store'
import { join } from 'path'
import icon from '../../resources/icon.png?asset'

// SSL証明書の検証を無効にする
// これにより、自己署名証明書を使用しているサーバーからデータを取得できるようになります。
// 参考: https://stackoverflow.com/questions/31673587/ignore-invalid-self-signed-ssl-certificate-in-node-js-with-https-request
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const store = new ElectronStore<ConfigData>();
let config = store.store;
let tray;
let isQuiting = false; // ウィンドウの終了フラグをアプリスコープ

// シングルインスタンスロックをリクエスト
const gotTheLock = app.requestSingleInstanceLock();

function createWindow(): void {
  // ブラウザウィンドウを作成
  const mainWindow = new BrowserWindow({
    width: 400,
    height: 300,
    minWidth: 400,
    minHeight: 300,
    maxWidth: 400,
    maxHeight: 300,
    alwaysOnTop: true,
    show: false,
    title: 'jira工数入力',
    //背景色を透過
    transparent: true,
    frame: false,
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
  mainWindow.on('blur', () => {
    mainWindow.setOpacity(0.7);
  });

  mainWindow.on('focus', () => {
    mainWindow.setOpacity(1);
  });

  tray = new Tray(join(__dirname, '../../resources/icon.png'));

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show App', click: () => mainWindow.show() },
    {
      label: 'Quit', click: () => {
        isQuiting = true; // 終了フラグを立てる
        app.quit();
      }
    }
  ]);

  tray.setToolTip('jira工数入力');
  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    mainWindow.show();
  });

  mainWindow.on('close', (event) => {
    if (!isQuiting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });
}


if (!gotTheLock) {
  // 別のインスタンスがすでに起動している場合はアプリを終了する
  app.quit();
} else {
  app.on('second-instance', (_event, _commandLine, _workingDirectory) => {
    // すでに別のインスタンスが起動している場合に実行されます
    // 既存のウインドウを前面に表示する
    const mainWindow = BrowserWindow.getAllWindows()[0];
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.on('before-quit', () => {
    isQuiting = true; // アプリケーション終了フラグを設定
  });
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

    // SSL証明書の検証を無効にする
    app.on('certificate-error', (event, _webContents, _url, _error, _certificate, callback) => {
      event.preventDefault()
      callback(true)
    })

    // クライアント証明書の選択を無効にする
    app.on('select-client-certificate', (event, _webContents, _url, list, callback) => {
      event.preventDefault()
      callback(list[0])
    })

    // IPC test
    ipcMain.on('ping', () => console.log('pong')) // pingを受信したらpongを出力

    ipcMain.handle('save-data', (_, data: ConfigData) => {
      store.set('domain', data.domain);
      store.set('id', data.id);
      store.set('token', data.token);
      store.set('jql', data.jql);
      config = data;
    });

    ipcMain.handle('read-data', () => {
      return store.store;
    });

    ipcMain.handle('fetch-jira-tickets', async () => {
      try {
        const response = await axios.get(`https://${config.domain}/rest/api/3/search`, {
          params: {
            jql: config.jql,
            maxResults: 1000,
          },
          auth: {
            username: config.id,
            password: config.token
          }
        });
        return response.data.issues;
      } catch (error) {
        console.error('Error fetching tickets:', error);
        throw error;
      }
    });

    ipcMain.handle('fetch-jira-ticket', async (_, key: string) => {
      try {
        const response = await axios.get(`https://${config.domain}/rest/api/3/issue/${key}`, {
          auth: {
            username: config.id,
            password: config.token
          }
        });
        return response.data;
      } catch (error) {
        console.error('Error fetching ticket:', error);
        throw error;
      }
    })

    ipcMain.handle('update-timespent', async (_, key: string, time: number) => {
      try {
        await axios.post(`https://${config.domain}/rest/api/3/issue/${key}/worklog`, {
          timeSpentSeconds: time
        }, {
          auth: {
            username: config.id,
            password: config.token
          }
        });
      } catch (error) {
        console.error('Error updating timespent:', error);
        throw error;
      }
    })


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
}
