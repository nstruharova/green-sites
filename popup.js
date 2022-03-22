showConsumption.addEventListener("click", async () => {
    console.log('yeet');
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // chrome.scripting.executeScript({
    //   target: { tabId: tab.id },
    //   function: setPageBackgroundColor,
    // });

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: getImages,
    });

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: getVideos,
    });

  });

function setPageBackgroundColor() {
    document.body.style.backgroundColor = "black";
    document.body.style.color = "white"
    document.body.style.fontFamily = "Arial"
}
  //Access-Control-Allow-Origin: 'https://foo.example '
function addtext(text){
  const p = document.createElement('p');
  p.textContent = text;
  container.appendChild(p);
  container.setAttribute('class', 'measurement');
}

const app = document.getElementById('root');
const container = document.createElement('div');
container.setAttribute('class', 'container');

app.appendChild(container);

chrome.tabs.query({
  'active': true,
  'windowId': chrome.windows.WINDOW_ID_CURRENT
}, function (tabs) {
  url = "https://api.websitecarbon.com/site?url="+tabs[0].url
  var request = new XMLHttpRequest();
  request.open('GET', url, true);

  request.onload = function () {

  // Begin accessing JSON data here
  var data = JSON.parse(this.response);
  console.log("trying here")
  console.log(data)

  addtext(`Bytes transferred:  ${parseFloat(data.statistics.adjustedBytes).toFixed()} bytes`)
  addtext(`Energy consumption: ${parseFloat(data.statistics.energy).toFixed(5)} kWg`)

  let datagrid = parseFloat(data.statistics.co2.grid.grams).toFixed(5)
  let datarenewable = parseFloat(data.statistics.co2.renewable.grams).toFixed(5)
  let datatotal = parseFloat(parseFloat(datagrid)+parseFloat(datarenewable).toFixed(5))
  addtext(`CO2: ${datatotal} grams \n\t`)
  addtext(`From grid: ${datagrid} grams`)
  addtext(`From renewable: ${datarenewable} grams`)

}

request.send();
});

function readHTML() {
    console.log(document.body);
    console.log('\nyeetssss');
}

function getImageDimentions(images) {
  console.log("get image dimentions")

}

function getImages() {
    console.log("=== Images ===");
    var imagesCollection = document.getElementsByTagName('img');
    var images = Array.from(imagesCollection);
    images.forEach((x) => {
      console.log(x);
      
      // Check dimensions
      var clientwidth = x.clientWidth;
      var clientheight = x.clientHeight;
      var naturalwidth = x.naturalWidth;
      var naturalheight = x.naturalHeight;
    
      if(clientwidth == 0 || clientHeight == 0){
        console.log("This image isn't rendered. Then why save it?")
      }
      if(clientwidth>400 || clientheight > 400){
        console.log("This image is "+ clientwidth + "x" + clientheight+"px, we consider this a large image. Maybe this image could be smaller?");
      }
      if(naturalwidth > 0 && naturalheight>0 && (clientwidth<clientheight || clientheight < naturalheight)){
        console.log("This image is saved as a " + naturalwidth + "x" + naturalheight + "px image, but rendered as a " + clientwidth + "x" + clientheight + "px image. Consider saving the file with smaller dimensions. ");
      }

      // Check lazy loading
      if(x.loading == 'eager'){
        console.log("This image is always loaded, regardless of whether it is shown. Consider lazy loading.");
      }
      
      // Check file format
      var src = x.src;
      if(src.includes(".png")|| src.includes(".svg")){
        console.log("PNG and SVG should only be used if the precision of the file is very importent. Perhaps a .jpg file would suffice here?")
      }
      if(src.includes(".jpg")||src.includes(".jpeg")||src.includes(".png")||src.includes(".svg")||src.includes(".gif")){
        console.log("Consider using the .avif file format.")
      }
      
    });
    console.log("There are " + images.length + " images");
}

function getVideos() {
  console.log("=== Videos ===");
  var videoCollection = document.getElementsByTagName('video');
  var videos = Array.from(videoCollection);
  videos.forEach((x) => {
    console.log(x)
    if(x.autoplay == true){
      console.log("Consider switching of autoplay")
    }
    if(x.preload == "metadata"){
      console.log("Consider not loading the metadata, you won't see a preview, but you download less data this way.")
    } else if (x.preload != "none"){
      console.log("Set the preload property to none to avoid unnecesary energy use.")
    }
  });
  console.log("There are " + videos.length + " videos");
}


