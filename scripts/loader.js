function showIndex() {
    var index_url = "/details.html";
    chrome.tabs.create({
        url: index_url
    });
}
Details.addEventListener("click", showIndex);
