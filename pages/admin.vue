<template>
    <div v-if="isAuthenticated" class="main-container w-100" :style="{ height: deviceHeight + 'px' }">
      <v-card class="pa-2 bg-grey-lighten-4">
        <v-tabs v-model="tab" align-tabs="center" class="bg-white" stacked>
          <v-tab
            value="tab-1"
            :class="{'active-tab': tab === 'tab-1'}"
            @mouseover="hoverTab('tab-1')"
            @mouseleave="hoverTab('')"
            :style="{'background-color': hoveredTab === 'tab-1' ? 'blue' : '', 'color': hoveredTab === 'tab-1' ? 'white' : ''}"
            class="rounded-lg"
          >
            Saved
          </v-tab>
          <v-tab
            value="tab-2"
            :class="{'active-tab': tab === 'tab-2'}"
            @mouseover="hoverTab('tab-2')"
            @mouseleave="hoverTab('')"
            :style="{'background-color': hoveredTab === 'tab-2' ? 'blue' : '', 'color': hoveredTab === 'tab-2' ? 'white' : ''}"
             class="rounded-lg"
          >
            Add
          </v-tab>
          <v-tab
            value="tab-3"
            :class="{'active-tab': tab === 'tab-3'}"
            @mouseover="hoverTab('tab-3')"
            @mouseleave="hoverTab('')"
            :style="{'background-color': hoveredTab === 'tab-3' ? 'blue' : '', 'color': hoveredTab === 'tab-3' ? 'white' : ''}"
             class="rounded-lg"
          >
            One Time
          </v-tab>
        </v-tabs>
  
        <v-tabs-window v-model="tab" class="mt-3">
          <v-tabs-window-item value="tab-1">
            <v-card>
      <div class="main_id_box bg-grey-lighten-4">
        <div v-if="loading_search" class="w-100">
          <v-progress-circular
            color="primary"
            indeterminate
          ></v-progress-circular>
        </div>
        <div v-else-if="error_search" class="w-100">
          {{ error_search }}
        </div>
        <div v-else class="w-100">
          <v-form @submit.prevent="categoriesfilter_data">
            <v-sheet class="w-100">
              <div class="w-100 pa-2">
                <label for="" class="text-indigo font-weight-bold">Loan Type</label>
                <div class="options d-flex justify-center">
                  <CheckboxButton
                    v-for="option in options"
                    :key="option.value"
                    :name="'check-type1'"
                    :label="option.label"
                    :value="option.value"
                    v-model="selectedOption"
                    class="pa-2"
                  />
                </div>
  
                <v-row no-gutters class="pa-0 d-flex ga-2 mt-2">
                  <v-col>
                    <v-sheet>
                      <label for="">Select Low Limit</label>
                      <v-select
                        v-model="selectedLowerLimit"
                        label="Select Low Limit"
                        :items="lowerlimit"
                        variant="solo-filled"
                        :rules="[value => !value || value.length > 0 || 'Low limit is optional']" 
                      />
                    </v-sheet>
                  </v-col>
                  <v-col>
                    <v-sheet>
                      <label for="">Select Upper Limit</label>
                      <v-select
                        v-model="selectedUpperLimit"
                        label="Select Upper Limit"
                        variant="solo-filled"
                        :items="upperlimit"
                        :rules="[value => !value || value.length > 0 || 'Upper limit is optional']"
                      />
                    </v-sheet>
                  </v-col>
                </v-row>
                <v-btn class="text-white bg-indigo" type="submit" block>Search</v-btn>
              </div>
            </v-sheet>
          </v-form>
          <div v-if="loadingf" class="w-100 d-flex justify-center">
            <v-progress-circular
              color="primary"
              indeterminate
            ></v-progress-circular>
          </div>
          <div v-else-if="errorf"class="w-100">
            {{ errorf }}
          </div>
  
          <div v-for="data in res" class="pt-1 pa-1" :key="data.id">
            <v-sheet class="w-100 pa-1 d-flex flex-column">
              <div class="w-100 d-flex justify-content-between" style="display: flex; justify-content: space-between;">
                <div class="text-indigo">ID: {{ data.id }}</div>
                <div class="text-indigo">{{ data.Loan_type1 }}</div>
              </div>
              <div>LowLimit: {{ data.LowLimit }}</div>
              <div>UpperLimit: {{ data.UpperLimit }}</div>
              <div>DiscountPeriod: {{ data.DiscountPeriod }}</div>
              <div>DiscountInterest: {{ data.DiscountInterest }}</div>
              <div>ElevatedInterest: {{ data.ElevatedInterest }}</div>
              <div class="w-100 pa-2 d-flex justify-space-between ga-2">
                <div class="w-100"><v-btn class="bg-red text-white" @click="edit_record(data.id)" block>Edit</v-btn></div>
                <div class="w-100"><v-btn class="bg-blue text-white"  @click="openDeleteDialog(data.id)"  block>Delete</v-btn></div>
              </div>
            </v-sheet>
          </div>
        </div>
      </div>
    </v-card>
          </v-tabs-window-item>
  
          <v-tabs-window-item  class="mt-3" value="tab-2" v-if="tab === 'tab-2'">
           <v-card class="d-flex flex-column">
              <div class="w-100 pa-2">
                 <v-sheet class="w-100 pa-2">
                <div class="w-100 boxex-2 pa-2":style="{height:boxex2Height + 'px'}">
                  <p class="text-center text-indigo font-weight-bold">Add Interest Record</p>
                  <div class="loan-2 w-100 d-flex justify-center" >
                </div>
            
                  <div class="loan-3 w-100">
                    <v-form  v-model="isValid" @submit.prevent="handleSubmit">
                    <div class="w-100 d-flex justify-center flex-wrap">
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
                                  <p class="text-indigo font-weight-bold text-center">Discount Interest</p>
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
                                  <label for="">Discount Interest</label>
                                  <v-text-field
                                  v-model="discount_interest"
                                  placeholder="0.00"
                                  type="number"
                                  hide-details
                                  required
                                  class="w-100"
                                :rules="discountinterest_r"
                                  @input="restrictDecimalPlaces"
                                ></v-text-field>
                              </v-sheet>
                          </v-col>
                          </v-row>
  
                          <v-row no-gutters>
                              <v-col cols="12">
                                  <p class="text-indigo font-weight-bold text-center">Elevated Interest</p>
                              </v-col>
                          <v-col cols="6">
                             
                          </v-col>
                          <v-col cols="6">
                              <v-sheet class="pa-1" >
                                  <label for="">Elevated Interest</label>
                                  <v-text-field
                                  v-model="el_interest"
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
                            <div class="w-100 d-flex ga-3 pa-4 align-center">
                              <div class="w-100"><v-btn class="bg-yellow text-black" @click="resetform" block>Reset</v-btn></div>
                              <div class="w-100"><v-btn class="bg-green text-white" type="submit"  @click="dialog = true" block>Insert</v-btn></div>
                            </div>
                          </v-row>
                    </v-form>
                  </div>
                </div>
                      </v-sheet>
                    </div>
                   
            </v-card>
          </v-tabs-window-item>
  
                  <v-tabs-window-item  class="mt-3" value="tab-3" v-if="tab === 'tab-3'">
                    <v-btn  block class="bg-warning"@click="toggleDisabled">Edit</v-btn>
                    <v-form  :class="{ 'disabled-box': isDisabled }" v-model="isValid" @submit.prevent>
                    
                    <v-card>
                    <v-sheet class="w-100 pa-2">
                      <p class="text-center text-indigo font-weight-bold">Onetime Setup</p>
                      <div class="w-100 pa-1">
                        <p>[1] Extra 3 Days after 1 Month will be calculated as ?</p>
                        <div class="loan-2 w-100" >
  
                          <div class="options d-flex justify-center flex-wrap">
                            <CheckboxButton
                              v-for="option in optionsot"
                              :key="option.value"
                              :name="'check-type3'"
                              :label="option.label"
                              :value="option.value"
                              v-model="otselectedOption"
                            
                              class="pa-2"
                            />
                          </div>
                        </div>
                      </div>
                      <hr class="mt-1">
                      <div class="w-100 d-flex mt-2">
                        <div class="w-100">
                          <p>[2] How many months of Initial <br> Interest Deducation?(Type in Months)</p>
                        </div>
                        <div class="w-100">
                          <v-text-field
                            v-model="month"
                            placeholder="1"
                            type="number"
                            hide-details
                            required
                            class="w-100"
                            :step="1"
                             @keypress="blockInvalidChar"
                            
                          ></v-text-field>
                        </div>
                      </div>
                      <hr class="mt-1">
                      <div class="w-100 mt-2">
                        <p>[3] Do you need value handover calculation?</p>
                        <div class="loan-2 w-100 d-flex  ga-10 justify-center align-center" >
                          <div class="options d-flex justify-center flex-wrap">
                            <CheckboxButton
                              v-for="option in ysoptions"
                              :key="option.value"
                              :name="'check-type5'"
                              :label="option.label"
                              :value="option.value"
                              v-model="ysselectedOption"
                             
                              class="pa-2"
                            />
                          </div>
                        </div>
                      </div>
                      <hr class="mt-1">
                      <div class="w-100 mt-2">
                        <p>[4] calculation Type?</p>
                        <div class="loan-2 w-100 d-flex  justify-center" >
                          <div class="options d-flex justify-center flex-wrap">
                            <CheckboxButton
                              v-for="option in caloptions"
                              :key="option.value"
                              :name="'check-type4'"
                              :label="option.label"
                              :value="option.value"
                              v-model="calselectedOption"
                              class="pa-2"
                            
                            />
                          </div>
                        </div>
                      </div>
                    </v-sheet>
                    <hr class="mt-1">
                    <div class="w-100 mt-2">
                        <v-row no-gutters>
                            <v-col cols="6">
                              <p>[5] Government Rate*</p>
                            </v-col>
                            <v-col cols="6">
                              <v-text-field
                           v-model="govtrate"
                           type="number"
                            placeholder="1"
                            hide-details
                            required
                            class="w-100"
                           :step="1"
                             @keypress="blockInvalidChar"
                        
                          ></v-text-field>
                            </v-col>
                        </v-row>
                    </div>
                    <div class="w-100 mt-2 d-flex ga-2">
                        <div class="w-100">
                            <v-btn class="bg-indigo text-white" @click="handleSubmit3('update')" type="submit" block>Update</v-btn>

                        </div>
                        <div class="w-100">
                            <v-btn class="bg-yellow text-black" @click="handleSubmit3('insert')" type="submit" block>Insert</v-btn>

                        </div>
                    </div>
                  </v-card>
  
                  </v-form>
                    </v-tabs-window-item>
                </v-tabs-window>
              </v-card>
       
  
            <!-- dialogbox -->
            <v-dialog
        v-model="dialog"
        width="auto"
        
      >
        <v-card
          max-width="400"
          prepend-icon="mdi-check"
          text="Interest Record Successfully Submited."
          title="Interest Record"
          class="bg-green"
        >
          <template v-slot:actions>
            <v-btn
              class="ms-auto bg-warning"
              text="Ok"
              @click="dialog = false"
            ></v-btn>
          </template>
        </v-card>
      </v-dialog>
  
      <!-- dialog box update -->
      <v-dialog
        v-model="dialog2"
        width="auto"
        
      >
        <v-card
          max-width="400"
          prepend-icon="mdi-update"
          text="Settings Updated Successfully."
          title="Settings update"
          class="bg-green"
        >
          <template v-slot:actions>
            <v-btn
              class="ms-auto bg-warning"
              text="Ok"
              @click="dialog2 = false"
            ></v-btn>
          </template>
        </v-card>
      </v-dialog>
  
      <!-- delete dialogbox -->
      <v-dialog
        v-model="dialog_delete"
        width="auto"
      >
        <v-card
          max-width="400"
          prepend-icon="mdi-delete"
          text="Are you sure want to delete ?"
          title="Delete Item"
        >
       
          <template #actions>
            <v-btn text @click="dialog_delete = false">Cancel</v-btn>
            <v-btn class="bg-red text-white" @click="delete_interest_id">Delete</v-btn>
          </template>
        </v-card>
      </v-dialog>
    </div>
  </template>
  
  <script>
  import { ref, onBeforeMount } from 'vue';
  import CheckboxButton from '~/components/CheckboxButton.vue'; // Adjust the path as necessary
  import { useRouter } from 'vue-router'
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
      // Options for various selections
      const options = ref([
        { label: 'ALL', value: 'all' },
        { label: 'Brass', value: 'brass' },
        { label: 'Gold', value: 'gold' },
        { label: 'Silver', value: 'silver' },
      ]);
      
      const selectedOption = ref('');
  
      const addoptions = ref([
        { label: 'Gold', value: 'Gold' },
        { label: 'Silver', value: 'Silver' },
        { label: 'Brass', value: 'Brass' },
      ]);
  
      const addselectedOption = ref('');
  
      const optionsot = ref([
        { label: '0.5 Month', value: '0.5 Month' },
        { label: '1 Month', value: '1 Month' },
      ]);
      const caloptions = ref([
        { label: 'Discount', value: 'Discount' },
        { label: 'Elevated', value: 'Elevated' },
      ]);
      const ysoptions = ref([
        { label: 'Yes', value: 'Yes' },
        { label: 'No', value: 'No' },
      ]);
      const govtrules = [
        v => !!v || 'Loan value is required',
        v => /^[0-9]+(\.[0-9]{1,2})?$/.test(v) || 'Loan value must be numeric and can have up to 2 decimal places',
      ];
  
      const lower_l = ref('');
      const lowerrules = [...govtrules];
  
      const upper_l = ref('');
      const upperrules = [...govtrules];
  
      const discount = ref('');
      const discountrules = [...govtrules];
  
      const discount_interest = ref('');
      const discountinterest_r = [...govtrules];
  
      const el_interest = ref('');
      const elrules = [...govtrules];
  
     
      const loading = ref(false);
      const error = ref(null);
    //  dialogbox
    const dialog = ref(false);
    const dialog2 = ref(false);
    const dialog_delete=ref(false)
  
  
      const blockInvalidChar = (event) => {
        // Prevent user from typing '.' or other non-numeric characters
        if (event.key === '.' || event.key === '-') {
          event.preventDefault();
        }
      };
  // tab-2 submitted
    const handleSubmit = async () => {
    if (!addselectedOption.value || !lower_l.value || !upper_l.value || !discount.value || !discount_interest.value || !el_interest.value) {
      error.value = 'Please fill in all fields';
      return;
    }
  
    await data_insert();
  };
      const data_insert = async () => {
        loading.value = true;
        error.value = null;
  
        const apiurl = 'http://vaanam.w3webtechnologies.co.in/loandb/interest.php';
        const formData = new FormData();
        formData.append('Loan_type1', addselectedOption.value);
        formData.append('LowLimit', lower_l.value);
        formData.append('UpperLimit', upper_l.value);
        formData.append('DiscountPeriod', discount.value);
        formData.append('DiscountInterest', discount_interest.value);
        formData.append('ElevatedInterest', el_interest.value);
  
        try {
          const response = await fetch(apiurl, {
            method: 'POST',
            body: formData,
          });
  
          if (!response.ok) {
            throw new Error('Failed to submit data. Please check your inputs.');
          }
  
          const data = await response.json();
          // Handle the returned data as needed
  
        } catch (err) {
          error.value = err.message;
        } finally {
          loading.value = false;
        }
      };
  // form reset...
  
  const resetform =()=>{
    addselectedOption.value='';
    lower_l.value='';
    upper_l.value='';
    discount.value='';
    discount_interest.value='';
    el_interest.value=''
  }
  
  // tab-3
  const month = ref(null);
  const otselectedOption = ref(''); 
  const calselectedOption = ref('');
  const ysselectedOption = ref('');
  const govtrate = ref(null);
  const loading_d = ref(true);
  const error_d = ref(null);
  const isDisabled = ref(false);
  const isValid = ref(false);
  
  
  const handleSubmit3 = async (typemode) => {
    if(typemode==='update'){
        if (!otselectedOption.value || !month.value || !ysselectedOption.value || !calselectedOption.value || !govtrate.value) {
      error.value = 'Please fill in all fields';
      return;
    }
  
    await updatedata();
    alert('successfully Updated')
    }

    if(typemode==='insert'){
        if (!otselectedOption.value || !month.value || !ysselectedOption.value || !calselectedOption.value || !govtrate.value) {
      error.value = 'Please fill in all fields';
      return;
    }
  
    await settinginsertdata();
    alert('successfully inserted')
    }
  
  };
  
  const getFormattedDateTime = () => {
      const date = new Date();
      const formattedDate = date.toISOString().split('T')[0]; // dd-mm-yyyy
      const formattedTime = date.toLocaleTimeString('en-GB', { hour12: false }); // hh:mm:ss
      return `${formattedDate} ${formattedTime}`;
    };

    const currentDateTime = ref(getFormattedDateTime());

  const loading_u=ref(true)
  const error_u=ref(null)
  const updatedata = async()=>{
    loading_u.value=true
    error_u.value=null
    const apiurl_u = 'http://vaanam.w3webtechnologies.co.in/loandb/setting.php';
    const updateformdata = new FormData();
    updateformdata.append('datetime', currentDateTime.value);
        updateformdata.append('ExtraDays', otselectedOption.value);
        updateformdata.append('AdvanceMonths', month.value);
        updateformdata.append('HandOver', ysselectedOption.value);
        updateformdata.append('CalculationMethod', calselectedOption.value);
        updateformdata.append('GovtRate', govtrate.value);
  
        try {
          const response_u = await fetch(apiurl_u, {
            method: 'POST',
            body: updateformdata,
          });
  
          if (!response_u.ok) {
            throw new Error('Failed to submit data. Please check your inputs.');
          }
  
          const data_u = await response_u.json();
          data_u.value=data_u
  
        } catch (err) {
          error_u.value = err.message;
        } finally {
          loading_u.value = false;
         
        }
  
  }

  const settinginsertdata = async()=>{
    loading_u.value=true
    error_u.value=null
    const apiurl_u = 'http://vaanam.w3webtechnologies.co.in/loandb/settinginsert.php';
    const updateformdata = new FormData();
    updateformdata.append('datetime', currentDateTime.value);
        updateformdata.append('ExtraDays', otselectedOption.value);
        updateformdata.append('AdvanceMonths', month.value);
        updateformdata.append('HandOver', ysselectedOption.value);
        updateformdata.append('CalculationMethod', calselectedOption.value);
        updateformdata.append('GovtRate', govtrate.value);
  
        try {
          const response_u = await fetch(apiurl_u, {
            method: 'POST',
            body: updateformdata,
          });
  
          if (!response_u.ok) {
            throw new Error('Failed to submit data. Please check your inputs.');
          }
  
          const data_u = await response_u.json();
          data_u.value=data_u
  
        } catch (err) {
          error_u.value = err.message;
        } finally {
          loading_u.value = false;
         
        }
  
  }
  
  const lowerlimit = ref([]); 
  const upperlimit = ref([]); 
  const selectedLowerLimit = ref(null); // Store selected lower limit
  const selectedUpperLimit = ref(null); // Store selected upper limit
  
  const loading_search = ref(true);
  const error_search = ref(null);
  const res = ref([]); // Store filtered data

  
const setdata = async()=>{
  loading_d.value = true;
      error_d.value = null;
      const apiurl_d = 'http://vaanam.w3webtechnologies.co.in/loandb/setting_get.php';
      try {
        const response_d = await fetch(apiurl_d, {
          method: 'GET',
        });
        if (!response_d.ok) {
          throw new Error('Failed to fetch data. Please check your inputs.');
        }
        const getdata = await response_d.json();
        otselectedOption.value=getdata[0].ExtraDays
         month.value=getdata[0].AdvanceMonths
         ysselectedOption.value=getdata[0].HandOver
         calselectedOption.value=getdata[0].CalculationMethod
         govtrate.value=getdata[0].GovtRate

      } catch (err) {
        error.value = err.message;
      } finally {
        loading.value = false;
      }
}
setdata()
  
  const search_filter_data = async () => {
        loading_search.value = true;
        error_search.value = null;
  
        const apiurl_search = 'http://vaanam.w3webtechnologies.co.in/loandb/limitsvalue.php';
  
        try {
          const response_search = await fetch(apiurl_search, {
            method: 'GET',
          });
  
          if (!response_search.ok) {
            throw new Error('Failed to fetch limit values.');
          }
  
          const data_limits = await response_search.json();
          lowerlimit.value = data_limits.low1;
          upperlimit.value = data_limits.upper1;
        } catch (err) {
          error_search.value = err.message;
        } finally {
          loading_search.value = false;
        }
      };
  
      // Call the search function on component mount
      search_filter_data();
  
       // Handle form submission and filtering
       const loadingf = ref(false);
      const errorf = ref(null);
      const categoriesfilter_data = async () => {
        loadingf.value = true;
        errorf.value = null;
  
        const formdatafilter = new FormData();
        formdatafilter.append('loan_type', selectedOption.value);
        
        // Only append lower limit if it is selected
        if (selectedLowerLimit.value) {
          formdatafilter.append('lower_limit', selectedLowerLimit.value);
        }
  
        // Only append upper limit if it is selected
        if (selectedUpperLimit.value) {
          formdatafilter.append('upper_limit', selectedUpperLimit.value);
        }
  
        const apiurlf = 'http://vaanam.w3webtechnologies.co.in/loandb/filter.php';
        try {
          const responsef = await fetch(apiurlf, {
            method: 'POST',
            body: formdatafilter,
          });
  
          if (!responsef.ok) {
            throw new Error('Failed to submit filter data.');
          }
  
          const datafilter = await responsef.json();
          res.value = datafilter; // Assign filtered data to res
        } catch (err) {
          errorf.value = err.message;
        } finally {
          loadingf.value = false;
        }
      };
      const selectedId = ref(null)
      const openDeleteDialog =(id)=>{
        selectedId.value = id
        dialog_delete.value = true
      }
      const error_del=ref(null)
      const delete_interest_id = async()=>{
        error_del.value=null
        const deleteform=new FormData();
        deleteform.append('interestid',selectedId.value)
        const deleteapi='http://vaanam.w3webtechnologies.co.in/loandb/interest_delete.php'
  
        try{
          const del_res= await fetch(deleteapi,{
            method:'POST',
            body:deleteform
          })
          if(!del_res.ok){
            throw new Error('Failed to submit filter data.');
          }
          else{
            const del_data=del_res.json()
          }
        
        }
        catch(err){
            error_del.value=err.message
          }
          finally{
            dialog_delete.value = false 
            categoriesfilter_data()
          }
      }
      const router = useRouter()
      const edit_record = (id) => {
        selectedId.value = id
        router.push({ name: 'interest_edit_record', query: { value: selectedId.value } })
      }
      return {
        options,
        selectedOption,
        addoptions,
        addselectedOption,
        optionsot,
        otselectedOption,
        caloptions,
        calselectedOption,
        ysoptions,
        ysselectedOption,
        govtrate,
        govtrules,
        lower_l,
        lowerrules,
        upper_l,
        upperrules,
        discount,
        discountrules,
        discount_interest,
        discountinterest_r,
        el_interest,
        elrules,
        month,
        loading,
        loading_d,
        loading_u,
        error,
        error_d,
        error_u,
        lowerlimit,
        upperlimit,
        selectedLowerLimit,
        selectedUpperLimit,
        loading_search,
        error_search,
        loadingf,
        errorf,
        error_del,
        res,
        router,
        selectedId,
        openDeleteDialog,
        //dialogbox
        dialog,
        dialog2,
        dialog_delete,
        // functions
        categoriesfilter_data,
        search_filter_data,
        handleSubmit,
        blockInvalidChar,
        data_insert,
        resetform,
     
        updatedata,
        handleSubmit3,
        delete_interest_id,
        edit_record,
  
        isAuthenticated
     
      };
    },
    
    data() {
      return {
        deviceWidth: 0,
        deviceHeight: 0,
        tab: 'tab-1',
        hoveredTab: '', // Track the currently hovered tab
        // items: ['Foo', 'Bar', 'Fizz', 'Buzz'],
        inline: null,
        isDisabled: true,
      };
    },
  
    mounted() {
      this.updateDeviceDimensions(); // Initial call to set dimensions on component mount
      window.addEventListener('resize', this.updateDeviceDimensions); // Listen for window resize events
    },
  
    beforeUnmount() {
      window.removeEventListener('resize', this.updateDeviceDimensions); // Clean up: remove resize event listener
    },
  
    methods: {
      updateDeviceDimensions() {
        this.deviceWidth = window.innerWidth; // Update device width
        this.deviceHeight = window.innerHeight; // Update device height
      },
  
      hoverTab(tab) {
        this.hoveredTab = tab; // Update the currently hovered tab
      },
  
      restrictDecimalPlaces(e) {
        const value = e.target.value;
        // Regular expression to allow numbers with at most 2 decimal places
        const regex = /^[0-9]+(\.[0-9]{0,2})?$/;
  
        // If the value does not match the regex, reset to the last valid value
        if (!regex.test(value)) {
          e.target.value = ''; // Clear the invalid input
        }
      },
  
      toggleDisabled() {
        this.isDisabled = !this.isDisabled;
      },
    },
  };
  </script>
  
  
  <style scoped>
  .active-tab {
    background-color: blue !important;
    color: white !important;
  }
  
  .disabled-box {
    pointer-events: none; /* Disable pointer events */
    opacity: 0.5; /* Optional: make it look visually disabled */
  }
  </style>
  