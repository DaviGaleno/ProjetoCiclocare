// USUÁRIO LOGADO
const usuario =
JSON.parse(
  localStorage.getItem('usuario')
);

const nomeUsuario =
document.getElementById('nomeUsuario');

if(usuario && nomeUsuario){

  nomeUsuario.textContent =
  `Olá, ${usuario.nome}`;

}
// =========================
// DROPDOWN MENU
// =========================

const dropdownBtn =
document.querySelector(".dropdown-btn");

const dropdownContent =
document.querySelector(".dropdown-content");

if (dropdownBtn && dropdownContent) {
  dropdownBtn.addEventListener("click", () => {
    dropdownContent.classList.toggle("active");
  });
}


// =========================
// SIDEBAR NOTIFICAÇÕES
// =========================

const bellIcon =
document.querySelector(".bell-icon");

const notificationSidebar =
document.querySelector(".notification-sidebar");

const closeSidebar =
document.querySelector(".close-sidebar");

// ABRIR SIDEBAR

if (bellIcon && notificationSidebar) {

  bellIcon.addEventListener("click", () => {

    notificationSidebar.classList.add("active");

  });
}

// FECHAR SIDEBAR

if (closeSidebar && notificationSidebar) {

  closeSidebar.addEventListener("click", () => {

    notificationSidebar.classList.remove("active");

  });
}

// =========================
// DROPDOWN PERFIL
// =========================

const usuarioInfo =
document.querySelector(".usuario-info");

const profileDropdown =
document.querySelector(".profile-dropdown");

if (usuarioInfo && profileDropdown) {

  usuarioInfo.addEventListener("click", () => {

    profileDropdown.classList.toggle("active");

  });
}

// =========================
// CALENDÁRIO
// =========================

const monthYear =
document.getElementById("monthYear");

const calendarGrid =
document.getElementById("calendarGrid");

const prevMonth =
document.getElementById("prevMonth");

const nextMonth =
document.getElementById("nextMonth");

let currentDate = new Date();

const metaAguaPadrao = 2.25;
const metaAguaGestante = 2.75;
const passoAgua = 0.25;

let aguaConsumida = 0;

function obterMetaAgua() {
  const modoGestanteAtivo =
    localStorage.getItem("modoGestante") === "true";

  return modoGestanteAtivo
    ? metaAguaGestante
    : metaAguaPadrao;
}

function atualizarCardAgua() {
  const metaAgua = obterMetaAgua();

  document.getElementById("aguaConsumidaTexto").textContent =
    aguaConsumida.toFixed(2).replace(".", ",");

  document.getElementById("metaAguaTexto").textContent =
    `/ ${metaAgua.toFixed(2).replace(".", ",")} L`;
}

document.getElementById("maisAgua").addEventListener("click", () => { 
  aguaConsumida += passoAgua;
  atualizarCardAgua();
});

document.getElementById("menosAgua").addEventListener("click", () => {
  aguaConsumida = Math.max(0, aguaConsumida - passoAgua);
  atualizarCardAgua();
})

function renderCalendar(date) {

  calendarGrid.innerHTML = "";

  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay =
  new Date(year, month, 1).getDay();

  const lastDate =
  new Date(year, month + 1, 0).getDate();

  const prevLastDate = new Date(year, month, 0).getDate();

  const monthNames = [

    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro"

  ];

  monthYear.textContent =
  `${monthNames[month]} ${year}`;

  for (let i = firstDay; i > 0; i--) {
    const dayElement = document.createElement("div");
    const previousMonthDay = prevLastDate - i + 1;
    const dayDate = new Date(year, month - 1, previousMonthDay);

    dayElement.classList.add("day", "other-month");
    dayElement.textContent = String(prevLastDate - i + 1).padStart(2, "0");

    calendarGrid.appendChild(dayElement);
  }

  for (let day = 1; day <= lastDate; day++) {
    const dayElement = document.createElement("div");
    const dayDate = new Date(year, month, day);

    dayElement.classList.add("day", "current-month");
    dayElement.textContent = String(day).padStart(2, "0");

    const modoGestanteAtivo = localStorage.getItem("modoGestante") === "true";

    if (modoGestanteAtivo) {
      if (isBirthPredictionMonth(dayDate)) {
        dayElement.classList.add("birth-prediction-month");
      }

      if (isBirthPredictionDay(dayDate)) {
        dayElement.classList.add("birth-prediction-day");
      }
    } else {
      if (isMenstruationDay(dayDate)) {
        dayElement.classList.add("menstruation-day");
      }
    }

    dayElement.addEventListener("click", () => {
      document
        .querySelectorAll(".calendar-grid .day")
        .forEach((item) => item.classList.remove("selected"));

      dayElement.classList.add("selected");
    });

    calendarGrid.appendChild(dayElement);
  }

  const totalCells = firstDay + lastDate;
  const nextDays = 42 - totalCells;

  for (let day = 1; day <= nextDays; day++) {
    const dayElement = document.createElement("div");

    dayElement.classList.add("day", "other-month");
    dayElement.textContent = String(day).padStart(2, "0");

    calendarGrid.appendChild(dayElement);
  }
  
}

// MÊS ANTERIOR

if (prevMonth) {

  prevMonth.addEventListener("click", async () => {

    currentDate.setMonth(
      currentDate.getMonth() - 1
    );
    
    if (!modoGestanteAtivo) {
      await carregarCiclosCalendario(currentDate);
    }

    renderCalendar(currentDate);

  });
}

// PRÓXIMO MÊS

if (nextMonth) {

  nextMonth.addEventListener("click", async () => {

    currentDate.setMonth(
      currentDate.getMonth() + 1
    );

    if (!modoGestanteAtivo) {
      await carregarCiclosCalendario(currentDate);
    }
    
    renderCalendar(currentDate);

  });
}

//================================================
//              CICLO MENSTRUAL
//=================================================

let cycleData = null;
let ciclosCalendario = [];

function parseLocalDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function daysBetween(startDate, targetDate) {
  const start = Date.UTC(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  );

  const target = Date.UTC(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate()
  );

  return Math.floor((target - start) / 86400000);
}

async function carregarCiclosCalendario(date) {
  const token = localStorage.getItem("token");

  const year = date.getFullYear();
  const month = date.getMonth();

  const inicio = new Date(year, month, 1);
  const fim = new Date(year, month + 1, 0);

  const inicioFormatado = inicio.toISOString().split("T")[0];
  const fimFormatado = fim.toISOString().split("T")[0];

  const response = await fetch(
    `http://localhost:8080/api/ciclos/calendario?inicio=${inicioFormatado}&fim=${fimFormatado}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const data = await response.json();

  ciclosCalendario = data.dados || [];
}

function isMenstruationDay(date) {
  const existeCicloReal =
    ciclosCalendario.some(ciclo => {
      const inicio =
        parseLocalDate(ciclo.dataInicio);

      const fim =
        parseLocalDate(ciclo.dataFim);

      return date >= inicio && date <= fim;
    });

  if (existeCicloReal) {
    return true;
  }

  if (!cycleData) { return false; }

  const lastPeriodStart = parseLocalDate(cycleData.lastPeriodStart);
  const daysFromStart = daysBetween(lastPeriodStart, date);

  if (daysFromStart < 0) {
    return false;
  }

  const cycleDay = daysFromStart % cycleData.cycleLength;

  return cycleDay < cycleData.periodLength;
}  

// ============================================================
//                        DASHBOARD
// ============================================================

function alterarCorCirculo(fase) {
  const cycleCircle = document.getElementById("cycle-circle");

  cycleCircle.classList.remove(
    "menstrual",
    "folicular",
    "ovulacao",
    "lutea"
  );

  switch (fase) {
    case "MENSTRUAL":
      cycleCircle.classList.add("menstrual");
      break;
    
    case "FOLICULAR":
      cycleCircle.classList.add("folicular");
      break;

    case "OVULACAO":
      cycleCircle.classList.add("ovulacao");
      break;

    case "LUTEA":
      cycleCircle.classList.add("lutea");   
      break;
  }

}

function atualizarDashboard(data) {
    const fase = document.getElementById("fase-ciclo");

    const dia = document.getElementById("dia-ciclo");

    const mensagem = document.getElementById("mensagem-ciclo");

    fase.innerText = formatarFase(data.faseCiclo);

    dia.innerText = `Dia ${data.diaCiclo}`;

    mensagem.innerText = data.mensagem;

    alterarCorCirculo(data.faseCiclo);
}

function formatarFase(fase) {

  switch(fase) {

    case "MENSTRUAL":
        return "Menstruação";

    case "FOLICULAR":
        return "Fase Folicular";

    case "OVULACAO":
        return "Ovulação";

    case "LUTEA":
        return "Fase Lútea";

    default:
        return "Ciclo";
  }
}

function atualizarConteudoDiario(data) {
  const faseTitulo = document.getElementById("faseAtualCiclo");
  const mensagemFase = document.getElementById("mensagemFaseCiclo");

  if (!faseTitulo || !mensagemFase) {
    return;
  }

  faseTitulo.textContent =
    `Fase atual do ciclo: ${formatarFase(data.faseCiclo)}`;

  mensagemFase.textContent =
    data.mensagemDetalhadaFase ||
    data.mensagem ||
    "Acompanhe seus sintomas e recomendações para entender melhor este momento do ciclo.";
}

async function exibirDashboard() {  
  try {
    const usuarioId = localStorage.getItem("usuarioId");
    const token = localStorage.getItem("token");
    
    const response = await fetch(
      `http://localhost:8080/api/usuarios/${usuarioId}/dashboard`,
      {
        headers: {
        Authorization: `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Erro ao carregar dashboard: ${response.status}`)
    }
    const data = await response.json();

    console.log(data);

    cycleData = {
      lastPeriodStart: data.ultimaMenstruacao,
      cycleLength: data.duracaoCiclo,
      periodLength: data.duracaoMenstruacao,
      nextPeriodStart: data.proximaPrevisao,
      fertilePeriodStart: data.janelaFertilInicio,
      fertilePeriodEnd: data.janelaFertilFim,
      ovulationPredict: data.previsaoOvulacao,
      cycleAmount: data.quantidadeCiclos,
      lessThan3Cycles: data.menosDe3Ciclos,
      message: data.mensagem 
    }


    atualizarDashboard(data);
    atualizarConteudoDiario(data);
    atualizarAvisoPrecisao();
    await carregarCiclosCalendario(currentDate);
    renderCalendar(currentDate);
  
  } catch (error) {
    console.error("Erro ao carregar dashboard:", error);
  }
}

function atualizarAvisoPrecisao() {
  const avisoPrecisao = document.getElementById("avisoPrecisaoCiclo");

  if (!avisoPrecisao || !cycleData) { return; }

  if (cycleData.lessThan3Cycles) {
    avisoPrecisao.hidden = false;
    avisoPrecisao.textContent = 
      "As previsões podem não ser tão precisas, pois há menos de 3 ciclos cadastrados."
  } else {
    avisoPrecisao.hidden = true;
    avisoPrecisao.textContent = "";
  }
}

function formatarMesAno(dataISO) {
  const data = parseLocalDate(dataISO);

  const texto = data.toLocaleDateString("pt-BR", {
    month: "long", 
    year: "numeric"
  });

  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

let dataProvavelParto = null; 

async function exibirDashboardGestante() {
  const usuarioId = localStorage.getItem("usuarioId");
  const token = localStorage.getItem("token");
  const avisoPrecisao = document.getElementById("avisoPrecisaoCiclo");
  const editarMenstruacaoBtn = document.getElementById("editarMenstruacaoBtn");

  const response = await fetch(
    `http://localhost:8080/api/usuarios/${usuarioId}/modo-gestante`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );  

  const data = await response.json();

  if (avisoPrecisao) {
    avisoPrecisao.hidden = true;
    avisoPrecisao.textContent = "";
  }

  editarMenstruacaoBtn.hidden = true;

  document.getElementById("fase-ciclo").innerText = "Gestação";

  document.getElementById("faseAtualCiclo").textContent =
  `Fase Gestacional: ${data.faseGestacional}`;

  document.getElementById("mensagemFaseCiclo").textContent = 
    data.mensagemFaseGestacao || "Acompanhe sua gestação com orientação profissional";

  document.getElementById("dia-ciclo").innerText = `Dia ${data.diasGravidez}`;

  document.getElementById("mensagem-ciclo").innerText = 
    `${data.semanasCompletas} semanas e ${data.diasSemana} dias`;

  document.getElementById("resumoSemanaGestacao").textContent = 
    `Faltam ${data.semanasRestantes} semanas e ${data.diasRestantesSemana} dias`
  
  document.getElementById("dataProvavelPartoCard").textContent = 
    formatarMesAno(data.previsaoParto);  

  dataProvavelParto = data.previsaoParto;
  renderCalendar(currentDate);
}

window.onload = async () => {
  atualizarCardAgua();
  
  const modoGestanteAtivo = localStorage.getItem("modoGestante") === "true";

  if (modoGestanteAtivo) {
    await exibirDashboardGestante();
    return;
  }
  await exibirDashboard();
}

function isBirthPredictionDay(date) {
  if (!dataProvavelParto) {
    return false;
  }

  const parto = parseLocalDate(dataProvavelParto);

  return (
    date.getFullYear() === parto.getFullYear() &&
    date.getMonth() === parto.getMonth() &&
    date.getDate() === parto.getDate()
  );
}

function isBirthPredictionMonth(date) {
  if (!dataProvavelParto) {
    return false;
  }

  const parto = parseLocalDate(dataProvavelParto);

  return (
    date.getFullYear() === parto.getFullYear() &&
    date.getMonth() === parto.getMonth()
  );
}

// ============================================================
//                 MEU CONTEÚDO DIÁRIO
// ============================================================

//Aqui ele faz exatamente a mesma que o círculo menstrual faz: puxa informações do ciclo direto do banco 
//e mostra uma mensagem personalizada de acordo com o dia do ciclo.



// LOGOUT
const logoutBtn =
document.getElementById('logoutBtn');

if(logoutBtn){

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href =
    'login.html';
  });

}
