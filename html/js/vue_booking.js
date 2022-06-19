var cal = new Vue({
  el: '#cal',
  vuetify: new Vuetify(),
    template: `<v-app>
      <center>
        <v-card elevation="10">
          <v-sheet height="64" dark>
            
          </v-sheet>
        </v-card>
      </center>
    </v-app>`,
  data() {
    return {
      url: 'https://www.googleapis.com/calendar/v3/calendars/ins%40spiriert.de/events?orderBy=startTime&singleEvents=true&timeMax=2022-12-31T00%3A00%3A00Z&timeMin=2022-01-01T00%3A00%3A00Z',
      auth: '&key=AIzaSyC2jS8Z_Fqqo2PAQ91DU7n9d4Eky6Etb_Q',
      weekday: [1, 2, 3, 4, 5, 6, 0],
      events: []
    }
  },
  computed: {
    now() {
      return new Date().toISOString()
    },
    today () {
      return this.now.substr(0, 10)
    },
    time () {
      return this.now.substr(11, 5)
    },
  },
  methods: {
    date2sting(key,time_only=false){
      const dateTime = new Date(key.dateTime || key.date)
      dateTime.setHours(dateTime.getHours() + 1)
      dateTimeStr = dateTime.toISOString()
      const tag = dateTimeStr.substr(0, 10)
      const zeit = dateTimeStr.substr(11, 5)
      if (time_only) {
        return zeit
      }
      return tag + ' ' + zeit
    },
    filterEvents(data){
      console.log(data)
      const items = data.items
      let events = []
      for (let item of items) {
        if (item.status !== 'confirmed'){
          continue
        }
        var color = ""
        const loc = String(item.location)
        for (l in this.locs) {
          if (loc.includes(this.locs[l].name)) {
            color = this.locs[l].color
            break
          }
        }
        let event = {
          start: this.date2sting(item.start),
          end: this.date2sting(item.end),
          startTime: this.date2sting(item.start,true),
          endTime: this.date2sting(item.end,true),
          name: item.summary,
          loc: loc,
          color: color
        }
        events.push(event)
      }
      console.log(events)
      this.events = events
    },
    getEvents () {
      fetch(this.url + this.auth)
        .then(response => response.json())
        .then(data => this.filterEvents(data))
    },
    viewDay ({ date }) {
      this.focus = date
      this.type = 'day'
    },
    showEvent ({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event
        this.selectedElement = nativeEvent.target
        requestAnimationFrame(() => requestAnimationFrame(() => this.selectedOpen = true))
      }
      if (this.selectedOpen) {
        this.selectedOpen = false
        requestAnimationFrame(() => requestAnimationFrame(() => open()))
      } else {
        open()
      }
      nativeEvent.stopPropagation()
    }
  },
  mounted() {
    this.$refs.calendar.scrollToTime(this.time)
    this.getEvents()
  }
})