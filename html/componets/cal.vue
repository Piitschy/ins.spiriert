<template>
  <v-card elevation="10">
    <v-sheet height="64" dark>
      <v-toolbar
        flat
      >
        <v-btn
          v-if="type != 'month'"
          outlined
          class="mr-4"
          color="grey darken-2"
          @click="type = 'month'"
          >
          <v-icon>
            mdi-calendar-range
          </v-icon>
        </v-btn>
        <v-btn
    v-if="type != 'week'"
          outlined
          class="mr-4"
          color="grey darken-2"
          @click="type = 'week'"
          >Woche
        </v-btn>
        <v-btn
          fab
          text
          small
          color="grey darken-2"
          @click="prev"
          >
          <v-icon small>
            mdi-chevron-left
          </v-icon>
        </v-btn>
        <v-toolbar-title v-if="$refs.calendar && type == 'month'">
          {{ $refs.calendar.title }}
        </v-toolbar-title>
        <v-btn
          fab
          text
          small
          color="grey darken-2"
          @click="next"
          >
          <v-icon small>
            mdi-chevron-right
          </v-icon>
        </v-btn>
        <v-btn
          outlined
          class="mr-4"
          color="grey darken-2"
          @click="setToday"
          >Heute
        </v-btn>
      </v-toolbar>
    </v-sheet>
    <v-sheet height="800" dark>
      <v-calendar
        ref="calendar"
        v-model="focus"
        color="#202020"
        :events="events"
        :type="type"
        :weekdays="weekday"
        @click:event="showEvent"
        @click:more="viewDay"
        @click:date="viewDay"
        locale="de-de" 
      ></v-calendar>
      <v-menu
        v-model="selectedOpen"
        :close-on-content-click="false"
        :activator="selectedElement"
        offset-x
      >
        <v-card
          color="grey lighten-4"
          flat
        >
          <v-toolbar
            :color=selectedEvent.color
            dark
          >
            <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            {{selectedEvent.startTime}} - {{selectedEvent.endTime}} <br>
            {{selectedEvent.loc}}
            <span v-html="selectedEvent.details"></span>
          </v-card-text>
          <v-card-actions>
            <v-btn
              text
              color="secondary"
              @click="selectedOpen = false"
            >
              Schließen
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-sheet>
  </v-card>
</template>


<script>
export default {
  data() {
    return {
      url: 'https://www.googleapis.com/calendar/v3/calendars/ins%40spiriert.de/events?orderBy=startTime&singleEvents=true&timeMax=2022-12-31T00%3A00%3A00Z&timeMin=2022-01-01T00%3A00%3A00Z',
      auth: '&key=AIzaSyC2jS8Z_Fqqo2PAQ91DU7n9d4Eky6Etb_Q',
      focus: '',
      type: 'month',
      typeToLabel: {
        month: 'Monat',
        week: 'Woche',
        day: 'Tag'
      },
      weekday: [1, 2, 3, 4, 5, 6, 0],
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [],
      locs:{
        luther:{
          name: "Lutherkirche",
          color: "#00c2fb"
        },
        lukas:{
          name: "Lukaskirche",
          color: "#47E844"
        }
      }
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
    getEventColor (event) {
      return event.color
    },
    setToday () {
      this.focus = ''
    },
    prev () {
      this.$refs.calendar.prev()
    },
    next () {
      this.$refs.calendar.next()
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
}
</script>