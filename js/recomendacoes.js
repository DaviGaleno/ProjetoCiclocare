const API_BASE_URL = "http://localhost:8080/api";
const modoGestanteOn = localStorage.getItem("modoGestante") === "true";


const fallbackRecommendations = [
  {
    titulo: "Priorize refeições leves e ricas em ferro",
    descricao: "Inclua folhas verde-escuras, feijão, ovos ou carnes magras para apoiar o corpo durante a fase menstrual.",
    categoria: "alimentacao",
    fase: "MENSTRUAL",
    tempoLeitura: "3 min",
    icone: "fa-solid fa-bowl-food",
    tags: ["ferro", "energia"]
  },
  {
    titulo: "Use calor local para aliviar cólicas",
    descricao: "Bolsa térmica morna e pausas de descanso podem ajudar quando houver desconforto abdominal.",
    categoria: "cuidados",
    fase: "MENSTRUAL",
    tempoLeitura: "2 min",
    icone: "fa-solid fa-temperature-half",
    tags: ["cólica", "conforto"]
  },
  {
    titulo: "Movimentos leves podem melhorar o humor",
    descricao: "Caminhada curta, alongamento ou yoga suave ajudam a reduzir tensão sem exigir esforço alto.",
    categoria: "atividade",
    fase: "FOLICULAR",
    tempoLeitura: "4 min",
    icone: "fa-solid fa-person-walking",
    tags: ["movimento", "humor"]
  },
  {
    titulo: "Observe sinais da janela fértil",
    descricao: "Mudanças no muco cervical, libido e disposição podem indicar aproximação da ovulação.",
    categoria: "cuidados",
    fase: "OVULACAO",
    tempoLeitura: "3 min",
    icone: "fa-solid fa-seedling",
    tags: ["ovulação", "autoconhecimento"]
  },
  {
    titulo: "Reduza cafeína se houver irritabilidade",
    descricao: "Na fase lútea, trocar parte do café por chás sem cafeína pode suavizar ansiedade e sensibilidade.",
    categoria: "bem-estar",
    fase: "LUTEA",
    tempoLeitura: "2 min",
    icone: "fa-solid fa-mug-hot",
    tags: ["PMS", "sono"]
  },
  {
    titulo: "Planeje uma rotina de sono mais estável",
    descricao: "Horários consistentes e menos tela antes de dormir ajudam especialmente quando há cansaço ou oscilação de humor.",
    categoria: "bem-estar",
    fase: "LUTEA",
    tempoLeitura: "3 min",
    icone: "fa-regular fa-moon",
    tags: ["descanso", "rotina"]
  }
];

const fallbackGestanteRecommendations = [
  {
    titulo: "Mantenha o acompanhamento pré-natal",
    descricao: "Consultas regulares ajudam a acompanhar a evolução da gestação e identificar cuidados necessários.",
    categoria: "cuidados",
    tempoLeitura: "3 min",
    icone: "fa-solid fa-user-doctor",
    tags: ["pré-natal", "acompanhamento"]
  },
  {
    titulo: "Priorize hidratação ao longo do dia",
    descricao: "A hidratação adequada é importante durante a gestação. Ajuste sua ingestão conforme orientação profissional.",
    categoria: "alimentacao",
    tempoLeitura: "2 min",
    icone: "fa-solid fa-droplet",
    tags: ["hidratação", "bem-estar"]
  },
  {
    titulo: "Prefira movimentos leves e seguros",
    descricao: "Caminhadas leves e alongamentos podem ajudar no bem-estar, desde que estejam liberados para você.",
    categoria: "atividade",
    tempoLeitura: "3 min",
    icone: "fa-solid fa-person-walking",
    tags: ["movimento", "gestação"]
  }
];

let recommendations = [];
let activeFilter = "todas";

const dropdownBtn = document.querySelector(".dropdown-btn");
const dropdownContent = document.querySelector(".dropdown-content");
const bellIcon = document.querySelector(".bell-icon");
const notificationSidebar = document.querySelector(".notification-sidebar");
const closeSidebar = document.querySelector(".close-sidebar");
const usuarioInfo = document.querySelector(".usuario-info");
const profileDropdown = document.querySelector(".profile-dropdown");
const grid = document.getElementById("recommendationsGrid");
const statusText = document.getElementById("statusRecomendacoes");
const faseAtual = document.getElementById("faseAtual");
const resumoCiclo = document.getElementById("resumoCiclo");
const nomeUsuario = document.getElementById("nomeUsuario");

if (dropdownBtn && dropdownContent) {
  dropdownBtn.addEventListener("click", () => {
    dropdownContent.classList.toggle("active");
  });
}

if (bellIcon && notificationSidebar) {
  bellIcon.addEventListener("click", () => {
    notificationSidebar.classList.add("active");
  });
}

if (closeSidebar && notificationSidebar) {
  closeSidebar.addEventListener("click", () => {
    notificationSidebar.classList.remove("active");
  });
}

if (usuarioInfo && profileDropdown) {
  usuarioInfo.addEventListener("click", () => {
    profileDropdown.classList.toggle("active");
  });
}

function carregarUsuario() {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");

  if (usuario && usuario.nome && nomeUsuario) {
    nomeUsuario.textContent = `Olá, ${usuario.nome.split(" ")[0]}`;
  }
}

function formatarFase(fase) {
  const fases = {
    MENSTRUAL: "Menstruação",
    FOLICULAR: "Fase folicular",
    OVULACAO: "Ovulação",
    LUTEA: "Fase lútea"
  };

  return fases[fase] || fase || "Ciclo";
}

function normalizarLista(payload) {
  const dados = payload && payload.dados ? payload.dados : payload;

  if (Array.isArray(dados)) {
    return { lista: dados };
  }

  if (dados && Array.isArray(dados.recomendacoes)) {
    return {
      lista: dados.recomendacoes,
      faseCiclo: dados.faseCiclo,
      diaCiclo: dados.diaCiclo,
      mensagem: dados.mensagem
    };
  }

  return { lista: [] };
}

function normalizarRecomendacao(item, index) {
  return {
    titulo: item.titulo || item.title || `Recomendação ${index + 1}`,
    descricao: item.descricao || item.description || item.mensagem || "Recomendação personalizada para o seu ciclo.",
    categoria: (item.categoria || item.category || "cuidados").toLowerCase(),
    fase: item.fase || item.faseCiclo || "",
    tempoLeitura: item.tempoLeitura || item.tempo || "2 min",
    icone: item.icone || item.icon || escolherIcone(item.categoria),
    tags: item.tags || item.sintomasRelacionados || []
  };
}

function escolherIcone(categoria) {
  const chave = (categoria || "").toLowerCase();

  if (chave.includes("aliment")) return "fa-solid fa-bowl-food";
  if (chave.includes("atividade")) return "fa-solid fa-person-walking";
  if (chave.includes("bem")) return "fa-regular fa-heart";
  return "fa-solid fa-spa";
}

function renderizarRecomendacoes() {
  const filtradas = activeFilter === "todas"
    ? recommendations
    : recommendations.filter((item) => item.categoria === activeFilter);

  grid.innerHTML = "";

  if (!filtradas.length) {
    grid.innerHTML = '<div class="empty-state">Nenhuma recomendação encontrada para este filtro.</div>';
    statusText.textContent = "0 recomendações";
    return;
  }

  filtradas.forEach((item) => {
    const card = document.createElement("article");
    card.className = "recommendation-card";

    const tags = item.tags
      .slice(0, 3)
      .map((tag) => `<small>${tag}</small>`)
      .join("");

    card.innerHTML = `
      <div class="card-visual">
        <i class="${item.icone}"></i>
      </div>
      <div class="card-body">
        <div class="card-meta">
          <span>${formatarCategoria(item.categoria)}</span>
          <small>${item.tempoLeitura}</small>
        </div>
        <h3>${item.titulo}</h3>
        <p>${item.descricao}</p>
        <div class="card-tags">${tags}</div>
      </div>
    `;

    grid.appendChild(card);
  });

  statusText.textContent = `${filtradas.length} recomendações`;
}

function formatarCategoria(categoria) {
  const categorias = {
    alimentacao: "Alimentação",
    "bem-estar": "Bem-estar",
    atividade: "Atividade",
    cuidados: "Cuidados"
  };

  return categorias[categoria] || "Cuidados";
}

function configurarFiltros() {
  document.querySelectorAll(".filter-chip").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".filter-chip").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      activeFilter = button.dataset.filter;
      renderizarRecomendacoes();
    });
  });
}

async function carregarResumoDashboard() {
  const usuarioId = localStorage.getItem("usuarioId");
  const token = localStorage.getItem("token");

  if (!usuarioId || !token) {
    faseAtual.textContent = "Perfil não conectado";
    resumoCiclo.textContent = "Faça login para carregar dados reais do ciclo.";
    return null;
  }

  const response = await fetch(`${API_BASE_URL}/usuarios/${usuarioId}/dashboard`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!response.ok) {
    throw new Error(`Dashboard ${response.status}`);
  }

  const data = await response.json();
  faseAtual.textContent = formatarFase(data.faseCiclo);
  resumoCiclo.textContent = data.diaCiclo
    ? `Dia ${data.diaCiclo} do ciclo. ${data.mensagem || ""}`
    : data.mensagem || "Dados do ciclo carregados.";

  return data;
}

async function carregarRecomendacoesGestante() {
  const token = localStorage.getItem("token");
  const usuarioId = localStorage.getItem("usuarioId");

  statusText.textContent = "Carregando recomendações da gestação";

  const headers = {
    Authorization: `Bearer ${token}`
  };

  const responseGestante = await fetch(
    `${API_BASE_URL}/usuarios/${usuarioId}/modo-gestante`,
    { headers }
  );

  if (!responseGestante.ok) {
    throw new Error(`Modo gestante ${responseGestante.status}`);
  }

  const dadosGestante = await responseGestante.json();

  faseAtual.textContent = dadosGestante.faseGestacional;

  resumoCiclo.textContent =
    `${dadosGestante.semanaAtual}ª semana de gestação. ${dadosGestante.mensagemFaseGestacao || ""}`;

  const responseRecomendacoes = await fetch(
    `${API_BASE_URL}/recomendacoes/gestante?id=${usuarioId}`,
    { headers }
  );

  if (!responseRecomendacoes.ok) {
    throw new Error(`Recomendações ${responseRecomendacoes.status}`);
  }

  const payloadRecomendacoes = await responseRecomendacoes.json();
  const resultado = normalizarLista(payloadRecomendacoes);

  recommendations =
    resultado.lista.map(normalizarRecomendacao);

  statusText.textContent =
    `${recommendations.length} recomendações`;

  renderizarRecomendacoes();

}

async function carregarRecomendacoes() {
  const token = localStorage.getItem("token");
  const usuarioId = localStorage.getItem("usuarioId");

  try {
    if (modoGestanteOn) {
      await carregarRecomendacoesGestante();
      return;
    }

    statusText.textContent = "Carregando do backend";

    const resumo = await carregarResumoDashboard();

    const params = new URLSearchParams();

    if (usuarioId) {
      params.set("usuarioId", usuarioId);
    }

    if (resumo && resumo.faseCiclo) {
      params.set("faseCiclo", resumo.faseCiclo);
    }

    const response = await fetch(
      `${API_BASE_URL}/recomendacoes?${params.toString()}`,
      {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : {}
      }
    );

    if (!response.ok) {
      throw new Error(`Recomendações ${response.status}`);
    }

    const payload = await response.json();
    const resultado = normalizarLista(payload);

    recommendations =
      resultado.lista.map(normalizarRecomendacao);

    if (resultado.faseCiclo) {
      faseAtual.textContent =
        formatarFase(resultado.faseCiclo);
    }

    if (resultado.mensagem) {
      resumoCiclo.textContent =
        resultado.mensagem;
    }

    if (!recommendations.length) {
      recommendations =
        fallbackRecommendations.map(normalizarRecomendacao);

      statusText.textContent =
        "Exibindo sugestões iniciais";
    }

    renderizarRecomendacoes();

  } catch (error) {
    console.warn("Erro ao carregar recomendações:", error);

    recommendations = modoGestanteOn
      ? fallbackGestanteRecommendations.map(normalizarRecomendacao)
      : fallbackRecommendations.map(normalizarRecomendacao);

    if (modoGestanteOn) {
      faseAtual.textContent = "Gestação";
      resumoCiclo.textContent =
        "Não foi possível carregar recomendações personalizadas da gestação agora.";
    } else {
      faseAtual.textContent = "Sugestões iniciais";
      resumoCiclo.textContent =
        "A página já está pronta para receber recomendações personalizadas do backend.";
    }

    statusText.textContent =
      "Exibindo sugestões iniciais";

    renderizarRecomendacoes();
  }
}

carregarUsuario();
configurarFiltros();
carregarRecomendacoes();
