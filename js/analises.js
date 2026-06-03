const dropdownBtn = document.querySelector(".dropdown-btn");

const dropdownContent = document.querySelector(".dropdown-content");

dropdownBtn.addEventListener("click", () => {

  if(dropdownContent.style.display === "flex"){

    dropdownContent.style.display = "none";

  } else {

    dropdownContent.style.display = "flex";

  }

});

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

async function carregarAnalises() {
  try {
    const token = localStorage.getItem("token");

    const resposta = await fetch("http://localhost:8082/api/analises", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!resposta.ok) {
      throw new Error("Erro ao buscar análises");
    }

    const dados = await resposta.json();

    document.getElementById("faseAtual").textContent =
      dados.faseAtual || "Sem dados";

    document.getElementById("proximoCiclo").textContent =
      dados.diasProximoCiclo !== null
        ? `Em ${dados.diasProximoCiclo} dias`
        : "Sem dados";

    document.getElementById("humorPredominante").textContent =
      dados.humorPredominante || "Sem registros";

    document.getElementById("sintomaMaisFrequente").textContent =
      dados.sintomaMaisFrequente || "Sem registros";

    document.getElementById("libidoPredominante").textContent =
      dados.libidoPredominante || "Sem registros";

    document.getElementById("secrecaoPredominante").textContent =
      dados.secrecaoPredominante || "Sem registros";

  } catch (erro) {
    console.error("Erro ao carregar análises:", erro);
  }
}

carregarAnalises();
