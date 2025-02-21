<template>
  <div v-if="isAuthenticated">
    <div class="w-100 pa-1 bg-blue" :style="{ height: box1Height + 'px' }" style="border: 2px solid black;"></div>
    <div class="w-100 d-flex flex-column justify-space-between pa-1" :style="{ height: box2Height + 'px' }" style="border: 2px solid black;">
      
      <div v-if="loading" class="w-100 d-flex justify-center">
        <v-progress-circular
      :size="50"
      color="primary"
      indeterminate
    ></v-progress-circular>
      </div>
      <div v-else-if="error" class="w-100 d-flex justify-center">
        <v-alert
          title=""
          type="success"
        >
         {{ error }}
      </v-alert>
            </div>
    
      <div v-else class="w-100" style="overflow: hidden; overflow-y: scroll;"> 
        <p class="text-h5 text-center">Loan Summary</p>
        <div class="w-100 pa-1 d-flex ga-2 mt-2">
          <v-text-field label="Loan Number" v-model="loanno" variant="solo" readonly></v-text-field>
          <v-text-field label="Name" v-model="name" variant="solo" readonly></v-text-field>
        </div>
        <div class="w-100 pa-1 d-flex ga-2">
          <v-text-field label="Address" v-model="address" variant="solo" readonly></v-text-field>
          <v-text-field label="Place" v-model="place" variant="solo" readonly></v-text-field>
        </div>
        <div class="w-100 pa-1 d-flex ga-2">
          <v-text-field label="Mobile Number" v-model="mobileno" variant="solo" readonly></v-text-field>
          <v-text-field label="ID Number" v-model="idnumber" variant="solo" readonly></v-text-field>

        </div>
        <div class="w-100 pa-1 d-flex ga-2">
          <v-text-field label="Loan Amount" v-model="loanamount" variant="solo" readonly></v-text-field>
          <v-text-field label="Loan Type" v-model="loantype" variant="solo" readonly></v-text-field>
        </div>
        <div class="w-100 pa-1 d-flex ga-2">
          <v-text-field label="Loan Date" v-model="loandate" variant="solo" readonly></v-text-field>
          <v-text-field label="Material Details" v-model="mdetails" variant="solo" readonly></v-text-field>
        </div>
        <div class="w-100 pa-1 d-flex ga-2">
          <v-text-field label="Weight" v-model="weight" variant="solo" readonly></v-text-field>
          <v-text-field label="Status" v-model="status" variant="solo" readonly></v-text-field>
        </div>
        <div class="w-100 pa-1 d-flex ga-2"></div>
        <!-- <div class="w-100 pa-1" style="border: 1px solid red;">
          <span>NProof</span>
          <img :src="nproof" alt="">
        </div>
        <div class="w-100 pa-1" style="border: 1px solid red;">
          <span>NPerson</span>
          <img :src="nperson" alt="">
        </div>
        <div class="w-100 pa-1" style="border: 1px solid red;">
          <span>NPorul</span>
          <img :src="nproul" alt="">
        </div> -->
      
      </div>
      <div class="w-100">
         
        <div class="w-100" >
          <v-btn class="btn bg-red" block @click="delete_Data()">Delete</v-btn>
        </div>
        <div class="w-100 d-flex ga-1 mt-1">
          <div class="w-100" >
            <v-btn class="btn bg-yellow"  block @click="mp_edit()">Edit</v-btn>
          </div>
          <div class="w-100" >
            <v-btn class="btn bg-green"  block @click="dialog = true">Submit</v-btn>
          </div>
        </div>
      </div>
    </div>
  </div>

  <v-dialog
      v-model="dialog"
      width="auto"
    >
      <v-card
        max-width="500"
      
      >
      <div class="w-100 pa-1 d-flex flex-column justify-center align-center" >
        <img src="https://cdn-icons-png.flaticon.com/512/5290/5290058.png" alt="" width="100" height="100">
        <p class="text-h5 pa-1">Your Loan Successfully Submited</p>
      </div>
        <template v-slot:actions>
          <v-btn
            class="ms-auto"
            text="Ok"
           @click="success()"
          ></v-btn>
        </template>
      </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import CryptoJS from 'crypto-js'; 
const isAuthenticated = ref(false)

onBeforeMount(() => {
  const token = localStorage.getItem('token')
  
  if (!token) {
   
    router.replace('/login')
  } else {
    
    isAuthenticated.value = true
  }
})
// Declare variables and hooks
const dialog=ref(false)
const deviceHeight = ref(0);
const box1Height = ref(0);
const box2Height = ref(0);
const loanno=ref('')
const name=ref('')
  const mobilenumber=ref('')
  const address=ref('')
  const place=ref('')
  const mobileno=ref('')
  const idnumber=ref('')
  const loanamount=ref('')
  const loantype=ref('')
  const loandate=ref('')
  const mdetails=ref('')
  const weight=ref('')
  const status=ref('')
  const nproof=ref('')
  const nperson=ref('')
  const nproul=ref('')



const route = useRoute();
    const secretKey = "loanidmust123"; 
    let decryptedId = "";

    if (route.query.encryptedId) {
      try {
        const bytes = CryptoJS.AES.decrypt(route.query.encryptedId, secretKey);
        decryptedId = bytes.toString(CryptoJS.enc.Utf8);
      } catch (error) {
        console.error("Failed to decrypt the ID:", error);
      }
    }



const updateDeviceDimensions = () => {
  deviceHeight.value = window.innerHeight;
  box1Height.value = Math.floor(deviceHeight.value * 0.08); 
  box2Height.value = Math.floor(deviceHeight.value * 0.92); 
};

onMounted(() => {
  updateDeviceDimensions();
  window.addEventListener('resize', updateDeviceDimensions);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateDeviceDimensions);
});

const loading=ref(false);
  const error=ref(null)
 
  const getdata=async()=>{
    loading.value=true
    error.value=null
    const apiurl_loan='https://vaanam.w3webtechnologies.co.in/loandb/loan_getdata.php'
    const formdata_loan=new FormData()
    formdata_loan.append('loanid', decryptedId)
    try {
      const response=await fetch(apiurl_loan,{
        method:"POST",
        body:formdata_loan
      })
      if(!response.ok){
        throw new Error('Failed your response try again!');
        }
        else{
         
          const data_loan=await response.json()
          loanno.value=data_loan[0].Loan_Number
          name.value=data_loan[0].Name
         
          address.value=data_loan[0].Address1
          place.value=data_loan[0].Place
          mobileno.value=data_loan[0].MobileNum
          idnumber.value=data_loan[0].ProofDtails
          loanamount.value=data_loan[0].Weight
          loantype.value=data_loan[0].Loan_Type
          loandate.value=data_loan[0].Loan_Date
          mdetails.value=data_loan[0].Pawn_Details
          weight.value=data_loan[0].Weight
          status.value=data_loan[0].Status
          nproof.value=data_loan[0].nProof
          nperson.value=data_loan[0].nPerson
          nproul.value=data_loan[0].nPorul

          
        }
      } catch (error) {
        error.value=error.message
      }
      finally{
        loading.value=false

      }
  }


  getdata()

  const delete_Data=async()=>{
    loading.value=true
    error.value=null
    const apiurl_loan='http://vaanam.w3webtechnologies.co.in/loandb/loandata_delete.php'
    const formdata_loan=new FormData()
    formdata_loan.append('loanid', decryptedId)
    try {
      const response=await fetch(apiurl_loan,{
        method:"POST",
        body:formdata_loan
      })
      if(!response.ok){
        throw new Error('Failed your response try again!');
        }
        else{
         
          const data_loan=await response.json()
        
        }
      } catch (error) {
        error.value=error.message
      }
      finally{
        loading.value=false
        getdata()
      }
  }
 const router=useRouter()
  const mp_edit=()=>{
  const id = decryptedId; // The ID to encrypt
  const secretKey = "loanid12345"; // Use a strong secret key
  const encryptedId = CryptoJS.AES.encrypt(id, secretKey).toString();

  // Navigate to page2.vue with the encrypted ID
  router.push({ path: "/loan_search_edit", query: { encryptedId } });
}

const success=()=>{
  router.push({ path: "/dashboard" });
}

</script>

<style scoped>

</style>
