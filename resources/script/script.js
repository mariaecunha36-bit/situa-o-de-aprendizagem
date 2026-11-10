function carregarDados(chave) {
    try {
        let dados = JSON.parse(localStorage.getItem(chave));
        return Array.isArray(dados) ? dados : [];
    } catch (erro) {
        return [];
    }
}

let moradores = carregarDados("moradores");
let solicitacoes = carregarDados("solicitacoes");
let atividades = carregarDados("atividades");
let participacoes = carregarDados("participacoes");

function mostrarTela(id, botao) {
    document.querySelectorAll(".tela").forEach(function(tela) {
        tela.classList.remove("ativa");
    });

    document.getElementById(id).classList.add("ativa");

    document.querySelectorAll(".botao-menu").forEach(function(item) {
        item.classList.remove("ativo");
    });

    if (botao) {
        botao.classList.add("ativo");
    } else {
        document.querySelectorAll(".botao-menu").forEach(function(item) {
            if (item.getAttribute("onclick").includes("'" + id + "'")) {
                item.classList.add("ativo");
            }
        });
    }
}

function salvarDados() {
    localStorage.setItem("moradores", JSON.stringify(moradores));
    localStorage.setItem("solicitacoes", JSON.stringify(solicitacoes));
    localStorage.setItem("atividades", JSON.stringify(atividades));
    localStorage.setItem("participacoes", JSON.stringify(participacoes));
}

function atualizarTela() {
    document.getElementById("totalMoradores").textContent = moradores.length;
    document.getElementById("totalSolicitacoes").textContent = solicitacoes.length;
    document.getElementById("totalAtividades").textContent = atividades.length;

    listarMoradores();
    listarSolicitacoes();
    listarAtividades();
    listarParticipacoes();
    atualizarSelects();
}

function atualizarSelects() {
    let selectMorador = document.getElementById("moradorSolicitacao");
    let selectParticipante = document.getElementById("moradorParticipacao");
    let selectAtividade = document.getElementById("atividadeParticipacao");

    let valorMorador = selectMorador.value;
    let valorParticipante = selectParticipante.value;
    let valorAtividade = selectAtividade.value;

    selectMorador.innerHTML = '<option value="">Selecione o morador</option>';
    selectParticipante.innerHTML = '<option value="">Selecione o morador</option>';
    selectAtividade.innerHTML = '<option value="">Selecione a atividade</option>';

    for (let i = 0; i < moradores.length; i++) {
        selectMorador.innerHTML += `<option value="${moradores[i].id}">${moradores[i].nome}</option>`;
        selectParticipante.innerHTML += `<option value="${moradores[i].id}">${moradores[i].nome}</option>`;
    }

    for (let i = 0; i < atividades.length; i++) {
        selectAtividade.innerHTML += `<option value="${atividades[i].id}">${atividades[i].nome}</option>`;
    }

    selectMorador.value = valorMorador;
    selectParticipante.value = valorParticipante;
    selectAtividade.value = valorAtividade;
}

// Cadastro e edição de moradores

document.querySelector("#formMorador").addEventListener("submit", function(event) {
    event.preventDefault();

    let id = document.querySelector("#moradorId").value;
    let nome = document.querySelector("#nome").value;
    let telefone = document.querySelector("#telefone").value;
    let email = document.querySelector("#email").value;
    let endereco = document.querySelector("#endereco").value;

    if (id === "") {
        moradores.push({ id: Date.now(), nome: nome, telefone: telefone, email: email, endereco: endereco });
        alert("Morador cadastrado com sucesso!");
    } else {
        for (let i = 0; i < moradores.length; i++) {
            if (moradores[i].id == id) {
                moradores[i].nome = nome;
                moradores[i].telefone = telefone;
                moradores[i].email = email;
                moradores[i].endereco = endereco;
            }
        }
        alert("Morador atualizado com sucesso!");
    }

    salvarDados();
    this.reset();
    document.querySelector("#moradorId").value = "";
    document.querySelector("#botaoMorador").textContent = "Salvar Morador";
    document.querySelector("#cancelarMorador").hidden = true;
    atualizarTela();
});

function listarMoradores() {
    let lista = document.querySelector("#listaMoradores");
    let pesquisa = document.querySelector("#pesquisa").value.toLowerCase();
    lista.innerHTML = "";
    let encontrou = false;

    for (let i = 0; i < moradores.length; i++) {
        if (moradores[i].nome.toLowerCase().includes(pesquisa)) {
            encontrou = true;
            lista.innerHTML += `
                <div class="item">
                    <strong>${moradores[i].nome}</strong><br>
                    Telefone: ${moradores[i].telefone}<br>
                    E-mail: ${moradores[i].email || "Não informado"}<br>
                    Endereço: ${moradores[i].endereco || "Não informado"}<br>
                    <button class="editar" onclick="editarMorador(${moradores[i].id})">Editar</button>
                    <button class="excluir" onclick="excluirMorador(${moradores[i].id})">Excluir</button>
                </div>`;
        }
    }

    if (!encontrou) {
        lista.innerHTML = "<p>Nenhum morador encontrado.</p>";
    }
}

function editarMorador(id) {
    for (let i = 0; i < moradores.length; i++) {
        if (moradores[i].id == id) {
            document.querySelector("#moradorId").value = moradores[i].id;
            document.querySelector("#nome").value = moradores[i].nome;
            document.querySelector("#telefone").value = moradores[i].telefone;
            document.querySelector("#email").value = moradores[i].email;
            document.querySelector("#endereco").value = moradores[i].endereco;
        }
    }
    document.querySelector("#botaoMorador").textContent = "Atualizar Morador";
    document.querySelector("#cancelarMorador").hidden = false;
    mostrarTela("moradores");
}

function excluirMorador(id) {
    if (confirm("Deseja excluir este morador e suas solicitações e participações?")) {
        moradores = moradores.filter(function(morador) { return morador.id != id; });
        solicitacoes = solicitacoes.filter(function(solicitacao) { return solicitacao.moradorId != id; });
        participacoes = participacoes.filter(function(participacao) { return participacao.moradorId != id; });
        salvarDados();
        atualizarTela();
    }
}

document.querySelector("#cancelarMorador").addEventListener("click", function() {
    document.querySelector("#formMorador").reset();
    document.querySelector("#moradorId").value = "";
    document.querySelector("#botaoMorador").textContent = "Salvar Morador";
    this.hidden = true;
});

document.querySelector("#pesquisa").addEventListener("input", listarMoradores);

// Cadastro e edição de solicitações

document.querySelector("#formSolicitacao").addEventListener("submit", function(event) {
    event.preventDefault();
    let id = document.querySelector("#solicitacaoId").value;
    let moradorId = Number(document.querySelector("#moradorSolicitacao").value);
    let descricao = document.querySelector("#descricao").value;
    let status = document.querySelector("#status").value;

    if (moradorId === 0) {
        alert("Selecione um morador!");
        return;
    }

    if (id === "") {
        solicitacoes.push({ id: Date.now(), moradorId: moradorId, descricao: descricao, status: status });
        alert("Solicitação cadastrada com sucesso!");
    } else {
        for (let i = 0; i < solicitacoes.length; i++) {
            if (solicitacoes[i].id == id) {
                solicitacoes[i].moradorId = moradorId;
                solicitacoes[i].descricao = descricao;
                solicitacoes[i].status = status;
            }
        }
        alert("Solicitação atualizada com sucesso!");
    }

    salvarDados();
    this.reset();
    document.querySelector("#solicitacaoId").value = "";
    document.querySelector("#botaoSolicitacao").textContent = "Registrar Solicitação";
    document.querySelector("#cancelarSolicitacao").hidden = true;
    atualizarTela();
});

function listarSolicitacoes() {
    let lista = document.querySelector("#listaSolicitacoes");
    lista.innerHTML = "";

    if (solicitacoes.length === 0) {
        lista.innerHTML = "<p>Nenhuma solicitação cadastrada.</p>";
        return;
    }

    for (let i = 0; i < solicitacoes.length; i++) {
        let nomeMorador = "Morador não encontrado";
        for (let j = 0; j < moradores.length; j++) {
            if (moradores[j].id == solicitacoes[i].moradorId) nomeMorador = moradores[j].nome;
        }
        lista.innerHTML += `
            <div class="item">
                <strong>${nomeMorador}</strong><br>
                Solicitação: ${solicitacoes[i].descricao}<br>
                Situação: ${solicitacoes[i].status}<br>
                <button class="editar" onclick="editarSolicitacao(${solicitacoes[i].id})">Editar</button>
                <button class="excluir" onclick="excluirSolicitacao(${solicitacoes[i].id})">Excluir</button>
            </div>`;
    }
}

function editarSolicitacao(id) {
    for (let i = 0; i < solicitacoes.length; i++) {
        if (solicitacoes[i].id == id) {
            document.querySelector("#solicitacaoId").value = solicitacoes[i].id;
            document.querySelector("#moradorSolicitacao").value = solicitacoes[i].moradorId;
            document.querySelector("#descricao").value = solicitacoes[i].descricao;
            document.querySelector("#status").value = solicitacoes[i].status;
        }
    }
    document.querySelector("#botaoSolicitacao").textContent = "Atualizar Solicitação";
    document.querySelector("#cancelarSolicitacao").hidden = false;
    mostrarTela("solicitacoes");
}

function excluirSolicitacao(id) {
    if (confirm("Deseja excluir esta solicitação?")) {
        solicitacoes = solicitacoes.filter(function(solicitacao) { return solicitacao.id != id; });
        salvarDados();
        atualizarTela();
    }
}

document.querySelector("#cancelarSolicitacao").addEventListener("click", function() {
    document.querySelector("#formSolicitacao").reset();
    document.querySelector("#solicitacaoId").value = "";
    document.querySelector("#botaoSolicitacao").textContent = "Registrar Solicitação";
    this.hidden = true;
});

// Cadastro e edição de atividades

document.querySelector("#formAtividade").addEventListener("submit", function(event) {
    event.preventDefault();
    let id = document.querySelector("#atividadeId").value;
    let nome = document.querySelector("#nomeAtividade").value;
    let data = document.querySelector("#dataAtividade").value;
    let local = document.querySelector("#localAtividade").value;

    if (id === "") {
        atividades.push({ id: Date.now(), nome: nome, data: data, local: local });
        alert("Atividade cadastrada com sucesso!");
    } else {
        for (let i = 0; i < atividades.length; i++) {
            if (atividades[i].id == id) {
                atividades[i].nome = nome;
                atividades[i].data = data;
                atividades[i].local = local;
            }
        }
        alert("Atividade atualizada com sucesso!");
    }

    salvarDados();
    this.reset();
    document.querySelector("#atividadeId").value = "";
    document.querySelector("#botaoAtividade").textContent = "Cadastrar Atividade";
    document.querySelector("#cancelarAtividade").hidden = true;
    atualizarTela();
});

function listarAtividades() {
    let lista = document.querySelector("#listaAtividades");
    lista.innerHTML = "";

    if (atividades.length === 0) {
        lista.innerHTML = "<p>Nenhuma atividade cadastrada.</p>";
        return;
    }

    for (let i = 0; i < atividades.length; i++) {
        lista.innerHTML += `
            <div class="item">
                <strong>${atividades[i].nome}</strong><br>
                Data: ${atividades[i].data}<br>
                Local: ${atividades[i].local}<br>
                <button class="editar" onclick="editarAtividade(${atividades[i].id})">Editar</button>
                <button class="excluir" onclick="excluirAtividade(${atividades[i].id})">Excluir</button>
            </div>`;
    }
}

function editarAtividade(id) {
    for (let i = 0; i < atividades.length; i++) {
        if (atividades[i].id == id) {
            document.querySelector("#atividadeId").value = atividades[i].id;
            document.querySelector("#nomeAtividade").value = atividades[i].nome;
            document.querySelector("#dataAtividade").value = atividades[i].data;
            document.querySelector("#localAtividade").value = atividades[i].local;
        }
    }
    document.querySelector("#botaoAtividade").textContent = "Atualizar Atividade";
    document.querySelector("#cancelarAtividade").hidden = false;
    mostrarTela("atividades");
}

function excluirAtividade(id) {
    if (confirm("Deseja excluir esta atividade e suas participações?")) {
        atividades = atividades.filter(function(atividade) { return atividade.id != id; });
        participacoes = participacoes.filter(function(participacao) { return participacao.atividadeId != id; });
        salvarDados();
        atualizarTela();
    }
}

document.querySelector("#cancelarAtividade").addEventListener("click", function() {
    document.querySelector("#formAtividade").reset();
    document.querySelector("#atividadeId").value = "";
    document.querySelector("#botaoAtividade").textContent = "Cadastrar Atividade";
    this.hidden = true;
});

// Registro de participação dos moradores

document.querySelector("#formParticipacao").addEventListener("submit", function(event) {
    event.preventDefault();
    let id = document.querySelector("#participacaoId").value;
    let moradorId = Number(document.querySelector("#moradorParticipacao").value);
    let atividadeId = Number(document.querySelector("#atividadeParticipacao").value);

    if (moradorId === 0 || atividadeId === 0) {
        alert("Selecione o morador e a atividade!");
        return;
    }

    if (id === "") {
        participacoes.push({ id: Date.now(), moradorId: moradorId, atividadeId: atividadeId });
        alert("Participação registrada com sucesso!");
    } else {
        for (let i = 0; i < participacoes.length; i++) {
            if (participacoes[i].id == id) {
                participacoes[i].moradorId = moradorId;
                participacoes[i].atividadeId = atividadeId;
            }
        }
        alert("Participação atualizada com sucesso!");
    }

    salvarDados();
    this.reset();
    document.querySelector("#participacaoId").value = "";
    document.querySelector("#botaoParticipacao").textContent = "Registrar Participação";
    document.querySelector("#cancelarParticipacao").hidden = true;
    atualizarTela();
});

function listarParticipacoes() {
    let lista = document.querySelector("#listaParticipacoes");
    lista.innerHTML = "";

    if (participacoes.length === 0) {
        lista.innerHTML = "<p>Nenhuma participação registrada.</p>";
        return;
    }

    for (let i = 0; i < participacoes.length; i++) {
        let nomeMorador = "Morador não encontrado";
        let nomeAtividade = "Atividade não encontrada";

        for (let j = 0; j < moradores.length; j++) {
            if (moradores[j].id == participacoes[i].moradorId) nomeMorador = moradores[j].nome;
        }
        for (let j = 0; j < atividades.length; j++) {
            if (atividades[j].id == participacoes[i].atividadeId) nomeAtividade = atividades[j].nome;
        }

        lista.innerHTML += `
            <div class="item">
                <strong>${nomeMorador}</strong><br>
                Atividade: ${nomeAtividade}<br>
                <button class="editar" onclick="editarParticipacao(${participacoes[i].id})">Editar</button>
                <button class="excluir" onclick="excluirParticipacao(${participacoes[i].id})">Excluir</button>
            </div>`;
    }
}

function editarParticipacao(id) {
    for (let i = 0; i < participacoes.length; i++) {
        if (participacoes[i].id == id) {
            document.querySelector("#participacaoId").value = participacoes[i].id;
            document.querySelector("#moradorParticipacao").value = participacoes[i].moradorId;
            document.querySelector("#atividadeParticipacao").value = participacoes[i].atividadeId;
        }
    }
    document.querySelector("#botaoParticipacao").textContent = "Atualizar Participação";
    document.querySelector("#cancelarParticipacao").hidden = false;
    mostrarTela("atividades");
}

function excluirParticipacao(id) {
    if (confirm("Deseja excluir esta participação?")) {
        participacoes = participacoes.filter(function(participacao) { return participacao.id != id; });
        salvarDados();
        atualizarTela();
    }
}

document.querySelector("#cancelarParticipacao").addEventListener("click", function() {
    document.querySelector("#formParticipacao").reset();
    document.querySelector("#participacaoId").value = "";
    document.querySelector("#botaoParticipacao").textContent = "Registrar Participação";
    this.hidden = true;
});

atualizarTela();
