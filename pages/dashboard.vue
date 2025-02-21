
<template>
    <div v-if="isAuthenticated" class="main-container w-100" :style="{height: deviceHeight + 'px'}">
      <div class="w-100 boxex-1 d-flex justify-center align-center" :style="{height: boxex1Height + 'px'}">
        <logo/>
      </div>
      <div class="w-100 boxex-2 d-flex flex-column" :style="{height: boxex2Height + 'px'}">
        <v-container class="pa-0 d-flex flex-column flex-grow-1">
          <v-row no-gutters class="flex-grow-1">
            <v-col class="d-flex">
              <v-sheet class="pa-2 ma-2 d-flex justify-start align-start flex-grow-1 bg-green">
            <nuxt-link to="/new_user" class="text-h4 text-white text-start" style="text-decoration: none;">New<br>user</nuxt-link>
              </v-sheet>
            </v-col>
            <v-col class="d-flex">
              <v-sheet class="pa-2 ma-2 flex-grow-1 bg-green">
                <nuxt-link to="/new_loan" class="text-h4 text-start text-white" style="text-decoration: none;">New<br>Loan</nuxt-link>
              </v-sheet>
            </v-col>
          </v-row>
          <v-row no-gutters class="flex-grow-1">
            <v-col class="d-flex">
              <v-sheet class="pa-2 ma-2 d-flex justify-center align-center  flex-grow-1 bg-yellow">
                <nuxt-link to="/searchdata" class="text-h4 text-white" style="text-decoration: none;">Search & Calculate</nuxt-link>
              </v-sheet>
            </v-col>
          </v-row>
          <v-row no-gutters class="flex-grow-1">
            <v-col class="d-flex">
              <v-sheet class="pa-2 ma-2 d-flex-grow-1 bg-teal-accent-2 d-flex justify-center align-center">
                <nuxt-link to="/closesearch" class="text-h4 text-white" style="text-decoration: none;">Close Records</nuxt-link>
              </v-sheet>
            </v-col>
          </v-row>
          <v-row no-gutters class="flex-grow-1">
            <v-col class="d-flex">
              <v-sheet class="pa-2 ma-2 d-flex-grow-1 bg-blue d-flex justify-center align-center">
                <nuxt-link to="/admin" class="text-h4 text-white" style="text-decoration: none;">Admin</nuxt-link>
              </v-sheet>
            </v-col>
          </v-row>
          <v-row no-gutters class="flex-grow-1">
            <v-col class="d-flex">
              <v-sheet class="pa-2 ma-2 flex-grow-1 bg-red  d-flex justify-end align-end">
                <h1 class="text-end">Ledger<br>Reports</h1>
              </v-sheet>
            </v-col>
            <v-col class="d-flex">
              <v-sheet class="pa-2 ma-2 flex-grow-1 bg-red d-flex justify-end align-end">
                <nuxt-link to="/balance_check" class="text-h4 text-end text-white" style="text-decoration: none;">Balance<br>Check</nuxt-link>
              </v-sheet>
            </v-col>
          </v-row>

          <v-row no-gutters class="flex-grow-1 d-flex justify-end">
            <v-col class="d-flex" cols="6">
              <v-sheet class="pa-2 ma-2 flex-grow-1 bg-black d-fle justify-end align-center">
                <nuxt-link to="/login" class="text-h4 text-white" style="text-decoration: none;">
                  <logout/>
                </nuxt-link>
              </v-sheet>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </div>
  </template>
  
  
  <script>
  import logo from '~/components/logo.vue'
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
  router,isAuthenticated
}
    },
  
   
    data() {
      return {
        deviceWidth: 0,
        deviceHeight: 0,
        boxex1Height: 0,
        boxex2Height: 0,
      };
    },
    mounted() {

    
      this.updateDeviceDimensions(); 
      window.addEventListener('resize', this.updateDeviceDimensions); 
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.updateDeviceDimensions()); // Clean up: remove resize event listener
    },
    methods: {
      updateDeviceDimensions() {
        this.deviceWidth = window.innerWidth; // Update device width
        this.deviceHeight = window.innerHeight; // Update device height
  
        // Calculate heights for each box based on percentages
        this.boxex1Height = Math.floor(this.deviceHeight * 0.10); // 10% of device height
        this.boxex2Height = Math.floor(this.deviceHeight * 0.89); // 89% of device height
      },
    }
  };
  </script>
  <style scoped>
  .main-container {
    width: 100%;
  }
  
  .boxex-1 {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .v-container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  
  .v-row {
    display: flex;
    flex-grow: 1;
  }
  
  .v-col {
    display: flex;
  }
  
  .v-sheet {
    display: flex;
    flex-grow: 1;
    border-radius: 10px;
  }
  </style>
  