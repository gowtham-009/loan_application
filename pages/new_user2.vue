<template>
  <div  v-if="isAuthenticated">
    <div class="w-100 bg-blue" :style="{ height: boxex1Height + 'px' }"> </div>
    <div class="w-100" :style="{ height: boxex2Height + 'px' }">
      <div class="w-100 d-flex" :style="{ height: new_us + 'px' }">
        <div class="w-100">
          <v-btn variant="plain" class="text-blue font-weight-bold text-h6" block>New User</v-btn>
        </div>
     
      </div>
      <div class="w-100" :style="{ height: form + 'px' }">
        <v-form ref="form" v-model="isValid" @submit.prevent="handleSubmit" :style="{ height: form + 'px' }" class="w-100 d-flex justify-space-between flex-column" >
          
          <div class="w-100 pa-1 scroller">
           <v-row  class="mt-3">
            <v-col cols="12" class="pt-2" >
              <v-text-field
               v-model="name"
              :rules="namerules"
              label="Name"
              placeholder="Enter a name"
              type="text"
              hide-details
              required
              class="w-100"
              variant="solo-filled"
               @input="formatToUppercase"
            ></v-text-field>

            <v-text-field
                  v-model="address"
                  counter="1000"
                   maxlength="1000"
                  :rules="addressrules"
                  label="Address"
                  placeholder="Enter a address"
                  hide-details
                  required
                  class="w-100 mt-1"
               variant="solo-filled"
                ></v-text-field>

                <v-text-field
                  v-model="place"
                   counter="150"
                   maxlength="150"
                  :rules="placerules"
                  label="Place"
                  placeholder="Enter a place"
                  hide-details
                  required
                  class="w-100 mt-1"
                   variant="solo-filled"
                    @input="formatToUppercasep"
                ></v-text-field>
            </v-col>
           </v-row>
            <v-row class="d-flex flex-column ga-0" style="margin-top: 2px;">
              <v-col class="d-flex flex-column ga-2" cols="12">
                <div v-if="show" class="w-100 pa-1" style="border: 2px solid red;">
                  <h5>Capture nProof</h5>

                 
                  <img :src="imageP" alt="Captured Image" class="captured-image w-100" style="border-radius: 10px;" />
                  <v-btn type="btn" @click="recapture()" class="btn bg-red" block>RE-CAPTURE</v-btn>
               
                </div>

                <div v-if="camcontainer" class="w-100 d-flex flex-column">
                  <h5>Capture nProof</h5>
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

    <!-- Dialog for displaying captured image -->
    <v-dialog v-model="dialogVisible" class="h-75 pa-1">
      <v-card class="h-screen pa-0">
        <img :src="capturedImage" alt="Captured Image" class="h-100" />
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ref ,onBeforeMount} from 'vue';
import { useRouter } from 'vue-router'

export default {

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
    const name=ref('');
    const address = ref('');
    const place = ref('');
    const capturedImage = ref('');
    const dialogVisible = ref(false);
    const show=ref(true)
    const camcontainer=ref(true)
    const imageP=ref('')
    

    const namerules=[
    (v) => !!v || "Name is required",
  (v) => /^[A-Z]+$/.test(v) || "Only alphabetic characters are allowed",
  (v) => v.length <= 150 || "Maximum 150 characters allowed",
    ]
    const addressrules=[
    v => !!v || 'Address is required',
        v => v.length <= 1000 || 'Maximum 1000 characters allowed',
        v => /^[\w\s\W]+$/.test(v) || 'Only alphanumeric and special characters are allowed',
    ]

    const placerules=[
      (v) => !!v || 'place is required',
        v => /^[A-Z]+$/.test(v) || 'Only alphabetic characters are allowed',
        v => v.length <= 150 || 'Maximum 150 characters allowed',
    ]
    
    const route = useRoute();
    const queryValue = ref('');


    onMounted(() => {
      queryValue.value = route.query.value || ''; 
    });
    const uniqueid = computed(() => queryValue.value);
    
   
    



    const loading=ref('')
    const error=ref(null)
    const router = useRouter()
    const imagePath=ref('')

    const getdatauser=async()=>{
      loading.value=true
      const apiurl='http://localhost/loan%20db/getuser_data.php'
      const formdata=new FormData()
      formdata.append('appid',  route.query.value)
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
          name.value=data[0].Name
          address.value=data[0].Address1
          place.value=data[0].Place
          imageP.value=data[0].nPerson

          if(imageP.value){
            show.value=true
            camcontainer.value=false
          }
          else{
            show.value=false
            camcontainer.value=true
          }

        
        
        }
      } catch (error) {
         error.value=error.message
      }
      finally{
        loading.value=false
      }
    }

    getdatauser()


    const handleSubmit = async () => {
  // Input validation
  if (!uniqueid.value || !name.value || !address.value || !place.value || (!imagePath.value && !imageP.value)) {
    error.value = 'Please fill in all fields, including an image.';
    return;
  }

  // Proceed with the form submission
  await newuser2_formdata();
};

const newuser2_formdata = async () => {
  loading.value = true;
  error.value = null;

  const newuser2_apiurl = 'http://localhost/loan%20db/newuser2_insert.php';
  const formdata = new FormData();

  // Append form fields
  formdata.append('appid', uniqueid.value);
  formdata.append('name', name.value);
  formdata.append('address1', address.value);
  formdata.append('place', place.value);

  // Append the image path conditionally
  const imageValue = imagePath.value || imageP.value; // Use imagePath first, fallback to imageP
  formdata.append('nperson', imageValue);

  try {
    const response = await fetch(newuser2_apiurl, {
      method: 'POST',
      body: formdata,
    });

    // Check for HTTP error responses
    if (!response.ok) {
      throw new Error('Failed to submit data. Please check your inputs.');
    }

    // Handle JSON response
    const userdata_res = await response.json();
    console.log('User data response:', userdata_res);
  } catch (err) {
    // Catch and display errors
    error.value = err.message;
  } finally {
    // Reset loading state
    loading.value = false;
  }
};


    const formatToUppercase = () => {
  name.value = name.value.toUpperCase();
};

const formatToUppercasep = () => {
  place.value = place.value.toUpperCase();
};

const recapture=()=>{
  show.value=false
  camcontainer.value=true
}

    return {
      isAuthenticated,
      name,
      namerules,
      address,
      addressrules,
      place,
      placerules,
      capturedImage,
      dialogVisible,
      queryValue,
      uniqueid,
      imagePath,
      router,
      newuser2_formdata,
      handleSubmit,
      formatToUppercase,
      formatToUppercasep,

      show,
      imageP,
      camcontainer,
      recapture,

      
     
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
