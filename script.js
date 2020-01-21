chrome.runtime.sendMessage(
  { domain: location.hostname, action: "checkSite" },
  function(response) {
    console.log(response);
    if (response) {
      let div = document.createElement("div");
      let style = document.createElement("style");
      let cross = document.createElement("button");

      cross.innerHTML = "X";
      cross.setAttribute("id", "cross");

      div.innerHTML = response;
      div.setAttribute("id", "ing");

      style.type = "text/css";
      document.getElementsByTagName("head")[0].append(style);
      style.appendChild(
        document.createTextNode(`#ing {
                background-color: blue;
                font-size: 20px;
                position: fixed;
                top: 0;
                z-index: 2147483647;
                color: white;
            }
            #cross {
                color: white;
                background-color: red;
                cursor: pointer;
                transition: opacity 1s;
              }
              #cross:hover {
                opacity: 0.7;
              }`)
      );

      document.getElementsByTagName("body")[0].append(div);
      div.appendChild(cross);
      cross.addEventListener("click", () => {
        chrome.runtime.sendMessage({
          domain: location.hostname,
          action: "closedMessage"
        });
        div.remove();
      });
    }
  }
);
