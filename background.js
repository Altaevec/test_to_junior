class Background {
    constructor() {
        this.list = [];
    };
    async load() {
        const response = await fetch("http://www.softomate.net/ext/employees/list.json");

        this.list = await response.json();

    }
};

window.background = new Background();
