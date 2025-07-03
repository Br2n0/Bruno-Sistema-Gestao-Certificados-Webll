import { ref, computed, onMounted, onUnmounted } from 'vue'

// Estado da sidebar: false = expandida, true = minimizada/escondida
const isCollapsed = ref(false)
const isMobileMenuOpen = ref(false)

// Detecta se é mobile
const isMobile = ref(false)

const checkScreenSize = () => {
  if (typeof window !== 'undefined') {
    const mobile = window.innerWidth <= 991
    isMobile.value = mobile
    
    // No mobile, sempre fecha o menu quando muda de tamanho
    if (mobile) {
      isMobileMenuOpen.value = false
    }
  }
}

export function useSidebar() {
  const toggleSidebar = () => {
    if (isMobile.value) {
      // No mobile, controla a visibilidade do menu
      isMobileMenuOpen.value = !isMobileMenuOpen.value
    } else {
      // No desktop, controla o colapso
      isCollapsed.value = !isCollapsed.value
    }
  }

  // Listener para redimensionamento da tela
  const handleResize = () => {
    checkScreenSize()
  }

  onMounted(() => {
    checkScreenSize()
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize)
    }
  })

  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', handleResize)
    }
  })

  return {
    isCollapsed,
    isMobile,
    isMobileMenuOpen,
    toggleSidebar
  }
} 