
'use strict';

let PAGE_ANALYTICS = []; 
// Setup an array with all the analytic tracker definitions
// Should be imported from another file either using require.js or react imports;
const DEVHUB_ANALYTICS = [
  {
    name: 'link_call',
    tagName: 'A',
    event: 'click',
    requirements: [
      { property: 'href', test: /tel:/ }
    ],
    analyzers: ['ga', 'mixpanel', 'optimizely'],
    extracts: []
  },
  {
    name: 'link_facebook',
    event: 'click',
    tagName: 'A',
    analyzers: ['mixpanel', 'optimizely'],
    requirements: [
      { property: 'hostname', test: /facebook\.com/ } // TODO: fix facebook
    ],
    extracts: []
  },
  {
    name: 'link_outgoing',
    event: 'click',
    tagName: 'A',
    analyzers: ['ga', 'mixpanel', 'optimizely'],
    requirements: [
      { property: 'hostname', test: /^((?!localhost).)*$/ }
    ],
    extracts: []
  }, 
  {
    name: 'form_submit',
    event: 'submit',
    tagName: 'FORM',
    analyzers: ['ga', 'mixpanel', 'optimizely'],
    requirements: [
      { property: 'tagName', test: /^FORM/ }
    ],
    extracts: []
  }
];

// Sets up all tags and events that need to be listened to
const { tags, events } = DEVHUB_ANALYTICS.reduce((a, c) => {
  c.tagName && !a.tags.includes(c.tagName) && a.tags.push(c.tagName);
  c.event && !a.events.includes(c.event) && a.events.push(c.event);
  return a;
}, { tags: [], events: [] });



// filters the event against all tracked analytics
function handleEvents(e){
  for(const tag of tags){
    if(e.target.tagName === tag){
      for(const eTargetCategory of DEVHUB_ANALYTICS){
        analyze(e, eTargetCategory);
      }
    }
  }
}

// consumes the event, runs regex matches against each analytic category's requirement(s), 
// then sends it to the propper tracker
function analyze (e, analytic_category) {
  const { requirements, analyzers } = analytic_category;
  for (const { property, test } of requirements){
    const event_attribute = e.target[property];
    if (event_attribute && test.test(event_attribute)) {
      
      PAGE_ANALYTICS
      // If I had the existing code for DevHub's analytics, in v2 I would format the last step to match what is already in place
      // For processors that need the target url, we could send it through easily as it is already in the event 
        .map(analytic => {
          analytic && analyzers.includes(analytic.name) && analytic.analyze(e, { category : analytic_category.name });
        });
    }
  }
}





(function () {
  // Discover which analytics have loaded, 
  // I am not sure what optimizely's code looks like or how I can interface with it, but that would be improved in v2

  PAGE_ANALYTICS = [
    true && { 
      name: 'ga',
      analyze: function (e, options) { console.log(`${this.name} consumed a '${options.category}' event on a '${e.target.tagName}' element`);},
    }, 
    window.mixpanel && {
      name: 'mixpanel',
      analyze: function (e, options) { console.log(`${this.name} consumed a '${options.category}' event on a '${e.target.tagName}' element`); },
    },
    window.optimizely && {
      name: 'optimizely',
      analyze: function (e, options) { console.log(`${this.name} consumed a '${options.category}' event on a '${e.target.tagName}' element`); },
    },
  ];
  /*
    Listen for all tracked event types on the document level
    Listening on the document level is more performance efficient than targetting individual event types
    https://gomakethings.com/why-event-delegation-is-a-better-way-to-listen-for-events-in-vanilla-js/
  */
  events.forEach(event => document.addEventListener(event, handleEvents));
})();


