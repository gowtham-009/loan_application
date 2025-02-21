<template>
  <div v-if="isAuthenticated" class="main-container w-100" :style="{ height: deviceHeight + 'px' }">
    <div class="w-100 boxex-1 bg-grey-lighten-4 rounded-xl d-flex justify-center align-center" :style="{ height: boxex1Height + 'px' }">
      <logo />
    </div>
    <div class="w-100 boxex-2 pa-2 d-flex justify-center" :style="{ height: boxex2Height + 'px' }">
      <v-form ref="form" v-model="isValid" @submit.prevent="handleSubmit" class="w-100 d-flex justify-center">
        <v-container class="w-100 d-flex justify-center">
          <v-row class="d-flex flex-column justify-space-between">
            <div class="w-100">
              <v-col cols="12">
                <v-text-field
                  label="User ID (4 digits only)"
                  required
                  v-model="userId"
                  :rules="userIdRules"
                  type="number"     
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="OTP (4 digits only)"
                  required
                  v-model="otp"
                  :rules="otpRules"
                  type="number"     
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="newpassword"
                  :type="newshowPassword ? 'text' : 'password'"
                  hint="Enter your password to access this website"
                  label="New Password"
                  :append-icon="newshowPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append="togglenewPasswordVisibility"
                  :rules="newPasswordRules"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="confirmpassword"
                  :type="confirmshowPassword ? 'text' : 'password'"
                  hint="Confirm your password"
                  label="Confirm Password"
                  :append-icon="confirmshowPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append="toggleconfirmPasswordVisibility"
                  :rules="confirmPasswordRules"
                ></v-text-field>
              </v-col>
            </div>
            <div class="w-100">
              <v-col cols="12">
                <v-btn 
                  type="submit" 
                  block 
                  size="large" 
                  class="bg-indigo text-white text-h5 rounded-xl"
                  :disabled="!isValid" 
                >
                  Update
                </v-btn>
              </v-col>
            </div>
          </v-row>
        </v-container>
      </v-form>
    </div>
  </div>

  <v-dialog
      v-model="dialog"
      class="w-100 h-75 pa-0"
   
    >
      <v-card
        class="h-75"
      >
     <div class=" pa-3 height " >
        <h1 class="text-center text-blue">Success</h1>
        <P class="text-center pt-12">NewPassword Updated</P>

     </div>
        <template v-slot:actions>
          <v-btn
            class="ms-auto"
            text="Ok"
            @click="handleOkClick"
          ></v-btn>
        </template>
      </v-card>
    </v-dialog>
</template>

<script>
import logo from '~/components/logo.vue';
import { useRouter } from 'vue-router'
import { ref, onBeforeMount } from 'vue'

export default {
  components: {
    logo
  },

  setup(){

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
return{
  router, isAuthenticated
}
  },
  data() {
    return {
      deviceWidth: 0,
      deviceHeight: 0,
      boxex1Height: 0,
      boxex2Height: 0,
      userId: '',
      otp: '',
      newpassword: '',
      confirmpassword: '',
      newshowPassword: false,
      confirmshowPassword: false,
      isValid: false, // Track form validity

      dialog: false,
    };
  },
  computed: {
    userIdRules() {
      return [
        v => !!v || 'User ID is required',
        v => (v && v.length === 4) || 'User ID must be 4 digits',
      ];
    },
    otpRules() {
      return [
        v => !!v || 'OTP is required',
        v => (v && v.length === 4) || 'OTP must be 4 digits',
      ];
    },
    newPasswordRules() {
      return [
      v => !!v || 'New Password is required',                 // Ensures the password is provided
    v => (v && v.length >= 6) || 'Password must be at least 6 characters',  // Minimum length 6
    v => (v && v.length <= 10) || 'Password must be at most 10 characters',  // Maximum length 10
    v => /^[A-Z]/.test(v) || 'Password must start with a capital letter',   // First character is a capital letter
    v => /[0-9]/.test(v) || 'Password must contain at least one number',    // At least one number
    v => /[!@#\$%\^&\*]/.test(v) || 'Password must contain at least one special character (!@#$%^&*)',
      ];
    },
    confirmPasswordRules() {
      return [
        v => !!v || 'Confirm Password is required',
        v => v === this.newpassword || 'Passwords must match',
      ];
    },
  },
  mounted() {
    this.updateDeviceDimensions(); // Initial call to set dimensions on component mount
    window.addEventListener('resize', this.updateDeviceDimensions); // Listen for window resize events
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateDeviceDimensions); // Clean up: remove resize event listener
  },
  methods: {
    updateDeviceDimensions() {
      this.deviceWidth = window.innerWidth; // Update device width
      this.deviceHeight = window.innerHeight; // Update device height

      // Calculate heights for each boxex based on percentages
      this.boxex1Height = Math.floor(this.deviceHeight * 0.20); // 20% of device height
      this.boxex2Height = Math.floor(this.deviceHeight * 0.80); // 80% of device height 
    },
    togglenewPasswordVisibility() {
      this.newshowPassword = !this.newshowPassword;
    },
    toggleconfirmPasswordVisibility() {
      this.confirmshowPassword = !this.confirmshowPassword;
    },
    handleSubmit() {
      // Validate the form before proceeding
      const isFormValid = this.$refs.form.validate();

      if (isFormValid) {
        // Log the form data and show the dialog
        console.log('Form submitted with:', {
          userId: this.userId,
          otp: this.otp,
          newpassword: this.newpassword,
          confirmpassword: this.confirmpassword,
        });

        // Show the dialog
        this.dialog = true;

        // Clear form fields after submission
        this.userId = '';
        this.otp = '';
        this.newpassword = '';
        this.confirmpassword = '';
      } else {
        // Show alert message for invalid form submission
        alert('Please correct the errors in the form before submitting.'); // Alert message
      }
    },
    handleOkClick() {
      // Navigate to the index page after clicking "Ok" in the dialog
      this.dialog = false; // Close the dialog
      this.$router.push('/'); // Navigate to the index page
    }
  },
};
</script>

<style scoped>
.height{
  height: 280px;
}
</style>
