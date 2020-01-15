chrome.runtime.sendMessage(
  {
    location: window.location
  },
  function(response) {
    console.log(response);
  }
);
