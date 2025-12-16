const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bodyParser = require("body-parser");
const hbs = require("hbs");

const app = express();
const prisma = new PrismaClient();
const PORT = 3008;
const path = require("path");

// Configuration de Handlebars pour Express
app.set("view engine", "hbs"); // On définit le moteur de template que Express va utiliser
app.set("views", path.join(__dirname, "views")); // On définit le dossier des vues (dans lequel se trouvent les fichiers .hbs)
hbs.registerPartials(path.join(__dirname, "views", "partials")); // On définit le dossier des partials (composants e.g. header, footer, menu...)

// Enregistrer le helper ifEquals pour Handlebars
hbs.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

// Helper pour formater la date au format datetime-local
hbs.registerHelper('formatDateForInput', function(date) {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
});

// Servir les fichiers statiques (CSS, images, etc.)
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded())

app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const launchfun = async () => {
    const genres = await prisma.genres.count()
    if (genres == 0){
        await prisma.genres.createMany({
            data: [
            { nom: 'Action'  },
            { nom: 'Aventure' }, // Duplicate unique key!
            { nom: 'RPG'},
            { nom: 'Simulation'},
            { nom: 'Sport'}
            ],
        })
    }
}

launchfun()

app.get("/", async (req, res) => {
    const jeux = await prisma.jeux.findMany({ where : {misenavant: Boolean('true')}})
    res.render("jeux/misenavant", { jeux });
});

app.get("/jeux", async (req, res) => {
    const jeux = await prisma.jeux.findMany();
    res.render("jeux/jeux", { jeux });
});

app.get("/jeux/form", async (req, res) => {
    const genres = await prisma.genres.findMany();
    const editeurs = await prisma.editeurs.findMany();
    res.render("jeux/ajout", {
        genres,
        editeurs
    });
})

app.post("/jeux/form", async (req, res) => {
    const jeux = {
        titre: req.body.titre,
        description: req.body.description,
        date: new Date(req.body.date).toISOString(),
        genre: req.body.genre,
        editeur: req.body.editeur,
        misenavant: req.body.misenavant === 'true',
        image:  req.body.image
    };
    try {
        await prisma.jeux.create({
            data: jeux,
        }); // Ici on ne stock pas le retour de la requête, mais on attend quand même son exécution
        res.status(201).redirect("/jeux"); // On redirige vers la page des films
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Task creation failed" });
    }
});

app.get("/jeux/edit/:id", async (req, res) => {
    const jeuId = parseInt(req.params.id, 10);
    const jeu = await prisma.jeux.findUnique({
        where: { id: jeuId },
    });
    const genres = await prisma.genres.findMany({
        where: { 
            NOT: { nom: jeu.genre }
        },
    });
    const editeurs = await prisma.editeurs.findMany({
        where: { 
            NOT: { nom: jeu.editeur }
        },
    });
    res.render("jeux/edit", {
        jeu,
        genres,
        editeurs
    });
});

app.post("/jeux/edit/:id", async (req, res) => {
    const jeuId = parseInt(req.params.id, 10);
    console.log("Edit form data:", req.body);
    
    const updatedJeu = {
        titre: req.body.titre,
        description: req.body.description,
        date: new Date(req.body.date).toISOString(),
        genre: req.body.genre,
        editeur: req.body.editeur,
        misenavant: req.body.misenavant === 'true',
        image:  req.body.image
    };
    try {
        // Créer une copie avec les nouvelles données
        await prisma.jeux.update({
            where: { id: jeuId },
            data: updatedJeu,
        });
        res.status(200).redirect("/jeux");
    } catch (error) {
        console.error("Error updating jeu:", error);
        res.status(400).json({ error: "Task update failed", details: error.message });
    }
});

app.get("/jeux/:id", async (req, res) => {
    const jeuId = parseInt(req.params.id, 10);
    const jeu = await prisma.jeux.findUnique({
        where: { id: jeuId },
    });
        res.render("jeux/jeu", jeu);
});

app.get("/editeurs", async (req, res) => {
    const editeurs = await prisma.editeurs.findMany();
    res.render("editeurs/editeurs", { editeurs });
});

app.get("/genres", async (req, res) => {
    const genres = await prisma.genres.findMany();
    res.render("genres/genres", { genres });
});

app.get("/genres/:genre", async (req, res) => {
    const genreParam = req.params.genre;
    const jeux = await prisma.jeux.findMany({
        where: { genre: genreParam },
    });
    res.render("genres/genre", { jeux, genreParam });
});

app.get("/editeurs/form", async (req, res) => {
    res.render("editeurs/ajout");
});

app.post("/editeurs/form", async (req, res) => {
    const editeur = {
        nom: req.body.nom,
        pays: req.body.pays
    };
    try {
        await prisma.editeurs.create({
            data: editeur,
        });
        res.status(201).redirect("/editeurs");
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Task creation failed" });
    }
});

app.get("/editeurs/edit/:id", async (req, res) => {
    const editeurId = parseInt(req.params.id, 10);
    const editeur = await prisma.editeurs.findUnique({
        where: { id: editeurId },
    });
    res.render("editeurs/edit", {
        editeur
    });
});

app.post("/editeurs/edit/:id", async (req, res) => {
    const editeurId = parseInt(req.params.id, 10);
    console.log("Edit form data:", req.body);
    const ancienNom = await prisma.editeurs.findUnique({
        where: { id: editeurId },
    });
    const nouveauEditeur = {
        nom: req.body.nom,
    };
    try {
        await prisma.jeux.updateMany({
            where: { editeur: ancienNom.nom },
            data: { editeur: req.body.nom },
        });
        await prisma.editeurs.update({
            where: { id: editeurId },
            data: nouveauEditeur,
        });
        res.status(200).redirect("/editeurs");
    } catch (error) {
        console.error("Error updating editeur:", error);
        res.status(400).json({ error: "Task update failed", details: error.message });
    }
});

app.get("/editeurs/:editeur", async (req, res) => {
    const editeurParam = req.params.editeur;
    const jeux = await prisma.jeux.findMany({
        where: { editeur: editeurParam },
    });
    res.render("editeurs/editeur", { jeux, editeur: editeurParam });
});

app.get("/editeurs/delete/:id", async (req, res) => {
    const editeurId = parseInt(req.params.id, 10);
    const editeur = (await prisma.editeurs.findUnique({
        where: { id: editeurId },
    })).nom;
    const jeux = await prisma.jeux.findMany({
        where: { editeur: editeur.nom },
    });
    for (const jeu of jeux) {
        await prisma.jeux.delete({
            where: { id: jeu.id },
        });
    }
    await prisma.editeurs.delete({
        where: { id: editeurId },
    });
    
    res.redirect("/editeurs");
});



app.get("/jeux/delete/:id", async (req, res) => {
    const jeuId = parseInt(req.params.id, 10);
    await prisma.jeux.delete({
        where: { id: jeuId },
    });
    res.redirect("/jeux");
});