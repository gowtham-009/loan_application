<template>
  <div v-if="isAuthenticated" class="main-container w-100" :style="{height: deviceHeight + 'px'}">
    <div class="w-100 boxex-1  d-flex justify-center align-center" :style="{height: boxex1Height + 'px'}">
      <logo/>
    </div>
    <div class="w-100 boxex-2 d-flex flex-column" :style="{height: boxex2Height + 'px'}">
      <div class="boxex  rounded-t-xl">
      <v-card class="rounded-t-xl">
        <v-tabs v-if="showMainContent" v-model="tab" align-tabs="center" >
          <v-tab value="tab-1">Mobile Number</v-tab>
          <v-tab value="tab-2">Name</v-tab>
          <v-tab value="tab-3">ID</v-tab>
         
          
        </v-tabs>

        <v-tabs-window v-if="showMainContent" v-model="tab">
         
          
          <v-tabs-window-item value="tab-1" v-if="tab === 'tab-1'">
            <v-card>
              <v-sheet class="w-100 pa-2">
                <v-form @submit.prevent="loansearch">
                  <v-text-field
                    v-model="mobile"
                    :rules="mobileRules"
                    type="number"
                    hide-details
                    label="Mobile (must be exactly 10 digits)"
                  maxlength="10"
                   @input="onInputMobile"
                  ></v-text-field>       
                  <v-text-field
                    v-model="place"
                    :rules="placeRules"
                    label="Place"
                    @input="handleInput"
                    class="mt-2"
                  ></v-text-field>
                  <v-btn class="bg-deep-purple-accent-4" size="x-large" type="submit" block>Search</v-btn>
                </v-form>
              </v-sheet>
            </v-card>
            <v-sheet class="w-100 pa-1">
        <div class="w-100" style=" overflow-y: auto;"> <!-- Set fixed height here -->
          
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

          <!-- Content Display -->
          <div v-else class="w-100 d-flex flex-column bg-white ga-3">
            <div v-for="datafilter_mp in paginatedData" :key="datafilter_mp.id" class="w-100 pa-1 rounded-lg bg-blue-grey-lighten-4">
              
              <!-- Loan Info -->
              <div class="w-100 d-flex">
                <div class="w-100 pa-1">
                  <p class="text-left">LOAN NUMBER: {{ datafilter_mp.Loan_Number }}</p>
                  <p class="text-left">LOAN VALUE: {{ datafilter_mp.Loan_Value }}</p>
                </div>
                <div class="w-100 pa-1">
                  <p class="text-right">Date: {{ datafilter_mp.Loan_Date }}</p>
                  <p class="text-right">TYPE: {{ datafilter_mp.Loan_Type }}</p>
                  <p  class="text-right">DETAILS: {{ datafilter_mp.Pawn_Details }}</p>
                  <p  class="text-right">loanid: {{ datafilter_mp.Loan_appid }}</p>
                </div>
              </div>

              <!-- Customer Details -->
              <div class="w-100 pa-1">
                <p class="text-left">NAME: {{ datafilter_mp.Name }}</p>
                <span>Address: {{ datafilter_mp.Address1 }}</span><br>
                <span>Mobile Number: {{ datafilter_mp.MobileNum }}</span><br>
              </div>

              <!-- Buttons -->
              <div class="w-100 pa-1 d-flex gap-2">
                <div class="w-100">
                  <v-btn class="btn bg-yellow" block @click="mp_edit(datafilter_mp)">Edit</v-btn>
                </div>
                <div class="w-100">
                  <v-btn class="btn bg-indigo" @click="calculate(datafilter_mp)" block>Calculate</v-btn>
                </div>
              </div>

            </div>
            <div v-if="show" class="w-100 pa-1" style="display: flex; justify-content: space-between; align-items: center">
              <v-btn :disabled="currentPage === 1" @click="prevPage">Previous</v-btn>
              <span class="text-gray">No.of Data:{{ nofdata }}</span>
              <span class="text-gray">Page {{ currentPage }} of {{ totalPages }}</span>
              <v-btn :disabled="currentPage === totalPages" @click="nextPage">Next</v-btn>
            </div>
          </div>

  </div>
</v-sheet>

          </v-tabs-window-item>

          <v-tabs-window-item value="tab-2" v-if="tab === 'tab-2'">
            <v-card>
              <v-sheet class="w-100 pa-2">
                <v-form @submit.prevent="loansearchnp" >
                  <v-text-field
                  v-model="name2"
                    :rules="nameRules"
                    label="Name"
                    @input="handleInputn"
                    class="mt-1">
                  </v-text-field>
                  <v-text-field
                  v-model="place2"
                    :rules="placeRules2"
                    label="Place"
                    @input="handleInputp"
                    class="mt-1">
                  </v-text-field>
                  <v-btn class="mt-1 bg-deep-purple-accent-4" size="x-large" type="submit" block>Search</v-btn>
                </v-form>
              </v-sheet>
            
            </v-card>

            <v-sheet class="w-100 pa-1" >
        <div class="w-100" style=" overflow-y: auto;"> <!-- Set fixed height here -->
          
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

          <!-- Content Display -->
          <div v-else class="w-100 d-flex flex-column bg-white ga-3">
            <div v-for="datafilter_np in paginatedData_np" :key="datafilter_np.id" class="w-100 pa-1 rounded-lg bg-blue-grey-lighten-4">
              
              <!-- Loan Info -->
              <div class="w-100 d-flex">
                <div class="w-100 pa-1">
                  <p class="text-left">LOAN NUMBER: {{ datafilter_np.Loan_Number }}</p>
                  <p class="text-left">LOAN VALUE: {{ datafilter_np.Loan_Value }}</p>
                </div>
                <div class="w-100 pa-1">
                  <p class="text-right">Date: {{ datafilter_np.Loan_Date }}</p>
                  <p class="text-right">TYPE: {{ datafilter_np.Loan_Type }}</p>
                  <p  class="text-right">DETAILS: {{ datafilter_np.Pawn_Details }}</p>
                </div>
              </div>

              <!-- Customer Details -->
              <div class="w-100 pa-1">
                <p class="text-left">NAME: {{ datafilter_np.Name }}</p>
                <span>Address: {{ datafilter_np.Address1 }}</span><br>
                <span>Mobile Number: {{ datafilter_np.MobileNum }}</span><br>
              </div>

              <!-- Buttons -->
              <div class="w-100 pa-1 d-flex gap-2">
                <div class="w-100">
                  <v-btn class="btn bg-yellow" block @click="mp_edit(datafilter_np)">Edit</v-btn>
                </div>
                <div class="w-100">
                  <v-btn class="btn bg-indigo" @click="calculate(datafilter_np)" block>Calculate</v-btn>
                </div>
              </div>

            </div>
            <div v-if="show" class="w-100 pa-1 " style="display: flex; justify-content: space-between; align-items: center">
              <v-btn :disabled="currentPage_np === 1" @click="prevPage_np">Previous</v-btn>
              <span class="text-gray">No.of Data:{{ nofdata_np }}</span>
              <span class="text-gray">Page {{ currentPage_np }} of {{ totalPages_np }}</span>
              <v-btn :disabled="currentPage_np === totalPages_np" @click="nextPage_np">Next</v-btn>
            </div>
          </div>

  </div>
</v-sheet>


          </v-tabs-window-item>


          <v-tabs-window-item value="tab-3">
            <v-card>
              <div class="main_id_box">
                <v-sheet class="w-100 pa-2 mt-2">
                  <v-form @submit.prevent="loansearchpp">

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
                      :rules="idrules"
                      label="ID number (16 alphanumeric characters)"
                      maxlength="16"
                      :counter="false" 
                      @input="idnumber = idnumber.toUpperCase()"  
                    ></v-text-field>
                    <v-btn class="mt-3 bg-deep-purple-accent-4" size="x-large" type="submit" block>Search</v-btn>
                  </v-form>
                </v-sheet>
              </div>
            </v-card>

            <v-sheet class="w-100 pa-1">
        <div class="w-100" style=" overflow-y: auto;"> <!-- Set fixed height here -->
          
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

          <!-- Content Display -->
          <div v-else class="w-100 d-flex flex-column bg-white ga-3">
            <div v-for="datafilter_pp in paginatedData_pp" :key="datafilter_pp.id" class="w-100 pa-1 rounded-lg bg-blue-grey-lighten-4">
              
              <!-- Loan Info -->
              <div class="w-100 d-flex">
                <div class="w-100 pa-1">
                  <p class="text-left">LOAN NUMBER: {{ datafilter_pp.Loan_Number }}</p>
                  <p class="text-left">LOAN VALUE: {{ datafilter_pp.Loan_Value }}</p>
                </div>
                <div class="w-100 pa-1">
                  <p class="text-right">Date: {{ datafilter_pp.Loan_Date }}</p>
                  <p class="text-right">TYPE: {{ datafilter_pp.Loan_Type }}</p>
                  <p  class="text-right">DETAILS: {{ datafilter_pp.Pawn_Details }}</p>
                </div>
              </div>

              <!-- Customer Details -->
              <div class="w-100 pa-1">
                <p class="text-left">NAME: {{ datafilter_pp.Name }}</p>
                <span>Address: {{ datafilter_pp.Address1 }}</span><br>
                <span>Mobile Number: {{ datafilter_pp.MobileNum }}</span><br>
              </div>

              <!-- Buttons -->
              <div class="w-100 pa-1 d-flex gap-2">
                <div class="w-100">
                  <v-btn class="btn bg-yellow" block @click="mp_edit(datafilter_pp)">Edit</v-btn>
                </div>
                <div class="w-100">
                  <v-btn class="btn bg-indigo" @click="calculate(datafilter_pp)" block>Calculate</v-btn>
                </div>
              </div>

            </div>
          
            <div  v-if="show" class="w-100 pa-1" style="display: flex; justify-content: space-between; align-items: center">
              <v-btn :disabled="currentPage_pp === 1" @click="prevPage_pp">Previous</v-btn>
              <span class="text-gray">No.of Data:{{ nofdata_pp }}</span>
              <span class="text-gray">Page {{ currentPage_pp }} of {{ totalPages_pp }}</span>
              <v-btn :disabled="currentPage_pp === totalPages_pp" @click="nextPage_pp">Next</v-btn>
            </div>
          </div>

  </div>
</v-sheet>

          </v-tabs-window-item>

      <div v-if="list">
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
          <div v-else class="w-100 pa-1 d-flex flex-column ga-2" style=" overflow: hidden; overflow-y: scroll;">
            <div v-for="datacont in datauser" :key="datacont.id" class="w-100 pa-1 rounded-lg bg-blue-grey-lighten-4">
              
              <!-- Loan Info -->
              <div class="w-100 d-flex">
                <div class="w-100 pa-1">
                  <p class="text-left">LOAN NUMBER: {{ datacont.Loan_Number }}</p>
                  <p class="text-left">LOAN VALUE: {{ datacont.Loan_Value }}</p>
                </div>
                <div class="w-100 pa-1">
                  <p class="text-right">Date: {{ datacont.Loan_Date }}</p>
                  <p class="text-right">TYPE: {{ datacont.Loan_Type }}</p>
                  <p  class="text-right">DETAILS: {{ datacont.Pawn_Details }}</p>
                </div>
              </div>

              <!-- Customer Details -->
              <div class="w-100 pa-1">
                <p class="text-left">NAME: {{ datacont.Name }}</p>
                <span>Address: {{ datacont.Address1 }}</span><br>
                <span>Mobile Number: {{ datacont.MobileNum }}</span><br>
              </div>

              <!-- Buttons -->
              <div class="w-100 pa-1 d-flex gap-2">
                <div class="w-100">
                  <v-btn class="btn bg-yellow" block @click="mp_edit(datacont)">Edit</v-btn>
                </div>
                <div class="w-100">
                  <v-btn class="btn bg-indigo" block @click="calculate(datacont)">Calculate</v-btn>
                </div>
              </div>
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
import CheckboxButton from '~/components/CheckboxButton.vue';
import { useRouter } from 'vue-router';
import CryptoJS from 'crypto-js';
export default {
  components: {
    logo,
    CheckboxButton
  },

  setup(){

    const isAuthenticated = ref(false)

onBeforeMount(() => {
  const token = localStorage.getItem('token')
  
  if (!token) {
   
    router.replace('/login')
  } else {
    
    isAuthenticated.value = true
  }
})
const place = ref("");
const mobile=ref("")

const list=ref(true)


// Method to handle input and restrict to 10 digits
const onInputMobile = () => {
  mobile.value = mobile.value.replace(/\D/g, '').slice(0, 10);
};



const handleInput = (event) => {
  const value = event.target.value;
  place.value = value.replace(/[^A-Za-z\s]/g, "").toUpperCase();
};

const name2=ref('')
const place2=ref('')


const handleInputn = (event) => {
  const value = event.target.value;
  name2.value = value.replace(/[^A-Za-z\s]/g, "").toUpperCase();
};
const handleInputp = (event) => {
  const value = event.target.value;
  place2.value = value.replace(/[^A-Za-z\s]/g, "").toUpperCase();
};
const idnumber=ref('')

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

    const selectedOption = ref('');
   const show=ref(false)
    const currentPage = ref(1);
    const itemsPerPage = ref(2);
    const lonamp_data=ref([])
    const loading =ref(false)
    const error=ref(null)
    const totalPages = computed(() => {
      return Math.ceil(lonamp_data.value.length / itemsPerPage.value);
    });
    
    const nofdata=ref('')
    const paginatedData = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return lonamp_data.value.slice(start, end);
    });

    const prevPage = () => {
      if (currentPage.value > 1) currentPage.value--;
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) currentPage.value++;
    };

   
    
    

    const datauser=ref([])
    const userdata=async()=>{
      loading.value=true
      const apiurl='http://localhost/loan%20db/getlastdata_loan.php'
      
      
      try {
        const response=await fetch(apiurl,{
          method:"GET",
          
        })
        if(!response.ok){
          throw new Error('Failed your response try again!');
          }
          else{
            const data=await response.json()   
            datauser.value=data  
          }
        } catch (error) {
          error.value=error.message
        }
        finally{
          loading.value=false
        }

  }

  userdata()



    const loansearch=async()=>{
      list.value=false

      show.value=true
      loading.value=true
      const apiurl_loan='http://localhost/loan%20db/loan_search_data.php'
      const formdata_loan=new FormData()
      formdata_loan.append('mobilenumber', mobile.value)
      formdata_loan.append('place', place.value)

    
      
      
      try {
        const response=await fetch(apiurl_loan,{
          method:"POST",
          body:formdata_loan
        })
        if(!response.ok){
          throw new Error('Failed your response try again!');
          }
          else{
            const data=await response.json()
            lonamp_data.value=data
            nofdata.value=data.length
           
          }
        } catch (error) {
          error.value=error.message
        }
        finally{
          loading.value=false
        }

  }

  const currentPage_np = ref(1);
  const itemsPerPage_np = ref(5);
  const npdata=ref([])

  const totalPages_np = computed(() => {
      return Math.ceil(npdata.value.length / itemsPerPage_np.value);
    });

    const paginatedData_np = computed(() => {
      const start = (currentPage_np.value - 1) * itemsPerPage_np.value;
      const end = start + itemsPerPage_np.value;
      return npdata.value.slice(start, end);
    });

    const prevPage_np = () => {
      if (currentPage_np.value > 1) currentPage_np.value--;
    };

    const nextPage_np = () => {
      if (currentPage_np.value < totalPages_np.value) currentPage_np.value++;
    };

 
const nofdata_np=ref('')
  const loansearchnp=async()=>{
    list.value=false
    show.value=true
      loading.value=true
      const apiurl_loan='http://localhost/loan%20db/loan_search_data.php'
      const formdata_loan=new FormData()
      formdata_loan.append('name', name2.value)
      formdata_loan.append('place', place2.value)
     

      try {
        const response=await fetch(apiurl_loan,{
          method:"POST",
          body:formdata_loan
        })
        if(!response.ok){
          throw new Error('Failed your response try again!');
          }
          else{
            const data=await response.json()
            npdata.value=data
            nofdata_np.value=data.length
             
           
          }
        } catch (error) {
          error.value=error.message
        }
        finally{
          loading.value=false
        }

  }
  

  const currentPage_pp = ref(1);
  const itemsPerPage_pp = ref(5);
  const datapp=ref([])

  const totalPages_pp = computed(() => {
      return Math.ceil(datapp.value.length / itemsPerPage_pp.value);
    });

    const paginatedData_pp = computed(() => {
      const start = (currentPage_pp.value - 1) * itemsPerPage_pp.value;
      const end = start + itemsPerPage_pp.value;
      return datapp.value.slice(start, end);
    });

    const prevPage_pp = () => {
      if (currentPage_pp.value > 1) currentPage_pp.value--;
    };

    const nextPage_pp = () => {
      if (currentPage_pp.value < totalPages_pp.value) currentPage_pp.value++;
    };




  const nofdata_pp=ref('')
  const loansearchpp=async()=>{
    list.value=false
    show.value=true
      loading.value=true
      const apiurl_loan='http://localhost/loan%20db/loan_search_data.php'
      const formdata_loan=new FormData()
      formdata_loan.append('prooftype', selectedOption.value)
      formdata_loan.append('proofid', idnumber.value)
      try {
        const response=await fetch(apiurl_loan,{
          method:"POST",
          body:formdata_loan
        })
        if(!response.ok){
          throw new Error('Failed your response try again!');
          }
          else{
            const data=await response.json()
            datapp.value=data
            nofdata_pp.value=data.length
             
           
          }
        } catch (error) {
          error.value=error.message
        }
        finally{
          loading.value=false
        }
  }

const router=useRouter()
const mp_edit=(search_data_value)=>{
  const id = search_data_value.Loan_appid; // The ID to encrypt
  const secretKey = "loanid12345"; // Use a strong secret key
  const encryptedId = CryptoJS.AES.encrypt(id, secretKey).toString();

  // Navigate to page2.vue with the encrypted ID
  router.push({ path: "/loan_search_edit", query: { encryptedId } });
}

const calculate=(loannumber)=>{
   const id=loannumber.Loan_Number
   const secretKey='loannumber123456'
   const encryptedId = CryptoJS.AES.encrypt(id, secretKey).toString();
   router.push({ path: "/demo", query: { encryptedId } });
}


  
    return {
      isAuthenticated,
      options,
      selectedOption,
      mobile,
    
      place,
      list,
      handleInput,
      loading,
      error,
    
      loansearch,
      lonamp_data,
      onInputMobile,
      currentPage,
      itemsPerPage,
      paginatedData,
      totalPages,
      prevPage,
      nextPage,
      show,
      nofdata,
      router,
      // tab2
      name2,
     
      place2,
    
      handleInputn,
      handleInputp,
      loansearchnp,
      npdata,
     
      currentPage_np,
      itemsPerPage_np,
      paginatedData_np,
      totalPages_np,
      prevPage_np,
      nextPage_np,
      nofdata_np,
      mp_edit,


      //tab3
      idnumber,
    
      
      loansearchpp,
      datapp,
      currentPage_pp,
      itemsPerPage_pp,
      paginatedData_pp,
      totalPages_pp,
      prevPage_pp,
      nextPage_pp,
      nofdata_pp,
      datauser,
      userdata,
      calculate

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

    };
  },
  mounted() {
    this.updateDeviceDimensions(); 
    window.addEventListener('resize', this.updateDeviceDimensions); 
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateDeviceDimensions()); 
  },
  methods: {
    updateDeviceDimensions() {
      this.deviceWidth = window.innerWidth;
      this.deviceHeight = window.innerHeight;
      this.boxex1Height = Math.floor(this.deviceHeight * 0.10); 
      this.boxex2Height = Math.floor(this.deviceHeight * 0.89); 
    },
    selectTag(tag) {
    this.selectedTag = tag;
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
