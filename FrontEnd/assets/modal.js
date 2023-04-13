import { articlesAll } from './gallery.js';

function createItem(article) {
    const itemElement = document.createElement("figure");
    itemElement.setAttribute('data-id', article.id);
    const itemImageElement = document.createElement("img");
    itemImageElement.src = article.imageUrl;
    const textElement = document.createElement("p");
    textElement.textContent = "Editer";
    const deleteElement = document.createElement("span");
    deleteElement.classList.add("delete");
    const iconElement = document.createElement("i");
    iconElement.classList.add("fa-solid", "fa-trash-can", "background-trash");

    deleteElement.addEventListener("click", function (event) {
        const id = event.currentTarget.parentNode.getAttribute("data-id");
        event.preventDefault();
        event.stopPropagation();
        let bearer = 'Bearer ' + token;

        fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: {
                'Authorization': bearer,
            }
        }).then(response => {
            if (response.ok) {
                const itemToDelete = document.querySelector(`[data-id="${id}"]`);
                console.log(itemToDelete);
                itemToDelete.remove();
            } else {
                throw new Error("Erreur lors de la suppression de l'élément");
            }
        })
            .catch(error => {
                console.error(error);
            });
    });

    deleteElement.appendChild(iconElement);
    itemElement.appendChild(deleteElement);
    itemElement.appendChild(itemImageElement);
    itemElement.appendChild(textElement);
    return itemElement;
}

function updateModal(articles) {
    const modal = document.querySelector('.img-modal');
    while (modal.firstChild) {
        modal.removeChild(modal.firstChild);
    }
    for (const article of articles) {
        const item = createItem(article);
        modal.appendChild(item);
    }
}
updateModal(articlesAll);

// Fonction d'ouverture de modale en cliquant sur modifier
const openModal = function (e) {
    e.preventDefault();
    const target = document.querySelector(e.currentTarget.getAttribute('data-target'));
    if (target) {
        target.classList.remove("modal-disable");
        target.querySelector('.close-modal').addEventListener('click', closeModal);
    }
};

// Fonction de fermeture de modale en cliquant sur la croix
const closeModal = function (e) {
    e.preventDefault();
    const modal = e.currentTarget.closest(".modal")
    modal.classList.add("modal-disable");
    modal.removeEventListener('click', closeModal);
};
// Ouverture de la modal
document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal);
});

//
// Changement de fenetre de modal quand on clique sur ajouter une photo
//
const modalWindow = document.querySelector('.modal-window');
const modalWindowAdd = document.querySelector('.modal-window-add');
const addButton = document.querySelector('.add');

addButton.addEventListener('click', function () {
    modalWindow.style.display = 'none';
    modalWindowAdd.style.display = 'block';
});

//
// Retour à la modal précédente
//
const previousModal = document.querySelector('.previous-modal');
previousModal.addEventListener('click', function () {
    modalWindow.style.display = 'block';
    modalWindowAdd.style.display = 'none';
});

//
//Requete de récupération des catégories depuis l'API
//
const select = document.getElementById("category");
fetch("http://localhost:5678/api/categories")
    .then(response => response.json())
    .then(categories => {
        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category.id;
            option.text = category.name;
            select.add(option);
        });
    });





//
// fonction POST
//
const token = localStorage.getItem('token');
const imgInput = document.querySelector('#img-input');
const titleInput = document.querySelector('#title');
const categoryInput = document.querySelector('#category');
const submitBtn = document.querySelector('.registration');

submitBtn.addEventListener('submit', (event) => {
    event.preventDefault();

    /*
     Vérifier la validité des input avant de consommer le service de création de projet
       - vérifier que le nom du projet est renseigné
       - vérifier que le fichier n'excède pas les 4Mo
       - vérifier le format du fichier (jpg ou png)
    */
    let bearer = 'Bearer ' + token;
    let data = new FormData();
    data.append('image', imgInput.files[0]);
    data.append('title', titleInput.value);
    data.append('category', categoryInput.value);


    fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
            'Authorization': bearer,
        },
        body: data,
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('ça morche po');
        })
        .then(work => {
            articlesAll.push(work);
            // Mise à jour de la modale avec la liste mise à jour
            updateModal(articlesAll);
            //reset le formulaire (qu'il soit vide pour un nouvel ajout)
            event.target.reset();
            previousModal.click();
        })
        .catch(error => {
            console.log(error);
        });
});


