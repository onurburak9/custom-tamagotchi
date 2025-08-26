const CACHE_NAME = 'stachie-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  // Focus on the app window or open it
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        // Check if there's already a window/tab open
        for (let client of clientList) {
          if (client.url && 'focus' in client) {
            return client.focus();
          }
        }
        // If no window is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
  );
});

// Handle notification actions (if we add action buttons later)
self.addEventListener('notificationclose', event => {
  // Log notification dismissal for analytics if needed
  console.log('Notification was closed', event.notification.tag);
});

// Store scheduled notification timeouts
let scheduledNotifications = [];

// Listen for messages from the main app
self.addEventListener('message', event => {
  if (event.data.type === 'SCHEDULE_NOTIFICATIONS') {
    scheduleNotifications(event.data.data);
  } else if (event.data.type === 'CANCEL_NOTIFICATIONS') {
    cancelAllNotifications();
  }
});

function scheduleNotifications(data) {
  // Cancel any existing scheduled notifications
  cancelAllNotifications();
  
  // Schedule notifications at different intervals
  // TEST MODE: Using seconds instead of minutes for testing
  const notificationSchedule = [
    { delay: 5 * 1000, message: "TEST: 5 seconds away! Stachie might be getting lonely! 🐾" },
    { delay: 10 * 1000, message: "TEST: 10 seconds! Stachie really misses you! Come back and play? 😿" },
    { delay: 15 * 1000, message: "TEST: 15 seconds away? Stachie needs attention! Her stats might be low! 🥺" },
    { delay: 20 * 1000, message: "TEST: 20 seconds! She's probably hungry and sad! 😢" },
    { delay: 30 * 1000, message: "TEST: 30 seconds! Stachie really needs you! Please come back! 🆘" },
    { delay: 45 * 1000, message: "TEST: 45 seconds! Stachie is very sad and needs care urgently! 💔" }
  ];
  
  // PRODUCTION MODE: Uncomment these lines for real usage
  // const notificationSchedule = [
  //   { delay: 30 * 60 * 1000, message: "Hey! It's been 30 minutes. Stachie might be getting lonely! 🐾" },
  //   { delay: 60 * 60 * 1000, message: "It's been an hour! Stachie really misses you! Come back and play? 😿" },
  //   { delay: 2 * 60 * 60 * 1000, message: "2 hours away? Stachie needs attention! Her stats might be low! 🥺" },
  //   { delay: 4 * 60 * 60 * 1000, message: "Stachie hasn't seen you in 4 hours! She's probably hungry and sad! 😢" },
  //   { delay: 8 * 60 * 60 * 1000, message: "It's been 8 hours! Stachie really needs you! Please come back! 🆘" },
  //   { delay: 24 * 60 * 60 * 1000, message: "A whole day without you! Stachie is very sad and needs care urgently! 💔" }
  // ];
  
  // Schedule each notification
  notificationSchedule.forEach(schedule => {
    const timeoutId = setTimeout(() => {
      showScheduledNotification(schedule.message, data);
    }, schedule.delay);
    
    scheduledNotifications.push(timeoutId);
  });
}

function cancelAllNotifications() {
  // Clear all scheduled timeouts
  scheduledNotifications.forEach(timeoutId => {
    clearTimeout(timeoutId);
  });
  scheduledNotifications = [];
}

function showScheduledNotification(message, data) {
  // Check if we have permission
  if (self.Notification && self.Notification.permission === 'granted') {
    self.registration.showNotification('Stachie needs you!', {
      body: message,
      icon: '/stachie-sprites-2.png',
      badge: '/stachie-sprites-2.png',
      tag: 'stachie-scheduled',
      requireInteraction: true,
      vibrate: [200, 100, 200, 100, 200],
      data: {
        url: '/',
        stats: data.stats,
        mood: data.mood
      },
      actions: [
        { action: 'open', title: 'Check on Stachie' },
        { action: 'later', title: 'Remind me later' }
      ]
    });
  }
}

// Handle notification action clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    // Open the app
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then(clientList => {
          // Check if there's already a window/tab open
          for (let client of clientList) {
            if (client.url && 'focus' in client) {
              return client.focus();
            }
          }
          // If no window is open, open a new one
          if (clients.openWindow) {
            return clients.openWindow('/');
          }
        })
    );
  } else if (event.action === 'later') {
    // Schedule another reminder in 1 hour
    setTimeout(() => {
      showScheduledNotification("Reminder: Stachie still needs you! 🐾", event.notification.data);
    }, 60 * 60 * 1000);
  }
});