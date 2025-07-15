import { ref, nextTick, onUnmounted } from 'vue'
import { Modal, Toast, Dropdown } from 'bootstrap'

export function useBootstrap() {
  const activeModals = ref<Modal[]>([])
  const activeToasts = ref<Toast[]>([])
  const activeDropdowns = ref<Dropdown[]>([])

  // Função para criar e mostrar modal
  const showModal = async (element: HTMLElement | string | null): Promise<Modal | null> => {
    let targetElement: HTMLElement | null = null
    
    if (typeof element === 'string') {
      targetElement = document.getElementById(element)
    } else {
      targetElement = element
    }
    
    if (!targetElement) return null
    
    await nextTick()
    const modal = new Modal(targetElement)
    activeModals.value.push(modal)
    modal.show()
    
    // Limpar da lista quando o modal for fechado
    targetElement.addEventListener('hidden.bs.modal', () => {
      const index = activeModals.value.indexOf(modal)
      if (index > -1) {
        activeModals.value.splice(index, 1)
      }
    }, { once: true })
    
    return modal
  }

  // Função para fechar modal
  const hideModal = (modal: Modal | string | null) => {
    if (typeof modal === 'string') {
      const element = document.getElementById(modal)
      if (element) {
        const modalInstance = Modal.getInstance(element)
        if (modalInstance) {
          modalInstance.hide()
        }
      }
    } else if (modal) {
      modal.hide()
    }
  }

  // Função para mostrar toast
  const showToast = (element: HTMLElement | null, options?: any): Toast | null => {
    if (!element) return null
    
    const toast = new Toast(element, options)
    activeToasts.value.push(toast)
    toast.show()
    
    // Limpar da lista quando o toast for fechado
    element.addEventListener('hidden.bs.toast', () => {
      const index = activeToasts.value.indexOf(toast)
      if (index > -1) {
        activeToasts.value.splice(index, 1)
      }
    }, { once: true })
    
    return toast
  }

  // Função para inicializar dropdowns
  const initDropdowns = (container?: HTMLElement) => {
    const selector = container || document
    const dropdownElements = selector.querySelectorAll('[data-bs-toggle="dropdown"]')
    
    dropdownElements.forEach(element => {
      if (!Dropdown.getInstance(element)) {
        const dropdown = new Dropdown(element as HTMLElement)
        activeDropdowns.value.push(dropdown)
      }
    })
  }

  // Função para criar toast simples
  const createSimpleToast = (message: string, type: 'success' | 'error' | 'danger' = 'success', duration = 5000) => {
    // Criar elemento de toast dinamicamente
    const toastContainer = document.getElementById('toast-container') || createToastContainer()
    
    const toastElement = document.createElement('div')
    toastElement.className = `toast position-relative`
    toastElement.setAttribute('role', 'alert')
    const isError = type === 'error' || type === 'danger'
    toastElement.innerHTML = `
      <div class="toast-header ${type === 'success' ? 'bg-success text-white' : 'bg-danger text-white'}">
        <i class="${type === 'success' ? 'ti ti-check-circle' : 'ti ti-alert-circle'} me-2"></i>
        <strong class="me-auto">${type === 'success' ? 'Sucesso' : 'Erro'}</strong>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
      </div>
      <div class="toast-body">
        ${message}
      </div>
    `
    
    toastContainer.appendChild(toastElement)
    
    const toast = showToast(toastElement, { delay: duration })
    
    // Remover elemento após ser fechado
    toastElement.addEventListener('hidden.bs.toast', () => {
      toastElement.remove()
    }, { once: true })
    
    return toast
  }

  // Criar container de toasts se não existir
  const createToastContainer = () => {
    const container = document.createElement('div')
    container.id = 'toast-container'
    container.className = 'toast-container position-fixed top-0 end-0 p-3'
    container.style.zIndex = '1060'
    document.body.appendChild(container)
    return container
  }

  // Limpar todos os componentes Bootstrap ao desmontar
  onUnmounted(() => {
    activeModals.value.forEach(modal => modal.dispose())
    activeToasts.value.forEach(toast => toast.dispose())
    activeDropdowns.value.forEach(dropdown => dropdown.dispose())
  })

  return {
    showModal,
    hideModal,
    showToast,
    createSimpleToast,
    initDropdowns
  }
} 