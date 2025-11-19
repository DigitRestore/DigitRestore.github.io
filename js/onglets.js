// Fonction de chargement d'un onglet
function loadOnglet(tab) {
    fetch(`components/onglet-${tab}.html`)
        .then(res => res.text())
        .then(html => {
            document.getElementById("onglet-content").innerHTML = html;

            // Mise à jour du bouton actif
            document.querySelectorAll(".onglet-btn").forEach(b => b.classList.remove("active"));
            document.querySelector(`.onglet-btn[data-tab="${tab}"]`).classList.add("active");
        });
}

// Activation via le bandeau et les cartes
document.addEventListener("DOMContentLoaded", () => {

    // Clic onglets horizontaux
    document.querySelectorAll(".onglet-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            loadOnglet(btn.dataset.tab);
        });
    });

    // Clic cartes
    document.querySelectorAll(".onglet-card").forEach(card => {
        card.addEventListener("click", () => {
            loadOnglet(card.dataset.tab);

            // scroll automatique vers la zone de contenu
            document.getElementById("onglet-content")
                .scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });
});
