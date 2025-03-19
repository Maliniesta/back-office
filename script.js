let produits = []; // Stocke les produits en mémoire
let produitModifie = null; // Variable globale pour stocker l'ID du produit en modification

// Charger les produits depuis le fichier JSON
fetch('produits.json')
    .then(response => response.json())
    .then(data => {
        produits = data;  // Stocke les produits
        afficherProduits(produits);
    })
    .catch(error => console.error("Erreur lors du chargement du fichier JSON :", error));

// Fonction pour afficher tous les produits
function afficherProduits(produits) {
    let table = document.getElementById('table');
    table.innerHTML = ''; // Réinitialiser le contenu de la table avant de la remplir

    for (let i = 0; i < produits.length; i++) {
        let produit = produits[i];

        let tr = document.createElement('tr');

        let tdReference = document.createElement('td');
        tdReference.textContent = produit.reference;
        tr.appendChild(tdReference);

        let tdCategorie = document.createElement('td');
        tdCategorie.textContent = produit.categorie;
        tr.appendChild(tdCategorie);

        let tdLibelle = document.createElement('td');
        tdLibelle.textContent = produit.libelle;
        tr.appendChild(tdLibelle);

        let tdPrix = document.createElement('td');
        tdPrix.textContent = produit.prix;
        tr.appendChild(tdPrix);

        let tdStock = document.createElement('td');
        tdStock.classList.add("stock");

        let stockSpan = document.createElement('span');
        if (produit.stock > 0) {
            stockSpan.style.backgroundColor = "green";
        } else {
            stockSpan.style.backgroundColor = "red";
        }

        tdStock.appendChild(stockSpan);
        tr.appendChild(tdStock);

        let image1 = document.createElement('img');
        image1.src = "imagesProduits/icons/eye.png";
        image1.addEventListener('click', function() {
            voir(produit);  
        });

        let image2 = document.createElement('img');
        image2.src = "imagesProduits/icons/edit.png";
        image2.addEventListener('click', function() {
            modifier(produit.id);  // Passe l'id du produit pour modification
        });

        let image3 = document.createElement('img');
        image3.src = "imagesProduits/icons/trash.png";
        image3.addEventListener('click', function() {
            tr.remove();
        });

        tr.appendChild(image1);
        image1.style.margin="1rem";
        image1.style.cursor="pointer";
        tr.appendChild(image2);
        image2.style.margin="1rem";
        image2.style.cursor="pointer";
        tr.appendChild(image3);
        image3.style.margin="1rem";
        image3.style.cursor="pointer";
        table.appendChild(tr);

        let lignes = document.querySelectorAll("tr"); 
        lignes.forEach((tr, index) => {  
            if (index % 2 === 0) {  
                tr.style.backgroundColor = "lightgray"; // Applique un fond gris aux lignes paires
            }
        });
    }
}

// Afficher la modale au clic sur "Ajouter un produit"
let ajout = document.getElementById('primary-btn');
ajout.addEventListener("click", function() {
    produitModifie = null; // Réinitialiser l'ID du produit modifié
    formProduit.reset(); // Vider le formulaire
    modal.style.display = "block";
});

// Fermer la modale au clic sur la croix
document.querySelector(".close").addEventListener("click", function() {
    modal.style.display = "none";
});

// Fonction pour la modification
function modifier(id) {
    produitModifie = id; // Récupère l'ID du produit à modifier

    // On parcourt le tableau des produits
    for (let i = 0; i < produits.length; i++) {
        if (produits[i].id === id) {
            // Remplir les champs du formulaire avec les données du produit
            document.getElementById('ref').value = produits[i].reference;
            document.getElementById('cat').value = produits[i].categorie;
            document.getElementById('libelle').value = produits[i].libelle;
            document.getElementById('prix').value = produits[i].prix;
            document.getElementById('stock').value = produits[i].stock;

            // Afficher la modale pour modification
            modal.style.display = "block";
            break; // On sort de la boucle une fois que le produit est trouvé
        }
    }
}

// Gestion du formulaire d'ajout/modification
let formProduit = document.getElementById("form-produit");
formProduit.addEventListener('submit', function(e) {
    e.preventDefault();

    if (produitModifie !== null) {
        // MODIFICATION D'UN PRODUIT EXISTANT
        for (let i = 0; i < produits.length; i++) {
            if (produits[i].id === produitModifie) {
                produits[i].reference = formProduit.ref.value;
                produits[i].categorie = formProduit.cat.value;
                produits[i].libelle = formProduit.libelle.value;
                produits[i].prix = parseInt(formProduit.prix.value);
                produits[i].stock = parseInt(formProduit.stock.value);
                break; // Sortir de la boucle après modification
            }
        }
    } else {
        // AJOUT D'UN NOUVEAU PRODUIT
        let nouveauProduit = {
            id: Date.now(), // Générer un ID unique
            reference: formProduit.ref.value,
            categorie: formProduit.cat.value,
            libelle: formProduit.libelle.value,
            prix: parseInt(formProduit.prix.value),
            stock: parseInt(formProduit.stock.value),
            description: "", // Ajoute une description vide par défaut
            photo: "imagesProduits/default.png" // Image par défaut
        };
        produits.push(nouveauProduit);
    }

    // Rafraîchir l'affichage des produits
    afficherProduits(produits);

    // Fermer la modale après ajout/modification
    modal.style.display = "none";
    formProduit.reset(); // Réinitialiser les champs du formulaire
});

// Fonction pour afficher les détails du produit
function voir(produit) {
    let detail = document.getElementById('details');
    let details = document.getElementById('details-content');
    details.innerHTML = ''; // Vide le contenu précédent

    let div = document.createElement('div');
    let ul = document.createElement('ul');

    let liDescription = document.createElement('li');
    liDescription.textContent = produit.description;

    let liCategorie = document.createElement('li');
    liCategorie.textContent = "Catégorie : " + produit.categorie;

    let liPrix = document.createElement('li');
    liPrix.textContent = "Prix : " + produit.prix + "€";

    let liPhoto = document.createElement('li');
    let photo = document.createElement('img');
    photo.src = produit.photo;
    photo.style.width = "400px";
    photo.style.maxHeight = '300px';
    liPhoto.appendChild(photo);

    let acceuil = document.createElement('button');
    acceuil.textContent = "Quitter les détails";
    acceuil.addEventListener('click', function() {
        detail.style.display = "none";
    });

    // Ajout des éléments à la liste
    ul.appendChild(liPhoto);
    ul.appendChild(liDescription);
    ul.appendChild(liCategorie);
    ul.appendChild(liPrix);
    ul.appendChild(acceuil);

    // Ajout au conteneur
    div.appendChild(ul);
    details.appendChild(div);

    detail.style.display = "flex";
}
