<template>
    <div  v-if="isAuthenticated" class="main-container w-100" :style="{height: deviceHeight + 'px'}">
      <div class="w-100 boxex-1 bg-blue":style="{height:boxex1Height + 'px'}"></div>
      <div class="w-100 boxex-2 pa-2":style="{height:boxex2Height + 'px'}">
        <div class="loan-1 w-100 rounded-lg bg-indigo d-flex justify-center align-center pa-3" >
          <p class="text-white">Edit Interest Record</p>
        </div>
         
        <div class="loan-3 w-100">
                  <v-form @submit.prevent="update_form">
                  <div class="w-100 d-flex justify-center">
                    <CheckboxButton
                      v-for="option in addoptions"
                      :key="option.value"
                      :name="'check-type2'"
                      :label="option.label"
                      :value="option.value"
                      v-model="addselectedOption"
                      class="pa-2"
                    />
                  </div>
                    <v-row no-gutters>
                        <v-col>
                            <v-sheet class="pa-1" >
                                <label for="">Lower Limit</label>
                                <v-text-field
                                v-model='lower_l'
                                placeholder="0.00"
                                type="number"
                                hide-details
                                required
                                class="w-100"
                                :rules="lowerrules"
                                @input="restrictDecimalPlaces"
                              ></v-text-field>
                            </v-sheet>
                        </v-col>
                        <v-col>
                            <v-sheet class="pa-1" >
                                <label for="">Upper Limit</label>
                                <v-text-field
                                v-model="upper_l"
                                placeholder="0.00"
                                type="number"
                                hide-details
                                required
                                class="w-100"
                              :rules="upperrules"
                                @input="restrictDecimalPlaces"
                              ></v-text-field>
                            </v-sheet>
                        </v-col>
                        </v-row>

                        <v-row no-gutters class="mt-2">
                            <v-col cols="12">
                                <p class="text-indigo font-weight-bold text-center">Discount Intrest</p>
                            </v-col>
                        <v-col cols="6">
                            <v-sheet class="pa-1" >
                                <label for="">Discount Period</label>
                                <v-text-field
                                v-model="discount"
                                placeholder="0.00"
                                type="number"
                                hide-details
                                required
                                class="w-100"
                              :rules="discountrules"
                                @input="restrictDecimalPlaces"
                              ></v-text-field>
                            </v-sheet>
                        </v-col>
                        <v-col cols="6">
                            <v-sheet class="pa-1" >
                                <label for="">Discount Intrest</label>
                                <v-text-field
                                v-model="discount_intrest"
                                placeholder="0.00"
                                type="number"
                                hide-details
                                required
                                class="w-100"
                              :rules="discountintrest_r"
                                @input="restrictDecimalPlaces"
                              ></v-text-field>
                            </v-sheet>
                        </v-col>
                        </v-row>

                        <v-row no-gutters>
                            <v-col cols="12">
                                <p class="text-indigo font-weight-bold text-center">Elevated Intrest</p>
                            </v-col>
                        <v-col cols="6">
                           
                        </v-col>
                        <v-col cols="6">
                            <v-sheet class="pa-1" >
                                <label for="">Elevated Intrest</label>
                                <v-text-field
                                v-model="el_intrest"
                                type="number"
                                hide-details
                                required
                                class="w-100"
                              :rules="elrules"
                                @input="restrictDecimalPlaces"
                              ></v-text-field>
                            </v-sheet>
                        </v-col>
                        </v-row>
                        <v-row no-gutters>
                          <v-col class="d-flex ga-2" cols="12">
                            <div class="w-100"><v-btn class="bg-yellow text-black" @click="resetForm" block>Reset</v-btn></div>
                            <div class="w-100"><v-btn class="bg-green text-white" type="submit" block>Insert</v-btn></div>
                          </v-col>
                        </v-row>
                  </v-form>
                </div>
        
      </div>

    </div>

   
  </template>
  
  <script>
import { ref, watch, computed, onBeforeMount } from 'vue';
import CheckboxButton from '~/components/CheckboxButton.vue'; 
import { useRoute, useRouter } from 'vue-router';
export default {
  name: 'ParentComponent',
  components: {
    CheckboxButton,
  },

  setup() {
    const router = useRouter()
const isAuthenticated = ref(false)

onBeforeMount(() => {
  const token = localStorage.getItem('token')
  
  if (!token) {
   
    router.replace('/login')
  } else {
    
    isAuthenticated.value = true
  }
})
    const addoptions = ref([
      { label: 'Gold', value: 'gold' },
      { label: 'Silver', value: 'silver' },
      { label: 'Brass', value: 'brass' },
    ]);

    const addselectedOption = ref('');
    const lower_l = ref('');
    const upper_l = ref('');
    const discount = ref('');
    const discount_intrest = ref('');
    const el_intrest = ref('');

    const lowerrules = [
      v => !!v || 'Loan value is required',
      v => /^[0-9]+(\.[0-9]{1,2})?$/.test(v) || 'Loan value must be numeric and can have up to 2 decimal places',
    ];

    const upperrules = [
      v => !!v || 'Loan value is required',
      v => /^[0-9]+(\.[0-9]{1,2})?$/.test(v) || 'Loan value must be numeric and can have up to 2 decimal places',
    ];

    const discountrules = [
      v => !!v || 'Loan value is required',
      v => /^[0-9]+(\.[0-9]{1,2})?$/.test(v) || 'Loan value must be numeric and can have up to 2 decimal places',
    ];

    const discountintrest_r = [
      v => !!v || 'Loan value is required',
      v => /^[0-9]+(\.[0-9]{1,2})?$/.test(v) || 'Loan value must be numeric and can have up to 2 decimal places',
    ];

    const elrules = [
      v => !!v || 'Loan value is required',
      v => /^[0-9]+(\.[0-9]{1,2})?$/.test(v) || 'Loan value must be numeric and can have up to 2 decimal places',
    ];

    // Access the route parameters
    const route = useRoute();
    const value = ref('');
     
    onMounted(() => {
      value.value = route.query.value || ''; // Default to an empty string if not provided
      update_data();
    });

    const updateId = computed(() => value.value);
    const loading_edit = ref(true);
    const error_edit = ref(null);

    const update_data = async () => {
      loading_edit.value = true;
      error_edit.value = null;
      const update_formdata = new FormData();
      const update_api = 'http://localhost/loan%20db/interest_update.php';
      update_formdata.append('interestid', updateId.value);

      try {
        const res_update = await fetch(update_api, {
          method: 'POST',
          body: update_formdata,
        });
        if (!res_update.ok) {
          throw new Error('Failed to submit filter data.');
        } else {
          const data_update = await res_update.json();
          console.log(data_update); // Log to see the structure
          addselectedOption.value = data_update[0]?.Loan_type1 || ''; // Use optional chaining
          lower_l.value = data_update[0]?.LowLimit || ''; // Use optional chaining
          upper_l.value = data_update[0]?.UpperLimit || ''; // Use optional chaining
          discount.value = data_update[0]?.DiscountPeriod || ''; // Use optional chaining
          discount_intrest.value = data_update[0]?.DiscountInterest || ''; // Use optional chaining
          el_intrest.value = data_update[0]?.ElevatedInterest || ''; // Use optional chaining
        }
      } catch (err) {
        error_edit.value = err.message;
      } finally {
        loading_edit.value = false;
      }
    };
     
  
    const resetForm = () => {
      // Reset logic for form fields
      addselectedOption.value = '';
      lower_l.value = '';
      upper_l.value = '';
      discount.value = '';
      discount_intrest.value = '';
      el_intrest.value = '';
    };
    const loading_update=ref('')
    const error_update=ref('')
    const update_form = async()=>{
        loading_update.value=true
        error_update.value=null
        const update_form_data=new FormData()
        update_form_data.append('interestid', updateId.value)
        update_form_data.append('Loan_type1', addselectedOption.value)
        update_form_data.append('LowLimit', lower_l.value)
        update_form_data.append('UpperLimit', upper_l.value)
        update_form_data.append('DiscountPeriod', discount.value)
        update_form_data.append('DiscountInterest',discount_intrest.value)
        update_form_data.append('ElevatedInterest', el_intrest.value)
        const update_apiurl='http://localhost/loan%20db/update_insert.php'
        try{
            const update_response=await fetch(update_apiurl,{
              method:'POST',
              body:update_form_data
            })
            if(!update_response.ok){
              throw new Error('Failed to submit filter data.');
            }
            else{
              const dataupdate=await update_response.json()

            }
        }
        catch(err){
          error_update.value=err.message
        }
        finally{
          loading_update.value=false
          update_data()
        }
    }
  
    return {
      addoptions,
      addselectedOption,
      lower_l,
      lowerrules,
      upper_l,
      upperrules,
      discount,
      discountrules,
      discount_intrest,
      discountintrest_r,
      el_intrest,
      elrules,
      update_data,
      resetForm,
      update_form,
      loading_update,
      error_update,
      router,
      isAuthenticated,
    };
  },
  data() {
    return {
      deviceWidth: 0,
      deviceHeight: 0,
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
     
    },
   

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
  },
};
</script>

<style scoped>

</style>
