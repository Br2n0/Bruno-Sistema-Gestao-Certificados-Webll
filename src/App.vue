<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavSideBar from './layout/NavSideBar.vue'
import HeadBar from './layout/HeadBar.vue'
import FooterBar from './layout/FooterBar.vue'
import BreadCrumb from './layout/breadcrumb.vue'
</script>

<template>
  <NavSideBar />
  <HeadBar />

  <div class="pc-container">
    <div class="pc-content">

      <BreadCrumb />

      <RouterView />

    </div>
  </div>


  <FooterBar />

</template>

<style scoped>

</style>
