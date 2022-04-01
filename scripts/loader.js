function showIndex() {
    var index_url = "/details.html";
    chrome.tabs.create({
        url: index_url
    });
}

document.getElementById('details').addEventListener("click", showIndex);
