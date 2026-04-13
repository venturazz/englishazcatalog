self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(clients.claim());
});

self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Queue Alert 📢';
  const body  = data.body  || 'Your number is being called! Please proceed to the counter.';
  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: '/icon.png',
      badge: '/badge.png',
      vibrate: [300, 100, 300, 100, 300],
      tag: 'queue-alert',
      renotify: true,
      requireInteraction: true
    })
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (const client of clientList) {
        if (client.url.includes('queue-guest') && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('/queue-guest.html');
    })
  );
});

// Listen for messages from the page to show notification locally
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    self.registration.showNotification(event.data.title, {
      body: event.data.body,
      vibrate: [300, 100, 300, 100, 300],
      tag: 'queue-alert',
      renotify: true,
      requireInteraction: true
    });
  }
});
