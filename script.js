const hostName = location.hostname;
chrome.runtime.sendMessage(hostName);
console.log(hostName);

// location: window.location;
