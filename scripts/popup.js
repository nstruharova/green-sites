Rendered.addEventListener("click", async () => {
  console.log("Start: Check rendered images");
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: checkRendered,
  });

  console.log("Done: Check rendered images");
});

Large.addEventListener("click", async () => {
  console.log("Start: Check for images rendered larger than they are saved.");
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: checkLarge,
  });

  console.log("Done: Check for images rendered larger than they are saved.");
});

FileFormats.addEventListener("click", async () => {
  console.log("Start: Check file formats images.");
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: checkFileFormats,
  });

  console.log("Done: Check file formats images.");
});

Autoplay.addEventListener("click", async () => {
  console.log("Start: Check for autoplay video's");
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: checkAutoplay,
  });

  console.log("Done: Check for autoplay video's");
});

Fonts.addEventListener("click", async () => {
  console.log("Start: Check for external fonts")
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: checkFonts,
  });

  console.log("Done: Check for external fonts");
});

LazyLoading.addEventListener("click", async () => {
  console.log("Start: Check for lazy loading")
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: checkLazyLoading,
  });

  console.log("Done: Check for lazy loading");
});

WebsiteCdn.addEventListener("click", async () => {
  console.log("Start: Check for loading the website from a CDN");
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: checkWebsiteCdn,
  });

  console.log("Done: Check for loading the website from a CDN");
});

ElementCdn.addEventListener("click", async () => {
  console.log("Start: Check for loading the elements from a CDN");
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: checkElementCdn,
  });

  console.log("Done: Check for loading the elements from a CDN");
});

Reset.addEventListener("click", async () => {
  console.log("Start: Reset shadows");
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: resetShadows,
  });

  console.log("Done: Reset shadows");
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
}).then((tabs) => {
  let url = "https://api.websitecarbon.com/site?url=" + tabs[0].url
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
    document.getElementById('message').remove();
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
      x.style.filter = "opacity(0.3) drop-shadow(0.3em 0.3em 0.3em #ed6039)";
      nrImages++;
    }
  });

  if (nrImages > 0) {
    window.alert("Found " + nrImages + " images that are saved with a larger width or height than they are rendered. Please check the page for the transparant and red images, consider saving these files with smaller dimensions.");
  }
  else {
    window.alert("All images are rendered in the same dimensions as they are saved.")
  }
}

function checkFileFormats() {
  var imagesCollection = document.getElementsByTagName('img');
  var images = Array.from(imagesCollection);
  var nrImages = 0;
  images.forEach((x) => {
    const src = x.src;
    if (src.includes(".jpg") || src.includes(".jpeg") || src.includes(".png") || src.includes(".svg")) {
      x.style.filter = "opacity(0.3) drop-shadow(0.3em 0.3em 0.3em #ed6039)";
      nrImages++;
    }
  });

  if (nrImages > 0) {
    window.alert("Found " + nrImages + " images in JPG, PNG or SVG format. Please check the page for the transparant and red images, consider using the AVIF format for these files where possible.");
  }
  else {
    window.alert("Found no images in JPG, PNG or SVG format.")
  }
}

function checkAutoplay() {
  var videoCollection = document.getElementsByTagName('video');
  var videos = Array.from(videoCollection);
  var nrVideos = 0;

  videos.forEach((x) => {
    if (x.autoplay == true) {
      x.style.filter = x.style.filter = "opacity(0.3) drop-shadow(0.3em 0.3em 0.3em #ed6039)";
      nrVideos++;
    }
  });

  if (nrVideos > 0) {
    window.alert("Found " + nrVideos + " videos with autoplay. Please consider turning off autoplay for the videos shown transparently.")
  }
  else {
    window.alert("Found no videos with autoplay.")
  }
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
      x.style.filter = "opacity(0.3) drop-shadow(0.3em 0.3em 0 #ed6039)"; //red
      nrEager++;
    } else if (x.loading == "auto") {
      x.style.filter = "opacity(0.3) drop-shadow(0.3em 0.3em 0 #f0db3c)"; //yellow
      nrAutoImage++;
    }

  });
  
  if (nrEager + nrAutoImage > 0) {
    var alertText = "Found " + nrEager + " eagerly loaded images shown in red and " + nrAutoImage + " images using the default browser settings shown in yellow. Please consider specifying lazy loading for these images.\n\n"
  }
  else {
    var alertText = "Found no eagerly loaded images or images using default browser settings.\n"
  }

  var iframesCollection = document.getElementsByTagName('iframe');
  var iframes = Array.from(iframesCollection);
  var nrEageriFrame = 0;
  var nrAutoiFrame = 0;
  iframes.forEach((x) => {
    if (x.loading == "eager") {
      x.style.filter = "opacity(0.7) drop-shadow(0.3em 0.3em 0 #ed6039)"; //red
      nrEageriFrame++;
    } else if (x.loading == "auto") {
      x.style.filter = "opacity(0.7) drop-shadow(0.3em 0.3em 0 #f0db3c)"; //yellow
      nrAutoiFrame++;
    }

  });
  
  if (nrEageriFrame + nrAutoiFrame > 0) {
    alertText += "Found " + nrEageriFrame + " eagerly loaded iFrames shown in red and " + nrAutoiFrame + " iFrames using the default browser settings shown in yellow. Please consider specifying lazy loading for these iFrames.\n\n";
  }
  else {
    alertText = "Found no eagerly loaded iFrames or iFrames using default browser settings.\n"
  }
  
  var videoCollection = document.getElementsByTagName('video');
  var videos = Array.from(videoCollection);
  let nrMeta = 0;
  let nrAutoVideo = 0;

  videos.forEach((x) => {
    if (x.preload == "metadata") {
      x.style.filter = "opacity(0.3) drop-shadow(0.3em 0.3em 0 #f0db3c)"; //yellow
      nrMeta++;
    } else if (x.preload == "auto") {
      x.style.filter = "opacity(0.3) drop-shadow(0.3em 0.3em 0 #ed6039)"; //red
      nrAutoVideo++;
    }
  });

  if (nrAutoVideo + nrMeta > 0) {
    alertText += "Found " + nrAutoVideo + " automatically loaded videos shown in yellow and " + nrMeta + " videos where only the metadata is loaded shown in red. Please consider setting the preload attribute to 'none' for these videos.";
  }
  else {
    alertText += "Found no automatically loaded videos or videos where the metadata is preloaded."
  }
  window.alert(alertText);
}


function checkWebsiteCdn() {
  // Detecting if the HTTPS response is served from a CDN
  var result = CdnDetector.detectFromHostname(location.hostname);
  var alertText = "";
  if (result == null) {
    alertText = "Your website is currently not being loaded from a CDN. Consider using a content delivery network.";
  } else {
    alertText = "Your website is loaded from a CDN. No problems were found.";
  }
  window.alert(alertText);
}

function checkElementCdn() {
  // Detecting if elements are served from a CDN
  var scripts = Array.from(document.getElementsByTagName('script'));
  var images = Array.from(document.getElementsByTagName('img'));
  var iframes = Array.from(document.getElementsByTagName('iframe'));
  var videos = Array.from(document.getElementsByTagName('video'));
  var alertText = "";
  
  let nrScript = 0;
  for (let i = 0; i < scripts.length; i++) {
    if (!scripts[i].src.includes("cdn")) {
      nrScript += 1;
    }
  };
  let scriptAlert = "";
  if (scripts.length == 0) {
    scriptAlert = "There are no scripts to be loaded with CDN.\n";
  } 
  else if (nrScript == 0) {
    scriptAlert = "You are loading all your scripts using CDN. No problems found with script loading.\n";
  }
  else {
    scriptAlert = "You are currently not loading " + nrScript + " of your scripts using CDN.\n";
  }
  alertText += scriptAlert;

  let nrImg = 0;
  for (let i = 0; i < images.length; i++) {
    if (!images[i].src.includes("cdn")) {
      nrImg += 1;
    }
  };
  let imagesAlert = ""
  if (images.length == 0) {
    imagesAlert = "There are no images to be loaded with CDN.\n"
  }
  else if (nrImg == 0) {
    imagesAlert = "You are loading all your images using CDN. No problems found with image loading.\n" 
  }
  else {
    imagesAlert = "You are currently not loading " + nrImg + " of your images using CDN. \n";
  }
  alertText += imagesAlert;
  
  var iframesAlert = ""
  let nrFrames = 0;
  for (let i = 0; i < iframes.length; i++) {
    if (!iframes[i].src.includes("cdn")) {
      nrFrames += 1;
    }
  };
  if (iframes.length == 0) {
    iframesAlert = "There are no iFrames to be loaded with CDN.\n";
  }
  else if (nrFrames == 0) {
    iframesAlert = "You are loading all your iFrames using CDN. No problems found with iFrame loading.\n";
  }
  else {
    iframesAlert = "You are currently not loading " + nrFrames + " of your iFrames using CDN.\n";
  }
  alertText += iframesAlert;
  
  var videosAlert = "";
  let nrVideos = 0;
  for (let i = 0; i < videos.length; i++) {
    if (!scripts[i].src.includes("cdn")) {
      nrVideos += 1;
    }
  };
  if (videos.length == 0) {
    videosAlert = "There are no videos to be loaded with CDN."
  }
  else if (nrVideos == 0) {
    videosAlert = "You are loading all your videos using CDN. No problems found with video loading."
  }
  else {
    videosAlert = "You are currently not loading all your videos using CDN. Consider using a content delivery network.";
  }
  alertText += videosAlert;

  if (nrScript + nrImg + nrFrames + nrVideos > 0) {
    alertText += "\n\nConsider using a content delivery network for the identified content."
  }
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

var CdnDetectorHeaders = [
  [
    "powered-by-chinacache",
    "",
    "ChinaCache"
  ],
  [
    "server",
    "airee",
    "Airee"
  ],
  [
    "server",
    "caspowa",
    "Caspowa"
  ],
  [
    "server",
    "cloudflare",
    "Cloudflare"
  ],
  [
    "server",
    "ecacc",
    "Edgecast"
  ],
  [
    "server",
    "ecd",
    "Edgecast"
  ],
  [
    "server",
    "ecs",
    "Edgecast"
  ],
  [
    "server",
    "gocache",
    "GoCache"
  ],
  [
    "server",
    "golfe2",
    "Google"
  ],
  [
    "server",
    "gse",
    "Google"
  ],
  [
    "server",
    "gws",
    "Google"
  ],
  [
    "server",
    "hiberniacdn",
    "HiberniaCDN"
  ],
  [
    "server",
    "leasewebcdn",
    "LeaseWeb CDN"
  ],
  [
    "server",
    "netdna",
    "NetDNA"
  ],
  [
    "server",
    "optimal cdn",
    "Optimal CDN"
  ],
  [
    "server",
    "resrc",
    "ReSRC.it"
  ],
  [
    "server",
    "sffe",
    "Google"
  ],
  [
    "server",
    "surgecdn",
    "Surge"
  ],
  [
    "server",
    "tsa_b",
    "Twitter"
  ],
  [
    "server",
    "unicorncdn",
    "UnicornCDN"
  ],
  [
    "server",
    "yunjiasu",
    "Yunjiasu"
  ],
  [
    "via",
    "bitgravity",
    "BitGravity"
  ],
  [
    "via",
    "cloudfront",
    "Amazon CloudFront"
  ],
  [
    "via",
    "rev-cache",
    "Rev Software"
  ],
  [
    "x-akamai-request-id",
    "",
    "Akamai"
  ],
  [
    "x-amz-cf-id",
    "",
    "Amazon CloudFront"
  ],
  [
    "x-ar-debug",
    "",
    "Aryaka"
  ],
  [
    "x-cache",
    "cache.51cdn.com",
    "ChinaNetCenter"
  ],
  [
    "x-cdn-geo",
    "",
    "OVH CDN"
  ],
  [
    "x-cdn",
    "incapsula",
    "Incapsula"
  ],
  [
    "x-cdn",
    "zenedge",
    "Zenedge"
  ],
  [
    "x-edge-ip",
    "",
    "CDN"
  ],
  [
    "x-edge-location",
    "",
    "CDN"
  ],
  [
    "x-hw",
    "",
    "Highwinds"
  ],
  [
    "x-iinfo",
    "",
    "Incapsula"
  ],
  [
    "x-instart-request-id",
    "instart",
    "Instart Logic"
  ],
  [
    "x-powered-by",
    "nyi ftw",
    "NYI FTW"
  ],
  [
    "x-px",
    "",
    "CDNetworks"
  ],
  [
    "x-rev-cache",
    "",
    "Rev Software"
  ]
];
var CdnDetectorHostnames = {
  "\\.aads-cn\\.net$": "Aryaka",
  "\\.aads-cng\\.net$": "Aryaka",
  "\\.aads1\\.net$": "Aryaka",
  "\\.afxcdn\\.net$": "afxcdn.net",
  "\\.akadns\\.net$": "Akamai",
  "\\.akamai\\.net$": "Akamai",
  "\\.akamaiedge-staging\\.net$": "Akamai",
  "\\.akamaiedge\\.net$": "Akamai",
  "\\.akamaihd\\.net$": "Akamai",
  "\\.akamaistream\\.net$": "Akamai",
  "\\.akamaitechnologies\\.com$": "Akamai",
  "\\.akamaitechnologies\\.fr$": "Akamai",
  "\\.akamaized\\.net$": "Akamai",
  "\\.akastream\\.net$": "Akamai",
  "\\.alikunlun\\.com$": "Alibaba",
  "\\.aliyuncdn\\.com$": "Alibaba",
  "\\.alphacdn\\.net$": "Edgecast",
  "\\.amazonaws\\.com$": "Amazon AWS",
  "\\.anankecdn\\.com\\.br$": "Ananke",
  "\\.att-dsa\\.net$": "AT&T",
  "\\.ay1\\.b\\.yahoo\\.com$": "Yahoo",
  "\\.azion\\.net$": "Azion",
  "\\.azioncdn\\.com$": "Azion",
  "\\.azioncdn\\.net$": "Azion",
  "\\.azureedge\\.net$": "Microsoft Azure",
  "\\.belugacdn\\.com$": "BelugaCDN",
  "\\.betacdn\\.net$": "Edgecast",
  "\\.bisongrid\\.net$": "Bison Grid",
  "\\.bitgravity\\.com$": "BitGravity",
  "\\.bluehatnetwork\\.com$": "Blue Hat Network",
  "\\.c3cache\\.net$": "ChinaCache",
  "\\.c3cdn\\.net$": "ChinaCache",
  "\\.cachecentric\\.net$": "CacheCentric",
  "\\.cachefly\\.net$": "Cachefly",
  "\\.cap-mii\\.net$": "Mirror Image",
  "\\.caspowa\\.com$": "Caspowa",
  "\\.ccgslb\\.com$": "ChinaCache",
  "\\.ccgslb\\.net$": "ChinaCache",
  "\\.cdn\\.gocache\\.net$": "GoCache",
  "\\.cdn\\.telefonica\\.com$": "Telefonica",
  "\\.cdn77\\.net$": "CDN77",
  "\\.cdn77\\.org$": "CDN77",
  "\\.cdncloud\\.net\\.au$": "MediaCloud",
  "\\.cdnga\\.net$": "CDNetworks",
  "\\.cdngc\\.net$": "CDNetworks",
  "\\.cdngd\\.net$": "CDNetworks",
  "\\.cdngs\\.net$": "CDNetworks",
  "\\.cdnify\\.io$": "CDNify",
  "\\.cdninstagram\\.com$": "Facebook",
  "\\.cdnsun\\.net$": "CDNsun",
  "\\.cdntel\\.net$": "Telenor",
  "\\.chicdn\\.net$": "Edgecast",
  "\\.chinacache\\.net$": "ChinaCache",
  "\\.clients\\.turbobytes\\.com$": "Turbobytes",
  "\\.cloudflare\\.com$": "Cloudflare",
  "\\.cloudflare\\.net$": "Cloudflare",
  "\\.cloudfront\\.net$": "Amazon CloudFront",
  "\\.cotcdn\\.net$": "Cotendo CDN",
  "\\.cubecdn\\.net$": "cubeCDN",
  "\\.distil\\.us$": "Distil Networks",
  "\\.doubleclick\\.net$": "Google",
  "\\.edge2befaster\\.com$": "TransparentCDN",
  "\\.edgecaching\\.net$": "Hostway",
  "\\.edgekey\\.net$": "Akamai",
  "\\.edgesuite\\.net$": "Akamai",
  "\\.epsiloncdn\\.net$": "Edgecast",
  "\\.etacdn\\.net$": "Edgecast",
  "\\.facebook\\.com$": "Facebook",
  "\\.facebook\\.net$": "Facebook",
  "\\.fasterized\\.com$": "Fasterize",
  "\\.fastly\\.net$": "Fastly",
  "\\.fastlylb\\.net$": "Fastly",
  "\\.fbcdn\\.net$": "Facebook",
  "\\.footprint\\.net$": "Level 3",
  "\\.footprint6\\.net$": "Level 3",
  "\\.fpbns\\.net$": "Level 3",
  "\\.fplive\\.net$": "Level 3",
  "\\.fpondemand\\.net$": "Level 3",
  "\\.gccdn\\.cn$": "CDNetworks",
  "\\.gccdn\\.net$": "CDNetworks",
  "\\.gcdn\\.co$": "G-Core Labs",
  "\\.google\\.": "Google",
  "\\.googleusercontent\\.com$": "Google",
  "\\.gslb\\.taobao\\.com$": "Taobao",
  "\\.gslb\\.tbcache\\.com$": "Alimama",
  "\\.gstatic\\.com$": "Google",
  "\\.herokuapp\\.com$": "Heroku",
  "\\.hiberniacdn\\.com$": "HiberniaCDN",
  "\\.incapdns\\.net$": "Incapsula",
  "\\.inscname\\.net$": "Instart Logic",
  "\\.insnw\\.net$": "Instart Logic",
  "\\.instacontent\\.net$": "Mirror Image",
  "\\.internapcdn\\.net$": "Internap",
  "\\.iotacdn\\.net$": "Edgecast",
  "\\.isprimecdn\\.com$": "ISPrime",
  "\\.kappacdn\\.net$": "Edgecast",
  "\\.kxcdn\\.com$": "KeyCDN",
  "\\.lagrangesystems\\.net$": "Webscale Networks",
  "\\.llns\\.net$": "Limelight",
  "\\.llnwd\\.net$": "Limelight",
  "\\.llnwi\\.net$": "Limelight",
  "\\.lswcdn\\.eu$": "LeaseWeb CDN",
  "\\.lswcdn\\.net$": "LeaseWeb CDN",
  "\\.lxdns\\.com$": "ChinaNetCenter",
  "\\.mirror-image\\.net$": "Mirror Image",
  "\\.mncdn\\.com$": "Medianova",
  "\\.mncdn\\.net$": "Medianova",
  "\\.mncdn\\.org$": "Medianova",
  "\\.mucdn\\.net$": "Edgecast",
  "\\.mwcloudcdn\\.com$": "Quantil",
  "\\.mwcname\\.com$": "Quantil",
  "\\.netdna-cdn\\.com$": "NetDNA",
  "\\.netdna-ssl\\.com$": "NetDNA",
  "\\.netdna\\.com$": "NetDNA",
  "\\.ngenix\\.net$": "NGENIX",
  "\\.nocookie\\.net$": "Fastly",
  "\\.nttcdn\\.com$": "NTT",
  "\\.nucdn\\.net$": "Edgecast",
  "\\.nyiftw\\.com$": "NYI FTW",
  "\\.nyiftw\\.net$": "NYI FTW",
  "\\.omegacdn\\.net$": "Edgecast",
  "\\.omicroncdn\\.net$": "Edgecast",
  "\\.optimalcdn\\.com$": "Optimal CDN",
  "\\.ourwebpic\\.com$": "ChinaNetCenter",
  "\\.pagerain\\.net$": "PageRain",
  "\\.panthercdn\\.com$": "CDNetworks",
  "\\.psicdn\\.net$": "Edgecast",
  "\\.qingcdn\\.com$": "BaishanCloud",
  "\\.r\\.worldcdn\\.net$": "OnApp",
  "\\.r\\.worldssl\\.net$": "OnApp",
  "\\.raxcdn\\.com$": "Rackspace",
  "\\.reblaze\\.com$": "Reblaze",
  "\\.resrc\\.it$": "ReSRC.it",
  "\\.revcn\\.net$": "Rev Software",
  "\\.revdn\\.net$": "Rev Software",
  "\\.rhocdn\\.net$": "Edgecast",
  "\\.rlcdn\\.com$": "Reapleaf",
  "\\.rncdn1\\.com$": "Reflected Networks",
  "\\.sandpiper\\.net$": "Level 3",
  "\\.secretcdn\\.net$": "Fastly",
  "\\.section\\.io$": "section.io",
  "\\.sigmacdn\\.net$": "Edgecast",
  "\\.simplecdn\\.net$": "Simple CDN",
  "\\.sitelockcdn\\.net$": "SiteLock",
  "\\.smecdn\\.net$": "Edgecast",
  "\\.speedcdns\\.com$": "ChinaNetCenter",
  "\\.squixa\\.net$": "section.io",
  "\\.srip\\.net$": "Akamai",
  "\\.swiftcdn\\.net$": "SwiftCDN",
  "\\.swiftcdn1\\.com$": "SwiftCDN",
  "\\.swiftserve\\.com$": "SwiftServe",
  "\\.syndn\\.net$": "Synedge",
  "\\.systemcdn\\.net$": "EdgeCast",
  "\\.taobaocdn\\.com$": "Taobao",
  "\\.taucdn\\.net$": "Edgecast",
  "\\.teliasoneracdn\\.net$": "TeliaSonera",
  "\\.teridions\\.net$": "Teridion",
  "\\.thetacdn\\.net$": "Edgecast",
  "\\.tl88\\.net$": "Akamai China CDN",
  "\\.transactcdn\\.com$": "Edgecast",
  "\\.transactcdn\\.net$": "Edgecast",
  "\\.turbobytes-cdn\\.com$": "Turbobytes",
  "\\.twimg\\.com$": "Twitter",
  "\\.unicorncdn\\.net$": "UnicornCDN",
  "\\.upsiloncdn\\.net$": "Edgecast",
  "\\.v1cdn\\.net$": "Edgecast",
  "\\.v2cdn\\.net$": "Edgecast",
  "\\.v3cdn\\.net$": "Edgecast",
  "\\.v4cdn\\.net$": "Edgecast",
  "\\.v5cdn\\.net$": "Edgecast",
  "\\.vitalstream\\.com$": "Internap",
  "\\.vo\\.msecnd\\.net$": "Microsoft Azure",
  "\\.voxcdn\\.com$": "VoxCDN",
  "\\.voxcdn\\.net$": "VoxCDN",
  "\\.wp\\.com$": "WordPress",
  "\\.wscdns\\.com$": "ChinaNetCenter",
  "\\.wscloudcdn\\.com$": "ChinaNetCenter",
  "\\.xicdn\\.net$": "Edgecast",
  "\\.yahooapis\\.com$": "Yahoo",
  "\\.yimg\\.": "Yahoo",
  "\\.yottaa\\.net$": "Yottaa",
  "\\.zenedge\\.net$": "Zenedge",
  "\\.zetacdn\\.net$": "Edgecast",
  "bo\\.lt$": "BO\\.LT",
  "cdn\\.jsdelivr\\.net$": "jsDelivr",
  "cdn\\.sfr\\.net$": "SFR",
  "code\\.jquery\\.com$": "jQuery",
  "edgecastcdn\\.net$": "EdgeCast",
  "googlehosted\\.com$": "Google",
  "googlesyndication\\.": "Google",
  "hwcdn\\.net$": "Highwinds",
  "tbcdn\\.cn$": "Taobao",
  "youtube\\.": "Google"
};
var CdnDetectorMultiHeaders = [
  [
    "Fastly",
    {
      "via": "varnish",
      "x-served-by": "cache-",
      "x-cache": ""
    }
  ]
];
//
// cdn-detector.js
//
// Detects Content Delivery Networks (CDNs) based on the HTTP hostname and
// HTTP response headers.
//
// https://github.com/nicjansma/cdn-detector.js
//
/* eslint-env commonjs, browser, amd */
(function (window) {
  "use strict";

  // save old CdnDetector object for noConflict()
  var root;
  var previousObj;
  if (typeof window !== "undefined") {
    root = window;
    previousObj = root.CdnDetector;
  } else {
    root = {};
  }

  //
  // Imports
  //
  // Pulls JSON data from the global scope (i.e. if running in a browser) or via
  // require() if in Node
  //
  var headersData = root.CdnDetectorHeaders ?
    root.CdnDetectorHeaders : require("../data/headers.json");
  var hostnamesData = root.CdnDetectorHostnames ?
    root.CdnDetectorHostnames : require("../data/hostnames.json");
  var multiHeadersData = root.CdnDetectorMultiHeaders ?
    root.CdnDetectorMultiHeaders : require("../data/multi-headers.json");

  // model
  var self, CdnDetector = self = {};

  //
  // Functions
  //
  /**
   * Changes the value of CdnDetector back to its original value, returning
   * a reference to the CdnDetector object.
   *
   * @returns {object} Original CdnDetector object
   */
  CdnDetector.noConflict = function () {
    root.CdnDetector = previousObj;
    return CdnDetector;
  };

  /**
   * @typedef CdnDetectorResult
   * @type Object
   * @property {string} cdn CDN name
   * @property {object} [evidence] Evidence why the CDN was detected
   * @property {object} [evidence.headers] Header evidence
   * @property {string} [evidence.hostname] Hostname evidence
   */

  //
  // Functions
  //
  /**
   * Detects CDN usage from the HTTP hostname or headers.
   *
   * @param {string} hostname Hostname
   * @param {object} headers Map of HTTP Response headers
   *
   * @returns {CdnDetectorResult|null} Result, or null if no match
   */
  CdnDetector.detect = function (hostname, headers) {
    var result = {};

    // check hostname first
    var hostnameCheck = self.detectFromHostname(hostname);
    if (hostnameCheck) {
      result.cdn = hostnameCheck.cdn;
      result.evidence = result.evidence || {};
      result.evidence.hostname = hostnameCheck.evidence;
    }

    // check HTTP response headers next
    var headersCheck = self.detectFromHeaders(headers);
    if (headersCheck) {
      result.cdn = headersCheck.cdn;
      result.evidence = result.evidence || {};
      result.evidence.headers = headersCheck.evidence;
    }

    return result.cdn ? result : null;
  };

  /**
   * @typedef CdnDetectorHostnameResult
   * @type Object
   * @property {string} cdn CDN name
   * @property {string} evidence Evidence why the CDN was detected
   */

  /**
   * Detects CDN usage from a hostname.
   *
   * Matches against regular expressions in hostnames.json.
   *
   * @param {string} hostname Request Host name
   *
   * @returns {CdnDetectorHostnameResult|null} Host's CDN info, or, null if a CDN wasn't detected
   */
  CdnDetector.detectFromHostname = function (hostname) {
    if (!hostname) {
      // skip falsy (empty, null, etc) hostnames
      return null;
    }

    for (var regexString in hostnamesData) {
      if (hostnamesData.hasOwnProperty(regexString)) {
        var regex = new RegExp(regexString);

        if (regex.test(hostname)) {
          return {
            cdn: hostnamesData[regexString],
            evidence: regexString
          };
        }
      }
    }

    return null;
  };

  /**
   * @typedef CdnDetectorHeadersResult
   * @type Object
   * @property {string} cdn CDN name
   * @property {string[]} evidence Array of HTTP response headers that matched
   */

  /**
   * Detects CDN usage from HTTP response headers.
   *
   * Matches against headers in headers.json and multi-headers.json.
   *
   * @param {object} headers HTTP Response Headers map
   *
   * @returns {CdnDetectorHeadersResult|null} Header CDN info, or, null if a CDN wasn't detected
   */
  CdnDetector.detectFromHeaders = function (headers) {
    if (!headers || headers.length === 0) {
      return null;
    }

    // build return evidence object in case we find something
    var result = {
      evidence: []
    };

    // convert all incoming headers to lower case first
    var lowerHeaders = {};
    for (var headerName in headers) {
      if (headers.hasOwnProperty(headerName)) {
        lowerHeaders[headerName.toLowerCase()] = headers[headerName];
      }
    }

    var i, data, cdn, match, matches;

    // find any matching headers in our data
    for (i = 0; i < headersData.length; i++) {
      data = headersData[i];

      var header = data[0];
      match = data[1];
      cdn = data[2];

      if (typeof lowerHeaders[header] === "string") {
        // if there is no match string, we're good
        // if there a match string, make sure the header starts with it
        if ((!match || match.length === 0)
          || (match.length > 0 && lowerHeaders[header].toLowerCase().indexOf(match) === 0)) {
          result.cdn = cdn;
          result.evidence.push(header + ": " + (match ? match : "*"));
        }
      }
    }

    // find any multi headers (multiple headers need to match)
    for (i = 0; i < multiHeadersData.length; i++) {
      data = multiHeadersData[i];

      cdn = data[0];
      matches = data[1];

      var matchesAll = true;
      var matchEvidence = [];

      // loop through, looking to see if this request matches
      // all headers in the set
      for (match in matches) {
        if (matches.hasOwnProperty(match)) {
          var matchValue = matches[match];

          if (typeof lowerHeaders[match] !== "string") {
            matchesAll = false;
            break;
          }

          if (lowerHeaders[match].toLowerCase().indexOf(matchValue) !== 0) {
            matchesAll = false;
            break;
          }

          // add to our evidence pile
          matchEvidence.push(match + ": " + (matchValue ? matchValue : "*"));
        }
      }

      // we matched all headers
      if (matchesAll) {
        result.cdn = cdn;
        result.evidence = result.evidence.concat(matchEvidence);
      }
    }

    return result.cdn ? result : null;
  };

  //
  // Export to the appropriate location
  //
  if (typeof define === "function" && define.amd) {
    //
    // AMD / RequireJS
    //
    define([], function () {
      return CdnDetector;
    });
  } else if (typeof module !== "undefined" && module.exports) {
    //
    // Node.js
    //
    module.exports = CdnDetector;
  } else if (typeof root !== "undefined") {
    //
    // Browser Global
    //
    root.CdnDetector = CdnDetector;
  }
}(typeof window !== "undefined" ? window : undefined));

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
