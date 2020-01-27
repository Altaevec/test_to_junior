"use strict";

const extractDomain = url => {
  if (!url) return url;
  let domain;
  if (url.indexOf("://") > -1) {
    domain = url.split("/")[2];
  } else {
    domain = url.split("/")[0];
  }
  domain = domain.split(":")[0];
  let arrayFromString = domain.split(".");
  if (arrayFromString.length > 2)
    arrayFromString.splice(0, arrayFromString.length - 2);
  domain = arrayFromString.join(".");
  domain = ("" + domain).toLowerCase();
  return domain;
};

chrome.runtime.sendMessage(
  { domain: location.hostname, action: "checkSite" },
  function(response) {
    // console.log(response);
    if (response.message) {
      let div = document.createElement("div");
      let style = document.createElement("style");
      let cross = document.createElement("button");

      cross.innerHTML = "X";
      cross.setAttribute("id", "cross");

      div.innerHTML = response.message;
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
        }
        .googleSerp {
          left: -30px;
          width: 20px;
          height: 20px;
          z-index: 2147483627;
          position: absolute;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          background-image: url("data:image/png;base64,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");
        }
        .yandexSerp {
          top: 19px;
          left: -1px;
          width: 20px;
          height: 20px;
          z-index: 2147483627;
          position: absolute;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          background-image: url("data:image/png;base64,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");
        }
        .bingSerp {
          left: 95px;
          width: 20px;
          height: 20px;
          z-index: 2147483627;
          position: absolute;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          background-image: url("data:image/png;base64,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");
        }
        
              `)
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

      let arrayFromCollection = Array.from(
        document.querySelectorAll(response.config.collectionSelector)
      );

      let sites = response.sitesList;
      // console.log(sites);

      arrayFromCollection.forEach(item => {
        sites.forEach(conf => {
          // console.log(conf);
          // console.log(item);

          if (extractDomain(item.textContent) === conf.domain) {
            let img = document.createElement("div");
            img.setAttribute("class", response.config.class);
            // console.log(item.closest(response.config.pasteSelector));
            if (response.config.isYandex) {
              item
                .closest(response.config.pasteSelector_1)
                .querySelector(response.config.pasteSelector_2)
                .prepend(img);
            } else {
              item.closest(response.config.pasteSelector).prepend(img);
            }
          }
        });
      });
    }
  }
);
