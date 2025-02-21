<template>
    <div class="main-container w-100" :style="{height: deviceHeight + 'px'}">
      <div class="w-100 boxex-1 bg-blue":style="{height:boxex1Height + 'px'}"></div>
      <div class="w-100 boxex-2":style="{height:boxex2Height + 'px'}">
         <div class="w-100 d-flex justify-center align-center pa-3">
            <h2 class="text-center">Loan Creation Success</h2>
         </div>
         <div class="w-100 mt-4 d-flex justify-center align-center">
            <h2 class="text-center">Text Summary of all input boxes</h2>
         </div>
      </div>
  
      <div class="w-100 d-flex ga-3 pa-4 align-center" :style="{height:boxex3Height + 'px'}">
          <div class="w-100"><v-btn class="bg-yellow text-black" block>Reset</v-btn></div>
          <div class="w-100"><v-btn class="bg-green text-white" block>Insert</v-btn></div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        deviceWidth: 0,
        deviceHeight: 0,
        boxex1Height: 0,
        boxex2Height: 0,
        boxex3Height: 0
        
  
      };
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
        this.boxex1Height = Math.floor(this.deviceHeight * 0.05); // 6% of device height
        this.boxex2Height = Math.floor(this.deviceHeight * 0.90); // 88% of device height
        this.boxex3Height = Math.floor(this.deviceHeight * 0.05); // 6% of device height
       
      },
      
  
    }
  };
  </script>
  
  <style scoped>
  
  
  
  </style>
  