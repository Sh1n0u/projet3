
const form = document.getElementById('connexion');

function showModal(message) {
    const modal = document.getElementById('modal');
    const modalMessage = document.getElementById('modal-message');
    modalMessage.textContent = message;
    modal.style.display = 'block';

    // Gestionnaire d'événement pour fermer la modale en cliquant sur le bouton de fermeture (la croix "x")
    const modalClose = document.getElementById('modal-close');
    modalClose.onclick = function () {
      modal.style.display = 'none';
    };
}

form.addEventListener('click', (event) => {
	event.preventDefault(); // Empêcher l'envoi du formulaire

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
				window.location.href = 'login.html';
			}
		})
});

