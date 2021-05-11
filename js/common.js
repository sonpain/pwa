// @ch4. 서비스 워커 등록
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/pwa/service-worker.js').then((registration) => {
    // 업데이트 발견
    registration.addEventListener('updatefound', () => {
      // 설치 중인 새로운 서비스 워커
      const newServiceWorker = registration.installing;
      console.log('PAPER: New update found!');

      newServiceWorker.addEventListener('statechange', (event) => {
        const state = event.target.state;
        console.log('PAPER: ' + state);
        if (state === 'installed') {
          util.message('앱을 재시작하면 업데이트가 적용됩니다!');
        }
      });
    });
  });
}


let deferredPrompt;
  const addBtn = document.querySelector('.add-button');
  addBtn.style.display = 'none';

  self.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI to notify the user they can add to home screen
    addBtn.style.display = 'block';
  
    addBtn.addEventListener('click', (e) => {
      // hide our user interface that shows our A2HS button
      addBtn.style.display = 'none';
      // Show the prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the A2HS prompt');
          } else {
            console.log('User dismissed the A2HS prompt');
          }
          deferredPrompt = null;
        });
    });
  });