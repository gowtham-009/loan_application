<template>
    <NuxtPage />
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  
  // Check if the current path is root and redirect to login
  if (process.client && router.currentRoute.value.path === '/') {
    router.push('/login')
  }
  </script>
