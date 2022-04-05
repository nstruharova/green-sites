# GreenSites: Sustainable Web Development
GreenSites is an extension for the Chrome™ browser identifies the elements which may contribute to excessive energy consumption by analysing them for bad design practices. It is a tool meant for developers to enable them to make their sites more sustainable, and with that, cut the unnecessary energy consumption and the associated carbon emissions. 

# Our goals

Our main goal is to provide developers with additional support when designing a new website or re-designing an existing website for sustainability. To make it as convenient as possible to use, we integrated the functionality in form of a plug-in that can be used directly in the Chrome™ browser during web design. 

# Features

GreenSites checks the following: 
- Images (`<img>`):
    - checks whether the images are being loaded and not being rendered
    - checks whether an image resolution is larger then its displayed size
    - checks which image file types are being used
- Videos (`<video>`):
    - checks whether `autoplay` is enabled
- Fonts:
    - checks for loading of external fonts instead of using system fonts
- Lazy loading:
    - checks the following element types for usage of lazy-loading:
        - images (`<img>`)
        - videos (`<video>`)
        - iFrames (`<iframe>`)
- Content Delivery Network usage (CDN)
    - checks whether a website's HTTPS response is loaded using a CDN
    - check whether the following element types are loaded using a CDN:
        - images (`<img>`)
        - videos (`<video>`)
        - iFrames (`<iframe>`)
        - scripts (`<script>`)

See the details page in the plugin for explanations of the features. 

# Tools and foundation

The extension makes use of https://websitecarbon.com for displaying the energy consumption of the website. The measures were based mainly on the following checklist: https://www.wholegraindigital.com/blog/website-energy-efficiency/. 

# Usage

The plugin is currently in active development, therefore it has not been published on the Chrome Webstore. If you would like to make use of GreenSites now, please clone the repository and follow the [manual](https://www.thesslstore.com/blog/install-a-chrome-extension/) on how to integrate the source code into your Chrome™ browser.

Within the browser, you can use GreenSites as you would use any other plug-in. When you run the plug-in, you will get a drop-down menu with buttons targetting the specific element type check. For more details on the specific element groups and explanations on the associated warnings, click on the helper icon with the question mark to open a new page with the information.

# Found a new issue or want to contribute?

If you found an issue with the plug-in or have a new feature request, you can [add a new issue](https://github.com/nstruharova/green-sites/issues/new/choose) to our our [issue list](https://github.com/nstruharova/green-sites/issues). To make it clear what your issue refers to, please use the `bug`/`refactoring`/`feature-request` tags.

GreenSites is an open-source project, and thus we invite anyone and everyone interested in web development or simply improving the plug-in. To make your contribution process as smooth as possible, please see our instructions on [how to contribute](https://github.com/nstruharova/green-sites/blob/main/CONTRIBUTING.md) and read the Code of Conduct before adding a contribution.
