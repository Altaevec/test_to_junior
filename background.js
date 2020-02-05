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
  return domain.match(/.*\./)[0].slice(0, -1);
};

class Background {
  constructor() {
    /*
    TODO:
         Тебе не требуется наличе это переменной. done
         Ты можешь делать преобразование в json строку прямо при записи в localStorage
         `localStorage.setItem("merchants", JSON.stringify(this.sitesList));`
     */
    this.json = "";
    this.sitesList = [];
    // TODO: список будет подгружаться только при инициализации бекгрунда. И потом не обновляться.
    this.timeUpdate = 60000;
    this.load();
  }
  load(forceUpdate = false) {
    let currentTime = new Date().getTime();
    let oldTime = +localStorage.getItem("time");
    if (currentTime - oldTime > this.timeUpdate || forceUpdate) {
      this.loadSites();
      this.updateMerchants(currentTime);
      setTimeout(() => {
        this.load();
      }, this.timeUpdate);
      console.log("if");
    } else {
      setTimeout(() => {
        this.load(true);
      }, this.timeUpdate - (currentTime - oldTime));
      console.log("else");
    }
  }

  async loadSites() {
    const response = await fetch(
      "http://www.softomate.net/ext/employees/list.json"
    );

    this.sitesList = await response.json();

    // TODO: получение текущим мерчей в целом не нужно. Если ты получил новый список его нужно просто записать.
    localStorage.getItem("merchants");

    this.json = JSON.stringify(this.sitesList);

    // TODO: Эту проверку можно полностью убрать. Как и проверку merchants !== this.json.
    //  Само создание запрос стоить делать только если у тебя прошло более времени.
    //  Если ты делаешь запрос к серверу и получешь положительный ответ, то проверки на клиенте как у тебя обычно не требуются.
    //done

    // TODO: если ты пишешь комментраий то пиши им подробно и с объектами.

    // TODO: Удали все комментарии с матами и которые не несут никакого смысла. done
  }

  updateMerchants(currentTime) {
    // TODO: метод updateMerchants не отражает своего имени.
    //  Желательно переделать в вид updateMerchants({ merchants, time })
    //  Более подробно могу обяснить словами если не понял.
    localStorage.setItem("merchants", this.json);
    localStorage.setItem("time", currentTime);
  }
}

window.background = new Background();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // TODO: fixedDomain -> domain или requestDomain
  let fixedDomain = extractDomain(request.domain);

  switch (request.action) {
    case "checkSite":
      background.sitesList.forEach(item => {
        const siteID = item.name;
        let siteCounter = +sessionStorage.getItem(siteID);
        const isOverflowed = siteCounter <= 2;
        if (extractDomain(item.domain) === fixedDomain && isOverflowed) {
          // TODO: В рамках задания норм, но желательно хранить объектом
          console.log(extractDomain(item.domain));
          sessionStorage.setItem(siteID, ++siteCounter);
          // TODO: Убрать закомменченные console.log. В мастер коде такого говна быть не должно. done
          // TODO: в контент можно вернуть только item и работать уже с ним там, без необходимости проверок на контенте, которые у тебя сейчас есть
          sendResponse({
            message: item.message
          });
          return;
        }
      });
      sendResponse(false);
      break;
    case "closedMessage":
      const site = background.sitesList.find(
        item => item.domain === fixedDomain
      );
      sessionStorage.setItem(site.name, 3);

      break;
    case "initSerp":
      console.log(fixedDomain);
      sendResponse({
        config: config[fixedDomain],
        sitesList: background.sitesList
      });
      return;
  }
});

const config = {
  google: {
    collectionSelector: ".rc .r > a cite",
    pasteSelector: ".rc .r > a",
    class: "google-serp"
  },

  yandex: {
    collectionSelector: "li a > b",
    pasteSelector_1: ".organic",
    pasteSelector_2: ".favicon__icon",
    isYandex: true,
    class: "yandex-serp"
  },

  bing: {
    collectionSelector: "li div cite",
    pasteSelector: "li div cite",
    class: "bing-serp"
  }
};
