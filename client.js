// client.js

const VAPID_PUBLIC_KEY = 'HIER_IHR_PUBLIC_KEY_EINFUEGEN'; // Ersetzen Sie dies mit Ihrem Public Key

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

async function subscribeUserToPush() {
    try {
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        console.log('Service Worker registriert.');

        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
        });
        
        await fetch('/api/subscribe', {
            method: 'POST',
            body: JSON.stringify(subscription),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log('Subscription an Server gesendet.');
        alert('Sie erhalten nun Benachrichtigungen!');

    } catch (error) {
        console.error('Fehler bei der Anmeldung für Push-Nachrichten:', error);
        alert('Fehler bei der Anmeldung für Benachrichtigungen. Bitte stellen Sie sicher, dass die Seite über HTTPS oder localhost aufgerufen wird.');
    }
}

async function askForNotificationPermission() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        alert("Push-Benachrichtigungen werden von diesem Browser nicht unterstützt.");
        return;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
        await subscribeUserToPush();
    } else {
        console.log('Berechtigung für Benachrichtigungen verweigert.');
    }
}
