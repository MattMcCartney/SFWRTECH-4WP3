// file for managing data
const express = require('express');
const router = express.Router();
const multer = require('multer');
const db = require('characters');

// Setup file storage
const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './uploads/');
    },
    filename: function(req, file, callback) {
        callback(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage: storage });

// Route to display all characters
router.get('/', (req, res) => {
    db.all("SELECT * FROM characters", [], (err, rows) => {
        if (err) {
            res.status(400).send("Unable to fetch characters.");
            throw err;
        }
        res.render('characters', { characters: rows });
    });
});

// Route to display the form for creating a new character
router.get('/create', (req, res) => {
    res.render('characterForm', { formAction: "/create", isNew: true });
});

// Route to handle the creation of a new character
router.post('/create', upload.single('Token'), (req, res) => {
    const { CharacterName, Class, Level, Strength, Dexterity, Constitution, Wisdom, Intelligence, Charisma } = req.body;
    const Token = req.file ? fs.readFileSync(req.file.path) : null; // Read file buffer if uploaded

    db.run("INSERT INTO characters (CharacterName, Token, Class, Level, Strength, Dexterity, Constitution, Wisdom, Intelligence, Charisma) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
        [CharacterName, Token, Class, Level, Strength, Dexterity, Constitution, Wisdom, Intelligence, Charisma], function(err) {
        if (err) {
            res.status(400).send("Failed to create character.");
            throw err;
        }
        res.redirect('/');
    });
});

// Route to display the form for editing an existing character
router.get('/edit/:id', (req, res) => {
    const id = req.params.id;
    db.get("SELECT * FROM characters WHERE rowid = ?", [id], (err, row) => {
        if (err) {
            res.status(400).send("Character not found.");
            throw err;
        }
        res.render('characterForm', { character: row, formAction: `/update/${id}`, isNew: false });
    });
});

// Route to update a character
router.post('/update/:id', upload.single('Token'), (req, res) => {
    const id = req.params.id;
    const { CharacterName, Class, Level, Strength, Dexterity, Constitution, Wisdom, Intelligence, Charisma } = req.body;
    const Token = req.file ? fs.readFileSync(req.file.path) : null; // Read file buffer if uploaded

    db.run("UPDATE characters SET CharacterName = ?, Token = ?, Class = ?, Level = ?, Strength = ?, Dexterity = ?, Constitution = ?, Wisdom = ?, Intelligence = ?, Charisma = ? WHERE rowid = ?",
        [CharacterName, Token, Class, Level, Strength, Dexterity, Constitution, Wisdom, Intelligence, Charisma, id], function(err) {
        if (err) {
            res.status(400).send("Failed to update character.");
            throw err;
        }
        res.redirect('/');
    });
});

// Route to delete a character
router.get('/delete/:id', (req, res) => {
    const id = req.params.id;
    db.run("DELETE FROM characters WHERE rowid = ?", [id], function(err) {
        if (err) {
            res.status(400).send("Failed to delete character.");
            throw err;
        }
        res.redirect('/');
    });
});

module.exports = router;
