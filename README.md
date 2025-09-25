# Inventur-Management-System

Dies ist eine Web-Anwendung zur Planung, Durchführung und Auswertung einer Inventur in mehreren Filialen. Sie wurde für den Einsatz in einem Baufachgroßhandel konzipiert.

## Features

* **Multi-Filial-fähig:** Verwalten Sie mehrere Standorte mit jeweils eigenen Teams, Hallenplänen und Bereichen.
* **Admin-Dashboard:** Zentrale Verwaltung von Standorten, Teams, Hallenplänen, Bereichen und Zuweisungen.
* **Team-Ansicht:** Eigene, vereinfachte Ansicht für Mitarbeiter mit ihren zugewiesenen Aufgaben.
* **Zeiterfassung:** Teams können die Arbeitszeit pro Bereich erfassen.
* **Fundgrube:** Mitarbeiter können unbekannte Artikel mit Foto, Beschreibung, Menge und Barcode melden.
* **Barcode-Scanner:** Die App kann die Kamera des Geräts nutzen, um EAN-Codes zu scannen.
* **Export-Funktionen:** Exportieren Sie Zeiterfassungen und Fundgruben-Listen als CSV-Datei zur Weiterverarbeitung.
* **Push-Benachrichtigungen:** Teams können bei neuen Zuweisungen per Push-Nachricht informiert werden (erfordert HTTPS).

## Setup & Installation

Folgen Sie diesen Schritten, um die Anwendung lokal auszuführen:

### 1. Abhängigkeiten installieren
Stellen Sie sicher, dass Node.js auf Ihrem System installiert ist. Öffnen Sie ein Terminal im Hauptverzeichnis des Projekts und führen Sie aus:
```bash
npm install

VAPID Schlüssel für Push-Benachrichtigung generieren:
npx web-push generate-vapid-keys

Öffnen sie die server.js und ändern das generierte Schlüsselpaar

// ...
const vapidKeys = {
    publicKey: "HIER_IHR_PUBLIC_KEY_EINFUEGEN",
    privateKey: "HIER_IHR_PRIVATE_KEY_EINFUEGEN"
};
// ...

öffne die client.js und füge dort den Public Key ein:
// ...
const VAPID_PUBLIC_KEY = 'HIER_IHR_PUBLIC_KEY_EINFUEGEN';
// ...

starte den Server mit folgendem Befehl:
node server.js

Öffnen Sie Ihren Webbrowser und navigieren Sie zu:http://localhost:3000/inventur-app.html
Das Standard Passwort für den Admin lautet: admin
