// @ch4. 서비스 워커 등록
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('../service-worker.js').then((registration) => {
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


