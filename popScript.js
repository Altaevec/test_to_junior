chrome.runtime.getBackgroundPage(({
    background
}) => {
    console.log(background);
    console.log(background.domainList);
    background.domainList.forEach((item) => { //фильтр
        let link = document.createElement("a");
        link.href = `http://www.${item}`;
        link.target = '_blank';
        link.innerHTML = item;
        document.getElementById("list").append(link);
    });
});

// alert("хуй");