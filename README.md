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


<img width="642" height="567" alt="image" src="https://github.com/user-attachments/assets/697f88c4-7845-4440-b61d-2d19631e7234" />
Admin Dashboard Login


<img width="651" height="540" alt="image" src="https://github.com/user-attachments/assets/2aa9f9a1-593c-4666-8bb6-1baa7d8fd19b" />
Filialauswahl

<img width="1901" height="594" alt="image" src="https://github.com/user-attachments/assets/b05ac4eb-0f23-41ec-8170-7b6605b162ff" />
Auswahl und Zeitstart der Inventurzählung

<img width="666" height="627" alt="image" src="https://github.com/user-attachments/assets/a1fde0a4-e84f-49b8-892b-206535c77dc5" />
Fundartikel melden, welcher nicht im ERP System gefunden werden kann. 

<img width="353" height="271" alt="image" src="https://github.com/user-attachments/assets/3c832c6f-6dfd-42bb-be66-ab6019e585cb" />
nach dem Login ins Admin Center ist eine Filialauswahl möglich

<img width="1882" height="763" alt="image" src="https://github.com/user-attachments/assets/69a6886c-7da4-4295-a783-a9f4d3579e53" />
Übersicht des Admin Dashboards


