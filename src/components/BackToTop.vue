<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

const showButton = ref(false)
const btnRef = ref(null)

const handleScroll = () => {
  const shouldShow = window.scrollY > 500
  if (shouldShow !== showButton.value) {
    showButton.value = shouldShow
    if (shouldShow) {
      gsap.fromTo(btnRef.value, 
        { scale: 0, opacity: 0, y: 20 }, 
        { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.7)' }
      )
    }
  }
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <button 
    v-show="showButton"
    ref="btnRef"
    @click="scrollToTop" 
    class="back-to-top"
    aria-label="Volver arriba"
  >
    <i class="pi pi-chevron-up"></i>
  </button>
</template>

<style scoped>
.back-to-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(212, 163, 115, 0.8);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.back-to-top:hover {
  background: var(--primary-color);
  transform: translateY(-5px) scale(1.1) !important;
  box-shadow: 0 12px 40px rgba(212, 163, 115, 0.4);
}

.back-to-top i {
  font-size: 1.2rem;
  font-weight: bold;
}
</style>
