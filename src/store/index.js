import Vue from 'vue'
import Vuex from 'vuex'
import MovieService  from '../services/MovieService'

Vue.use(Vuex)

const store = {
  state: {
    hello: 'world',
    movies: [],
    savedMovies: [],
    genres: [],
    selectedGenre: null,
    pages: 1,
    currentPage: 1,
    loading: false,
    currentSection: 'discover',
    currentMovie: null,
    imageBasePath: 'http://image.tmdb.org/t/p/w370_and_h556_bestv2'
  },

  actions: {
    async fetchMovies (context, page = 1) {
      context.commit('setLoading', true)
      const response = await MovieService.getMovies({
        page: page,
        genre: context.state.selectedGenre
      })
      context.commit('setMovies', response.data)
      context.commit('setLoading', false)
    },
    async fetchGenres (context) {
      const response = await MovieService.getGenres()
      context.commit('setGenres', response.data)
    },
    fetchPage(context, page) {
      context.dispatch('fetchMovies', page)
    },
    fetchByGenre(context, genre) {
      context.commit('setSelectedGenre', genre)
      context.dispatch('fetchMovies')
    },
    fetchSavedMovies (context) {
      const savedMovies = localStorage.getItem('savedMovies')
      context.commit('setSavedMovies', JSON.parse(savedMovies))
    },
    async fetchCurrentMovie(context, movieId) {
      context.commit('setLoading', true)
      const response = await MovieService.getMovie(movieId)
      context.commit('setCurrentMovie', response.data)
      context.commit('setLoading', false)
    },
    clearCurrentMovie (context) {
      context.commit('setCurrentMovie', null)
    }

  },

  mutations: {
    setMovies(state, moviesData) {
      state.movies = moviesData.results
      state.pages = moviesData.total_pages
      state.currentPage = moviesData.page
    },
    setGenres(state, genresData) {
      state.genres = genresData.genres
    },
    setSelectedGenre(state, genre) {
      state.selectedGenre = genre
    },
    setLoading(state, value) {
      state.loading = value
    },
    setSection(state, section) {
      state.currentSection = section
    },
    setSavedMovies (state, savedMovies) {
      if(savedMovies) {
        state.savedMovies = savedMovies
      }
    },
    saveMovie (state, movieObject) {
      state.savedMovies.push(movieObject)
      localStorage.setItem('savedMovies', JSON.stringify(state.savedMovies))
    },
    removeSavedMovie (state, movie) {
      const movieIndex = this.getters.savedMoviesIds.indexOf(movie.id)
      if (movieIndex >= 0) {
        state.savedMovies.splice(movieIndex, 1)
      }
      localStorage.setItem('savedMovies', JSON.stringify(state.savedMovies))
    },
    setCurrentMovie (state, movieObject) {
      state.currentMovie = movieObject
    }
  },

  getters: {
    movieCards (state) {
      if(state.currentSection === 'backlog') {
        return state.savedMovies
      }

      return state.movies.map(movie => ({
        id: movie.id,
        title: movie.title,
        description: movie.overview,
        image: `${state.imageBasePath}${movie.poster_path}`,
        voteAverage: movie.vote_average
      }))
    },
    selectedGenreName (state) {
      const genre = state.genres.filter(genre => genre.id === state.selectedGenre)
      return genre[0] ? genre[0].name : null
    },
    savedMoviesIds (state) {
      if (!state.savedMovies)
        return []
      return state.savedMovies.map(movie => movie.id)
    },
    singleMovie (state) {
      if (!state.currentMovie)
        return {}

      return state.currentMovie
    },
    imageURL (state) {
      if (!state.currentMovie)
        return ''

      return `${state.imageBasePath}${state.currentMovie.poster_path}`
    }
  }
}

export default new Vuex.Store(store)
