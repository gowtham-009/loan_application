<template>
  <div v-if="isAuthenticated">
    <div class="w-100 bg-blue" :style="{ height: boxex1Height + 'px' }"></div>
    <div class="w-100" :style="{ height: boxex2Height + 'px' }" >
      <div class="w-100" >
       <div class="w-100" :style="{ height: formbtn + 'px' }">
        <v-btn class="bg-yellow" block @click="handleButtonClick">{{ buttonLabel }}</v-btn>
       </div>
        <v-form  @submit.prevent="handleSubmitpost"
        :disabled="formDisabled" :class="{ 'disabled-box': formDisabled }"
          :style="{ height: form + 'px', backgroundColor: formColor }"
          class="w-100 mt-1"
          style="display: flex; justify-content: space-between; flex-direction: column;"
        >
          <div class="w-100 scroller">
            <div class="loan-1 w-100 d-flex ga-2">
              <div class="w-100">
                <v-text-field 
                  variant="solo" 
                  v-model="sfa" 
                  label="SFA"
                  type="number"
                  hide-details
                  readonly
                  
                />
              </div>
              <div class="w-100 d-flex justify-center">
                <p class="text-blue text-center text-h6 mt-2">New Loan</p>
              </div>
              <div class="w-100">
                <input 
                  type="date" 
                  class="w-100" 
                  v-model="currentdate" 
                  style="height: 50px; box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;"
                />
               </div>
            </div>
            <!-- {{ getdatas_all }} -->
            <div class="options" style="display: flex; justify-content: center">
              <CheckboxButton
                v-for="option in options"
                :key="option.value"
                :name="'check-type6'"
                :label="option.label"
                :value="option.value"
                v-model="selectedOption"
                class="pa-2"
                @click="updateFormColor" 
              />
            </div>

            <v-row class="d-flex flex-column ga-0" style="margin-top: 2px;">
              <v-col  class="d-flex ga-3">
                <v-text-field
              variant="solo" 
              v-model="loanvalue"
              :counter="10"
              
              label="Loan Value:"
              placeholder="0.00"
              type="number"
              hide-details
              required
              class="w-100"
             :rules="loanvrules"
              @input="restrictDecimalPlaces"
            />
                
            <v-text-field
              variant="solo" 
              v-model="handover"
              :counter="10"
              v-if="!handover"
              label="Loan Handover:"
              placeholder="0.00"
              type="number"
              hide-details
              required
              class="w-100"
             :rules="lhrules"
              @input="restrictDecimalPlaces"
            />
              
            
              </v-col>
              <v-col cols="12">
                <v-text-field
                  variant="solo" 
                  v-model="weight"
                  :counter="10"
                  label="Weight:"
                  placeholder="000.000"
                  type="number"
                  hide-details
                  required
                  class="w-100"
                  :rules="weightrules"
                  @input="restrictDecimalPlacesweight($event)" 
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                variant="solo" 
                  v-model="ldetails"
                  :rules="proofRules"
                  label="Pawn_Details:"
                  placeholder="English / தமிழ்"
                  hide-details
                  required
                  class="w-100"
                  @input="ldetails = ldetails.toUpperCase()"
                />
              </v-col>
              <v-col class="d-flex ga-2" cols="12">
                <div class="w-100 d-flex flex-column">
                  <h5>Capture Proof</h5>
                  <div class="camera-container d-flex flex-column align-center justify-center">
                    <v-btn
                      color="#33691E"
                      width="330"
                      prepend-icon="mdi mdi-camera"
                      height="200"
                      v-if="!cameraActive"
                      @click="openCamera"
                    >
                      Open Camera / Upload File
                    </v-btn>
                    <div v-if="cameraActive" class="credit-card-container">
                      <template v-if="capturedImage">
                        <img :src="capturedImage" alt="Captured Image" style="border-radius: 10px;" class="captured-image" />
                      </template>
                      <template v-else>
                        <video ref="video" class="video-feed" autoplay playsinline style="border-radius: 10px;"></video>
                      </template>
                    </div>
                    <div v-if="cameraActive" class="controls">
                      <div class="w-100 d-flex ga-3 justify-center align-center pa-4">
                        <div class="w-100">
                          <v-btn
                            block
                            :color="capturedImage ? '#0277BD' : '#33691E'"
                            prepend-icon="mdi mdi-camera-flip-outline"
                            variant="flat"
                            @click="capturedImage ? openDialog() : switchCamera"
                          >
                            {{ capturedImage ? 'Expand' : 'Flip' }}
                          </v-btn>
                        </div>
                        <div class="w-100">
                          <v-btn
                            variant="tonal"
                            block
                            prepend-icon="mdi mdi-camera-enhance"
                            v-if="!capturedImage"
                            @click="captureImage"
                          >
                            Capture Image
                          </v-btn>
                          <v-btn
                            block
                            class="flex-grow-1"
                            variant="flat"
                            prepend-icon="mdi mdi-camera-retake"
                            v-if="capturedImage"
                            @click="retakeImage"
                          >
                            Re-Capture Image
                          </v-btn>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </div>

          <!-- Form Action Buttons -->
          <div class="w-100 d-flex">
            <div class="w-100 d-flex justify-center align-end">
              <v-btn class="bg-yellow text-black" block @click="resetForm">Reset</v-btn>
            </div>
            <div class="w-100 d-flex justify-center align-end">
              <v-btn
                block 
                type="submit"
                class="bg-green text-white"
              >
                Next
              </v-btn>
            </div>
          </div>
        </v-form>
      </div>
    </div>
    
    <!-- Dialog for displaying captured image -->
    <v-dialog v-model="dialogVisible" class="h-75 pa-1">
      <v-card class="h-screen pa-0">
        <img :src="capturedImage" alt="Captured Image" class="h-100" />
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ref, watch, computed, onBeforeMount } from 'vue';
import CheckboxButton from '~/components/CheckboxButton.vue'; // Adjust the path as necessary
import { useRouter } from 'vue-router'
import CryptoJS from 'crypto-js';
export default {
  name: 'ParentComponent',
  components: {
    CheckboxButton,
  },

  setup() {
    const isAuthenticated = ref(false)

onBeforeMount(() => {
  const token = localStorage.getItem('token')
  
  if (!token) {
   
    router.replace('/login')
  } else {
    
    isAuthenticated.value = true
  }
})

    const options = ref([
      { label: 'Gold', value: 'Gold' },
      { label: 'Silver', value: 'Silver' },
      { label: 'Brass', value: 'Brass' },
    ]);
    const sfa = ref(1000);
    const weight = ref('');
    const loanvalue=ref('');



  const getCurrentDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const currentdate = ref(getCurrentDate());
 


 const selectedOption = ref('');
    const ldetails = ref('');
    const capturedImage = ref('');
    const dialogVisible = ref(false);
    const isDisabled = ref(true);
    const handover = ref(false);
    const proofRules = [
  v => !!v || 'Proof ID is required',
  v => /^[A-Z0-9\s]+$/.test(v) || 'Only capital letters, numbers, and spaces are allowed',
];


   

    const weightrules = [
    v => !!v || 'Weight is required',
    v => /^[0-9]+(\.[0-9]{1,3})?$/.test(v) || 'Weight value must be numeric and can have up to 3 decimal places',
    ];

    const loanvrules = [
    v => !!v || 'Loan value is required',
    v => /^[0-9]+(\.[0-9]{1,2})?$/.test(v) || 'Loan value must be numeric and can have up to 2 decimal places',
    ];
    
    const lhrules = [
    v => !!v || 'Loan Handover value is required',
    v => /^[0-9]+(\.[0-9]{1,2})?$/.test(v) || 'Loan Handover value must be numeric and can have up to 2 decimal places',
    ];

const formDisabled = ref(true); 
const buttonLabel = ref("Search User");
const router = useRouter();
const route = useRoute(); 
const appid=ref('')
const loanid=ref()







const getloannumber=async()=>{
   
    const apiurl_loan='https://vaanam.w3webtechnologies.co.in/loandb/getloan_number.php'
   
    

    try {
      const response=await fetch(apiurl_loan,{
        method:"GET",
       
      })
      if(!response.ok){
        throw new Error('Failed your response try again!');
        }
        else{
         
          const data=await response.json()
           const loan_no=Number(data[0].Loan_Number )+1
           
         sfa.value=loan_no
        }
      } catch (error) {
        console.log(error.message)
      }
      
  }

  if(isAuthenticated.value==false){
   
    getloannumber()
  }


const ENCRYPTION_KEY = "loanapp098765";
  
  // Decryption function
  const decrypt = (cipherText) => {
    try {
      const bytes = CryptoJS.AES.decrypt(cipherText, ENCRYPTION_KEY);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error("Decryption error:", error);
      return null;
    }
  };

  const decryptedAppId = computed(() => {
    const encryptedAppId = route.query.appid;
    return encryptedAppId ? decrypt(encryptedAppId) : null;
  });
  
onMounted(() => {

    appid.value=decryptedAppId.value
  if (route.query.enable === 'true') {

    formDisabled.value = false;
    buttonLabel.value = "Clear";

  }
});


const handleButtonClick = () => {
  if (formDisabled.value) {
    // Enable the form
    formDisabled.value = false;
    buttonLabel.value = "Clear"; // Change the button label to Clear
    buttonLabel.value = "Search User"; // Change the button label back
    router.push({ name: 'search2' });
  } else {
    // Clear the form inputs (resetting to empty)
    document.querySelectorAll('input[type="text"]').forEach(input => input.value = '');
    // Optionally, disable the form again
    formDisabled.value = true;
    buttonLabel.value = "Search User";
   
  }
};



    // Computed property for form background color
    const formColor = computed(() => {
      switch (selectedOption.value) {
        case 'Gold':
          return '#fbfaea';
        case 'Silver':
          return '#f2f2f2';
        case 'Brass':
          return '#e8e29a';
        default:
          return 'white';
      }
    });

  
    
    const handleSubmitpost = async () => {
  if (!sfa.value || !currentdate.value || !selectedOption.value || !loanvalue.value || !weight.value || !ldetails.value || !capturedImage.value) {
    error.value = 'Please fill in all fields';
    return;
  }

  await postdata_loan() 
  routerloan();
};
  const loading=ref(false);
  const error=ref(null)
  const postdata_loan=async()=>{
   
    loading.value=true
    error.value=null
    const apiurl_loan='https://vaanam.w3webtechnologies.co.in/loandb/loan_update.php'
    const formdata_loan=new FormData()
    formdata_loan.append('appid', decryptedAppId.value)
    formdata_loan.append('loannumber', sfa.value)
    formdata_loan.append('loandate', currentdate.value)
    formdata_loan.append('loantype', selectedOption.value)
    formdata_loan.append('loanvalue', loanvalue.value)
    formdata_loan.append('loanhandover', handover.value)
    formdata_loan.append('weight', weight.value)
    formdata_loan.append('pawndetails', ldetails.value)
    formdata_loan.append('nporul', capturedImage.value)
    

    try {
      const response_loan=await fetch(apiurl_loan,{
        method:"POST",
        body:formdata_loan
      })
      if(!response_loan.ok){
        throw new Error('Failed your response try again!');
        }
        else{
         
          const data_loan=await response_loan.json()
          loanid.value=data_loan.loan_id
        }
      } catch (error) {
        error.value=error.message
      }
      finally{
        loading.value=false

      }
  }

  const routerloan=()=>{
  const id = loanid.value; // The ID to encrypt
  const secretKey = "loanidmust123"; // Use a strong secret key
  const encryptedId = CryptoJS.AES.encrypt(id, secretKey).toString();

 
  router.push({ path: "/summary", query: { encryptedId } });
}
    return {
      isAuthenticated,
      options,
      selectedOption,
      sfa,
      weight,
      getCurrentDate,
      currentdate,
    
      loanvalue,
      handover,
      ldetails,
      capturedImage,
      dialogVisible,
      loanvrules,
      lhrules,
      weightrules,
      isDisabled,
      proofRules,
      formColor,
      formDisabled,
      buttonLabel,
      route,
      router,
      appid,
      handleButtonClick,
      ENCRYPTION_KEY,
      decryptedAppId,
      decrypt,
      loading,
      error,
      postdata_loan,
      handleSubmitpost,
      loanid,
      routerloan,
      getloannumber,
     
     
     

    };
  },

  data() {
    return {
      deviceWidth: 0,
      deviceHeight: 0,
      boxex1Height: 0,
      boxex2Height: 0,
      formbtn:0,
      form: 0,
      videoStream: null,
      cameraFacing: 'environment',
      cameraActive: false,
   
    };
  },

  mounted() {
    this.updateDeviceDimensions();
    window.addEventListener('resize', this.updateDeviceDimensions);
  },

  beforeUnmount() {
    window.removeEventListener('resize', this.updateDeviceDimensions);
  },
  
  methods: {
    restrictDecimalPlaces(e) {
      const value = e.target.value;

      // Regular expression to allow numbers with at most 2 decimal places
      const regex = /^[0-9]+(\.[0-9]{0,2})?$/;

      // If the value does not match the regex, reset to the last valid value
      if (!regex.test(value)) {
        e.target.value = this.loanValue; // Revert to last valid value
      } else {
        this.loanValue = value; // Update loanValue if it's valid
      }
    },
    restrictDecimalPlacesweight(event) {
      let value = event.target.value;
      // This regex matches any number followed by a decimal point and up to 3 digits after it
      const regex = /^\d+(\.\d{0,3})?$/;
      if (!regex.test(value)) {
        // If the input is invalid, revert the value to the previous valid value
        event.target.value = value.slice(0, value.length - 1);
      }
    },
    updateDeviceDimensions() {
      this.deviceWidth = window.innerWidth;
      this.deviceHeight = window.innerHeight;

      this.boxex1Height = Math.floor(this.deviceHeight * 0.05);
      this.boxex2Height = Math.floor(this.deviceHeight * 0.95);
      this.formbtn = Math.floor(this.boxex2Height * 0.07);
      this.form = Math.floor(this.boxex2Height * 0.91);
    },
    async startCamera() {
      const constraints = {
        video: {
          facingMode: this.cameraFacing,
          width: 300,
          height: 180,
        },
      };
      try {
        this.videoStream = await navigator.mediaDevices.getUserMedia(constraints);
        this.$refs.video.srcObject = this.videoStream;
      } catch (error) {
        console.error('Error accessing the camera:', error);
      }
    },
    openCamera() {
      this.cameraActive = true;
      this.startCamera();
    },
    switchCamera() {
      this.cameraFacing = this.cameraFacing === 'user' ? 'environment' : 'user';
      if (this.videoStream) {
        this.videoStream.getTracks().forEach(track => track.stop());
      }
      this.startCamera();
    },
    captureImage() {
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 180;
      const context = canvas.getContext('2d');
      context.drawImage(this.$refs.video, 0, 0, canvas.width, canvas.height);
      this.capturedImage = canvas.toDataURL('image/png');
      this.imagePath = this.capturedImage.replace(/^,+/, ''); 
      this.videoStream.getTracks().forEach(track => track.stop());
    },
    retakeImage() {
      this.capturedImage = '';
      this.startCamera();
    },
    openDialog() {
      this.dialogVisible = true;
    },

  },
};
</script>

<style scoped>
.scroller {
  overflow: hidden;
  overflow-y: scroll;
}
.main_container {
  display: flex;
  flex-direction: column;
}
.video-feed {
  width: 100%;
  height: auto;
}
.captured-image {
  max-width: 100%;
  height: auto;
}

.disabled-box {
  pointer-events: none; /* Disable pointer events */
  opacity: 0.5; /* Optional: make it look visually disabled */
}
</style>
