const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("api", {
    carregarMetas: () => ipcRenderer.invoke("metas:carregar"),
    salvarMetas: (metas) => ipcRenderer.invoke("metas:salvar", metas)
})