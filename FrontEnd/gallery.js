const response = await fetch("http://localhost:5678/api/works");
const articlesAll = await response.json();


function createFigure(article) {
    // création de la balise <figure>
    const figureElement = document.createElement("figure");
    // contenu de la figure
    const imageElement = document.createElement("img");
    imageElement.src = article.imageUrl;
    const titreElement = document.createElement("figcaption");
    titreElement.innerText = article.title;

    figureElement.appendChild(imageElement);
    figureElement.appendChild(titreElement);
    return figureElement;
}


function updateGallery (articles) {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";
    // boucle de lecture et d'affichage des objets de l'array
    for (const article of articles) {
        const figure = createFigure(article);
        gallery.appendChild(figure);
    }
};
updateGallery(articlesAll);



//
// Générateur de bouton de filtrage
//
const buttonBar = document.querySelector('.button-bar');
const buttonName = ["Tous", "Objets", "Appartements", "Hôtels & Restaurants"];
    for (let i = 0; i < buttonName.length; i++) {
        const button = document.createElement('button');
        button.textContent = buttonName[i];
        if (i === 0) {
            button.setAttribute('data-id', 'all');
          } else {
            button.setAttribute('data-id', i);
          }
        buttonBar.appendChild(button);
    };


//
// Filtrage de la page
//

buttonBar.addEventListener('click', (event) => {
    const id = event.target.getAttribute('data-id');
    if (id === 'all') {
      updateGallery(articlesAll);
    } else {
      const filteredArticles = articlesAll.filter(article => article.category.id == id);
      updateGallery(filteredArticles);
    }
});



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
  const logOutElement = document.getElementById('login');
  logOutElement.innerHTML = "Log out"
}
