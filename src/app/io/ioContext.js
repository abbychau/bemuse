
// The singleton IO context. This file is needed because many parts of
// our application still depends on a singleton.
//
import createCollectionLoader from '../interactors/createCollectionLoader'
import store from '../redux/instance'
import * as ReduxState from '../redux/ReduxState'
import { loadSongFromResources } from '../song-loader'

// Configure a collection loader, which loads the Bemuse music collection.
const collectionLoader = createCollectionLoader({
  fetch: fetch,
  onBeginLoading: (url) => store.dispatch({
    type: ReduxState.COLLECTION_LOADING_BEGAN,
    url: url
  }),
  onErrorLoading: (url, reason) => store.dispatch({
    type: ReduxState.COLLECTION_LOADING_ERRORED,
    url: url,
    error: reason
  }),
  onLoad: (url, data) => store.dispatch({
    type: ReduxState.COLLECTION_LOADED,
    url: url,
    data: data
  })
})

// Configure a custom song loader which loads custom song from resources.
const customSongLoader = {
  loadSongFromResources: async (resources, options) => {
    const song = await loadSongFromResources(resources, options)
    song.id = '__custom_' + Date.now()
    song.custom = true
    return song
  }
}

export const ioContext = {
  store,
  collectionLoader,
  customSongLoader
}

export default ioContext
