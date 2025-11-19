// js/onglets.js

// Charge le contenu détaillé d'un onglet (qualite, expertise, etc.)
function loadOnglet(tab) {
    fetch(`components/onglet-${tab}.html`)
        .then(res => res.text())
        .then(html => {
            const container = document.getElementById("onglet-content");
            if (!container) return;
            container.innerHTML = html;

            // Met à jour l'état des boutons du bandeau
            document.querySelectorAll(".onglet-btn").forEach(b => b.classList.remove("active"));
            const btn = document.querySelector(`.onglet-btn[data-tab="${tab}"]`);
            if (btn) btn.classList.add("active");
        })
        .catch(err => {
            console.error("Erreur chargement onglet:", err);
        });
}

// Écoute les clics sur les boutons et les cartes, même si le HTML
// a été injecté après coup par loader.js (délégation d'événement).
document.addEventListener("click", (event) => {
    const target = event.target.closest(".onglet-btn, .onglet-card");
    if (!target) return;

    const tab = target.dataset.tab;
    if (!tab) return;

    loadOnglet(tab);

    // Scroll doux vers la zone de contenu
    const content = document.getElementById("onglet-content");
    if (content) {
        content.scrollIntoView({ behavior: "smooth", block: "start" });
    }
});

