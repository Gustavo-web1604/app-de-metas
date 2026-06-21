const { app, BrowserWindow, ipcMain } = require("electron")
const path = require("path")
const fs = require("fs").promises

const caminhoMetas = path.join(app.getPath("userData"), "metas.json")

let janelaPrincipal

const criarJanela = () => {
    janelaPrincipal = new BrowserWindow({
        width: 900,
        height: 650,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false
        }
    })

    janelaPrincipal.loadFile(path.join(__dirname, "src", "index.html"))

    // Dica:
    // Descomente a linha abaixo para utilizar o DevTools(inspecionar) automaticamente se desejar:
    // janelaPrincipal.webContents.openDevTools()
}

const carregarMetas = async () => {
    try {
        const dados = await fs.readFile(caminhoMetas, "utf-8")
        return JSON.parse(dados)
    } catch (erro) {
        return []
    }
}

const salvarMetas = async (metas) => {
    await fs.writeFile(caminhoMetas, JSON.stringify(metas, null, 2))
}

ipcMain.handle("metas:carregar", async () => {
    return await carregarMetas()
})

ipcMain.handle("metas:salvar", async (event, metas) => {
    await salvarMetas(metas)
    return true
})

app.whenReady().then(criarJanela)

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit()
    }
})

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        criarJanela()
    }
})