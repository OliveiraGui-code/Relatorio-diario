const zonas = ["Benfica", "Sete Rios", "Laranjeiras", "Entre Campos", "Alvalade", "Roma", "Areeiro", "Alameda", "Campo Grande", "Almirante Reis", "Indentende", "Martin Moniz", "Rossio", "Avenida", "Restauradores", "Marques Pombal", "Picoas", "Saldanha", "Arco Cego", "Campo Pequeno", "Arroios", "Estafania", "Rato", "São Bento", "Av. General Roçada", "Eduardo VII", "Campolide"];
const tarefas = ["Organização", "Relógio", "Bateria", "Manutenção", "Rebalance"];

// guardamos o que foi feito em cada zona
const relatorio = {};
let zonaAtual = null;

const listaZonas = document.getElementById("lista-zonas");
const painel = document.getElementById("painel-zona");
const titulo = document.getElementById("titulo-zona");
const listaTarefas = document.getElementById("lista-tarefas");
const campoObservacao = document.getElementById("observacao");
const btnGuardar = document.getElementById("btn-guardar");

// Cria um botão para cada zona
zonas.forEach(function (zona) {
  const botao = document.createElement("button");
  botao.textContent = zona;
  botao.dataset.zona = zona;
  botao.addEventListener("click", function () {
    abrirZona(zona);
  });
  listaZonas.appendChild(botao);
});

function abrirZona(zona) {
  zonaAtual = zona;
  titulo.textContent = zona;
  const dados = relatorio[zona] || { tarefas: [], observacao: "" };

  listaTarefas.innerHTML = "";
  tarefas.forEach(function (tarefa) {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = tarefa;
    checkbox.checked = dados.tarefas.includes(tarefa);

    label.appendChild(checkbox);
    label.append(" " + tarefa);
    listaTarefas.appendChild(label);
  });

  campoObservacao.value = dados.observacao;
  painel.hidden = false;
}

btnGuardar.addEventListener("click", function () {
  const marcadas = listaTarefas.querySelectorAll("input:checked");
  const tarefasFeitas = Array.from(marcadas).map(function (c) {
    return c.value;
  });

  relatorio[zonaAtual] = {
    tarefas: tarefasFeitas,
    observacao: campoObservacao.value.trim(),
  };

  // Marca o botão da zona como feita
  const botaoZona = document.querySelector('[data-zona="' + zonaAtual + '"]');
  botaoZona.classList.add("feita");

  painel.hidden = true;
  console.log(relatorio);
});

const btnGerar = document.getElementById("btn-gerar");
const btnCopiar = document.getElementById("btn-copiar");
const textoRelatorio = document.getElementById("texto-relatorio");

function montarLinha(zona, dados) {
  let linha = zona;

  if (dados.tarefas.length > 0) {
    linha += " (" + dados.tarefas.join(" - ") + ")";
  }

  if (dados.observacao !== "") {
    linha += " - " + dados.observacao;
  }

  return linha;
}

function gerarRelatorio() {
  const linhas = [];

  Object.keys(relatorio).forEach(function (zona) {
    linhas.push(montarLinha(zona, relatorio[zona]));
  });

  const data = new Date().toLocaleDateString("pt-PT");
  return "Relatório " + data + "\n\n" + linhas.join("\n");
}

btnGerar.addEventListener("click", function () {
  if (Object.keys(relatorio).length === 0) {
    textoRelatorio.value = "Nenhuma zona guardada ainda.";
    return;
  }
  textoRelatorio.value = gerarRelatorio();
});

btnCopiar.addEventListener("click", function () {
  navigator.clipboard.writeText(textoRelatorio.value).then(function () {
    btnCopiar.textContent = "Copiado!";
    setTimeout(function () {
      btnCopiar.textContent = "Copiar";
    }, 1500);
  });
});