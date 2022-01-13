import { createApp } from 'https://unpkg.com/petite-vue?module'

createApp({
  // const
  url:'https://cms.spiriert.de/',
  // data
  data: {
    descriptions: []
  },
  // methods
  load(route,target) {
    fetch(this.url+route)
      .then(response => response.json())
      .then(data => this.data[target] = data)
  },
  mounted() {
    this.load('texts','descriptions')
  }
}).mount()