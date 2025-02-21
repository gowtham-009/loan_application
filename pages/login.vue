<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router'; 
import logo from '~/components/logo.vue';

const isAuthenticated = ref(false)

onBeforeMount(() => {
  const token = localStorage.getItem('token')
  
  if (token) {
   
    router.replace('/dashboard')
  } else {
    
    isAuthenticated.value = true
  }
})

const deviceHeight = ref(0);
const boxex1Height = ref(0);
const boxex2Height = ref(0);
const showPassword = ref(false);
const isValid = ref(false);
const userId = ref('');
const password = ref('');
const loading = ref(false);
const error = ref(null);
const usernot_found = ref('');
const incorrect_password = ref('');
const router = useRouter();

// Validation rules
const userIdRules = computed(() => [
  v => !!v || 'User ID is required',
  v => (v && v.toString().length === 4) || 'User ID must be 4 digits',
]);

const passwordRules = computed(() => [
  v => !!v || 'Password is required',
  v => (v && v.length <= 10) || 'Password must be at most 10 characters long.',
]);

// Limit password length to 10 characters
const limitPasswordLength = (event) => {
  const inputValue = event.target.value;
  password.value = inputValue.slice(0, 10);
};

// Update screen height/width
const updateDeviceDimensions = () => {
  deviceHeight.value = window.innerHeight;
  boxex1Height.value = Math.floor(deviceHeight.value * 0.20); // 20% of device height
  boxex2Height.value = Math.floor(deviceHeight.value * 0.80); // 80% of device height
};

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

// Handle form submission
const handleSubmit = async () => {
  loading.value = true;
  error.value = null;
  usernot_found.value = ''; // Reset error messages
  incorrect_password.value = '';

  const apiurl = 'http://vaanam.w3webtechnologies.co.in/loandb/index.php';
  const formData = new FormData();
  formData.append('username', userId.value);
  formData.append('password', password.value);

  try {
    const response = await fetch(apiurl, {
      method: 'POST',
      body: formData
    });

    // Check for non-200 HTTP statuses
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to login. Please check your credentials.');
    }

    const data = await response.json();

    // Update error messages based on response
    if (data.status_code === 101) {
      usernot_found.value = 'User name not found';
    } else if (data.status_code === 102) {
      incorrect_password.value = 'Password incorrect';
    } else if (data.status_code === 103) {
      localStorage.setItem('token', data.token);
      router.push('/dashboard');
    }
  } catch (err) {
    error.value = err.message || 'An error occurred during login';
  } finally {
    loading.value = false;
  }
};

// Setup event listeners for device dimension changes
onMounted(() => {
  updateDeviceDimensions(); // Initial call to set dimensions on component mount
  window.addEventListener('resize', updateDeviceDimensions); // Listen for window resize events
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateDeviceDimensions); // Clean up: remove resize event listener
});
</script>

<template>
  <div  v-if="isAuthenticated" class="main-container w-100" :style="{ height: deviceHeight + 'px' }">
    <!-- Logo Container -->
    <div class="w-100 boxex-1 bg-grey-lighten-4 rounded-xl d-flex justify-center align-center" :style="{ height: boxex1Height + 'px' }">
      <logo />
    </div>

    <!-- Form Container -->
    <div class="w-100 boxex-2 pa-2 d-flex justify-center" :style="{ height: boxex2Height + 'px' }">
      <v-form ref="form" class="w-100 d-flex justify-center" v-model="isValid" @submit.prevent="handleSubmit">
        <v-container class="w-100 d-flex justify-center">
          <v-row class="d-flex flex-column justify-space-between">
            <div class="w-100">
              <!-- User ID Input -->
              <v-col cols="12">
                <v-text-field
                  label="User ID"
                  type="number"
                  v-model="userId"
                  hide-details
                  :rules="userIdRules"
                  required
                ></v-text-field>
                <p style="color: red;">{{ usernot_found }}</p>
              </v-col>

              <!-- Password Input -->
              <v-col cols="12">
                <v-text-field
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  hint="Enter your password to access this website"
                  label="Password"
                  :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append="togglePasswordVisibility"
                  :rules="passwordRules"
                  @input="limitPasswordLength"
                  required
                ></v-text-field>
                <p style="color: red;">{{ incorrect_password }}</p>
              </v-col>

              <!-- Reset Password Link -->
              <v-col cols="12" class="d-flex justify-center">
                <nuxt-link to="/" class="text-center" style="text-decoration: none;">Reset your Password</nuxt-link>
              </v-col>
            </div>

            <!-- Submit Button -->
            <div class="w-100">
              <v-col cols="12">
                <v-btn block type="submit" size="large" class="bg-indigo text-white text-h5 rounded-xl" :disabled="loading">{{ loading ? 'Logging in...' : 'Login' }}</v-btn>
              </v-col>
            </div>
          </v-row>
        </v-container>
      </v-form>
    </div>

    <!-- Error Message Display -->
    <p v-if="error" style="color:red">{{ error }}</p>
  </div>
</template>

<style scoped>
/* Add any required CSS */
</style>
