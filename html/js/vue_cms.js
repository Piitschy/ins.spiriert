import { createApp } from 'https://unpkg.com/petite-vue?module'

createApp({
  // const
  url:'https://cms.spiriert.de/items/',
  routes: [
    'headline',
    'linkboxes',
    'texts',
    'sections',
    'workload',
  ],

  // data
  data: {},

  // methods
  load(route) {
    fetch(this.url+'/'+route)
      .then(response => response.json())
      .then(data => this.data[route] = data)
  },

  mounted() {
    for (let r of this.routes) {
      this.data[r] = []
      this.load(r)
    }
    setInterval(()=>{this.load('workload')},1000);
  }
}).mount()