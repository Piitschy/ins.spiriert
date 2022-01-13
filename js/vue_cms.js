import { createApp } from 'https://unpkg.com/petite-vue?module'

createApp({
  // data
  url:'https://cms.spiriert.de/',
  data: {
    items: []
  },
  // methods
  load(route,target) {
    fetch(this.url+route)
      .then(response => response.json())
      .then(data => this.data[target] = data)
  },
  mounted() {
    this.load('texts','items')
  }
}).mount()