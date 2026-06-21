let metas = []
let abaAtual = "todas"

const elLista = document.getElementById("listaMetas")
const elListaVazia = document.getElementById("listaVazia")
const elInput = document.getElementById("inputMeta")
const elBtnAdicionar = document.getElementById("btnAdicionar")
const elMensagem = document.getElementById("mensagem")
const elContador = document.getElementById("contador")
const elAbas = document.querySelectorAll(".aba-btn")
const template = document.getElementById("templateMeta")

let timeoutMensagem
const mostrarMensagem = (texto, tipo = "info") => {
    clearTimeout(timeoutMensagem)
    elMensagem.textContent = texto
    elMensagem.classList.remove("oculto", "erro")
    if (tipo === "erro") elMensagem.classList.add("erro")

    timeoutMensagem = setTimeout(() => {
        elMensagem.classList.add("oculto")
    }, 2500)
}

const carregarMetas = async () => {
    metas = await window.api.carregarMetas()
}

const salvarMetas = async () => {
    await window.api.salvarMetas(metas)
}

const metasFiltradas = () => {
    if (abaAtual === "realizadas") {
        return metas.filter((m) => m.checked)
    }
    if (abaAtual === "abertas") {
        return metas.filter((m) => !m.checked)
    }
    return metas
}

const renderizar = () => {
    elLista.innerHTML = ""
    const lista = metasFiltradas()

    elListaVazia.classList.toggle("oculto", lista.length > 0)

    lista.forEach((meta) => {
        const node = template.content.cloneNode(true)
        const li = node.querySelector(".meta-item")
        const checkbox = node.querySelector(".meta-checkbox")
        const texto = node.querySelector(".meta-texto")
        const btnDeletar = node.querySelector(".btn-deletar")

        texto.textContent = meta.value
        checkbox.checked = meta.checked
        li.classList.toggle("concluida", meta.checked)

        checkbox.addEventListener("change", async () => {
            meta.checked = checkbox.checked
            await salvarMetas()
            renderizar()
            mostrarMensagem(meta.checked ? "Meta marcada como concluída!" : "Meta desmarcada.")
        })

        btnDeletar.addEventListener("click", async () => {
            metas = metas.filter((m) => m !== meta)
            await salvarMetas()
            renderizar()
            mostrarMensagem("Meta deletada com sucesso!")
        })

        elLista.appendChild(node)
    })

    const total = metas.length
    const concluidas = metas.filter((m) => m.checked).length
    elContador.textContent = `${concluidas} de ${total} meta(s) concluída(s)`
}

const cadastrarMeta = async () => {
    const valor = elInput.value.trim()

    if (valor.length === 0) {
        mostrarMensagem("A meta não pode ser vazia", "erro")
        return
    }

    metas.push({ value: valor, checked: false })
    await salvarMetas()
    elInput.value = ""
    renderizar()
    mostrarMensagem("Meta cadastrada com sucesso!")
}

elBtnAdicionar.addEventListener("click", cadastrarMeta)
elInput.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter") cadastrarMeta()
})

elAbas.forEach((botao) => {
    botao.addEventListener("click", () => {
        elAbas.forEach((b) => b.classList.remove("ativa"))
        botao.classList.add("ativa")
        abaAtual = botao.dataset.aba
        renderizar()
    })
})

const iniciar = async () => {
    await carregarMetas()
    renderizar()
}

iniciar()