const hostName = location.hostname;
console.log(hostName);

// location: window.location;

chrome.runtime.sendMessage(hostName, function(response) {
  console.log(response);
  if (response) {
    let div = document.createElement("div");
    div.innerHTML = "<strong>Привет!</strong>";
    document.body.append(div);
  }
});
