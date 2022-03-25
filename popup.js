showConsumption.addEventListener("click", async () => {
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

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: getText,
    });

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: checkLazyLoading,
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
}

function checkLazyLoading() {
  var documentHeight = document.body.scrollHeight;
  var windowHeight = window.innerHeight;

  let heightRatio = documentHeight / windowHeight

  console.log(heightRatio)
  if (heightRatio > 1.0) {
    console.log("Since the content of your page is about" + Math.round(heightRatio) + "-times longer than your window height, it overflows. Consider lazy loading for your content.")
  }

  let iframesCollection = document.getElementsByTagName('iframe');
  var iframes = Array.from(iframesCollection);
  iframes.forEach((x) => {
    console.log(x);

    if (x.loading != 'lazy') {
      console.log("This iFrame does not seem to be loading lazily. Consider implementing this by changing the \"loading\" attribute to \"loading=lazy\".")
    }
  });
}

function getImageDimensions(images) {
  console.log("Get image dimensions")

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
      if(clientwidth>400 || clientheight > 400){
        console.log("This image is "+ clientwidth + "x" + clientheight+"px, we consider this a large image. Maybe this image could be smaller?");
      }
      if(naturalwidth > 0 && naturalheight>0 && (clientwidth<clientheight || clientheight < naturalheight)){
        console.log("This image is saved as a " + naturalwidth + "x" + naturalheight + "px image, but rendered as a " + clientwidth + "x" + clientheight + "px image. Consider saving the file with smaller dimensions. ");
      }

      // Check lazy loading
      // if(x.loading == 'eager'){
      //   console.log("This image is always loaded, regardless of whether it is shown. Consider lazy loading by changing \"loading=eager\" to \"loading=lazy\".");
      // }
      if (x.loading != 'lazy') {
        console.log("This image does not seem to be loading lazily. Consider implementing this by changing the \"loading\" attribute to \"loading=lazy\".")
      }

      // Check file format
      var src = x.src;
      if(src.includes(".png")|| src.includes(".svg")){
        console.log("PNG and SVG should only be used if the precision of the file is very important. Perhaps a .jpg file would suffice here?")
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

function getText() {
  console.log("=== Text ===");
  const systemFonts = new Set([
    // Windows 10
  'Arial', 'Arial Black', 'Bahnschrift', 'Calibri', 'Cambria', 'Cambria Math', 'Candara', 'Comic Sans MS', 'Consolas', 'Constantia', 'Corbel', 'Courier New', 'Ebrima', 'Franklin Gothic Medium', 'Gabriola', 'Gadugi', 'Georgia', 'HoloLens MDL2 Assets', 'Impact', 'Ink Free', 'Javanese Text', 'Leelawadee UI', 'Lucida Console', 'Lucida Sans Unicode', 'Malgun Gothic', 'Marlett', 'Microsoft Himalaya', 'Microsoft JhengHei', 'Microsoft New Tai Lue', 'Microsoft PhagsPa', 'Microsoft Sans Serif', 'Microsoft Tai Le', 'Microsoft YaHei', 'Microsoft Yi Baiti', 'MingLiU-ExtB', 'Mongolian Baiti', 'MS Gothic', 'MV Boli', 'Myanmar Text', 'Nirmala UI', 'Palatino Linotype', 'Segoe MDL2 Assets', 'Segoe Print', 'Segoe Script', 'Segoe UI', 'Segoe UI Historic', 'Segoe UI Emoji', 'Segoe UI Symbol', 'SimSun', 'Sitka', 'Sylfaen', 'Symbol', 'Tahoma', 'Times New Roman', 'Trebuchet MS', 'Verdana', 'Webdings', 'Wingdings', 'Yu Gothic',
    // macOS
    'American Typewriter', 'Andale Mono', 'Arial', 'Arial Black', 'Arial Narrow', 'Arial Rounded MT Bold', 'Arial Unicode MS', 'Avenir', 'Avenir Next', 'Avenir Next Condensed', 'Baskerville', 'Big Caslon', 'Bodoni 72', 'Bodoni 72 Oldstyle', 'Bodoni 72 Smallcaps', 'Bradley Hand', 'Brush Script MT', 'Chalkboard', 'Chalkboard SE', 'Chalkduster', 'Charter', 'Cochin', 'Comic Sans MS', 'Copperplate', 'Courier', 'Courier New', 'Didot', 'DIN Alternate', 'DIN Condensed', 'Futura', 'Geneva', 'Georgia', 'Gill Sans', 'Helvetica', 'Helvetica Neue', 'Herculanum', 'Hoefler Text', 'Impact', 'Lucida Grande', 'Luminari', 'Marker Felt', 'Menlo', 'Microsoft Sans Serif', 'Monaco', 'Noteworthy', 'Optima', 'Palatino', 'Papyrus', 'Phosphate', 'Rockwell', 'Savoye LET', 'SignPainter', 'Skia', 'Snell Roundhand', 'Tahoma', 'Times', 'Times New Roman', 'Trattatello', 'Trebuchet MS', 'Verdana', 'Zapfino',
  ].sort());

  const it = document.fonts.entries();
  let font = it.next();
  let fontArr = []

  // Check used fonts , if this is not a standard font display a message.
  while (!font.done) {
    if (!(font.value[0].family in systemFonts)) {
      fontArr.push(font.value[0].family);
    }
    font = it.next();
  }

  [... new Set(fontArr)].forEach(f => console.log(f + " font is not a system font. Consider using pre-installed system fonts for decreased energy consumption."));
}
