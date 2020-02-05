// TODO: убрать закоменченные логи и ненужные комменты done

chrome.runtime.getBackgroundPage(({ background }) => {
  background.sitesList.forEach(item => {
    let link = document.createElement("a");
    link.href = `http://www.${item.domain}`;
    link.target = "_blank";
    link.innerHTML = item.name;
    document.getElementById("list").append(link);
  });
});
