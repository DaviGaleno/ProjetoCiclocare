const dropdownBtn = document.querySelector(".dropdown-btn");

const dropdownContent = document.querySelector(".dropdown-content");
const modoGestanteToggle = document.getElementById("modoGestanteToggle");
const textoSemanaGestante = document.getElementById("textoSemanaGestante");
const textoMesesGestante = document.getElementById("textoMesesGestante");
const semanasCompletasGestante = document.getElementById("semanasCompletasGestante");
const diasGravidezGestante = document.getElementById("diasGravidezGestante");
const tempoRestanteGestante = document.getElementById("tempoRestanteGestante");
const painelGestante = document.getElementById("painelGestante");
const tituloNotificacoes = document.querySelector(".notificacoes-titulo");
const listaNotificacoes = document.querySelector(".lista-notificacoes");
const tituloPrivacidade = document.querySelector(".privacidade-titulo");
const listaPrivacidade = document.querySelector(".lista-privacidade");
const tituloSeguranca = document.querySelector(".seguranca-titulo");
const listaSeguranca = document.querySelector(".lista-seguranca");
const onOffButtons = document.querySelectorAll(".on-off-button");

onOffButtons.forEach((button) => {
  button.addEventListener("change", () => {
    const subItem = button.closest(".configuracoes-subitem");

    subItem.classList.toggle("on", button.checked);
  })
})

tituloNotificacoes.addEventListener("click", () => {
  listaNotificacoes.classList.toggle("aberta");
});

tituloPrivacidade.addEventListener("click", () => {
  listaPrivacidade.classList.toggle("aberta");
});

tituloSeguranca.addEventListener("click", () => {
  listaSeguranca.classList.toggle("aberta");
})

dropdownBtn.addEventListener("click", () => {

  if(dropdownContent.style.display === "flex"){

    dropdownContent.style.display = "none";

  } else {

    dropdownContent.style.display = "flex";

  }

});

// MODO GESTANTE

modoGestanteToggle.addEventListener("change", async() => {
  if (!modoGestanteToggle.checked) {
    painelGestante.classList.remove("aberto");
    localStorage.setItem("modoGestante", "false");
    return;
  }

  localStorage.setItem("modoGestante", "true");

  const usuarioId = localStorage.getItem("usuarioId");
  const token = localStorage.getItem("token");

  const response = await fetch(
    `http://localhost:8080/api/usuarios/${usuarioId}/modo-gestante`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const data = await response.json();

  textoSemanaGestante.textContent = data.mensagemPrincipal;
  textoMesesGestante.textContent = data.mensagemSecundaria;

  semanasCompletasGestante.textContent = data.semanasCompletas;
  diasGravidezGestante.textContent = data.diasGravidez;

  tempoRestanteGestante.textContent = 
    `${data.semanasRestantes} semanas e ${data.diasRestantesSemana} dias`;

  painelGestante.classList.add("aberto");  
})

// ÍCONE DO SINO
const bellIcon = document.querySelector(".bell-icon");

// SIDEBAR
const notificationSidebar = document.querySelector(".notification-sidebar");

// BOTÃO FECHAR
const closeSidebar = document.querySelector(".close-sidebar");


// ABRIR SIDEBAR

bellIcon.addEventListener("click", () => {

  notificationSidebar.classList.add("active");

});


// FECHAR SIDEBAR

closeSidebar.addEventListener("click", () => {

  notificationSidebar.classList.remove("active");

});

// USUÁRIO
const usuarioInfo = document.querySelector(".usuario-info");

// DROPDOWN PERFIL
const profileDropdown = document.querySelector(".profile-dropdown");


// ABRIR / FECHAR MENU PERFIL

usuarioInfo.addEventListener("click", () => {

  profileDropdown.classList.toggle("active");

});