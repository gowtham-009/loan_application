<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const logout = () => {
  // Remove token from localStorage
  localStorage.removeItem('token');
  
  // Redirect to login page
  router.push('/login');
};
</script>

<template>
  <button @click="logout">Logout</button>
</template>
