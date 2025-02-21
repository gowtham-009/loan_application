<template>
  <div v-if="isAuthenticated" class="main-container w-100" :style="{height: deviceHeight + 'px'}">
    <div class="w-100 boxex-1  d-flex justify-center align-center" :style="{height: boxex1Height + 'px'}">
      <logo/>
    </div>
    <div class="w-100 boxex-2 d-flex flex-column" :style="{height: boxex2Height + 'px'}">
      <div class="boxex  rounded-t-xl">
      <v-card class="rounded-t-xl">
        <v-tabs v-if="showMainContent" v-model="tab" align-tabs="center" stacked>
          <v-tab value="tab-1">Mobile Number</v-tab>
          <v-tab value="tab-2">Name</v-tab>
          <v-tab value="tab-3">ID</v-tab>
         
          
        </v-tabs>

        <v-tabs-window v-if="showMainContent" v-model="tab">
         
          
          <v-tabs-window-item value="tab-1" v-if="tab === 'tab-1'">
            <v-card>
              <v-sheet class="w-100 pa-2">
                <v-form @submit.prevent="mobile_filter">
                  <v-text-field
                    v-model="mobile"
                    :rules="mobilerules"
                    type="text"
                    hide-details
                    label="Mobile (must be exactly 10 digits)"
                    maxlength="10"  
                    @keypress="isNumber"   
                  ></v-text-field>
                  <v-btn class="mt-10 bg-deep-purple-accent-4" size="x-large" type="submit" block>Search</v-btn>
                </v-form>
              </v-sheet>
              <!-- Loading Spinner -->
          <div v-if="loading" class="w-100 d-flex justify-center">
            <v-progress-circular
              color="primary"
              indeterminate
            ></v-progress-circular>
          </div>

          <!-- Error Alert -->
          <div v-else-if="error" class="w-100 d-flex justify-center">
            <v-alert type="danger">
              <p>{{ error }}</p>
            </v-alert>
          </div>
             <div v-else class="w-100">
                <div v-for="datafilter in mobile_data" :key="datafilter.id" class="w-100 cards_filter">
                  <v-sheet class="w-100 pa-2 mt-2 bg-grey-lighten-5">
                    <v-card class="bg-grey-lighten-5 pa-2" variant="tonal">
                      <div class="w-100 d-flex justify-space-between pa-2">
                         <p class="text-indigo">ID:{{ datafilter.id }}</p>
                         <p class="text-indigo">APP ID:{{ datafilter.App_id }}</p>
                       </div>
                       <div class="w-100 pa-2">
                         <p class="text-black">Name:{{ datafilter.Name }}</p>
                         <p class="text-black">Mobile Number:{{ datafilter.MobileNum }}</p>
                     
                         <p class="text-black">Address:{{ datafilter.Address1 }}</p>
                         <p class="text-black">Mobile Number:{{ datafilter.MobileNum }}</p>
                     
                         <p class="text-black">Proof Type:{{ datafilter.ProofType }}</p>
                         <p class="text-black">Proof Details:{{ datafilter.ProofDetails }}</p>
                    
                         <p class="text-black">Place:{{ datafilter.Place }}</p> 
                      </div>

                      <div class="w-100 d-flex ga-1">
                        <div class="w-100"> <v-btn class="bg-yellow" @click="edit(datafilter)"  block>Edit</v-btn></div>
                        <div class="w-100"><v-btn class="bg-indigo" @click="loandata_post(datafilter)" block>Select</v-btn></div>
                      </div>
                    </v-card>
                  </v-sheet>
              </div>

             </div>

            </v-card>
          </v-tabs-window-item>

          <v-tabs-window-item value="tab-2" v-if="tab === 'tab-2'">
            <v-card>
              <v-sheet class="w-100 pa-2">
                <v-form @submit.prevent="nameplace_filter" >
                  <v-text-field
                   v-model="name" 
                   type="text"
                   hide-details
                   maxlength="25"   
                   @keypress="allowOnlyAlphabets($event)"
                     @input="name = name.toUpperCase()"
                   label="Name (type min 25 characters)">
                  </v-text-field>
                  <v-text-field
                   v-model="place"
                   type="text"
                   hide-details
                   maxlength="25" 
                   @keypress="allowOnlyAlphabets($event)"  
                     @input="place = place.toUpperCase()"
                    label="Place (type min 25 characters)">
                  </v-text-field>
                  <v-btn class="mt-10 bg-deep-purple-accent-4" size="x-large" type="submit" block>Search</v-btn>
                </v-form>
              </v-sheet>
               <!-- Loading Spinner -->
          <div v-if="loading" class="w-100 d-flex justify-center">
            <v-progress-circular
              color="primary"
              indeterminate
            ></v-progress-circular>
          </div>

          <!-- Error Alert -->
          <div v-else-if="error" class="w-100 d-flex justify-center">
            <v-alert type="danger">
              <p>{{ error }}</p>
            </v-alert>
          </div>
             <div v-else class="w-100">
                <div v-for="np_filter in nameplace_data" :key="np_filter.id" class="w-100 cards_filter">
                  <v-sheet class="w-100 pa-2 mt-2 bg-grey-lighten-5">
                    <v-card class="bg-grey-lighten-5 pa-2" variant="tonal">
                      <div class="w-100 d-flex justify-space-between pa-2">
                         <p class="text-indigo">ID:{{ np_filter.id }}</p>
                         <p class="text-indigo">APP ID:{{ np_filter.App_id }}</p>
                       </div>
                       <div class="w-100 pa-2">
                         <p class="text-black">Name:{{ np_filter.Name }}</p>
                         <p class="text-black">Mobile Number:{{ np_filter.MobileNum }}</p>
                     
                         <p class="text-black">Address:{{ np_filter.Address1 }}</p>
                         <p class="text-black">Mobile Number:{{ np_filter.MobileNum }}</p>
                     
                         <p class="text-black">Proof Type:{{ np_filter.ProofType }}</p>
                         <p class="text-black">Proof Details:{{ np_filter.ProofDetails }}</p>
                    
                         <p class="text-black">Place:{{ np_filter.Place }}</p> 
                      </div>

                      <div class="w-100 d-flex ga-1">
                        <div class="w-100"> <v-btn class="bg-yellow"  @click="edit(np_filter)" block>Edit</v-btn></div>
                        <div class="w-100"><v-btn class="bg-indigo"  @click="loandata_post(np_filter)" block>Select</v-btn></div>
                      </div>
                    </v-card>
                  </v-sheet>
              </div>
             </div>

            </v-card>
          </v-tabs-window-item>


          <v-tabs-window-item value="tab-3">
  <v-card>
    <div class="main_id_box">
      <v-sheet class="w-100 pa-2 mt-2">
        <v-form @submit.prevent="proofid_filter">
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
          <v-text-field
            v-model="idnumber"
            :rules="rules"
            label="ID number (16 alphanumeric characters)"
            maxlength="16"
            @keypress="isAlphaNumeric"
            @input="idnumber = idnumber.toUpperCase()"
          ></v-text-field>
          <v-btn class="mt-3 bg-deep-purple-accent-4" size="x-large" type="submit" block>Search</v-btn>
        </v-form>
      </v-sheet>

      <!-- Loading Spinner -->
      <div v-if="loading" class="w-100 d-flex justify-center">
            <v-progress-circular
              color="primary"
              indeterminate
            ></v-progress-circular>
          </div>

          <!-- Error Alert -->
          <div v-else-if="error" class="w-100 d-flex justify-center">
            <v-alert type="danger">
              <p>{{ error }}</p>
            </v-alert>
          </div>
      <div v-else class="w-100">
        <div v-for="dataproof in proofid_data" :key="dataproof.id" class="w-100 cards_filter">
          <v-sheet class="w-100 pa-2 mt-2 bg-grey-lighten-5">
            <v-card class="bg-grey-lighten-5 pa-2" variant="tonal">
              <div class="w-100 d-flex justify-space-between pa-2">
                <p class="text-indigo">ID: {{ dataproof.id }}</p>
                <p class="text-indigo">APP ID: {{ dataproof.App_id }}</p>
              </div>
              <div class="w-100 pa-2">
                <p class="text-black">Name: {{ dataproof.Name }}</p>
                <p class="text-black">Mobile Number: {{ dataproof.MobileNum }}</p>
                <p class="text-black">Address: {{ dataproof.Address1 }}</p>
                <p class="text-black">Proof Type: {{ dataproof.ProofType }}</p>
                <p class="text-black">Proof Details: {{ dataproof.ProofDetails }}</p>
                <p class="text-black">Place: {{ dataproof.Place }}</p>
              </div>
              <div class="w-100 d-flex ga-1">
                <div class="w-100">
                  <v-btn class="bg-yellow"  @click="edit(dataproof)"  block>Edit</v-btn>
                </div>
                <div class="w-100">
                  <v-btn class="bg-indigo"  @click="loandata_post(dataproof)" block>Select</v-btn>
                </div>
              </div>
            </v-card>
          </v-sheet>
        </div>
      </div>
    </div>
  </v-card>
</v-tabs-window-item>
<div v-if="list">
  
  <div v-if="loading" class="w-100 d-flex justify-center">Loading...</div>
      <div v-else-if="error" class="w-100">{{ error_proof }}</div>
      <div v-else class="w-100">
        <div v-for="u_Data in userdata" :key="u_Data.id" class="w-100 cards_filter">
          <v-sheet class="w-100 pa-2 mt-2 bg-grey-lighten-5">
            <v-card class="bg-grey-lighten-5 pa-2" variant="tonal">
              <div class="w-100 d-flex justify-space-between pa-2">
                <p class="text-indigo">ID: {{ u_Data.id }}</p>
                <p class="text-indigo">APP ID: {{ u_Data.App_id }}</p>
              </div>
              <div class="w-100 pa-2">
                <p class="text-black">Name: {{ u_Data.Name }}</p>
                <p class="text-black">Mobile Number: {{ u_Data.MobileNum }}</p>
                <p class="text-black">Address: {{ u_Data.Address1 }}</p>
                <p class="text-black">Proof Type: {{ u_Data.ProofType }}</p>
                <p class="text-black">Proof Details: {{ u_Data.ProofDetails }}</p>
                <p class="text-black">Place: {{ u_Data.Place }}</p>
              </div>
              <div class="w-100 d-flex ga-1">
                <div class="w-100">
                  <v-btn class="bg-yellow"  @click="edit(u_Data)"  block>Edit</v-btn>
                </div>
                <div class="w-100">
                  <v-btn class="bg-indigo"  @click="loandata_post(u_Data)" block>Select</v-btn>
                </div>
              </div>
            </v-card>
          </v-sheet>
        </div>
      </div>
</div>

</v-tabs-window>

     

      

      
      
    </v-card>
    </div>
    </div>
  </div>
</template>

<script>
import logo from '~/components/logo.vue'
import { ref, watch, computed, onBeforeMount } from 'vue';
import CheckboxButton from '~/components/CheckboxButton.vue'; // Adjust the path as necessary
import { useRouter } from 'vue-router'
import CryptoJS from 'crypto-js';
export default {
  components: {
    logo,
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
    const mobile = ref('');
    const name = ref('');
    const place = ref('');
    const selectedOption = ref('');
    const idnumber = ref('');
    const router = useRouter()
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
  //mobile filter
    const loading=ref(false)
    const error=ref(null)
    const mobile_data=ref([])
    const list=ref(true)


   const userdata=ref([])
    const getuserdata=async()=>{
      loading.value=true
      error.value=null
      const apiurl='https://vaanam.w3webtechnologies.co.in/loandb/getlastdata_user.php'
    

      try {
        const response=await fetch(apiurl,{
          method:"GET",
       
        })
        if(!response.ok){
          throw new Error('Failed to submit data. Please check your inputs.');
        }
        else{
          const data=await response.json()
          userdata.value=data
        
        }
      } catch (error) {
        error.value=error.message
      }
      finally{
        loading.value=false
      }
    }
    
    getuserdata()
    const mobile_filter=async()=>{
      list.value=false
      loading.value=true
      error.value=null
      const apiurl='https://vaanam.w3webtechnologies.co.in/loandb/search_filter.php'
      const formdata=new FormData()
      formdata.append('mobilenumber', mobile.value)

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
          mobile_data.value=data
        }
      } catch (error) {
        error.value=error.message
      }
      finally{
        loading.value=false
      }
    }

    //name place filter
 
   
    const nameplace_data=ref([])
    const nameplace_filter=async()=>{
      list.value=false
      loading.value=true
      error.value=null
      const np_apiurl='https://vaanam.w3webtechnologies.co.in/loandb/search_filter.php'
      const npformdata=new FormData()
      npformdata.append('name', name.value)
      npformdata.append('place', place.value)

    

      try {
        const response=await fetch(np_apiurl,{
          method:"POST",
          body:npformdata
        })
        if(!response.ok){
          throw new Error('Failed to submit data. Please check your inputs.');
        }
        else{
          const data=await response.json()
          nameplace_data.value=data
          
        }
      } catch (error) {
        error.value=error.message
      }
      finally{
        loading.value=false
      }
    }

    //proof id filter
     
 
  
  const proofid_data=ref([])
  const proofid_filter = async () => {
    list.value=false
  loading.value = true
  error.value = null
  const proofid_apiurl = 'https://vaanam.w3webtechnologies.co.in/loandb/search_filter.php'
  const proofformdata = new FormData()
  proofformdata.append('prooftype', selectedOption.value)
  proofformdata.append('proofid', idnumber.value)

 

  try {
    const response_proof = await fetch(proofid_apiurl, {
      method: 'POST',
      body: proofformdata,
    })
    if (!response_proof.ok) {
      throw new Error('Failed to submit data. Please check your inputs.')
    } else {
      const proofiddata = await response_proof.json()
      proofid_data.value = proofiddata
    }
  } catch (error) {
    error.value = error.message
  } finally {
    loading.value = false
  }
}
const ENCRYPTION_KEY = "loanapp098765";

const encrypt = (text) => {
  return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
};

const loandata_post = async (loandata) => {
  const encryptedAppId = encrypt(loandata.App_id);

  router.push({
    name: 'new_loan',
    query: {
      appid: encryptedAppId, 
      enable: 'true'
    }
  });
};


const edit=(appid)=>{
  const id = appid.App_id;
  const secretKey = "appiduser"; 
  const encryptedId = CryptoJS.AES.encrypt(id, secretKey).toString();
  router.push({ path: "/new_user", query: { encryptedId } });
}

    return {
      list,
      options,selectedOption,
      mobile,
      name,
      place,
      idnumber,
      loading,
      error,
      mobile_data,
      nameplace_data,
      proofid_data,
      router,
      mobile_filter,
      nameplace_filter,
      proofid_filter,
      isAuthenticated,
      //mobile_datapost,
      loandata_post,
      ENCRYPTION_KEY,
      encrypt,
     
      edit,

      getuserdata,
      userdata
    };
  },
  data() {
    return {
      deviceWidth: 0,
      deviceHeight: 0,
      boxex1Height: 0,
      boxex2Height: 0,
      tab: 'tab-1',
    showSearch: false,
    showMainContent: true,
    showNameContain: false,
    showMobileContain:false,
    resultName: '', // This will hold the search result for Name
    resultPlace: '', // This will hold the search result for Place
    searchResult: '', // This will hold the value to be displayed in search_c
    mobileResult:'',

    };
  },
  mounted() {
    this.updateDeviceDimensions(); // Initial call to set dimensions on component mount
    window.addEventListener('resize', this.updateDeviceDimensions); // Listen for window resize events
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
    selectTag(tag) {
    this.selectedTag = tag;
  },
 
 

  isNumber(e) {
      const charCode = e.keyCode ? e.keyCode : e.which;
      if (charCode < 48 || charCode > 57) { // Ensures only numbers are entered
        e.preventDefault();
      }
    },
    allowOnlyAlphabets(event) {
      const char = String.fromCharCode(event.keyCode || event.which);
      const pattern = /^[a-zA-Z]+$/;
      
      // Prevent the input if the character doesn't match the alphabet pattern
      if (!pattern.test(char)) {
        event.preventDefault();
      }
    },
    isAlphaNumeric(e) {
      const charCode = e.keyCode ? e.keyCode : e.which;
      const charStr = String.fromCharCode(charCode);
      if (!/^[a-zA-Z0-9]$/.test(charStr)) { // Only allows alphanumeric characters
        e.preventDefault();
      }
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

</style>
