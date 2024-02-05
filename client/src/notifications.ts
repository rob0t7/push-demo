
export function setupNotifications() {
  if (!('serviceWorker' in navigator)) {
    alert("Service Worker isn't supported on this browser")
    return;
  }

  if (!('PushManager' in window)) {
    alert('Push is not supported on this browser')
    return;
  }

  navigator.serviceWorker.register('/service-worker.js')
    .then(function (registration) {
      console.log('Service worker succeesfully registered.')
      const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U',
        ),
      }
      return registration.pushManager.subscribe(subscribeOptions)
    })
    .then(function (pushSubscription) {
      console.log('Received PushSubscription: ', JSON.stringify(pushSubscription))
      sendSubscriptionToBackEnd(pushSubscription)
      return pushSubscription
    })
    .catch(function (err) {
      console.error('Unable to register service worker,', err)
    })
}

export function askPermission() {
  return new Promise((resolve, reject) => {
    const permissionResult = Notification.requestPermission((result) => {
      resolve(result);
    })

    if (permissionResult) {
      permissionResult.then(resolve, reject);
    }
  }).then(function (permissionResult) {
    if (permissionResult !== 'granted') {
      alert('What the ____')
      throw new Error("We weren't granted permission")
    }
  })
}

function urlBase64ToUint8Array(base64String) {
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

function sendSubscriptionToBackEnd(subscription) {
  return fetch('http://localhost:8080/notifications/subscription', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(subscription)
  })
  .then(function (response) {
    if (!response.ok) {
      throw new Error('Bad status code from server.')
    }
    return response.json()
  })
  .then(function (responseData) {
    console.log(responseData)
  })
}
