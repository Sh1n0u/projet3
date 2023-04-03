import { updateGallery, articlesAll } from './gallery.js'

const openModal = function(e) {
    e.preventDefault();
    const target = document.querySelector(e.currentTarget.getAttribute('data-target'));
    if (target) {
        target.classList.remove("modal-disable");
        target.querySelector('.closeModal').addEventListener('click', closeModal);
        console.log(updateGallery(articlesAll))
    }
};

const closeModal = function (e) {
    e.preventDefault();
    const modal = e.currentTarget.closest(".modal")

    modal.classList.add("modal-disable");
    modal.removeEventListener('click', closeModal);
};

document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal);
});


console.log(updateGallery(articlesAll))
