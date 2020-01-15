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
      this.time - +localStorage.getItem("time") > 10000 //* 60 * 60 стоит 10сек
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
  //   console.log(request);
  // console.log(sender);
  sendResponse("test");
});
