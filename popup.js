// showConsumption.addEventListener("click", async () => {
//   console.log('Start all tests');
//   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

//   chrome.scripting.executeScript({
//     target: { tabId: tab.id, allFrames: true },
//     function: getImages,
//   }, (images) => {
//     console.log(images)
//   });

//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     function: getVideos,
//   });

//   console.log('End all tests');

//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     function: checkLazyLoading,
//   });
// });

Rendered.addEventListener("click", async () => {
  console.log("Start: Check rendered images")
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: checkRendered,
  });

  console.log("Done: Check rendered images")
});

Large.addEventListener("click", async () => {
  console.log("Start: Check for images rendered larger than they are saved.")
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: checkLarge,
  });

  console.log("Done: Check for images rendered larger than they are saved.")
});

FileFormats.addEventListener("click", async () => {
  console.log("Start: Check file formats images.")
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: checkFileFormats,
  });

  console.log("Done: Check file formats images.")
});

Autoplay.addEventListener("click", async () => {
  console.log("Start: Check for autoplay video's")
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: checkAutoplay,
  });

  console.log("Done: Check for autoplay video's")
});

Fonts.addEventListener("click", async () => {
  console.log("Start: Check for external fonts")
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: checkFonts,
  });

  console.log("Done: Check for external fonts")
});

LazyLoading.addEventListener("click", async () => {
  console.log("Start: Check for lazy loading")
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: checkLazyLoading,
  });

  console.log("Done: Check for lazy loading")
});


Reset.addEventListener("click", async () => {
  console.log("Start: Reset shadows")
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: resetShadows,
  });

  console.log("Done: Reset shadows")
});

// Start website carbon
function addtext(text) {
  const p = document.createElement('p');
  p.textContent = text;
  app.appendChild(p);
  app.setAttribute('class', 'measurement');
}

const app = document.getElementById('websitecarbon');

chrome.tabs.query({
  'active': true,
  'windowId': chrome.windows.WINDOW_ID_CURRENT
}, function (tabs) {
  url = "https://api.websitecarbon.com/site?url=" + tabs[0].url
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
    let datatotal = parseFloat(parseFloat(datagrid) + parseFloat(datarenewable).toFixed(5))
    addtext(`CO2: ${datatotal} grams \n\t`)
    addtext(`From grid: ${datagrid} grams`)
    addtext(`From renewable: ${datarenewable} grams`)

  }

  request.send();
});
//End website carbon

function checkRendered() {
  var imagesCollection = document.getElementsByTagName('img');
  var images = Array.from(imagesCollection);
  var alertText = "";
  var nrImages = 0;

  images.forEach((x) => {
    if (x.clientWidth == 0 || x.clientHeight == 0) {
      alertText = alertText + "\n" + x.src;
      nrImages++;
    }
  });

  if (alertText == "") {
    window.alert("No unrendered images found.");
  } else {
    window.alert(nrImages + " images are not rendered. The sources of these images are: \n" + alertText);
  }
}

function checkLarge() {
  var imagesCollection = document.getElementsByTagName('img');
  var images = Array.from(imagesCollection);
  var nrImages = 0;

  images.forEach((x) => {
    if (x.naturalWidth > 0 && x.naturalHeight > 0 && (x.clientWidth < x.clientHeight || x.clientHeight < x.naturalHeight)) {
      x.style.filter = "opacity(0.7) drop-shadow(0.3em 0.3em 0 #ed6039)";
      nrImages++;
    }
  });

  window.alert("Found " + nrImages + " images that are saved with a larger width or height than they are rendered. Please consider saving these files with smaller dimensions.");
}

function checkFileFormats() {
  var imagesCollection = document.getElementsByTagName('img');
  var images = Array.from(imagesCollection);
  var nrImages = 0;

  images.forEach((x) => {
    const src = x.src;
    if (src.includes(".jpg") || src.includes(".jpeg") || src.includes(".png") || src.includes(".svg")) {
      x.style.filter = "opacity(0.7) drop-shadow(0.3em 0.3em 0 #ed6039)";
      nrImages++;
    }
  });

  window.alert("Found " + nrImages + " images in JPG, PNG or SVG format. Please consider using the AVIF format.");
}

function checkAutoplay() {
  var videoCollection = document.getElementsByTagName('video');
  var videos = Array.from(videoCollection);
  var nrVideos = 0;

  videos.forEach((x) => {
    if (x.autoplay == true) {
      x.style.filter = "opacity(0.7) drop-shadow(0.3em 0.3em 0 #ed6039)";
      nrVideos++;
    }
  });

  window.alert("Found " + nrVideos + " video's with autoplay. Please consider turning off autoplay.")
}

function checkFonts() {
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

  fontArr = [... new Set(fontArr)];
  let fontNr = fontArr.length;

  let alertText = ""
  // .forEach(f => console.log(f + " font is not a system font. Consider using pre-installed system fonts for decreased energy consumption."));

  if (fontArr.length > 0) {
    alertText = "Found " + fontNr + " external fonts. Consider using pre-installed system fonts for decreased energy consumption. When using non-native fonts, the WOFF/WOFF2 font formats offer compression which make them more energy efficient.\n\nFonts found:";
    fontArr.forEach(f => alertText += "\n- " + f);
  }
  else {
    alertText = "Found 0 external fonts, no improvements can be made here. "
  }
  window.alert(alertText);
}

function checkLazyLoading() {
  var imagesCollection = document.getElementsByTagName('img');
  var images = Array.from(imagesCollection);
  var nrEager = 0;
  var nrAutoImage = 0;

  images.forEach((x) => {
    if (x.loading == "eager") {
      x.style.filter = "opacity(0.7) drop-shadow(0.3em 0.3em 0 #ed6039)"; //red
      nrEager++;
    } else if (x.loading == "auto") {
      x.style.filter = "opacity(0.7) drop-shadow(0.3em 0.3em 0 #f0db3c)"; //yellow
      nrAutoImage++;
    }

  });

  var alertText = "Found " + nrEager + "eagerly loaded images and " + nrAutoImage + " images using the default browser settings. Please consider specifying lazy loading."

  var videoCollection = document.getElementsByTagName('video');
  var videos = Array.from(videoCollection);
  let nrMeta = 0;
  let nrAutoVideo = 0;

  videos.forEach((x) => {
    if (x.preload == "metadata") {
      x.style.filter = "opacity(0.7) drop-shadow(0.3em 0.3em 0 #f0db3c)"; //yellow
      nrMeta++;
    } else if (x.preload == "auto") {
      x.style.filter = "opacity(0.7) drop-shadow(0.3em 0.3em 0 #ed6039)"; //red
      nrAutoVideo++;
    }
  });

  alertText = alertText + "\n Found " + nrAutoVideo + " automatically loaded video's and " + nrMeta + " video's where only the metadata is loaded. Please consider setting the preload attribute to 'none'.";
  window.alert(alertText);
}

function resetShadows() {
  var imagesCollection = document.getElementsByTagName('img');
  var images = Array.from(imagesCollection);

  images.forEach((x) => {
    x.style.filter = "none";
  });

  var videoCollection = document.getElementsByTagName('video');
  var videos = Array.from(videoCollection);

  videos.forEach((x) => {
    x.style.filter = "none";
  });
}

// function getImages() {
//   console.log("=== Images ===");
//   var imagesCollection = document.getElementsByTagName('img');
//   var images = Array.from(imagesCollection);
//   images.forEach((x) => {
//     console.log(x);
//     var score = 0;
//     // Check dimensions
//     var clientwidth = x.clientWidth;
//     var clientheight = x.clientHeight;
//     var naturalwidth = x.naturalWidth;
//     var naturalheight = x.naturalHeight;

//     if (clientwidth == 0 || clientheight == 0) {
//       console.log("This image isn't rendered. Check why this image isn't rendered. Possibly you have applied lazy loading without setting a width or height, which is bad practise.")
//       score++;
//     }
//     if (clientwidth > 400 || clientheight > 400) {
//       console.log("This image is " + clientwidth + "x" + clientheight + "px, we consider this a large image. Maybe this image could be smaller?");
//       score++;
//     }
//     if (naturalwidth > 0 && naturalheight > 0 && (clientwidth < clientheight || clientheight < naturalheight)) {
//       console.log("This image is saved as a " + naturalwidth + "x" + naturalheight + "px image, but rendered as a " + clientwidth + "x" + clientheight + "px image. Consider saving the file with smaller dimensions. ");
//       score++;
//     }

//     // Check lazy loading
//     if (x.loading == 'eager') {
//       console.log("This image is always loaded, regardless of whether it is shown. Consider lazy loading.");
//       score++;
//     }

//     // Check file format
//     var src = x.src;
//     if (src.includes(".png") || src.includes(".svg")) {
//       console.log("PNG and SVG should only be used if the precision of the file is very importent. Perhaps a .jpg file would suffice here?");
//       score++;
//     }
//     if (src.includes(".jpg") || src.includes(".jpeg") || src.includes(".png") || src.includes(".svg") || src.includes(".gif")) {
//       console.log("Consider using the .avif file format.");
//       score++;
//     }
//     const popup = document.createElement('div');
//     const p = document.createElement('p');
//     p.textContent = "testpopup";
//     popup.appendChild(p);

//     switch (score) {
//       case 0:
//         console.log("green")
//         x.style.filter = "opacity(0.7) drop-shadow(0.5em 0.5em 5 #5beb34)"
//         break;
//       case 1:
//         console.log("quite green")
//         x.style.filter = "opacity(0.7) drop-shadow(0.5em 0.5em 0 #daf77c)"
//         break;
//       case 2:
//         console.log("yellow")
//         x.style.filter = "opacity(0.7) drop-shadow(0.5em 0.5em 0 #f0db3c)"
//         break;
//       case 3:
//         console.log("dirty yellow")
//         x.style.filter = "opacity(0.7) drop-shadow(0.5em 0.5em 0 #f0b73c)"
//         break;
//       case 4:
//         console.log("orange")

//         x.style.filter = "opacity(0.7) drop-shadow(0.5em 0.5em 0 #f2913d)"
//         x.appendChild(popup)
//         break;
//       case 5:
//         console.log("red")
//         x.style.filter = "opacity(0.7) drop-shadow(0.5em 0.5em 0 #ed6039)"
//         break;
//       case 6:
//         console.log("dead read");
//         x.style.filter = "opacity(0.7) drop-shadow(0.5em 0.5em 0 #ed3939)"
//         break;
//       default:
//     }


//   });
//   console.log("There are " + images.length + " images");
//   return images;
// }

// function getVideos() {
//   console.log("=== Videos ===");
//   var videoCollection = document.getElementsByTagName('video');
//   var videos = Array.from(videoCollection);
//   videos.forEach((x) => {
//     console.log(x)
//     if (x.autoplay == true) {
//       console.log("Consider switching of autoplay")
//     }
//     if (x.preload == "metadata") {
//       console.log("Consider not loading the metadata, you won't see a preview, but you download less data this way.")
//     } else if (x.preload != "none") {
//       console.log("Set the preload property to none to avoid unnecesary energy use.")
//     }
//   });
//   console.log("There are " + videos.length + " videos");
// }
