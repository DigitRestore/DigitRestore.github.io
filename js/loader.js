
function loadComponent(id, file) {
    fetch(file)
        .then(response => response.text())
        .then(html => {
            document.getElementById(id).innerHTML = html;
        });
}

document.addEventListener("DOMContentLoaded", function() {
    loadComponent("header", "components/header.html");
});
