class Background {
  constructor() {
    this.time = 0;
    /*
    TODO:
         Тебе не требуется наличе это переменной.
         Ты можешь делать преобразование в json строку прямо при записи в localStorage
         `localStorage.setItem("merchants", JSON.stringify(this.sitesList));`
     */
    this.json = "";
    this.sitesList = [];
    // TODO: список будет подгружаться только при инициализации бекгрунда. И потом не обновляться.
    this.load();
  }
  async load() {
    const response = await fetch(
      "http://www.softomate.net/ext/employees/list.json"
    );

    this.sitesList = await response.json();

    //Работа с localStorage
    // TODO: получение текущим мерчей в целом не нужно. Если ты получил новый список его нужно просто записать.
    const merchants = localStorage.getItem("merchants");
    this.time = new Date().getTime();
    this.json = JSON.stringify(this.sitesList);

    // TODO: Эту проверку можно полностью убрать. Как и проверку merchants !== this.json.
    //  Само создание запрос стоить делать только если у тебя прошло более времени.
    //  Если ты делаешь запрос к серверу и получешь положительный ответ, то проверки на клиенте как у тебя обычно не требуются.
    if (merchants === null) {
      this.updateMerchants();

      // TODO: если ты пишешь комментраий то пиши им подробно и с объектами.
      console.log("added");
    } else if (
      merchants !== this.json ||
      this.time - +localStorage.getItem("time") > 10000 //* 60 * 60 время обновлений
    ) {
      this.updateMerchants();

      console.log("modify");
    } else {
      // TODO: Удали все комментарии с матами и которые не несут никакого смысла.
      console.log("sasamba");
    }
  }
  updateMerchants() {
    // TODO: метод updateMerchants не отражает своего имени.
    //  Желательно переделать в вид updateMerchants({ merchants, time })
    //  Более подробно могу обяснить словами если не понял.
    localStorage.setItem("merchants", this.json);
    localStorage.setItem("time", this.time);
  }
}

window.background = new Background();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // TODO: fixedDomain -> domain или requestDomain
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
          // TODO: В рамках задания норм, но желательно хранить объектом
          sessionStorage.setItem(siteID, ++siteCounter);
          // TODO: Убрать закомменченные console.log. В мастер коде такого говна быть не должно.
          // console.log(item.name);

          // TODO: в контент можно вернуть только item и работать уже с ним там, без необходимости проверок на контенте, которые у тебя сейчас есть
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
