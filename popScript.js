chrome.runtime.getBackgroundPage(({ background }) => {
  //   console.log(background);
  //   console.log(background.newList);
  background.sitesList.forEach(item => {
    //фильтр
    let link = document.createElement("a");
    link.href = `http://www.${item.domain}`;
    link.target = "_blank";
    link.innerHTML = item.name;
    document.getElementById("list").append(link);
  });
});

// alert("хуй");
