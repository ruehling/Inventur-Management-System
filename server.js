// --- Backend Server für die Inventur-App ---

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const webpush = require('web-push');

// --- KONFIGURATION ---
// Fügen Sie hier Ihre generierten VAPID-Schlüssel ein
const vapidKeys = {
    publicKey: "HIER_IHR_PUBLIC_KEY_EINFUEGEN",
    privateKey: "HIER_IHR_PRIVATE_KEY_EINFUEGEN"
};
// --------------------

webpush.setVapidDetails(
  'mailto:ihre-email@example.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(cors());
app.use(express.static(__dirname));


// --- Datenbank-Setup ---
const DB_PATH = path.join(__dirname, 'database.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR);
}

function readDatabase() {
    if (!fs.existsSync(DB_PATH)) {
        return { locations: [], teams: [], areas: [], timeLogs: [], hallPlans: [], foundItems: [], subscriptions: [] };
    }
    try {
        const data = fs.readFileSync(DB_PATH, 'utf8');
        if (data.trim() === '') {
            return { locations: [], teams: [], areas: [], timeLogs: [], hallPlans: [], foundItems: [], subscriptions: [] };
        }
        const parsedData = JSON.parse(data);
        if (parsedData.teamMemberships) delete parsedData.teamMemberships;
        if (!parsedData.hallPlans) parsedData.hallPlans = [];
        if (!parsedData.foundItems) parsedData.foundItems = [];
        if (!parsedData.subscriptions) parsedData.subscriptions = [];
        
        return parsedData;
    } catch (error) {
        console.error("Fehler beim Lesen der database.json:", error);
        return { locations: [], teams: [], areas: [], timeLogs: [], hallPlans: [], foundItems: [], subscriptions: [] };
    }
}

function writeDatabase(data) {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error("Fehler beim Schreiben in die database.json:", error);
    }
}

// --- API Endpunkte (Routen) ---

app.get('/api/data', (req, res) => {
    const data = readDatabase();
    res.json(data);
});

app.post('/api/data', (req, res) => {
    const newData = req.body;
    if (!newData || !newData.teams || !newData.areas || !newData.locations) {
        return res.status(400).json({ message: "Ungültige oder unvollständige Daten." });
    }
    const db = readDatabase();
    const oldAreas = [...db.areas];

    const dataToSave = { ...db, ...newData };
    writeDatabase(dataToSave);

    newData.areas.forEach(newArea => {
        const oldArea = oldAreas.find(a => a.id === newArea.id);
        if (newArea.teamId && (!oldArea || oldArea.teamId !== newArea.teamId)) {
            sendNotificationToTeam(newArea.teamId, `Neuer Bereich zugewiesen: ${newArea.name}`);
        }
    });

    res.status(200).json({ message: "Daten erfolgreich gespeichert." });
});

app.post('/api/subscribe', (req, res) => {
    const subscription = req.body;
    const db = readDatabase();
    if (!db.subscriptions.some(s => s.endpoint === subscription.endpoint)) {
        db.subscriptions.push(subscription);
        writeDatabase(db);
    }
    res.status(201).json({});
});

app.post('/api/found-item', (req, res) => {
    const { areaId, description, barcode, quantity, imageData } = req.body;
    if (!areaId || !description) {
        return res.status(400).json({ message: "Beschreibung fehlt." });
    }
    try {
        let imageFile = null;
        if (imageData) {
            const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
            const fileName = `found_${Date.now()}.png`;
            const filePath = path.join(UPLOADS_DIR, fileName);
            fs.writeFileSync(filePath, base64Data, 'base64');
            imageFile = `uploads/${fileName}`;
        }
        const db = readDatabase();
        const newFoundItem = { id: `found_${Date.now()}`, areaId, description, barcode, quantity: quantity || 1, imageFile, status: 'offen', comment: '', timestamp: new Date().toISOString() };
        db.foundItems.push(newFoundItem);
        writeDatabase(db);
        res.status(201).json({ message: "Fundstück erfolgreich gespeichert.", item: newFoundItem });
    } catch (error) {
        console.error("Fehler beim Speichern des Fundstücks:", error);
        res.status(500).json({ message: "Server-Fehler." });
    }
});

app.post('/api/found-item/status', (req, res) => {
    const { itemId, status, comment } = req.body;
    if (!itemId || !status) {
        return res.status(400).json({ message: "Fehlende Item-ID oder Status." });
    }
    const db = readDatabase();
    const item = db.foundItems.find(i => i.id === itemId);
    if (item) {
        item.status = status;
        if (typeof comment === 'string') {
            item.comment = comment;
        }
        writeDatabase(db);
        res.status(200).json({ message: "Status aktualisiert.", item });
    } else {
        res.status(404).json({ message: "Item nicht gefunden." });
    }
});

function sendNotificationToTeam(teamId, message) {
    const payload = JSON.stringify({ title: 'Inventur-App Update', body: message });
    const db = readDatabase();
    
    db.subscriptions.forEach(subscription => {
        webpush.sendNotification(subscription, payload).catch(error => {
            if (error.statusCode === 410) {
                db.subscriptions = db.subscriptions.filter(s => s.endpoint !== subscription.endpoint);
                writeDatabase(db);
            } else {
                console.error('Fehler beim Senden der Push-Nachricht:', error.statusCode);
            }
        });
    });
}

// --- Server starten ---
app.listen(PORT, () => {
    console.log(`Inventur-Backend und Frontend laufen auf http://localhost:${PORT}/inventur-app.html`);
});
