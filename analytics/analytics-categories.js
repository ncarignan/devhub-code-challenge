const DEVHUB_ANALYTICS = [
  {
    name: 'link_call',
    tagName: 'A',
    requirements: [
      { property: 'href', match: /tel:/ }
    ],
    extracts: []
  },
  {
    name: 'link_outgoing',
    requirements: [
      { property: 'hostname', match: /^localhost/ }
    ],
    extracts: []
  },
  {
    name: 'form_submit',
    tagName: 'FORM',
    requirements: [
      // { property: 'hostname', match: /^localhost/ }
    ],
    extracts: []
  }
];

module.exports = DEVHUB_ANALYTICS;