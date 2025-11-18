
function loadComponent(id, file) {
    fetch(file)
        .then(response => response.text())
        .then(html => {
            document.getElementById(id).innerHTML = html;
        });
}

document.addEventListener("DOMContentLoaded", function() {
    loadComponent("header", "components/header.html");
    loadComponent("hero", "components/hero.html");
    loadComponent("services", "components/services.html");
    loadComponent("reprise", "components/reprise.html");
    loadComponent("pourquoi", "components/pourquoi.html");
    loadComponent("processus", "components/processus.html");
});
