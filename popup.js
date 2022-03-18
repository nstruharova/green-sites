
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
