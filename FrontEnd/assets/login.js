import { showModal } from "./modal_error.js";
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('connexion');

    form.addEventListener('click', (event) => {
        event.preventDefault(); // Empêcher le comportement par défaut du formulaire

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Vérifier que l'email et le mot de passe ont été fournis
        if (!email || !password) {
            showModal('Veuillez fournir un email et un mot de passe');
            return;
        }

        // Envoyer une requête POST à l'API d'authentification
        fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.token) {
                    // Si l'authentification réussit, stocker le token dans le localStorage
                    localStorage.setItem('token', data.token);
                    // Rediriger l'utilisateur vers la page d'accueil, par exemple :
                    window.location.href = 'index.html';
                } else {
                    // Si l'authentification échoue, afficher un message d'erreur
                    showModal('Email ou mot de passe incorrect');
                }
            });
    });
});
