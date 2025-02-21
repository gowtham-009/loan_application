<template>
  <span>{{currentTime}}</span>
  <div v-if="isAuthenticated">
    <div class="w-100 bg-blue" :style="{ height: boxex1Height + 'px' }"> </div>
    <div class="w-100" :style="{ height: boxex2Height + 'px' }">
      <div class="w-100 d-flex" :style="{ height: new_us + 'px' }">
        <div class="w-100">
          <v-btn variant="plain" class="text-blue font-weight-bold text-h6" block>New User</v-btn>
        </div>
      </div>
      <div class="w-100 pa-1" :style="{ height: form + 'px' }">

        <div v-if="loading" class="w-100 d-flex justify-center">
              <v-progress-circular
            color="primary"
            indeterminate
          ></v-progress-circular>
       </div>
       <div v-if="error" class="w-100">
          <v-alert
            title="Error"
            type="danger"
          >
        {{ error }}
        </v-alert>
       </div>
       <div v-else>
        <v-form ref="form" :style="{ height: form + 'px' }" v-model="isValid" @submit.prevent="handleventfun" class="w-100 d-flex justify-space-between flex-column" >
          
          <div class="w-100 scroller">
            <v-text-field
            v-model="mobile_no"
              :counter="10"
              :rules="mobilerules"
              label="Mobile Number"
              placeholder="Enter Mobile Number"
              type="number"
              hide-details
              required
              class="w-100"
              maxlength="10"
              @input="checkLength"
            ></v-text-field>
            <div class="options">
              <CheckboxButton
                v-for="option in options"
                :key="option.value"
                :name="'proof-type'"
                :label="option.label"
                :value="option.value"
                v-model="selectedOption"
                class="pa-2"
              />
            </div>
            <v-row class="d-flex flex-column ga-0" style="margin-top: 2px;">
              <v-col cols="12">
                <v-text-field
                  v-model="proofid"
                  :counter="10"
                  :rules="proofRules"
                  label="Proof ID / Number"
                  placeholder="Enter Unique ID Number"
                  hide-details
                  required
                  class="w-100"
                  @input="proofid = proofid.toUpperCase()"
                ></v-text-field>
              </v-col>
              <v-col  class="d-flex ga-2 flex-column" cols="12">
                 <div v-if="imageshow" class="w-100 pa-2 d-flex justify-center flex-column" >
                   <img :src="getimage" alt="">
                   <v-btn block class="btn bg-red" @click="retakeimage()">Re-Take</v-btn>
                 </div>
                 <div v-if="imageshow2" class="w-100 pa-2" >
                  <div class="w-100 d-flex flex-column" >
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
                        <img :src="capturedImage" alt="Captured Image" class="captured-image" style="border-radius: 10px;" />
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
                 </div>
                </v-col>
             
              <v-col  class="d-flex ga-2" cols="12">
               
              
              </v-col>
            </v-row>
          </div>

          <!-- Form Action Buttons -->
          <div class="w-100 d-flex">
            <div class="w-100 d-flex justify-center align-end">
              <v-btn class="bg-yellow text-black" block >Reset</v-btn>
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
import { useRouter, useRoute } from 'vue-router'
import CryptoJS from 'crypto-js';
export default {
  name: 'ParentComponent',
  components: {
    CheckboxButton,
  },

  setup() {
    const currentTime = ref(new Date().toLocaleString());
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
      { label: 'AADHAR ID', value: 'AADHAR ID' },
      { label: 'VOTER ID', value: 'VOTER ID' },
      { label: 'DRIVING LICENCE', value: 'DRIVING LICENCE' },
      { label: 'RATION CARD', value: 'RATION CARD' },
      { label: 'BANK PASSBOOK', value: 'BANK PASSBOOK' },
      { label: 'PASSPORT', value: 'PASSPORT' },
      { label: 'OTHER', value: 'OTHER' },
      { label: 'DIGI LOCKER', value: 'DIGI LOCKER' },
    ]);
    const mobile_no=ref('');
    const selectedOption = ref('');
    const proofid = ref('');
    const capturedImage = ref('');
    const dialogVisible = ref(false);
    const imagePath=ref('');
 
    
    const proofRules = [
      v => !!v || 'Proof ID is required',
      v => /^[A-Z0-9]+$/.test(v) || 'Only capital letters are allowed',
      v => v.length <= 16 || 'Max 10 characters',
    ];

    const mobilerules=[(v) => !!v || 'Mobile number is required']


    const loading=ref('')
    const error=ref(null)
    const appid=ref('')
    const router = useRouter()



  const handleSubmit1 = async () => {
  if (!mobile_no.value || !selectedOption.value || !proofid.value || !imagePath.value) {
    error.value = 'Please fill in all fields';
    return;
  }

  await newuser_formdata();
};
const handleSubmit2 = async () => {
  if (!mobile_no.value || !selectedOption.value || !proofid.value) {
    error.value = 'Please fill in all fields';
    return;
  }

  await update_form();
};
    const newuser_formdata=async()=>{
      loading.value=true;
      error.value=null
      const newuser1_apiurl='https://vaanam.w3webtechnologies.co.in/loandb/newuser1_insert.php'
      const formdata=new FormData()
      formdata.append('Mobilenum',mobile_no.value);
      formdata.append('ProofType',selectedOption.value);
      formdata.append('Proofdetails', proofid.value)
      formdata.append('Nproof', imagePath.value);
      formdata.append('App_id', appid.value);
     

      try{
        const response=await fetch(newuser1_apiurl,{
          method:'POST',
          body:formdata
        })
        if(!response.ok){
          throw new Error('Failed to submit data. Please check your inputs.');
        }
        else{
          const userdata_res=await response.json()
          appid.value=userdata_res.id

        }
       
      }
      catch(err){
          error.value=err.message
        }
        finally{
          loading.value=false
         router.push({ name: 'new_user2', query: { value: appid.value } })
        }
    }

    const update_form=async()=>{
      loading.value=true;
      error.value=null
      const newuser1_apiurl='https://vaanam.w3webtechnologies.co.in/loandb/newuser1_insert.php'
      const formdata=new FormData()
      formdata.append('Mobilenum',mobile_no.value);
      formdata.append('ProofType',selectedOption.value);
      formdata.append('Proofdetails', proofid.value)
      formdata.append('update_appid', decryptedId);
      if (getimage.value) {
        formdata.append('Nproof', getimage.value);
        
    }  
    if (imagePath.value) {
      
      formdata.append('Nproof', imagePath.value);
    }

      try{
        const response=await fetch(newuser1_apiurl,{
          method:'POST',
          body:formdata
        })
        if(!response.ok){
          throw new Error('Failed to submit data. Please check your inputs.');
        }
        else{
          const userdata_res=await response.json()
          

        }
       
      }
      catch(err){
          error.value=err.message
        }
        finally{
          loading.value=false
         router.push({ name: 'new_user2', query: { value:decryptedId } })
        }
    }
    const route = useRoute();

const secretKey = "appiduser"; 
let decryptedId = "";

    if (route.query.encryptedId) {
      try {
        const bytes = CryptoJS.AES.decrypt(route.query.encryptedId, secretKey);
        decryptedId = bytes.toString(CryptoJS.enc.Utf8);
      } catch (error) {
        console.error("Failed to decrypt the ID:", error);
      }
    }
 const imageshow=ref(false)
 const imageshow2=ref(true)
 if(decryptedId){
  imageshow.value=true
  imageshow2.value=false

 }

 const retakeimage=()=>{
  imageshow.value=false
  imageshow2.value=true
 }
    const getimage=ref('')
    const getdatauser=async()=>{
      loading.value=true
      const apiurl='https://vaanam.w3webtechnologies.co.in/loandb/getuser_data.php'
      const formdata=new FormData()
      formdata.append('appid', decryptedId)
      try {
        const response=await fetch(apiurl, {
          method:'POST',
          body:formdata
        })
        if(!response.ok){
          throw new Error(`your request failed please try again! ${response.status}`)
        }
        else{
          const data=await response.json()
          selectedOption.value=data[0].ProofType
  
          mobile_no.value=data[0].MobileNum
          proofid.value=data[0].ProofDetails
          getimage.value=data[0].nProof
        
        }
      } catch (error) {
         error.value=error.message
      }
      finally{
        loading.value=false
      }
    }

   
      getdatauser()
  


    const handleventfun=()=>{
      if(decryptedId){
        handleSubmit2()
      }
      else{
        handleSubmit1()
      }
    }
    
    return {
      isAuthenticated,
      mobile_no,
      options,
      selectedOption,
      proofid,
      capturedImage,
      dialogVisible,
      imagePath,
      mobilerules,
      proofRules,
      appid,
      newuser_formdata,
      update_form,
      handleSubmit1,
      handleSubmit2,
      handleventfun,
      secretKey,
      decryptedId,
      route,
      getdatauser,
      imageshow,
      imageshow2,
      getimage,
      retakeimage,
      currentTime 
     
    };
  },

  data() {
    return {
      deviceWidth: 0,
      deviceHeight: 0,
      boxex1Height: 0,
      boxex2Height: 0,
      new_us: 0,
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
    updateDeviceDimensions() {
      this.deviceWidth = window.innerWidth;
      this.deviceHeight = window.innerHeight;

      this.boxex1Height = Math.floor(this.deviceHeight * 0.05);
      this.boxex2Height = Math.floor(this.deviceHeight * 0.95);
      // box---2
      this.new_us = Math.floor(this.boxex2Height * 0.08);
      this.form = Math.floor(this.boxex2Height * 0.92);
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
    checkLength() {
      if (this.mobile_no.length > 10) {
        this.mobile_no = this.mobile_no.slice(0, 10);
      }
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
</style>
