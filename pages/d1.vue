

<template>
  <!-- Render content only if authenticated -->
  <div v-if="isAuthenticated">
    <p>Page content goes here</p>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router'
import { ref, onBeforeMount } from 'vue'

const router = useRouter()
const isAuthenticated = ref(false)

onBeforeMount(() => {
  const token = localStorage.getItem('token')
  
  if (!token) {
   
    router.replace('/login')
  } else {
    
    isAuthenticated.value = true
  }
})
</script>

<style scoped>
/* Optional styling */
</style>
