# Code Challenge

https://github.com/ncarignan/devhub-code-challenge.git



1. Module Javascript standardized loader

As you know we have a system that builds pages - Each page is configured with a list of "modules" (i.e. widgets) - Examples would be Google Maps, Image Gallery, Youtube Video, etc.

Each of these can have javascript associated with rendering them - We'd like to standardize the way we are loading the javascript to the page from our system.

We would use webpack for compiling the bundles for each module.

Things to be aware of:

Not all modules (we have 30+) will be on the page all the time - we only want to load the JS we need for the modules configured
A module type can be on a page more than once, so we don't want to load the js multiple times - But you would have calls to the init multiple times (i.e. GoogleMap({moduleId: 'XXXXX'});) in the HTML
If modules have shared dependencies or utils, we might want to make sure loading of those is efficient as well by having a standard bundle in addition to the module bundles

Rough pseudocode if it helps, but feel free to scrap

<script>
(function() {
devhub.getOrLoadModule([‘utils’, ‘googlemaps’], function(googlemaps) {
   googlemaps.GoogleMap({
       moduleId: 12345,
       other: params,
       ...
   });
}
})();
</script>


2. Analytics Tracking v2

We currently have analytics to standardize binding/tracking of visitor events (link clicks, form fills, and other interactions) on Pages built on our platform

General requirements:

This tracking code will be added to the bottom of the page
We will not be adding any markup to the DOM - i.e. onClick attributes, etc
We want this to be "light", so native JS would be prefered
Sites on our platform can contain all sorts of existing javascript, so we'd like to avoid major dependencies like jquery, etc that could conflict with our own versions
Adaptors

When an event happens (i.e. click or submit), we then categorize it by criteria (type of event, type of element, etc) or ignore it. 

We then push that event (and optionally some meta data about the event) to a list of configured "Adaptors" that are available to accept that event - Examples of adaptors would be Google Analytics, Mixpanel, Optimizely. The event is then delivered in the format expected by the technology (i.e. Google Analytics - window.ga('send', 'event-name', ...))
Adaptor requirements:

Adaptors need to check to make sure they have a client (usually on the global namespace - window.ga, etc) available to interface with.
Adaptors can define which of our events they support or ignore
Example of Our Events (i.e. categorization):

link-call - click event: <a> tag with href starting with tel:

link-facebook - click event: <a> tag with a href to facebook.com (secure or insecure)

link-outgoing - click event: - <a> tag - This is a catch-all after the other "link-" event for events that leaving the current hostname/site

Note:
- any links to normal pages within the hostname/site should not be tracked
- "link-" events also push the "href" that was linked to as part of the meta data of the event

form-submit - submit event: <form> - Bind to any form being submitted


Rough pseudocode if it helps, but feel free to scrap

<script>
(function() {
Analytics({
  adaptors: [
    {
      adaptor: 'googleanalytics',
      options: here,
      ...
    },
    {
      adaptor: 'mixpanel',
      apiKey: 'XXXXXXXXXXXXXXXXXX'
    }
  ],
  options: here
  ...
});
})();
</script>


