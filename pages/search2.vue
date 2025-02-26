<template>
  <div v-if="isAuthenticated">
    <div v-if="errorpopup" style="position: absolute; width: 100%; z-index: 10;">
          <v-alert title="Input fields are Required !" type="error">
            {{ errormessage }}
          </v-alert>
         
        </div>
    <div class="bg-blue d-flex justify-center align-center w-100" :style="{ height: box1Height + 'px' }"
      style=" position: sticky; z-index: 3;">
      <logo />
    </div>
    <div class="pa-2 d-flex flex-column"  >
  <v-tabs v-model="tab" align-tabs="center">
    <v-tab value="mobilenumber">Mobile Number</v-tab>
    <v-tab value="name">Name</v-tab>
    <v-tab value="id">ID</v-tab>
  </v-tabs>

  <v-tabs-window v-model="tab" >
    <v-tabs-window-item value="mobilenumber">
      <v-form @submit.prevent="filterdata('mobile')">
      <v-text-field class="mt-3" v-model="phoneNumber" label="Mobile Number" variant="solo-filled"
        @input="validateInput" :rules="[validateLength]" maxlength="10"></v-text-field>
      <v-btn class="bg-deep-purple-accent-4" size="x-large" type="submit" block>Search</v-btn>
    </v-form>
    </v-tabs-window-item>

    <v-tabs-window-item value="name">
      <v-form @submit.prevent="filterdata('nameplace')">
      <v-text-field class="mt-3" v-model="name" variant="solo-filled" type="text" hide-details maxlength="25"
        @keypress="allowOnlyAlphabets($event)" @input="name = name.toUpperCase()" label="Name (type min 25 characters)">
      </v-text-field>

      <v-text-field class="mt-2" v-model="place" variant="solo-filled" type="text" hide-details maxlength="25"
        @keypress="allowOnlyAlphabets($event)" @input="place = place.toUpperCase()" label="Place (type min 25 characters)">
      </v-text-field>
      <v-btn class="mt-2 bg-deep-purple-accent-4" size="x-large" type="submit" block>Search</v-btn>
      </v-form>
    </v-tabs-window-item>

    <v-tabs-window-item value="id">
      <v-form @submit.prevent="filterdata('proof')">
      <CheckboxButton v-for="option in options" :key="option.value" :name="'proof-type'" :label="option.label"
        :value="option.value" v-model="selectedOption" class="pa-2" />

      <v-text-field class="mt-2" variant="solo-filled" v-model="proofid" :counter="16" :rules="proofRules"
        label="Proof ID / Number" placeholder="Enter Unique ID Number" hide-details
        @input="proofid = proofid.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 16)"></v-text-field>

      <v-btn class="mt-3 bg-deep-purple-accent-4" size="x-large" type="submit" block>Search</v-btn>
      </v-form>
    </v-tabs-window-item>
  </v-tabs-window>
</div>


<div class="w-100 pa-2" style=" height: 510px; overflow-y: auto;">
  <div class="d-flex justify-center" v-if="loading">
      <v-progress-circular color="purple" indeterminate></v-progress-circular>
  </div>
  <div class="w-100 d-flex flex-column ga-2" v-if="datashow">
    <div v-for="globaldata in userdata" :key="globaldata.id">
      <v-card class="bg-grey-lighten-5 pa-2" variant="tonal">
        <div class="w-100 d-flex justify-space-between pa-2">
          <p class="text-indigo">ID: {{ globaldata.id }}</p>
          <p class="text-indigo">APP ID: {{ globaldata.App_id }}</p>
        </div>
        <div class="w-100 pa-2">
          <p class="text-black">Name: {{ globaldata.Name }}</p>
          <p class="text-black">Mobile Number: {{ globaldata.MobileNum }}</p>
          <p class="text-black">Address: {{ globaldata.Address1 }}</p>
          <p class="text-black">Proof Type: {{ globaldata.ProofType }}</p>
          <p class="text-black">Proof Details: {{ globaldata.ProofDetails }}</p>
          <p class="text-black">Place: {{ globaldata.Place }}</p>
        </div>
        <div class="w-100 d-flex ga-1">
          <div class="w-100"><v-btn class="bg-yellow" @click="editdata(globaldata.App_id)" block>Edit</v-btn></div>
          <div class="w-100"><v-btn class="bg-indigo" @click="selectloandata(globaldata.App_id)" block>Select</v-btn></div>
        </div>
      </v-card>
    </div>
  </div>
</div>

  </div>
</template>

<script setup>
import logo from '~/components/logo.vue'
import { useRouter, useRoute } from 'vue-router'
import CheckboxButton from '~/components/CheckboxButton.vue';
import CryptoJS from 'crypto-js';

const loading = ref(false)
const errorpopup = ref(false)
const errormessage=ref(null)
const datashow=ref(false)
const tab = ref(null)
const isAuthenticated = ref(false)
const deviceHeight = ref(0)
const box1Height = ref(0)




const phoneNumber = ref('')
const name = ref('')
const place = ref('')
const selectedOption = ref('');
const proofid = ref('')
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
  box1Height.value = deviceHeight.value * 0.10

}


onMounted(() => {
  getuserdata()
  updateSizes()
  window.addEventListener('resize', updateSizes) // Update sizes on window resize
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateSizes) // Clean up event listener
})

const validateInput = () => {
  phoneNumber.value = phoneNumber.value.replace(/\D/g, "").slice(0, 10);
};

const validateLength = () => {
  return phoneNumber.value.length === 10 || "Number must be exactly 10 digits";
};

const allowOnlyAlphabets = (event) => {
  const char = String.fromCharCode(event.keyCode || event.which);
  const pattern = /^[a-zA-Z]+$/;

  if (!pattern.test(char)) {
    event.preventDefault();
  }
};


onBeforeMount(() => {
  const token = localStorage.getItem('token')

  if (!token) {

    router.replace('/login')
  } else {

    isAuthenticated.value = true
  }
})

const userdata = ref([])
const getuserdata = async () => {

loading.value=true
errormessage.value=null

  const apiurl = 'https://vaanam.w3webtechnologies.co.in/loandb/getlastdata_user.php'


  try {
    const response = await fetch(apiurl, {
      method: "GET",

    })
    if (!response.ok) {
      throw new Error('Failed to submit data. Please check your inputs.');
    }
    else {
      const data = await response.json()
      if(data){
        userdata.value = data
      }
      else{
        userdata.value='No Found Data'
      }
     

    }
  } 
  catch (error) {
    errorpopup.value=true
    errormessage.value = error.message
  }
  finally {
    loading.value=false
    datashow.value=true
  }
}

const filterdata=async(filtermode)=>{

  loading.value=true
  datashow.value=false
errormessage.value=null
  const apiurl='https://vaanam.w3webtechnologies.co.in/loandb/search_filter.php'
  const formdata=new FormData()
 if(filtermode=='mobile'){
  formdata.append('mobilenumber', phoneNumber.value)
 }
 else if(filtermode=='nameplace'){
  formdata.append('name', name.value)
  formdata.append('place', place.value)
 }
 else if(filtermode=='proof'){
  formdata.append('prooftype', selectedOption.value)
  formdata.append('proofid', proofid.value)
 }

 try {
  const response=await fetch(apiurl,{
          method:"POST",
          body:formdata
        })
        if(!response.ok){
          throw new Error('Failed to submit data. Please check your inputs.');
        }
        else{
          const data=await response.json()
          if(data.length>0){
            userdata.value=data
          }
          else{
            userdata.value='No data Found'
          }
         
        }
  
 } catch (error) {
  errorpopup.value=true
  errormessage.value = error.message
 }
 finally {
    loading.value=false
    datashow.value=true
  }
}


const secretKey = "appidsecreatekey001";
const router=useRouter()
const editdata=(appid)=>{
  const newValue = appid
  const encryptedValue = CryptoJS.AES.encrypt(newValue, secretKey).toString();
  router.push({ path: '/new_user', query: { data: encodeURIComponent(encryptedValue) } });
}


const selectloandata=(appid)=>{
  const newValue = appid
  const encryptedValue = CryptoJS.AES.encrypt(newValue, secretKey).toString();
  router.push({ path: '/new_loan', query: { data: encodeURIComponent(encryptedValue), enable: 'true' } });
}
</script>

<style></style>