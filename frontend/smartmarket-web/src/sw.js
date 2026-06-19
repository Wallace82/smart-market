self.addEventListener('push', function(event) {
    console.log('[Service Worker] Notificação Push recebida.', event);
    
    let data = {};
    if (event.data) {
        try {
            data = event.data.json();
        } catch (e) {
            console.error('[Service Worker] Erro ao parsear JSON do push:', e);
            data = { notification: { title: "SmartMarket", body: event.data.text() } };
        }
    }
    
    const title = data.notification?.title || "SmartMarket";
    const options = {
        body: data.notification?.body || "Você tem novas ofertas!",
        icon: "/assets/favicon.ico",
        badge: "/assets/favicon.ico",
        data: data.notification?.data || {}
    };
    
    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener('notificationclick', function(event) {
    console.log('[Service Worker] Notificação clicada.', event);
    event.notification.close();
    
    // URL padrão para abrir caso não venha deepLink
    let urlToOpen = event.notification.data?.url || '/';
    
    // Se for URL relativa, completa com a origem
    if (urlToOpen.startsWith('/')) {
        urlToOpen = self.location.origin + urlToOpen;
    }
    
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(windowClients) {
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                if (client.url === urlToOpen && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});
