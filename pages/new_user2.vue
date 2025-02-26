<template>
  <div v-if="isAuthenticated">
    <div class="d-flex justify-center h-screen d-flex justify-center align-center" v-if="loading">
      <v-progress-circular color="purple" indeterminate></v-progress-circular>
  </div>
    <form @submit.prevent="handleSubmit" v-if="userform">
      <div v-if="errorpopup" style="position: absolute; width: 100%; z-index: 10;">
        <v-alert title="Input fields are Required !" type="error">
          {{ errormessage }}
        </v-alert>

      </div>
    
      <div class="bg-blue d-flex justify-center align-center" :style="{ height: box1Height + 'px' }">
        <span class="text-h6">New User2</span>
      </div>
      <div class="pa-2 " :style="{ height: box2Height + 'px' }">
        <v-text-field class="mt-3" v-model="name" variant="solo-filled" type="text" hide-details maxlength="25"
          @keypress="allowOnlyAlphabets($event)" @input="name = name.toUpperCase()"
          label="Name (type min 25 characters)" />
        <v-text-field v-model="address" :rules="addressrules" label="Address" type="text" hide-details
          class="w-100 mt-2" variant="solo-filled" @input="formatToUppercase"></v-text-field>

        <v-text-field v-model="place" variant="solo-filled" class="mt-3" type="text" hide-details maxlength="25" @keypress="allowOnlyAlphabets($event)"
          @input="place = place.toUpperCase()" label="Place (type min 25 characters)">
        </v-text-field>

        <div class="w-100 pa-1 mt-1 d-flex justify-center align-center flex-column" v-if="cameramain">
          <div class="w-100 d-flex justify-start">
            <p class="text-left"> NProof</p>
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

        <div class="w-full pa-2" v-if="showphoto">
          <img :src="capturedImage" alt="Captured Photo" class="w-100 rounded shadow-lg" />
          <v-btn block @click="retake()" class="bg-red text-white">Re Take</v-btn>
        </div>
      </div>

      <div class=" d-flex ga-1 d-flex gap-2" :style="{ height: box3Height + 'px' }">
        <div class="w-100 d-flex justify-center align-end">
          <v-btn @click="back()" class="bg-yellow text-black" block>Back</v-btn>
        </div>
        <div class="w-100 d-flex justify-center align-end">
          <v-btn block type="submit" class="bg-green text-white">
            Next
          </v-btn>
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
import { useRouter, useRoute } from 'vue-router';
import CryptoJS from 'crypto-js';
import { errorMessages } from 'vue/compiler-sfc';
const cameramain = ref(true)
const showphoto = ref(false)
const router = useRouter();
const route = useRoute();

const addressrules = [
  v => !!v || 'Address is required',
  v => v.length <= 1000 || 'Maximum 1000 characters allowed',
  v => /^[\w\s\W]+$/.test(v) || 'Only alphanumeric and special characters are allowed',
]




const secretKey = "appidsecreatekey001";
const decryptedValue = ref('');

onMounted(() => {
  const encryptedData = route.query.data;
  if (encryptedData) {
    const bytes = CryptoJS.AES.decrypt(decodeURIComponent(encryptedData), secretKey);
    decryptedValue.value = bytes.toString(CryptoJS.enc.Utf8);
    getdata(decryptedValue.value)
  }
});
const loading = ref(false)
const userform=ref(true)
const errorpopup = ref(false)
const errormessage = ref(null)
const address = ref('');
const place = ref('');
const name = ref('');




const isAuthenticated = ref(false);
const cameraoperation = ref(true);
const cameracontainer = ref(false);
const videoElement = ref(null);
const canvasElement = ref(null);
const capturedImage = ref(null);

const dialog = ref(false)

const allowOnlyAlphabets = (event) => {
  const char = String.fromCharCode(event.keyCode || event.which);
  const pattern = /^[a-zA-Z]+$/;

  if (!pattern.test(char)) {
    event.preventDefault();
  }
};

const deviceHeight = ref(0)
const box1Height = ref(0)
const box2Height = ref(0)
const box3Height = ref(0)

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


const formatToUppercase = () => {
  name.value = name.value.toUpperCase();
  address.value = address.value.toUpperCase();
  place.value = place.value.toUpperCase();
};


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

const handleSubmit = () => {
  if (!name.value) {
    errorpopup.value = true;
    errormessage.value = 'Name is required';
    return;
  }
  if (!address.value) {
    errorpopup.value = true;
    errormessage.value = 'Address is Required';
    return;
  }
  if (!place.value) {
    errorpopup.value = true;
    errormessage.value = 'Place is required';
    return;
  }
  if (!capturedImage.value) {
    errorpopup.value = true;
    errormessage.value = 'Proof photo is Required';
    return;
  }
  errorpopup.value = false;
  errormessage.value = '';
  newuser2_formdata()
};

const newuser2_formdata = async () => {

  loading.value = true;
  userform.value=false
  errorMessages.value = null;

  const newuser2_apiurl = 'https://vaanam.w3webtechnologies.co.in/loandb/newuser2_insert.php';
  const formdata = new FormData();

  // Append form fields
  formdata.append('appid', decryptedValue.value);
  formdata.append('name', name.value);
  formdata.append('address1', address.value);
  formdata.append('place', place.value);
  formdata.append('nperson', capturedImage.value);

  try {
    const response = await fetch(newuser2_apiurl, {
      method: 'POST',
      body: formdata,
    });

    // Check for HTTPs error responses
    if (!response.ok) {
      throw new Error('Failed to submit data. Please check your inputs.');
    }

    // Handle JSON response
    const userdata_res = await response.json();
    alert('successfully added')
  } catch (err) {
    // Catch and display errors
    errorpopup.value = false
    errormessage.value = err.message;
  } finally {

    loading.value = false;
    userform.value=true
  }
};


const getdata = async (appid) => {


  loading.value = true;
  userform.value=false
  errormessage.value = null
  const newuser1_apiurl = 'https://vaanam.w3webtechnologies.co.in/loandb/getuser_data.php'
  const formdata = new FormData()
  formdata.append('appid', appid);


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
      name.value = userdata_res[0].Name
      address.value = userdata_res[0].Address1
      place.value = userdata_res[0].Place
      capturedImage.value = userdata_res[0].nPerson
      if (capturedImage.value) {
        cameramain.value = false
        showphoto.value = true
      }



    }

  }
  catch (err) {
    errorpopup.value = false
    errormessage.value = err.message
  }
  finally {
    loading.value = false
    userform.value=true
  }
}
const retake = () => {
  cameramain.value = true
  showphoto.value = false
  capturedImage.value = ''
 
}

const back = () => {
  const newValue = decryptedValue.value


  const encryptedValue = CryptoJS.AES.encrypt(newValue, secretKey).toString();


  router.push({ path: '/new_user', query: { data: encodeURIComponent(encryptedValue) } });
};

</script>

<style></style>