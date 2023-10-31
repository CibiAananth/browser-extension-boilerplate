chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === 'install') {
    chrome.tabs.create({ url: 'src/pages/onboarding/index.html' });
  }

  console.log('hello from hmr in bg');
});
