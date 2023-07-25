const response = await fetch("http://localhost:5678/api/works");
export const articlesAll = await response.json();

// Fonction de création des éléments de la galerie
export function createFigure(article) {
    // création de la balise <figure>
    const figureElement = document.createElement("figure");
    // création de l'id de chaque figure
    figureElement.setAttribute('data-id', article.id);
    figureElement.dataset.categoryId = article.categoryId;
    // contenu de la figure
    const imageElement = document.createElement("img");
    imageElement.src = article.imageUrl;
    const titreElement = document.createElement("figcaption");
    titreElement.textContent = article.title;
    // ajout des éléments dans la figure
    figureElement.appendChild(imageElement);
    figureElement.appendChild(titreElement);
    return figureElement;
}

// Fonction de création du menu admin
function createAdminContent() {
    //création du bandeau admin en haut de page
    const parentElement = document.getElementById('admin-band');
    const adminDiv = document.createElement('div');
    adminDiv.classList.add('admin-band');

    const iconElement = document.createElement('i');
    iconElement.classList.add('fa-regular', 'fa-pen-to-square');

    const godModeElement = document.createElement('p');
    godModeElement.classList.add('god-mode');
    godModeElement.textContent = 'Mode édition';

    const publishElement = document.createElement('p');
    publishElement.classList.add('publish');
    publishElement.textContent = 'publier les changements';

    adminDiv.appendChild(iconElement);
    adminDiv.appendChild(godModeElement);
    adminDiv.appendChild(publishElement);
    parentElement.appendChild(adminDiv);

    // Création du bouton modifier sous portrait
    const parentElementP = document.getElementById('admin-picture');
    const adminPictureDiv = document.createElement('div');
    adminPictureDiv.classList.add('dflex', 'align');

    const iconElementP = document.createElement('i');
    iconElementP.classList.add('fa-regular', 'fa-pen-to-square');

    const modifyElementP = document.createElement('p');
    modifyElementP.textContent = 'modifier';

    adminPictureDiv.appendChild(iconElementP);
    adminPictureDiv.appendChild(modifyElementP);
    parentElementP.appendChild(adminPictureDiv);


    // Création du bouton modifier de la galerie
    const parentElementEdit = document.getElementById('admin-edit');
    const adminEditDiv = document.createElement('div');
    adminEditDiv.classList.add('dflex', 'align');

    const iconElementEdit = document.createElement('i');
    iconElementEdit.classList.add('fa-regular', 'fa-pen-to-square');

    const modifyElementEdit = document.createElement('p');
    modifyElementEdit.textContent = 'modifier';

    adminEditDiv.appendChild(iconElementEdit);
    adminEditDiv.appendChild(modifyElementEdit);
    parentElementEdit.appendChild(adminEditDiv);
}


// fonction d'affichage de la galerie
function updateGallery(articles) {
    const gallery = document.querySelector(".gallery");
    while (gallery.firstChild) {
        gallery.removeChild(gallery.firstChild);
    }
    // boucle de lecture et d'affichage des objets de l'array
    for (const article of articles) {
        const figure = createFigure(article);
        gallery.appendChild(figure);
    }
};

updateGallery(articlesAll);



// filtrage des éléments de la galerie
const buttonBar = document.querySelector('.button-bar');
const allButton = document.createElement('button');
allButton.textContent = 'Tous';
allButton.setAttribute('data-id', 'all');
buttonBar.appendChild(allButton);

fetch('http://localhost:5678/api/categories')
    .then(response => response.json())
    .then(categories => {
        for (let i = 0; i < categories.length; i++) {
            const button = document.createElement('button');
            button.textContent = categories[i].name;
            button.setAttribute('data-id', categories[i].id);
            buttonBar.appendChild(button);
            button.addEventListener('click', (event) => {
                const id = event.target.getAttribute('data-id');

                if (id === null) {
                    return;
                } else {
                    const filteredArticles = articlesAll.filter(article => article.category.id == id);
                    const otherArticles = articlesAll.filter(article => article.category.id != id);
                    //Boucle de recherche des ID sélectionné
                    for (const article of filteredArticles) {
                        const figure = document.querySelector(`figure[data-id="${article.id}"]`);
                        figure.classList.remove('hide');
                    };
                    // BOucle de recherche des ID non sélectionné
                    for (const article of otherArticles) {
                        const figure = document.querySelector(`figure[data-id="${article.id}"]`);
                        figure.classList.add('hide');
                    };
                }
            });
        }
        allButton.addEventListener('click', () => {
            updateGallery(articlesAll);
        });
    });



//
// Redirection et suppression de token en cas de click sur login/logut
//
const login = document.getElementById('login');
login.addEventListener('click', () => {
  if (localStorage.getItem('token')) {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
  } else {
    window.location.href = 'login.html';
  }
});

if (localStorage.getItem('token')) {
    // affichage du bouton Log Out si l'utilisateur est connecté
    const logOutElement = document.getElementById('login');
    logOutElement.innerText = "Log out";
    // suppression de la button bar
    buttonBar.style.display = 'none';
    // affichage du menu admin
    createAdminContent();
}
