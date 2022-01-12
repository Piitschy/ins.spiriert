var cms = new Vue({
  el: '#cms',
  data() {
    return {
      items: []
    }
  },
  mounted() {
    fetch('https://cms.spiriert.de/texts')
      .then(response => response.json())
      .then(data => this.items = data)
  }
})