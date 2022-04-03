# GreenSites: Sustainable Web Development
GreenSites is an extension for the Chrome™ browser that measures the energy consumption of a given website and identifies which elements are mostly responsible. It is a tool meant for developers to enable them to make their sites more sustainable. 

GreenSites checks the following: 
- Images
    - Whether images are being loaded but not being rendered.
    - If an image resolution is larger then it's displayed size.
    - Which image file types are being used. 
- For videos if autoplay is on.
- Whether any external fonts are downloaded.
- How lazy loading is applied. 
- Content Delivery Networks
    - If the website is loaded with a CDN.
    - Which elements are not loaded with a CDN.

See the details page in the plugin for explanations of the features. 
The extension makes use of https://websitecarbon.com for displaying the energy consumption of the website. The measures were based mainly on the following checklist: https://www.wholegraindigital.com/blog/website-energy-efficiency/. 

The plugin is currently in active development, it has not been published on the Chrome Webstore.

Before contributing please read our Code of Conduct and Contributing files for more information. 
