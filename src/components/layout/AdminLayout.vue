<template>
  <div class="admin-layout">
    <!-- Header da página admin -->
    <div class="admin-header">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <h4 class="mb-1">{{ pageTitle }}</h4>
          <p class="text-muted mb-0">{{ pageDescription }}</p>
        </div>
        <div class="admin-actions">
          <slot name="actions"></slot>
        </div>
      </div>
    </div>

    <!-- Conteúdo principal -->
    <div class="admin-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  pageTitle: string
  pageDescription?: string
}

defineProps<Props>()
</script>

<style scoped>
.admin-layout {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.admin-header {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
  border: 1px solid #e9ecef;
}

.admin-content {
  min-height: 600px;
}

.admin-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

@media (max-width: 768px) {
  .admin-layout {
    padding: 15px;
  }
  
  .admin-header {
    padding: 20px;
    margin-bottom: 20px;
  }
  
  .admin-header .d-flex {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start !important;
  }
  
  .admin-actions {
    width: 100%;
    justify-content: flex-start;
  }
}
</style> 