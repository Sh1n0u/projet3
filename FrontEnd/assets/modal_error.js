export function showModal(message) {
    const modal = document.getElementById('modal-error');
    const modalMessage = document.getElementById('modal-message');
    modalMessage.textContent = message;
    modal.style.display = 'block';

    // Gestionnaire d'événement pour fermer la modale en cliquant sur le bouton de fermeture (la croix "x")
    const modalClose = document.getElementById('modal-close');
    modalClose.onclick = function () {
      modal.style.display = 'none';
    };
}

