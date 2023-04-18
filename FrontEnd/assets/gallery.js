const response = await fetch("http://localhost:5678/api/works");
export const articlesAll = await response.json();

function createFigure(article) {
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

export function updateGallery(articles) {
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
        }
    });

// Filtrage de la page
buttonBar.addEventListener('click', (event) => {
    const id = event.target.getAttribute('data-id');
    if (id === null) {
        return;
    }

    if (id === 'all') {
        updateGallery(articlesAll);
    } else {
        const filteredArticles = articlesAll.filter(article => article.category.id == id);
        updateGallery(filteredArticles);
    }
});

// Redirection et suppression de token en cas de click sur login/logut
const login = document.getElementById('login');
login.addEventListener('click', () => {
    if (localStorage.getItem('token')) {
        localStorage.removeItem('token')
        window.location.href = 'index.html';
    } else {
        window.location.href = 'login.html';
    }
});

if (localStorage.getItem('token')) {
    // affichage du bouton Log Out si l'utilisateur est connecté
    const logOutElement = document.getElementById('login');
    logOutElement.innerHTML = "Log out";
    // affichage du menu admin en étant connecté
    const gmElements = document.querySelectorAll('.gm');

    gmElements.forEach(element => {
        element.classList.remove('gm');
        const buttonBar = document.querySelector('.button-bar');
        buttonBar.style.display = 'none';
    });
};

