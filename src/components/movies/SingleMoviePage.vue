<template>
  <div class="container" :class="{'loading': isLoading}">
    <div class="row">
        <img :src="imageURL" class="rounded" alt="Responsive image"> 
    </div>
    <div class="row">
      <h1>{{movieObject.title}}</h1>
      <p>{{movieObject.overview}}</p>
    </div>


      
    </div>
  </div>
  
</template>

<script>
export default {

  name: 'SingleMoviePage',

  computed: {
    movieId () {
      return this.$route.params.id
    },
    movieObject () {
      return this.$store.getters.singleMovie
    },
    isLoading () {
      return this.$store.state.loading
    },
    imageURL () {
      return this.$store.getters.imageURL
    }
  },

  created () {
    this.$store.dispatch('fetchCurrentMovie', this.movieId)
  },

  destroyed () {
    this.$store.dispatch('clearCurrentMovie')
  }

}
</script>

<style lang="css" scoped>
.loading{
  opacity: 0.2;
}
</style>