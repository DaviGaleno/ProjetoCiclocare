const modoGestanteAtivo = localStorage.getItem("modoGestante") === "true";

if (modoGestanteAtivo) {
    document.body.classList.add("gestante-mode");
} else {
    document.body.classList.remove("gestante-mode");
}