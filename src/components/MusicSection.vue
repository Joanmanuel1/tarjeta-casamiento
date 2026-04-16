<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import gsap from 'gsap'
import confetti from 'canvas-confetti'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
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
const currentPlaying = ref(null)

const audio = new Audio()
const popularSuggestions = [
  { id: '1695210251', name: 'La Morocha', artist: 'Luck Ra & BM', image: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/86/9b/cd/869bcda4-b00b-d03d-cfd5-3da458924acc/196871259309.jpg/300x300bb.jpg', preview: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/ca/31/39/ca313924-625a-84e2-9698-c90fd726755c/mzaf_9300804319953101433.plus.aac.p.m4a' },
  { id: '1481250833', name: 'Hola Mi Amor', artist: 'Andy Erazo', image: 'https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/02/8b/4d/028b4d84-9f43-7567-e951-ac2ea8211ff5/artwork.jpg/300x300bb.jpg', preview: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview123/v4/a5/3a/2d/a53a2def-e840-95f5-3f18-6168f0af84d6/mzaf_622439657094906801.plus.aac.p.m4a' },
  { id: '1805898711', name: 'Inocente', artist: 'La Delio Valdez', image: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/42/60/36/42603647-52fb-d398-4b58-8746cdae52ee/cover.jpg/300x300bb.jpg', preview: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/a3/7b/31/a37b31f0-e3c9-ed01-e013-573f7a1e3895/mzaf_505785615841328097.plus.aac.p.m4a' },
  { id: '844221956', name: 'Mentirosa', artist: 'Ráfaga', image: 'https://is1-ssl.mzstatic.com/image/thumb/Music4/v4/a6/3b/9d/a63b9d36-4686-6717-341a-71aaa5581ba3/0605457535428.jpg/300x300bb.jpg', preview: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/ca/c7/e4/cac7e410-00ff-bce3-cd62-bb24ddd2bb13/mzaf_11411235403191366139.plus.aac.p.m4a' }
]

const togglePreview = (song) => {
  if (!song.preview) return
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
    nextTick(() => {
      gsap.from('.music-search-result', { opacity: 0, x: -10, stagger: 0.1, duration: 0.4 })
    })
  }, 400)
})

const handleVote = async (song) => {
  if (isVoting.value || userVotes.value.length >= 3) return
  const uid = auth.currentUser?.uid
  if (!uid) return

  isVoting.value = true
  try {
    await addOrVoteSong(song, uid)
    if (!userVotes.value.includes(song.id)) {
      userVotes.value.push(song.id)
    }

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#a8a29e', '#d4a373', '#fdfbf7']
    })
    searchQuery.value = ''
    searchResults.value = []
  } catch (error) {
    console.error('Error voting:', error)
  } finally {
    isVoting.value = false
  }
}

onMounted(async () => {
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      userVotes.value = await getUserVotes(user.uid)
    }
  })
  unsubscribe.value = listenToTopSongs((songs) => {
    topSongs.value = songs
  })
})

onUnmounted(() => {
  if (unsubscribe.value) unsubscribe.value()
  audio.pause()
})
</script>

<template>
  <section class="music-section py-5 bg-music">
    <div class="container-fluid maxWidth-md">
      <div class="text-center mb-5 section-reveal">
        <span class="section-tag mb-2">Ambiente</span>
        <h2 class="GreatVibes display-4 mb-3">La Música que nos une</h2>
        <p class="text-muted small mx-auto" style="max-width: 450px;">
          Ayudanos a armar la playlist de la fiesta. <br>
          ¡Podés sugerir hasta 3 canciones!
        </p>
      </div>

      <div class="row g-4 justify-content-center">
        <!-- 1. Search & Suggestions -->
        <div class="col-lg-7">
          <div class="music-card-premium p-4 p-md-5 rounded-5 shadow-sm bg-white border-light">
            <div class="search-experience mb-4">
              <div class="search-input-wrapper mb-3 position-relative">
                <i class="pi pi-search search-icon"></i>
                <InputText v-model="searchQuery" placeholder="Buscá artistas o canciones..."
                  class="w-100 premium-input py-3 rounded-pill px-5" :disabled="userVotes.length >= 3" />
                <div v-if="isSearching" class="spinner-border spinner-border-sm text-primary search-spinner"
                  role="status"></div>
              </div>

              <div class="votos-info d-flex align-items-center gap-3 ps-2">
                <div class="quota-dots d-flex gap-1">
                  <div v-for="i in 3" :key="i" class="dot" :class="{ 'active': userVotes.length >= i }"></div>
                </div>
                <span class="small fw-bold text-muted">{{ 3 - userVotes.length }} votos restantes</span>
              </div>
            </div>

            <!-- Pre-defined Suggestions -->
            <div v-if="!searchQuery" class="suggestions-area mb-4">
              <h6 class="small fw-bold text-muted text-uppercase tracking-widest mb-3">Sugerencias Populares</h6>
              <div class="suggestions-grid">
                <div v-for="s in popularSuggestions" :key="s.id"
                  class="suggestion-chip d-flex align-items-center p-2 rounded-pill mb-2 border hover-lift"
                  @click="handleVote(s)">
                  <div class="position-relative me-3" @click.stop="togglePreview(s)">
                    <img :src="s.image" class="rounded-circle" style="width: 32px; height: 32px; object-fit: cover;">
                    <div v-if="s.preview" class="play-overlay-pill">
                      <i class="pi" :class="currentPlaying === s.id ? 'pi-pause' : 'pi-play'"
                        style="font-size: 0.6rem;"></i>
                    </div>
                  </div>
                  <div class="flex-grow-1 overflow-hidden pe-3">
                    <p class="mb-0 fw-bold extra-small text-truncate">{{ s.name }}</p>
                  </div>
                  <i class="pi pi-plus-circle text-primary opacity-75 pe-2"></i>
                </div>
              </div>
            </div>

            <!-- Search Results -->
            <div v-if="searchResults.length > 0" class="search-results-list custom-scroll">
              <div v-for="track in searchResults" :key="track.id"
                class="music-search-result d-flex align-items-center p-3 mb-2 rounded-4 hover-highlight">
                <div class="position-relative me-3" @click="togglePreview(track)">
                  <img :src="track.image" class="rounded-3" style="width: 48px; height: 48px;">
                  <div v-if="track.preview" class="play-overlay">
                    <i class="pi" :class="currentPlaying === track.id ? 'pi-pause' : 'pi-play'"></i>
                  </div>
                </div>
                <div class="flex-grow-1 overflow-hidden" @click="togglePreview(track)">
                  <h6 class="mb-0 fw-bold text-truncate">{{ track.name }}</h6>
                  <p class="mb-0 text-muted extra-small">{{ track.artist }}</p>
                </div>
                <Button icon="pi pi-plus" class="p-button-rounded p-button-text p-button-primary"
                  @click.stop="handleVote(track)" :disabled="userVotes.includes(track.id) || userVotes.length >= 3" />
              </div>
            </div>
          </div>
        </div>

        <!-- 2. Ranking View -->
        <div class="col-lg-5">
          <div class="ranking-card-premium p-4 p-md-5 rounded-5 shadow-sm bg-white border-light h-100">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h4 class="fw-bold mb-0">Top de canciones mas votadas</h4>
              <div class="live-pill">LIVE</div>
            </div>

            <!-- Skeleton: mientras no llegaron canciones de Firestore -->
            <div v-if="topSongs.length === 0" class="ranking-skeleton">
              <div v-for="i in 5" :key="i" class="sk-song-row d-flex align-items-center gap-3 p-3 mb-3 rounded-4">
                <div class="sk-rank-badge"></div>
                <div class="sk-thumb"></div>
                <div class="flex-grow-1">
                  <div class="sk-bar sk-bar--title mb-2"></div>
                  <div class="sk-bar sk-bar--artist"></div>
                </div>
                <div class="sk-votes"></div>
              </div>
            </div>

            <div class="ranking-list">
              <transition-group name="list">
                <div v-for="(song, idx) in topSongs" :key="song.id"
                  class="ranking-item d-flex align-items-center p-3 rounded-4 mb-3 border-light shadow-xs position-relative overflow-hidden"
                  @click="togglePreview(song)">
                  <div class="rank-badge me-3">{{ idx + 1 }}</div>
                  <div v-if="song.preview" class="play-overlay-static" :class="{ 'active': currentPlaying === song.id }"
                    style="background-color: bisque; color: white; border-radius: 25px; margin-right: 5px;">
                    <i class="pi" :class="currentPlaying === song.id ? 'pi-pause' : 'pi-play'"></i>
                  </div>

                  <div class="position-relative me-3 overflow-hidden rounded-3">
                    <img :src="song.image" style="width: 50px; height: 50px; object-fit: cover;">
                  </div>
                  <div class="flex-grow-1 overflow-hidden">
                    <h6 class="mb-0 fw-bold text-truncate">{{ song.name }}</h6>
                    <p class="mb-0 text-muted extra-small d-flex align-items-center gap-1">
                      {{ song.artist }}
                      <i v-if="song.votes > 5" class="pi pi-bolt text-warning fs-small" title="Trending!"></i>
                    </p>
                  </div>

                  <div class="votos-count text-end">
                    <span class="d-block fw-bold fs-5 text-primary">{{ song.votes }}</span>
                    <span class="voto-label">VOTOS</span>
                  </div>

                  <div v-if="song.votes > 5" class="trending-fire">
                    <i class="pi pi-fire"></i>
                  </div>
                </div>
              </transition-group>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.music-section {
  background-color: var(--bg-music);
}

.maxWidth-md {
  max-width: 1600px;
}

.search-input-wrapper {
  background: #f8f9fa;
  border-radius: 50px;
}

.search-icon {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--primary-color);
  z-index: 1;
}

.premium-input {
  background: white !important;
  border: 1px solid rgba(0, 0, 0, 0.05) !important;
  transition: all 0.3s ease;
}

.premium-input:focus {
  border-color: var(--primary-color) !important;
  box-shadow: 0 10px 20px rgba(212, 163, 115, 0.1) !important;
}

.search-spinner {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  margin-top: -8px;
}

.dot {
  width: 8px;
  height: 8px;
  background: #eee;
  border-radius: 50%;
}

.dot.active {
  background: var(--primary-color);
  box-shadow: 0 0 8px var(--primary-color);
}

.suggestion-chip {
  cursor: pointer;
  background: #fdfbf7;
  transition: all 0.3s var(--transition-bounce);
}

.suggestion-chip:active {
  transform: scale(0.95);
}

.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border-radius: 8px;
  opacity: 0;
  transition: opacity 0.3s;
}

.music-search-result:hover .play-overlay {
  opacity: 1;
}

/* En touch siempre visible */
@media (pointer: coarse) {
  .play-overlay {
    opacity: 1;
    background: rgba(0, 0, 0, 0.3);
  }
}

.play-overlay-pill {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s;
}

.suggestion-chip:hover .play-overlay-pill {
  opacity: 1;
}

/* En touch siempre visible */
@media (pointer: coarse) {
  .play-overlay-pill {
    opacity: 1;
    background: rgba(0, 0, 0, 0.3);
  }
}

.live-pill {
  background: #fee2e2;
  color: #ef4444;
  font-size: 0.65rem;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 20px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }

  50% {
    transform: scale(1.05);
    opacity: 0.7;
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.rank-badge {
  font-weight: 800;
  color: var(--primary-color);
  opacity: 0.4;
  font-size: 1.2rem;
  min-width: 25px;
}

.voto-label {
  font-size: 0.55rem;
  letter-spacing: 1px;
  font-weight: 700;
  color: var(--text-muted);
}

.trending-fire {
  position: absolute;
  top: -5px;
  right: -5px;
  color: #fbbf24;
  font-size: 1.2rem;
  transform: rotate(15deg);
  opacity: 0.6;
}

.extra-small {
  font-size: 0.75rem;
}

.fs-small {
  font-size: 0.85rem;
}

@media (max-width: 768px) {
  .music-section {
    padding: 3rem 0.75rem;
  }

  .music-card-premium,
  .ranking-card-premium {
    padding: 1.25rem !important;
    border-radius: 1.25rem !important;
  }

  /* Touch targets más grandes para resultados */
  .music-search-result {
    padding: 0.85rem 0.75rem !important;
    min-height: 64px;
  }

  .suggestion-chip {
    min-height: 52px;
    padding: 0.5rem 0.75rem !important;
  }

  /* Ranking items más espaciados */
  .ranking-item {
    padding: 0.85rem 0.75rem !important;
    min-height: 64px;
  }

  /* Input más grande para teclado mobile */
  .premium-input {
    font-size: 16px !important;
    padding-top: 0.85rem !important;
    padding-bottom: 0.85rem !important;
  }

  /* Votos dots más grandes */
  .dot {
    width: 10px;
    height: 10px;
  }
}

/* ── Skeleton ranking ───────────────────────── */
@keyframes sk-shimmer {
  0%   { background-position: -400px 0 }
  100% { background-position: 400px 0 }
}

.sk-song-row {
  background: #fafafa;
  border: 1px solid #f0f0f0;
}

.sk-rank-badge,
.sk-thumb,
.sk-bar,
.sk-votes {
  background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
  background-size: 800px 100%;
  animation: sk-shimmer 1.4s ease-in-out infinite;
  border-radius: 6px;
}

.sk-rank-badge { width: 28px; height: 28px; min-width: 28px; border-radius: 50%; }
.sk-thumb      { width: 50px; height: 50px; min-width: 50px; border-radius: 10px; }
.sk-bar--title  { height: 13px; width: 70%; }
.sk-bar--artist { height: 10px; width: 45%; }
.sk-votes      { width: 36px; height: 36px; border-radius: 8px; }
</style>
