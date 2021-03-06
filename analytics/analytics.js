
'use strict';



// Import the Adaptors or use preloaded ones
const Adaptors = [
  {
    adaptor: 'ga',
    analyze:  logger,
  },
  {
    adaptor: 'mixpanel',
    analyze: logger,
  },
  {
    adaptor: 'optimizely',
    analyze: logger,
  },
];

// Set up an array with all the analytic tracker definitions
// Should be imported from another file either using require.js or ES6 imports;
const DEVHUB_ANALYTICS = [
  {
    name: 'link_call',
    tagName: 'A',
    event: 'click',
    requirements: [
      { property: 'href', test: /tel:/ }
    ],
    analyzers: ['ga', 'mixpanel'],
    extracts: []
  },
  {
    name: 'link_facebook',
    event: 'click',
    tagName: 'A',
    analyzers: [ 'optimizely'],
    requirements: [
      { property: 'hostname', test: /.*facebook\.com.*/ }
    ],
    extracts: []
  },
  {
    name: 'link_outgoing',
    event: 'click',
    tagName: 'A',
    analyzers: ['mixpanel'],
    requirements: [
      { property: 'hostname', test: /^((?!localhost).)*$/ } //regex needs to be adapted to reflect the domain name
    ],
    extracts: []
  }, 
  {
    name: 'form_submit',
    event: 'submit',
    tagName: 'FORM',
    analyzers: ['ga'],
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
// First by tag type, then by individual categorizations, this is O(n) time complexity where n is the amount of categories we have setup
function filterEvents(e){
  //Prevents page refresh for logging
  if(tags.includes(e.target.tagName)){
    for(const { requirements, analyzers, name } of DEVHUB_ANALYTICS){
      if(checkAnalyticRequirements(requirements, e)){
        // If I had the existing code for DevHub's analytics, in v2 I would format the last step to match what is already in place
        // For processors that need the target url, we could send it through easily as it is already in the event 
        Adaptors
          .map(analytic => {
            const { adaptor } = analytic;
            analytic &&
              window[adaptor] &&
              analyzers.includes(adaptor) &&
              analytic.analyze(e, { category: name });
          });
      }
    }
  }
}

function checkAnalyticRequirements(requirements, e){
  for (const { property, test } of requirements) {
    const event_attribute = e.target[property];
    if (!(event_attribute && test.test(event_attribute))) return false;
  }
  return true;
}

function logger (e, options) {
  let li = document.createElement('li');
  li.textContent = `the ${this.adaptor} adaptor consumed a '${options.category}' event`;
  document.getElementById('results').appendChild(li);
}

(function () {
  // Prevent page refresh or leaving page on link click or form submit, for testing purposes
  window.onbeforeunload = function () { return 'Please stay on this page.'; };

  events.forEach(event => document.addEventListener(event, filterEvents));
})();


