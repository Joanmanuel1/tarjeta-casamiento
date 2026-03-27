<script setup>
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import confetti from 'canvas-confetti'
import { auth } from '../firebase/config'
import { searchTracks } from '../services/musicSearchService'
import { addOrVoteSong, listenToTopSongs, getUserVotes } from '../services/musicService'

const searchQuery = ref('')
const searchResults = ref([])
const topSongs = ref([])
const userVotes = ref([])
const isSearching = ref(false)
const isVoting = ref(false)
const unsubscribe = ref(null)
const currentPlaying = ref(null) // ID of the song currently playing

const audio = new Audio()

const togglePreview = (song) => {
  if (currentPlaying.value === song.id) {
    audio.pause()
    currentPlaying.value = null
  } else {
    audio.src = song.preview
    audio.play()
    currentPlaying.value = song.id
  }
}

audio.onended = () => { currentPlaying.value = null }

// Debounce search
let searchTimeout = null
watch(searchQuery, (newQuery) => {
  if (searchTimeout) clearTimeout(searchTimeout)
  if (newQuery.length < 3) {
    searchResults.value = []
    return
  }

  isSearching.value = true
  searchTimeout = setTimeout(async () => {
    searchResults.value = await searchTracks(newQuery)
    isSearching.value = false
  }, 500)
})

const handleVote = async (song) => {
  if (isVoting.value || userVotes.value.length >= 3) return

  const uid = auth.currentUser?.uid
  if (!uid) return

  isVoting.value = true
  try {
    await addOrVoteSong(song, uid)
    userVotes.value.push(song.id)

    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#1DB954', '#191414', '#ffffff'] // Spotify colors
    })

    searchQuery.value = ''
    searchResults.value = []
  } catch (error) {
    if (error.message === 'LIMIT_REACHED') {
      alert('¡Ya alcanzaste tu límite de 3 canciones!')
    } else if (error.message === 'ALREADY_VOTED') {
      alert('Ya votaste por esta canción.')
    }
    console.error('Error voting:', error)
  } finally {
    isVoting.value = false
  }
}

onMounted(async () => {
  // Wait for auth to initialize
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      userVotes.value = await getUserVotes(user.uid)
    }
  })

  unsubscribe.value = listenToTopSongs((songs) => {
    topSongs.value = songs
  }, 5)
})

onUnmounted(() => {
  if (unsubscribe.value) unsubscribe.value()
  audio.pause()
})
</script>

<template>
  <section class="music-section section-reveal py-5">
    <div class="container-fluid px-4 px-md-5">
      <div class="row g-4 justify-content-center" style="height: 700px;">

        <!-- Search & Info Card -->
        <div class="col-lg-6">
          <div class="card music-card spotify-dark border-0 h-100 p-4 p-md-5 shadow-xl">
            <div class="header-content mb-4">
              <div class="d-flex align-items-center mb-3">
                <i class="pi pi-spotify text-success fs-1 me-3"></i>
                <h2 class="fw-bold mb-0">Playlist de la Fiesta</h2>
              </div>
              <p class="text-white-50 small">Buscá y votá tus temas favoritos. Límite: 3 votos por persona.</p>

              <!-- Vote Counter -->
              <div class="vote-quota d-flex gap-2 mt-3">
                <div v-for="i in 3" :key="i" class="quota-dot" :class="{ 'active': userVotes.length >= i }"></div>
                <span class="ms-2 small text-white-50">{{ 3 - userVotes.length }} votos restantes</span>
              </div>
            </div>

            <div class="search-container position-relative mb-4">
              <span class="p-input-icon-left w-100">
                <i class="pi pi-search text-white-50" />
                <InputText v-model="searchQuery" placeholder="Artistas, canciones..."
                  class="w-100 p-3 bg-dark-soft text-white border-0 rounded-3 shadow-inner"
                  :disabled="userVotes.length >= 3" />
              </span>

              <div v-if="searchResults.length > 0" class="search-results-overlay rounded-3 mt-2 shadow-2xl p-2">
                <div v-for="track in searchResults" :key="track.id"
                  class="result-item d-flex align-items-center p-2 rounded-3 mb-1"
                  :class="{ 'playing': currentPlaying === track.id }">

                  <!-- Play Button -->
                  <div class="play-btn-wrapper me-2" @click.stop="togglePreview(track)">
                    <i class="pi"
                      :class="currentPlaying === track.id ? 'pi-pause-circle text-success' : 'pi-play-circle'"></i>
                  </div>

                  <!-- Track Info -->
                  <div class="d-flex align-items-center flex-grow-1 pointer py-1 pe-2 overflow-hidden"
                    @click="togglePreview(track)">
                    <img :src="track.image" alt="cover" class="rounded-2 me-3"
                      style="width: 40px; height: 40px; object-fit: cover;">

                    <div class="flex-grow-1 overflow-hidden text-start">
                      <p class="mb-0 fw-bold text-white text-truncate small">{{ track.name }}</p>
                      <p class="mb-0 text-white-50 extra-small text-truncate">{{ track.artist }}</p>
                    </div>
                  </div>

                  <!-- Vote Button -->
                  <Button icon="pi pi-plus" label="Votar"
                    class="votar-btn-mini p-button-sm p-button-success p-button-outlined rounded-pill py-1 px-3"
                    @click.stop="handleVote(track)" :disabled="userVotes.includes(track.id)" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Real-time Ranking -->
        <div class="col-lg-5">
          <div class="card ranking-card glass-card border-0 h-100 p-4 p-md-5">
            <div class="d-flex align-items-center justify-content-between mb-4">
              <h3 class="fw-bold mb-0 text-premium">Top Ranking</h3>
              <div class="live-indicator">
                <span class="dot"></span> en vivo
              </div>
            </div>

            <div v-if="topSongs.length > 0" class="ranking-list">
              <div v-for="(song, index) in topSongs" :key="song.id"
                class="ranking-item d-flex align-items-center mb-3 p-2 p-md-3 rounded-4"
                :class="{ 'playing': currentPlaying === song.id }">

                <div class="rank-num me-2 me-md-3 d-none d-sm-block">{{ index + 1 }}</div>

                <div class="d-flex align-items-center flex-grow-1 pointer overflow-hidden" @click="togglePreview(song)">
                  <!-- Play Button -->
                  <div class="play-btn-wrapper me-3">
                    <i class="pi"
                      :class="currentPlaying === song.id ? 'pi-pause-circle text-success' : 'pi-play-circle'"></i>
                  </div>

                  <div class="position-relative me-3 flex-shrink-0">
                    <img :src="song.image" alt="cover" class="rounded-3 shadow-sm"
                      style="width: 48px; height: 48px; object-fit: cover;">
                  </div>

                  <div class="flex-grow-1 overflow-hidden text-start">
                    <p class="mb-0 fw-bold text-truncate" :class="currentPlaying === song.id ? 'text-success' : ''">{{
                      song.name }}</p>
                    <p class="mb-0 text-muted text-truncate" style="font-size: 0.75rem;">{{ song.artist }}</p>
                  </div>
                </div>

                <div class="vote-count text-end ms-3 flex-shrink-0">
                  <div class="fw-bold text-premium fs-5">{{ song.votes }}</div>
                  <div class="text-muted" style="font-size: 0.55rem; letter-spacing: 1px;">VOTOS</div>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-5">
              <i class="pi pi-clock fs-1 text-muted opacity-25 mb-3"></i>
              <p class="text-muted">Calculando ranking...</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
.spotify-dark {
  background: #121212;
  color: white;
}

.bg-dark-soft {
  background: #282828;
}

.search-results-overlay {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #1e1e1e;
  z-index: 1000;
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.result-item:active,
.result-item.playing {
  background: rgba(29, 185, 84, 0.1);
}

.extra-small {
  font-size: 0.7rem;
}

.play-btn-wrapper {
  font-size: 1.8rem;
  color: #1DB954;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}

.play-btn-wrapper:active {
  transform: scale(0.9);
}

.play-indicator {
  display: none;
  /* Removed from image */
}

.votar-btn-mini {
  font-size: 0.75rem !important;
  font-weight: 700 !important;
  transition: all 0.2s;
}

.votar-btn-mini:not(:disabled):active {
  transform: scale(0.95);
}

.ranking-item {
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid transparent;
}

.ranking-item.playing {
  background: rgba(29, 185, 84, 0.08);
  border-color: rgba(29, 185, 84, 0.2);
}

.quota-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #333;
  transition: all 0.4s ease;
}

.quota-dot.active {
  background: #1DB954;
  box-shadow: 0 0 10px rgba(29, 185, 84, 0.5);
}

.rank-num {
  font-family: var(--modern-font);
  font-weight: 800;
  font-size: 1.1rem;
  color: var(--primary-color);
  opacity: 0.5;
  min-width: 24px;
}

.live-indicator {
  font-size: 0.7rem;
  font-weight: 700;
  color: #ef4444;
  display: flex;
  align-items: center;
  gap: 5px;
}

.live-indicator .dot {
  width: 6px;
  height: 6px;
  background: #ef4444;
  border-radius: 50%;
  animation: blink 1s infinite;
}

@keyframes blink {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.3;
  }

  100% {
    opacity: 1;
  }
}

.pointer {
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

/* Custom Scrollbar */
.search-results-overlay::-webkit-scrollbar {
  width: 6px;
}

.search-results-overlay::-webkit-scrollbar-thumb {
  background: #444;
  border-radius: 10px;
}

@media (max-width: 768px) {

  .music-card,
  .ranking-card {
    padding: 1.5rem !important;
  }

  .votar-btn-mini span {
    display: none;
  }

  .votar-btn-mini {
    padding: 0.5rem !important;
  }
}
</style>
