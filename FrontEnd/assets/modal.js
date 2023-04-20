import { articlesAll, createFigure } from './gallery.js';


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
                const itemToDelete = document.querySelectorAll(`[data-id="${id}"]`);

                itemToDelete.forEach(item => item.remove());
            } else {
                throw new Error("Erreur lors de la suppression de l'élément");
            }
        }).catch(error => {
            console.error(error);
        });
    });

    deleteElement.appendChild(iconElement);
    itemElement.appendChild(deleteElement);
    itemElement.appendChild(itemImageElement);
    itemElement.appendChild(textElement);

    return itemElement;
};

function updateModal(articles) {
    const modal = document.querySelector('.img-modal');

    while (modal.firstChild) {
        modal.firstChild.remove();
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

const closeModalOnEscape = function (e) {
    if (e.key === "Escape") {
        const modal = document.querySelector(".modal:not(.modal-disable)");

        if (modal) {
            modal.classList.add("modal-disable");
        }
    }
};
// Ajouter l'écouteur d'événements sur le document
document.addEventListener("keydown", closeModalOnEscape);

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
const gallery = document.querySelector(".gallery");
const galleryModal = document.querySelector(".img-modal");

function refresh() {
    const file = imgInput.files[0];
    const reader = new FileReader();
    const previewImg = document.getElementById('preview');
    const defaultImg = document.getElementById('defaultImg');

    if (file) {
        reader.onload = () => {
            previewImg.src = reader.result;
        };
        reader.readAsDataURL(file);
        defaultImg.classList.add('hide');
        
        previewImg.classList.add('show');
        previewImg.classList.remove('hide');

    } else {
        previewImg.classList.add('hide');
        previewImg.classList.remove('show');

        defaultImg.classList.add('show');
        defaultImg.classList.remove('hide');
    }
}

imgInput.addEventListener('change', () => {
    refresh();
});

submitBtn.addEventListener('submit', (event) => {
    event.preventDefault();

    let bearer = 'Bearer ' + token;
    let data = new FormData();
    const maxFileSize = 4 * 1024 * 1024; // 4 Mo en octets
    const allowedFileTypes = ['image/jpeg', 'image/png'];

    // Vérifier que le fichier a été sélectionné
    if (!imgInput.files[0]) {
        alert('Veuillez sélectionner un fichier.');
        console.log(imgInput.files)
        return;
    }
    // Vérifier la taille du fichier
    if (imgInput.files[0].size > maxFileSize) {
        alert('Le fichier sélectionné est trop volumineux. La taille maximale autorisée est de 4 Mo.');
        return;
    }
    // Vérifier le type de fichier
    if (!allowedFileTypes.includes(imgInput.files[0].type)) {
        alert('Le fichier sélectionné n\'est pas au format attendu. Les formats autorisés sont JPG et PNG.');
        return;
    }

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
            const newFigure = createFigure(work);
            gallery.appendChild(newFigure);

            const newItem = createItem(work);
            galleryModal.append(newItem);


            console.log(imgInput.files)
            event.target.reset();
            console.log(imgInput.files)
            refresh();


        })
        .catch(error => {
            console.log(error);
        });
});

