chrome.runtime.sendMessage(
  { domain: location.hostname, action: "checkSite" },
  function(response) {
    // console.log(response);
    if (response) {
      let div = document.createElement("div");
      div.className = "ingection";
      //   div.style.backgroundColor = "blue";
      newDiv.innerHTML = response;
      document.body.append(div);
    }
  }
);
