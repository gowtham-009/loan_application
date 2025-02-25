<template>
  <div v-if="isAuthenticated">
    <form @submit.prevent="handleEventFun">
      <div v-if="errorpopup" style="position: absolute; width: 100%; z-index: 10;">
          <v-alert title="Input fields are Required !" type="error">
            {{ errormessage }}
          </v-alert>
          <div v-if="loading" class="w-100 d-flex justify-center">
          </div>
        </div>
      <div class="w-100">

        <div class="bg-blue d-flex justify-center align-center" :style="{ height: box1Height + 'px' }">
          <span class="text-h4">New User</span>
        </div>
      
        <div class="pa-2 " :style="{ height: box2Height + 'px' }">

          <v-text-field v-model="phoneNumber" label="Mobile Number" variant="solo-filled" @input="validateInput"
            :rules="[validateLength]" maxlength="10"></v-text-field>

          <div class="options mt-1">
            <CheckboxButton v-for="option in options" :key="option.value" :name="'proof-type'" :label="option.label"
              :value="option.value" v-model="selectedOption" class="pa-2" />
          </div>

          <v-text-field variant="solo-filled" v-model="proofid" :counter="16" :rules="proofRules"
            label="Proof ID / Number" placeholder="Enter Unique ID Number" hide-details  class="w-100"
            @input="proofid = proofid.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 16)"></v-text-field>


          <div class="w-100 pa-1 mt-1 d-flex justify-center align-center flex-column">
            <div class="w-100 d-flex justify-start">
              <p class="text-left">Capture Proof</p>
            </div>
            <!-- Open Camera Button -->
            <div v-if="cameraoperation" class="w-75 rounded bg-green-darken-4 d-flex justify-center align-center"
              style="height: 200px;">
              <v-btn @click="openCamera" block class="bg-green-darken-4" prepend-icon="mdi mdi-camera-flip-outline"
                text="Open Camera / Upload Files" variant="flat"></v-btn>
            </div>
            <!-- Camera Container -->
            <div v-if="cameracontainer" class="w-75 rounded d-flex justify-center align-center flex-column">
              <video ref="videoElement" autoplay class="w-100 h-100"></video>
              <div class="w-100 d-flex ga-2 justify-center">
                <v-btn prepend-icon="mdi mdi-camera-flip-outline" @click="flipCamera" class="mt-2 bg-green-darken-4"
                  text="Flip" variant="flat"></v-btn>
                <v-btn prepend-icon="mdi mdi-camera-enhance" @click="captureImage" class="mt-2 bg-gray-darken-4"
                  text="Capture" variant="flat"></v-btn>
              </div>
            </div>
            <!-- Display Captured Image -->
            <div v-if="capturedImage" class="w-75">
              <img :src="capturedImage" alt="Captured Photo" class="w-100 rounded shadow-lg" />
              <div class="w-100 d-flex ga-2 justify-center">
                <v-btn prepend-icon="mdi mdi-camera-flip-outline" @click="dialog = true" class="mt-2 bg-indigo-darken-4"
                  text="Expand" variant="flat"></v-btn>
                <v-btn prepend-icon="mdi mdi-camera-enhance" @click="recapturephoto" class="mt-2 bg-gray-darken-4"
                  text="Re-Capture" variant="flat"></v-btn>
              </div>
            </div>
            <canvas ref="canvasElement" style="display: none;"></canvas>
          </div>


        </div>
        <div class=" d-flex gap-2" :style="{ height: box3Height + 'px' }">
          <div class="w-100 d-flex justify-center align-end">
            <v-btn class="bg-yellow text-black" block>Reset</v-btn>
          </div>
          <div class="w-100 d-flex justify-center align-end">
            <v-btn  block type="submit" class="bg-green text-white">
              Next
            </v-btn>
          </div>
        </div>

      </div>
    </form>
    <v-dialog v-model="dialog" width="auto">
      <v-card max-width="400">
        <img :src="capturedImage" alt="Captured Photo" class="w-100 rounded shadow-lg" />
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, onBeforeUnmount, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import CryptoJS from 'crypto-js';

const errorpopup=ref(false)
const errormessage = ref('')
const loading = ref('')
const appid = ref('')
const isAuthenticated = ref(false);
const cameraoperation = ref(true);
const cameracontainer = ref(false);
const videoElement = ref(null);
const canvasElement = ref(null);
const capturedImage = ref(null);
const dialog = ref(false)

const deviceHeight = ref(0)
const box1Height = ref(0)
const box2Height = ref(0)
const box3Height = ref(0)
const phoneNumber = ref("");
const proofid = ref("");
const proofRules = [
  v => !!v || 'Proof ID is required',

];

const validateInput = () => {
  phoneNumber.value = phoneNumber.value.replace(/\D/g, "").slice(0, 10);
};

const validateLength = () => {
  return phoneNumber.value.length === 10 || "Number must be exactly 10 digits";
};

const getFormattedDateTime = () => {
      const date = new Date();
      const formattedDate = date.toISOString().split('T')[0]; // dd-mm-yyyy
      const formattedTime = date.toLocaleTimeString('en-GB', { hour12: false }); // hh:mm:ss
      return `${formattedDate} ${formattedTime}`;
    };

    const currentDateTime = ref(getFormattedDateTime());


const selectedOption = ref('');
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

const updateSizes = () => {
  deviceHeight.value = window.innerHeight
  box1Height.value = deviceHeight.value * 0.05 // 8% height
  box2Height.value = deviceHeight.value * 0.90 // 92% height
  box3Height.value = deviceHeight.value * 0.05

}

onMounted(() => {
  updateSizes()
  window.addEventListener('resize', updateSizes) // Update sizes on window resize
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateSizes) // Clean up event listener
})

const facingMode = ref("user"); // "user" for front camera, "environment" for back camera
let stream = null;

const openCamera = async () => {
  cameraoperation.value = false;
  cameracontainer.value = true;
  capturedImage.value = null;
  await startCamera();
};

const startCamera = async () => {
  try {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: facingMode.value } });
    if (videoElement.value) {
      videoElement.value.srcObject = stream;
    }
  } catch (error) {
    console.error("Error accessing camera:", error);
  }
};

const flipCamera = async () => {
  facingMode.value = facingMode.value === "user" ? "environment" : "user";
  await startCamera();
};

const captureImage = () => {
  if (!videoElement.value || !canvasElement.value) return;
  const canvas = canvasElement.value;
  const video = videoElement.value;
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  capturedImage.value = canvas.toDataURL('image/png');
  cameracontainer.value = false;
};

const recapturephoto = async () => {
  capturedImage.value = null;
  cameraoperation.value = false;
  cameracontainer.value = true;
  await startCamera();
};
const router = useRouter();
onBeforeMount(() => {
  const token = localStorage.getItem('token');

  if (!token) {
    router.replace('/login');
  } else {
    isAuthenticated.value = true;
  }
});

onBeforeUnmount(() => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
});

const handleEventFun = () => {
  if (!phoneNumber.value) {
    errorpopup.value = true;
    errormessage.value = 'Mobile number is required';
    return;
  }
  if (!selectedOption.value) {
    errorpopup.value = true;
    errormessage.value = 'Id Proof Type is Required';
    return;
  }
  if (!proofid.value) {
    errorpopup.value = true;
    errormessage.value = 'Proof ID is required';
    return;
  }
  if (!capturedImage.value) {
    errorpopup.value = true;
    errormessage.value = 'Proof photo is Required';
    return;
  }
  errorpopup.value = false; 
  errormessage.value = '';  
  newuser_formdata()
};


const secretKey = "appidsecreatekey001"; // Change this to a secure key
const encryptData = (data) => {
  return CryptoJS.AES.encrypt(data, secretKey).toString();
};

const newuser_formdata = async () => {
      loading.value = true;
      errormessage.value = null
      const newuser1_apiurl = 'https://vaanam.w3webtechnologies.co.in/loandb/newuser1_insert.php'
      const formdata = new FormData()
      formdata.append('datetime', currentDateTime.value);
      formdata.append('Mobilenum', phoneNumber.value);
      formdata.append('ProofType', selectedOption.value);
      formdata.append('Proofdetails', proofid.value)
      formdata.append('Nproof', capturedImage.value);
      formdata.append('App_id', appid.value);


      try {
        const response = await fetch(newuser1_apiurl, {
          method: 'POST',
          body: formdata
        })
        if (!response.ok) {
          throw new Error('Failed to submit data. Please check your inputs.');
        }
        else {
          const userdata_res = await response.json()
          appid.value = userdata_res.id
          const encryptedAppId = encryptData(appid.value);
          router.push({ name: 'new_user2', query: { value: encryptedAppId } });      
        }

      }
      catch (err) {
        errorpopup.value=false
        errormessage.value = err.message
      }
      finally {
        loading.value = false
      }
    }


</script>

<style scoped>
video {
  border-radius: 10px;
  object-fit: cover;
}

img {
  border-radius: 10px;
  border: 2px solid #4CAF50;
}
</style>
