import { createApp } from 'https://unpkg.com/petite-vue?module'

createApp({
  // const
  url:'https://api.spiriert.de/items/',
  routes: [
    'linkboxes',
    'texts',
    'sections',
  ],

  // data
  data: {},

  // methods
  load(route) {
    this.data[route] = []
    fetch(this.url+'/'+route)
      .then(response => response.json())
      .then(data => this.data[route] = data)
  },

  mounted() {
    for (let r of this.routes) {
      this.load(r)
    }
  }
}).mount()