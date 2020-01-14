class Background {
    constructor() {
        this.list = [];
        this.domainList = [];
    };
    async load() {
        const response = await fetch("http://www.softomate.net/ext/employees/list.json");

        this.list = await response.json();
        this.list.forEach((item) => { //фильтр
            this.domainList.push(item.domain);
        });

    }
};

window.background = new Background();



background.load();

console.log(background);

window.location;
if (background.list.find(item => item.domain === window.location)) {
    console.log("True")
};


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

    console.log(request);
    // console.log(sender);
    sendResponse("test");
});