showConsumption.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: setPageBackgroundColor,
    });
  });

function setPageBackgroundColor() {
    document.body.style.backgroundColor = "black";
    document.body.style.color = "white"
    document.body.style.fontFamily = "Arial"
}
