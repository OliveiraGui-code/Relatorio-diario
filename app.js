let zonas = ["Benfica", "Sete Rios", "Laranjeiras","São Sebastião", "Bairro do Rego", "Entre Campos", "Alvalade", "Roma", "Areeiro", "Alameda", "Campo Grande", "Almirante Reis", "Indentende", "Martin Moniz", "Rossio", "Avenida", "Restauradores", "Marques Pombal", "Picoas", "Saldanha", "Arco Cego", "Campo Pequeno", "Arroios", "Estafania", "Rato", "São Bento", "Av. General Roçada", "Eduardo VII", "Campolide"];
let tarefas = ["Organização", "Relógio", "Bateria", "Manutenção", "Rebalance"];


const relatorio = {};
let zonaAtual = null;

const listaZonas = document.getElementById("lista-zonas");
const painel = document.getElementById("painel-zona");
const titulo = document.getElementById("titulo-zona");
const listaTarefas = document.getElementById("lista-tarefas");
const campoObservacao = document.getElementById("observacao");
const btnGuardar = document.getElementById("btn-guardar");
const Novazona = document.getElementById("nova-zona"); 
const btnAddZona = document.getElementById("btn-add-zona"); 

function desenharZonas(){
  listaZonas.innerHTML = "";
zonas.forEach(function (zona) {
  const botao = document.createElement("button");
  botao.textContent = zona;
  botao.dataset.zona = zona;
  botao.addEventListener("click", function () {
    abrirZona(zona);
  });
  listaZonas.appendChild(botao);
});
}
desenharZonas();

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

  guardarNoTelemovel();

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

const btnWhatsapp = document.getElementById("btn-whatsapp");

btnWhatsapp.addEventListener("click", function () {
  const texto = textoRelatorio.value.trim();

  if (texto === "" || texto === "Nenhuma zona guardada ainda.") {
    alert("Gere o relatório primeiro.");
    return;
  }

  const url = "https://wa.me/?text=" + encodeURIComponent(texto);
  window.open(url, "_blank");
});

const CHAVE = "relatorio-diario";
const CHAVE_ZONAS = "zonas-lista";
const CHAVE_TAREFAS = "tarefas-lista";

function guardarNoTelemovel() {
  localStorage.setItem(CHAVE, JSON.stringify(relatorio));
}

function guardarListas() {
  localStorage.setItem(CHAVE_TAREFAS, JSON.stringify(tarefas));
  localStorage.setItem(CHAVE_ZONAS, JSON.stringify(zonas));
}

function carregarListas(){
  const textoZonas = localStorage.getItem(CHAVE_ZONAS);
  if (textoZonas !== null) {
    zonas = JSON.parse(textoZonas);
  }
  const textoTarefas = localStorage.getItem(CHAVE_TAREFAS);
  if (textoTarefas !== null) {
    zonas = JSON.parse(textoTarefas);
  }

}

function carregarDoTelemovel() {
  const texto = localStorage.getItem(CHAVE);
  if (texto === null) {
    return; 
  }

  Object.assign(relatorio, JSON.parse(texto));

  
  Object.keys(relatorio).forEach(function (zona) {
    const botaoZona = document.querySelector('[data-zona="' + zona + '"]');
    if (botaoZona) {
      botaoZona.classList.add("feita");
    }
  });
}

carregarDoTelemovel();

const btnLimpar = document.getElementById("btn-limpar");

btnLimpar.addEventListener("click", function () {
  if (!confirm("Apagar todas as zonas de hoje?")) {
    return;
  }

  Object.keys(relatorio).forEach(function (zona) {
    delete relatorio[zona];
  });
  localStorage.removeItem(CHAVE);

  document.querySelectorAll("button.feita").forEach(function (b) {
    b.classList.remove("feita");
  });
  textoRelatorio.value = "";
  painel.hidden = true;
});

btnAddZona.addEventListener("click", function(){
  const texto = Novazona.value.trim();

  if (texto === "") {
    alert("Escreva o nome da zona");
    return;
  }

  if (zonas.includes(texto)) {
    alert("Essa zona já existe!!");
    return;
  }

  zonas.push(texto);
  guardarListas();
  desenharZonas();
  Novazona.value = "";

});

let modoEdicao = false;
const btnEditar = document.getElementById("btn-editar");

btnEditar.addEventListener("click", function (){
  modoEdicao = !modoEdicao; //o "!" significa que é "não" ou "o contrario de"
 
  if (modoEdicao === true) {
    btnEditar.textContent = "Concluir";
  } else {
    btnEditar.textContent = "Editar ✏️";
  }
});