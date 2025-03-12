// file for managing data
const express = require('express');
const router = express.Router();
const multer = require('multer');
const db = require('./initdb');
const path = require('path');
const fs = require('fs');

// Setup file storage
const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './uploads/');
    },
    filename: function(req, file, callback) {
        // Use the 'path' module to get the extension of the original uploaded file
        callback(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage: storage });

// Route to display all characters
router.get('/', (req, res) => {
	const sort = req.query.sort;
    const order = req.query.order === 'desc' ? 'DESC' : 'ASC';  // Default to ascending if not specified

    // Validate sort field
    const validSortFields = ['Strength', 'Dexterity', 'Constitution', 'Wisdom', 'Intelligence', 'Charisma', 'Level'];
    const sortField = validSortFields.includes(sort) ? sort : 'CharacterId';  // Default to sorting by ID if invalid

    let query = `SELECT * FROM characters ORDER BY ${sortField} ${order}`;
	
    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(400).send("Unable to fetch characters.");
            throw err;
        }

        // Convert BLOB data to Base64 for each character
        const characters = rows.map(row => {
            const tokenBase64 = row.Token ? Buffer.from(row.Token).toString('base64') : null;
            return {
                ...row,
                Token: tokenBase64 ? `data:image/png;base64,${tokenBase64}` : null,
				id: row.CharacterId
            };
        });

        res.render('display', { characters: characters });
    });
});

// Route to display the form for creating a new character
router.get('/create', (req, res) => {
    const classes = [
        'Barbarian', 'Bard', 'Cleric', 'Druid', 
        'Fighter', 'Monk', 'Paladin', 'Ranger', 
        'Rogue', 'Sorcerer', 'Warlock', 'Wizard'
    ].map(cls => ({ name: cls, selected: false })); // Map to objects

    res.render('form', { 
        formAction: "/create", 
        isNew: true,
        classes: classes 
    });
});

// Route to handle the creation of a new character
router.post('/create', upload.single('Token'), (req, res) => {
    if (!req.file) {
        res.status(400).send("Uploading a token image is required.");
        return;
    }
	
	const { CharacterName, Class, Level, Strength, Dexterity, Constitution, Wisdom, Intelligence, Charisma } = req.body;
    const Token = fs.readFileSync(req.file.path);

	// Validation
	if (!CharacterName || !Class || [Strength, Dexterity, Constitution, Wisdom, Intelligence, Charisma].some(stat => stat < 8 || stat > 20)) {
        res.status(400).send("Please fill all fields correctly.");
        return;
    }

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
router.get('/modify/:id', (req, res) => {
    const id = req.params.id;
    db.get("SELECT * FROM characters WHERE CharacterId = ?", [id], (err, character) => {
        if (err) {
            res.status(400).send("Character not found.");
            throw err;
        }
        
        const classes = [
            'Barbarian', 'Bard', 'Cleric', 'Druid', 
            'Fighter', 'Monk', 'Paladin', 'Ranger', 
            'Rogue', 'Sorcerer', 'Warlock', 'Wizard'
        ].map(cls => ({ name: cls, selected: cls === character.Class }));

        res.render('form', { 
            character: character,
            formAction: `/update/${id}`, 
            isNew: false,
            classes: classes 
        });
    });
});

// Route to update a character
router.post('/update/:id', upload.single('Token'), (req, res) => {
    const id = req.params.id;
    const { CharacterName, Class, Level, Strength, Dexterity, Constitution, Wisdom, Intelligence, Charisma } = req.body;
    const Token = req.file ? fs.readFileSync(req.file.path) : null; // Read file buffer if uploaded

	// Validation
	if (!CharacterName || !Class || [Strength, Dexterity, Constitution, Wisdom, Intelligence, Charisma].some(stat => stat < 8 || stat > 20)) {
        res.status(400).send("Please fill all fields correctly.");
        return;
    }
	
	db.get("SELECT Token FROM characters WHERE CharacterId = ?", [id], (err, result) => {
        if (err) {
            res.status(400).send("Failed to retrieve existing character.");
            return;
        }

        // If no new file is uploaded, use the existing Token
        if (!Token && result.Token) {
            Token = result.Token;
        }
	
		db.run("UPDATE characters SET CharacterName = ?, Token = ?, Class = ?, Level = ?, Strength = ?, Dexterity = ?, Constitution = ?, Wisdom = ?, Intelligence = ?, Charisma = ? WHERE rowid = ?",
			[CharacterName, Token, Class, Level, Strength, Dexterity, Constitution, Wisdom, Intelligence, Charisma, id], function(err) {
			if (err) {
				res.status(400).send("Failed to update character.");
				throw err;
			}
			res.redirect('/');
		});
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

// Route to delete all characters
router.get('/delete-all', (req, res) => {
    db.run("DELETE FROM characters", function(err) {
        if (err) {
            res.status(500).send("Failed to delete all characters.");
            return;
        }
        res.redirect('/'); // Redirect back to the character list or a confirmation page
    });
});

// Route to filter character records
router.get('/filter', (req, res) => {
    const { class: filterClass, highestStat } = req.query;
    const stats = ['Strength', 'Dexterity', 'Constitution', 'Wisdom', 'Intelligence', 'Charisma'];

    let query = "SELECT * FROM characters WHERE 1=1";
    const params = [];

    if (filterClass && filterClass !== "") {
        query += " AND Class = ?";
        params.push(filterClass);
    }

    if (highestStat && highestStat !== "") {
        const comparisons = stats.filter(stat => stat !== highestStat) // Filter out the selected stat
            .map(stat => `${highestStat} >= ${stat}`); // Create comparison strings
        if (comparisons.length > 0) {
            query += ` AND ${comparisons.join(' AND ')}`; // Append comparisons to the main query
        }
	}

    db.all(query, params, (err, rows) => {
        if (err) {
            res.status(400).send("Unable to fetch characters.");
            return;
        }
		
		// Convert BLOB data to Base64 for each character
        const characters = rows.map(row => {
            const tokenBase64 = row.Token ? Buffer.from(row.Token).toString('base64') : null;
            return {
                ...row,
                Token: tokenBase64 ? `data:image/png;base64,${tokenBase64}` : null,
				id: row.CharacterId
            };
        });
		
		// Prepare viewData for rendering
        let viewData = {
            characters: characters,
            selectedClass: filterClass || "",
            selectedStat: highestStat || "",
            isBarbarian: filterClass === 'Barbarian',
            isBard: filterClass === 'Bard',
            isCleric: filterClass === 'Cleric',
			isDruid: filterClass === 'Druid',
            isFighter: filterClass === 'Fighter',
            isMonk: filterClass === 'Monk',
			isPaladin: filterClass === 'Paladin',
            isRanger: filterClass === 'Ranger',
            isRogue: filterClass === 'Rogue',
			isSorcerer: filterClass === 'Sorcerer',
			isWarlock: filterClass === 'Warlock',
            isWizard: filterClass === 'Wizard',
            isStrength: highestStat === 'Strength',
			isDexterity: highestStat === 'Dexterity',
            isConstitution: highestStat === 'Constitution',
            isWisdom: highestStat === 'Wisdom',
			isIntelligence: highestStat === 'Intelligence',
            isCharisma: highestStat === 'Charisma'
        };
		
        res.render('display', viewData);
    });
});

module.exports = router;
