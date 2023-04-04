import { articlesAll } from './gallery.js';

function createItem(article) {
    const itemElement = document.createElement("figure");
    itemElement.setAttribute('data-id', article.id);
    const itemImageElement = document.createElement("img");
    itemImageElement.src = article.imageUrl;
    const textElement = document.createElement("p");
    textElement.innerText = "Editer";
    const deleteElement = document.createElement("span");
    deleteElement.classList.add("delete");
    const iconElement = document.createElement("i");
    iconElement.classList.add("fa-solid", "fa-trash-can", "background-trash");

    deleteElement.appendChild(iconElement);
    itemElement.appendChild(deleteElement);
    itemElement.appendChild(itemImageElement);
    itemElement.appendChild(textElement);
    return itemElement;
}

function updateModal(articles) {
    const modal = document.querySelector('.img-modal');
    modal.innerHTML = "";
    for (const article of articles) {
        const item = createItem(article);
        modal.appendChild(item);
    }
}
updateModal(articlesAll);


const openModal = function(e) {
    e.preventDefault();
    const target = document.querySelector(e.currentTarget.getAttribute('data-target'));
    if (target) {
        target.classList.remove("modal-disable");
        target.querySelector('.close-modal').addEventListener('click', closeModal);
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