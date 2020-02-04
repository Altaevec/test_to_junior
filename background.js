class Background {
  constructor() {
    this.time = 0;
    this.json = "";
    this.sitesList = [];
    this.load();
  }
  async load() {
    const response = await fetch(
      "http://www.softomate.net/ext/employees/list.json"
    );

    this.sitesList = await response.json();

    //Работа с localStorage
    const merchants = localStorage.getItem("merchants");
    this.time = new Date().getTime();
    this.json = JSON.stringify(this.sitesList);

    if (merchants === null) {
      this.updateMerchants();

      console.log("added");
    } else if (
      merchants !== this.json ||
      this.time - +localStorage.getItem("time") > 10000 //* 60 * 60 время обновлений
    ) {
      this.updateMerchants();

      console.log("modify");
    } else {
      console.log("sasamba");
    }
  }
  updateMerchants() {
    localStorage.setItem("merchants", this.json);
    localStorage.setItem("time", this.time);
  }
}

window.background = new Background();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  let fixedDomain = request.domain.replace("www.", "");

  if (fixedDomain === "google.com") {
    fixedDomain = fixedDomain.replace(".com", ".ru");
  }
  switch (request.action) {
    case "checkSite":
      background.sitesList.forEach(item => {
        const siteID = item.name;
        let siteCounter = +sessionStorage.getItem(siteID);
        const isOverflowed = siteCounter <= 2;
        if (item.domain === fixedDomain && isOverflowed) {
          sessionStorage.setItem(siteID, ++siteCounter);
          // console.log(item.name);
          sendResponse({
            message: item.message,
            sitesList: background.sitesList,
            config: config[fixedDomain]
          });
          return;
        } else {
          console.log("govno");
        }
        // console.log(domainToList);
      });
      sendResponse(false);
      break;
    case "closedMessage":
      const site = background.sitesList.find(
        item => item.domain === fixedDomain
      );
      sessionStorage.setItem(site.name, 3);

      break;
  }
});

const config = {
  "google.ru": {
    collectionSelector: ".rc .r > a cite",
    pasteSelector: ".rc .r > a",
    class: "googleSerp"
  },

  "yandex.ru": {
    collectionSelector: "li a > b",
    pasteSelector_1: ".organic",
    pasteSelector_2: ".favicon__icon",
    isYandex: true,
    class: "yandexSerp"
  },

  "bing.com": {
    collectionSelector: "li div cite",
    pasteSelector: "li div cite",
    class: "bingSerp"
  }
};

//test
