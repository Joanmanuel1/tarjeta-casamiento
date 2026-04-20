<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import gsap from 'gsap'
import confetti from 'canvas-confetti'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import { auth } from '../firebase/config'
import { searchTracks } from '../services/musicSearchService'
import { addOrVoteSong, listenToTopSongs, getUserVotes } from '../services/musicService'

const searchQuery   = ref('')
const searchResults = ref([])
const topSongs      = ref([])
const userVotes     = ref([])
const isSearching   = ref(false)
const isVoting      = ref(false)
const unsubscribe   = ref(null)
const currentPlaying = ref(null)

const audio = new Audio()

const popularSuggestions = [
  { id: '1695210251', name: 'La Morocha',  artist: 'Luck Ra & BM',  image: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/86/9b/cd/869bcda4-b00b-d03d-cfd5-3da458924acc/196871259309.jpg/300x300bb.jpg', preview: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/ca/31/39/ca313924-625a-84e2-9698-c90fd726755c/mzaf_9300804319953101433.plus.aac.p.m4a' },
  { id: '1481250833', name: 'Hola Mi Amor', artist: 'Andy Erazo',   image: 'https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/02/8b/4d/028b4d84-9f43-7567-e951-ac2ea8211ff5/artwork.jpg/300x300bb.jpg',    preview: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview123/v4/a5/3a/2d/a53a2def-e840-95f5-3f18-6168f0af84d6/mzaf_622439657094906801.plus.aac.p.m4a' },
  { id: '1805898711', name: 'Inocente',    artist: 'La Delio Valdez', image: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/42/60/36/42603647-52fb-d398-4b58-8746cdae52ee/cover.jpg/300x300bb.jpg',    preview: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/a3/7b/31/a37b31f0-e3c9-ed01-e013-573f7a1e3895/mzaf_505785615841328097.plus.aac.p.m4a' },
  { id: '844221956',  name: 'Mentirosa',   artist: 'Ráfaga',         image: 'https://is1-ssl.mzstatic.com/image/thumb/Music4/v4/a6/3b/9d/a63b9d36-4686-6717-341a-71aaa5581ba3/0605457535428.jpg/300x300bb.jpg', preview: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/ca/c7/e4/cac7e410-00ff-bce3-cd62-bb24ddd2bb13/mzaf_11411235403191366139.plus.aac.p.m4a' },
]

const togglePreview = (song) => {
  if (!song.preview) return
  if (currentPlaying.value === song.id) { audio.pause(); currentPlaying.value = null }
  else { audio.src = song.preview; audio.play(); currentPlaying.value = song.id }
}
audio.onended = () => { currentPlaying.value = null }

let searchTimeout = null
watch(searchQuery, (q) => {
  if (searchTimeout) clearTimeout(searchTimeout)
  if (q.length < 3) { searchResults.value = []; return }
  isSearching.value = true
  searchTimeout = setTimeout(async () => {
    searchResults.value = await searchTracks(q)
    isSearching.value = false
    nextTick(() => {
      gsap.from('.music-result', { opacity: 0, x: -10, stagger: 0.08, duration: 0.3 })
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
    if (!userVotes.value.includes(song.id)) userVotes.value.push(song.id)
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#a8a29e','#d4a373','#fdfbf7'] })
    searchQuery.value = ''
    searchResults.value = []
  } catch (e) { console.error(e) }
  finally { isVoting.value = false }
}

onMounted(async () => {
  auth.onAuthStateChanged(async (user) => {
    if (user) userVotes.value = await getUserVotes(user.uid)
  })
  unsubscribe.value = listenToTopSongs(songs => { topSongs.value = songs })
})
onUnmounted(() => { if (unsubscribe.value) unsubscribe.value(); audio.pause() })
</script>

<template>
  <section class="music-section py-5">
    <div class="container-fluid px-3 px-md-4">

      <div class="text-center mb-4 mb-md-5 section-reveal">
        <span class="section-tag">Ambiente</span>
        <h2 class="GreatVibes display-4">La Música que nos une</h2>
        <p class="music-subtitle mx-auto">
          Ayudanos a armar la playlist de la fiesta.<br>
          ¡Podés sugerir hasta 3 canciones!
        </p>
      </div>

      <div class="music-grid">

        <!-- ── Panel búsqueda ─────────────────────────────── -->
        <div class="music-panel">
          <!-- Search bar -->
          <div class="music-search-bar mb-3">
            <i class="pi pi-search search-icon"></i>
            <InputText
              v-model="searchQuery"
              placeholder="Buscá artistas o canciones…"
              class="music-input"
              :disabled="userVotes.length >= 3"
            />
            <div v-if="isSearching" class="spinner-border spinner-border-sm text-primary search-spinner" role="status"></div>
          </div>

          <!-- Quota dots -->
          <div class="quota-row mb-4">
            <div class="quota-dots">
              <div v-for="i in 3" :key="i" class="quota-dot" :class="{ active: userVotes.length >= i }"></div>
            </div>
            <span class="quota-text">{{ 3 - userVotes.length }} votos restantes</span>
          </div>

          <!-- Sugerencias populares -->
          <div v-if="!searchQuery">
            <p class="panel-label mb-2">Sugerencias populares</p>
            <div class="suggestions-list">
              <div
                v-for="s in popularSuggestions" :key="s.id"
                class="suggestion-row"
                @click="handleVote(s)"
              >
                <div class="suggestion-thumb-wrap" @click.stop="togglePreview(s)">
                  <img :src="s.image" :alt="s.name" class="suggestion-thumb" />
                  <div v-if="s.preview" class="thumb-play">
                    <i class="pi" :class="currentPlaying === s.id ? 'pi-pause' : 'pi-play'"></i>
                  </div>
                </div>
                <div class="suggestion-info">
                  <p class="suggestion-name">{{ s.name }}</p>
                  <p class="suggestion-artist">{{ s.artist }}</p>
                </div>
                <i class="pi pi-plus-circle suggestion-add"></i>
              </div>
            </div>
          </div>

          <!-- Resultados de búsqueda -->
          <div v-if="searchResults.length" class="results-list custom-scroll">
            <div
              v-for="track in searchResults" :key="track.id"
              class="music-result"
            >
              <div class="result-thumb-wrap" @click="togglePreview(track)">
                <img :src="track.image" :alt="track.name" class="result-thumb" />
                <div v-if="track.preview" class="thumb-play">
                  <i class="pi" :class="currentPlaying === track.id ? 'pi-pause' : 'pi-play'"></i>
                </div>
              </div>
              <div class="result-info" @click="togglePreview(track)">
                <p class="result-name">{{ track.name }}</p>
                <p class="result-artist">{{ track.artist }}</p>
              </div>
              <button
                class="result-vote-btn"
                @click.stop="handleVote(track)"
                :disabled="userVotes.includes(track.id) || userVotes.length >= 3"
              >
                <i class="pi pi-plus"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- ── Ranking ─────────────────────────────────────── -->
        <div class="music-panel">
          <div class="ranking-header mb-4">
            <h4 class="ranking-title">Top canciones votadas</h4>
            <div class="live-badge">LIVE</div>
          </div>

          <!-- Skeleton -->
          <div v-if="!topSongs.length">
            <div v-for="i in 5" :key="i" class="sk-row d-flex align-items-center gap-3 mb-3 p-3 rounded-4">
              <div class="sk-num"></div>
              <div class="sk-thumb-sq"></div>
              <div class="flex-grow-1">
                <div class="sk-bar sk-bar-title mb-2"></div>
                <div class="sk-bar sk-bar-artist"></div>
              </div>
              <div class="sk-votes"></div>
            </div>
          </div>

          <transition-group name="list" tag="div">
            <div
              v-for="(song, idx) in topSongs" :key="song.id"
              class="ranking-row"
              @click="togglePreview(song)"
            >
              <span class="ranking-num">{{ idx + 1 }}</span>
              <div class="ranking-thumb-wrap">
                <img :src="song.image" :alt="song.name" class="ranking-thumb" />
                <div v-if="song.preview" class="thumb-play" :class="{ 'thumb-play--active': currentPlaying === song.id }">
                  <i class="pi" :class="currentPlaying === song.id ? 'pi-pause' : 'pi-play'"></i>
                </div>
              </div>
              <div class="ranking-info">
                <p class="ranking-name">{{ song.name }}</p>
                <p class="ranking-artist">
                  {{ song.artist }}
                  <i v-if="song.votes > 5" class="pi pi-bolt text-warning ms-1" style="font-size:.7rem"></i>
                </p>
              </div>
              <div class="ranking-votes">
                <span class="votes-num">{{ song.votes }}</span>
                <span class="votes-label">VOTOS</span>
              </div>
              <div v-if="song.votes > 5" class="trending-badge" aria-hidden="true">
                <i class="pi pi-fire"></i>
              </div>
            </div>
          </transition-group>
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
.music-section { background: var(--bg-light); }

.music-subtitle {
  font-size: 0.9rem; color: var(--text-muted);
  max-width: 420px; line-height: 1.7;
}

/* ── Grid ─────────────────────────────────── */
.music-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
  max-width: 1100px;
  margin: 0 auto;
  width: 100%;
}
@media (min-width: 992px) {
  .music-grid { grid-template-columns: 1fr 1fr; }
}

/* ── Panel base ───────────────────────────── */
.music-panel {
  background: white;
  border-radius: 1.5rem;
  padding: 1.25rem;
  box-shadow: 0 15px 40px rgba(0,0,0,0.05);
  border: 1px solid rgba(0,0,0,0.03);
  min-width: 0;
  width: 100%;
}
@media (min-width: 768px) {
  .music-panel { padding: 1.75rem; border-radius: 2rem; }
}

/* ── Search bar ───────────────────────────── */
.music-search-bar {
  position: relative;
  display: flex; align-items: center;
}
.search-icon {
  position: absolute; left: 1.1rem;
  color: var(--primary-color); font-size: 0.9rem; z-index: 1;
}
.music-input {
  width: 100% !important;
  background: var(--bg-cream) !important;
  border: 1.5px solid rgba(212,163,115,0.2) !important;
  border-radius: 2rem !important;
  padding: 0.75rem 1rem 0.75rem 2.75rem !important;
  font-size: 16px !important;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.music-input:focus {
  border-color: var(--primary-color) !important;
  box-shadow: 0 0 0 3px rgba(212,163,115,0.12) !important;
}
.search-spinner {
  position: absolute; right: 1rem;
  color: var(--primary-color) !important;
}

/* Quota */
.quota-row { display: flex; align-items: center; gap: 0.6rem; }
.quota-dots { display: flex; gap: 5px; }
.quota-dot {
  width: 9px; height: 9px;
  border-radius: 50%;
  background: #e8e8e8;
  transition: all 0.3s ease;
}
.quota-dot.active { background: var(--primary-color); box-shadow: 0 0 6px rgba(212,163,115,0.5); }
.quota-text { font-size: 0.78rem; font-weight: 600; color: var(--text-muted); }

/* Label de panel */
.panel-label {
  font-size: 0.68rem; font-weight: 800;
  text-transform: uppercase; letter-spacing: 0.15em;
  color: var(--text-muted);
}

/* ── Sugerencias ──────────────────────────── */
.suggestions-list { display: flex; flex-direction: column; gap: 0.5rem; }
.suggestion-row {
  display: flex; align-items: center; gap: 0.85rem;
  padding: 0.6rem 0.75rem;
  border-radius: 1.25rem;
  background: var(--bg-cream);
  border: 1px solid rgba(0,0,0,0.03);
  cursor: pointer;
  transition: all 0.25s var(--transition-bounce);
}
.suggestion-row:hover { background: var(--secondary-color); border-color: rgba(212,163,115,0.25); }
.suggestion-row:active { transform: scale(0.97); }

.suggestion-thumb-wrap { position: relative; flex-shrink: 0; }
.suggestion-thumb { width: 38px; height: 38px; border-radius: 50%; object-fit: cover; }
.thumb-play {
  position: absolute; inset: 0;
  background: rgba(0,0,0,0.4);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: white; font-size: 0.6rem;
  opacity: 0; transition: opacity 0.2s;
}
.suggestion-thumb-wrap:hover .thumb-play,
.result-thumb-wrap:hover .thumb-play { opacity: 1; }
.thumb-play--active { opacity: 1 !important; }

/* touch: siempre visible */
@media (pointer: coarse) {
  .thumb-play { opacity: 1; background: rgba(0,0,0,0.35); }
}

.suggestion-info { flex: 1; min-width: 0; }
.suggestion-name  { font-size: 0.82rem; font-weight: 700; color: var(--text-dark); margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.suggestion-artist { font-size: 0.72rem; color: var(--text-muted); margin: 0; }
.suggestion-add { color: var(--primary-color); opacity: 0.6; font-size: 1.1rem; flex-shrink: 0; }

/* ── Resultados de búsqueda ───────────────── */
.results-list { max-height: 280px; overflow-y: auto; display: flex; flex-direction: column; gap: 0.4rem; }
.music-result {
  display: flex; align-items: center; gap: 0.85rem;
  padding: 0.65rem 0.75rem;
  border-radius: 1.25rem;
  transition: background 0.2s;
}
.music-result:hover { background: var(--bg-cream); }

.result-thumb-wrap { position: relative; flex-shrink: 0; cursor: pointer; }
.result-thumb { width: 46px; height: 46px; border-radius: 0.75rem; object-fit: cover; }
.result-info { flex: 1; min-width: 0; cursor: pointer; }
.result-name   { font-size: 0.85rem; font-weight: 700; color: var(--text-dark); margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.result-artist { font-size: 0.72rem; color: var(--text-muted); margin: 0; }
.result-vote-btn {
  width: 36px; height: 36px;
  border-radius: 50%; border: none;
  background: var(--secondary-color); color: var(--primary-dark);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; flex-shrink: 0;
  transition: all 0.25s var(--transition-bounce);
}
.result-vote-btn:hover { background: var(--primary-color); color: white; transform: scale(1.1); }
.result-vote-btn:disabled { opacity: 0.35; cursor: default; transform: none; }

/* ── Ranking ─────────────────────────────── */
.ranking-header { display: flex; align-items: center; justify-content: space-between; }
.ranking-title { font-size: 1rem; font-weight: 700; color: var(--text-dark); margin: 0; }
.live-badge {
  background: #fee2e2; color: #ef4444;
  font-size: 0.62rem; font-weight: 800;
  padding: 3px 9px; border-radius: 2rem;
  animation: livePulse 2s infinite;
}
@keyframes livePulse {
  0%,100% { transform: scale(1); opacity: 1; }
  50%      { transform: scale(1.05); opacity: 0.75; }
}

.ranking-row {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.65rem 0.5rem;
  border-radius: 1.25rem;
  cursor: pointer;
  position: relative;
  transition: background 0.2s;
  margin-bottom: 0.35rem;
}
.ranking-row:hover { background: var(--bg-cream); }
.ranking-row:active { transform: scale(0.98); }

.ranking-num { font-size: 1rem; font-weight: 800; color: var(--primary-color); opacity: 0.35; min-width: 20px; }
.ranking-thumb-wrap { position: relative; flex-shrink: 0; }
.ranking-thumb { width: 48px; height: 48px; border-radius: 0.75rem; object-fit: cover; }
.ranking-info { flex: 1; min-width: 0; }
.ranking-name   { font-size: 0.85rem; font-weight: 700; color: var(--text-dark); margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ranking-artist { font-size: 0.72rem; color: var(--text-muted); margin: 0; }
.ranking-votes { text-align: right; flex-shrink: 0; }
.votes-num   { display: block; font-size: 1.1rem; font-weight: 800; color: var(--primary-color); line-height: 1; }
.votes-label { font-size: 0.55rem; font-weight: 700; letter-spacing: 0.1em; color: var(--text-muted); }

.trending-badge {
  position: absolute; top: -4px; right: -4px;
  color: #fbbf24; font-size: 0.9rem; opacity: 0.7;
  transform: rotate(15deg);
}

/* ── List transition ─────────────────────── */
.list-move { transition: transform 0.5s ease; }
.list-enter-active { transition: all 0.3s ease; }
.list-leave-active { transition: all 0.2s ease; }
.list-enter-from { opacity: 0; transform: translateX(-15px); }
.list-leave-to   { opacity: 0; transform: translateX(15px); }

/* ── Skeleton ────────────────────────────── */
@keyframes shimmer {
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}
.sk-num, .sk-thumb-sq, .sk-bar, .sk-votes {
  background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
  background-size: 800px 100%;
  animation: shimmer 1.4s ease-in-out infinite;
  border-radius: 6px;
}
.sk-num       { width: 20px; height: 20px; border-radius: 50%; }
.sk-thumb-sq  { width: 48px; height: 48px; border-radius: 10px; flex-shrink: 0; }
.sk-bar-title  { height: 13px; width: 65%; }
.sk-bar-artist { height: 10px; width: 40%; }
.sk-votes     { width: 36px; height: 36px; border-radius: 8px; flex-shrink: 0; }

/* ── Custom scroll ───────────────────────── */
.custom-scroll::-webkit-scrollbar { width: 4px; }
.custom-scroll::-webkit-scrollbar-thumb { background: var(--primary-color); border-radius: 10px; }
</style>
