<template>
  <div v-if="isAuthenticated">
    <div class="w-100 pa-1 bg-indigo" :style="{ height: box1 + 'px' }" ></div>
     
    <div class="w-100" v-if="error" @click="remove()">
          <v-alert
         type="error"
      >{{ error }}
    </v-alert>
    </div>
   
      <v-form class="d-flex flex-column pa-1" :style="{ height: box2 + 'px' }" @submit.prevent="handleSubmit">
        <input style="border: 1px solid black;" disabled type="text" v-model="mydate" hidden />
        <input style="border: 1px solid black;" disabled type="text" v-model="loanappid" hidden />
        <input style="border: 1px solid black;" disabled type="text" v-model="appid" hidden />
        <p class="text-center text-indigo mb-2"><b>Enter Closing Details SF-AA-<span>{{ loannumber }}</span></b></p>
          <div class="w-100 h-100">
            <v-row no-gutters>
            <v-col class="pa-1" cols="6" >
              <v-text-field v-model="loannumber" label="Loan Number" variant="outlined" readonly></v-text-field>
            </v-col>
            <v-col class="pa-1" cols="6" >
              <v-text-field v-model="loantype" label="Loan Type" variant="outlined" readonly></v-text-field>
            </v-col>
          </v-row>

          <v-row no-gutters>
            <v-col class="pa-1" cols="6" >
              <v-text-field v-model="loandate" label="Loan Date" variant="outlined" readonly ></v-text-field>
            </v-col>
            <v-col class="pa-1" cols="6" >
              <v-text-field v-model="loanvalue" label="Loan Value" variant="outlined" readonly ></v-text-field>
            </v-col>
          </v-row>

          <v-row no-gutters>
            <v-col class="pa-1" cols="12" >
               <span>Return Date</span>
                <input v-model="currentdate" type="date" style="border: 1px solid gray; height: 50px;" name="" readonly class="w-100 pa-1 rounded-lg">
            </v-col>
            <v-col class="pa-1" cols="12" >
              <div class="mb-7">Interest %</div>
              <v-slider
                v-model="discountRate"
                thumb-label="always"
                :min="0"
                :max="100"
                :step="1"
                @change="handleDiscountRateInput"
              />
              <!-- <v-text-field label="Interest" @input="handleDiscountRateInput" v-model="discountRate" variant="outlined" ></v-text-field> -->
              <v-text-field label="Given Amount" @input="handleGivenAmountInput" type="number" v-model="givenamount" variant="outlined" ></v-text-field>
            </v-col>
          </v-row>

          <v-row no-gutters>
            <v-col class="pa-1" cols="6" >
              <p>Interest Amount</p>
              <p>{{ interestamount }}</p>
            </v-col>
            <v-col class="pa-1" cols="6" >
              <v-text-field  variant="outlined" type="number" v-model="interestamount" readonly></v-text-field>
            </v-col>
          </v-row>

          <v-row no-gutters>
            <v-col class="pa-1" cols="6" >
              <p>OffBook</p>
              <p>{{ offbook }}</p>
            </v-col>
            <v-col class="pa-1" cols="6" >
              <v-text-field  variant="outlined" type="number" v-model="offbook" readonly></v-text-field>
            </v-col>
          </v-row>
          </div>
        
          <div class="w-100 pa-1  d-flex ga-1">
            <div class="w-100"><v-btn type="button" class="btn bg-blue"  @click="sheet = !sheet" block>{{ total }}</v-btn></div>
            

            <div class="w-100"><v-btn  @click="dialog = true"   class="btn bg-green" block>Submit & Close</v-btn></div>
          </div>



         


          <v-dialog
      v-model="dialog"
      width="auto"
    >
      <v-card
        max-width="400"
       
       
        title="Are you sure submit calculation ?"
      >
      <div class="w-100 pa-1 d-flex justify-end ga-2">
          <div >
             <v-btn @click="handleSubmit" class="btn bg-blue " >Yes</v-btn></div>
          <div >
            <v-btn
            text="No"
            @click="dialog = false"
          ></v-btn></div>
      </div>
      
      
      </v-card>
    </v-dialog>
</v-form>
 
    


      <v-bottom-sheet  v-model="sheet">
      <v-card
        class="text-center "
        height="500"
        
      >
        <v-card-text class="pa-0">
          <v-card>
    <v-tabs
      v-model="tab"
       class="w-100 "
      
    >
      <v-tab value="one"  :class="{'tab-one-active': tab === 'one'}">Saved <br>Details</v-tab>
      <v-tab value="two"  :class="{'tab-one-active': tab === 'two'}">Months <br>{{ monthsval }}.00</v-tab>
      <v-tab value="three"  :class="{'tab-one-active': tab === 'three'}">Interest <br> ₹{{ interestamount }}</v-tab>
      <v-tab value="four"  :class="{'tab-one-active': tab === 'four'}">Collect <br>{{ total }}</v-tab>
    </v-tabs>
    <hr>

    <v-card-text>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="one">
          <v-carousel>
              <v-carousel-item>
                <div class="w-100 d-flex justify-space-between" >
            <span class="text-gray">Loan Details:</span>
            <span class="text-gray">{{ loantype }}=> {{ weight }}g</span>
          </div>
          <div class="w-100 d-flex justify-end" >
            <span class="text-gray">{{ details }}</span>
          </div>
          <div class="w-100 mt-2  d-flex justify-space-between" >
            <span class="text-gray">Name:</span>
            <span class="text-gray">{{ name }}</span>
          </div>
          <div class="w-100  d-flex justify-space-between" >
            <span class="text-gray">Mobile Number:</span>
            <span class="text-gray">{{ mobilenumber }}</span>
          </div>
          <div class="w-100 mt-2 d-flex justify-space-between" >
            <span class="text-gray">ID Details:</span>
            <span class="text-gray">{{ idtype }}</span>
          </div>
          <div class="w-100 d-flex justify-space-between" >
            <span class="text-gray">ID Number:</span>
            <span class="text-gray">{{ idnumber }}</span>
          </div>

         <div class="w-100 d-flex justify-start mt-2" >
          <p>Address:</p>
         </div>
         <div class="w-100 d-flex justify-start " >
          <p>{{address}}</p>
         </div>
              </v-carousel-item>

              <v-carousel-item>
                <span>Nproof</span>
                <div class="w-100 p">
                  <img :src=nproof alt="">
                </div>
              
            </v-carousel-item>

              <v-carousel-item>
                <span>Nperson</span>
                <div class="w-100 p">
                  <img :src=nperson alt="">
                </div>
              </v-carousel-item>

              <v-carousel-item >
                <span>Nporul</span>
                <div class="w-100 p">
                  <img :src=nproul alt="">
                </div>
              </v-carousel-item>
            </v-carousel>
         

        </v-tabs-window-item>

        <v-tabs-window-item value="two" class="bg-pink-lighten-3 pa-0">
            <v-row no-gutters>
              <v-col  class="pa-1" cols="4">
                <div class="w-100 bg-white rounded-lg" style="height: 80px;">
                  <p class="mt-1 text-h6 text-pink-darken-4">Today Date</p>

                  <p class="text-indigo " style="font-size: 18px;">{{ formattedDate }}</p>
                  <span class="pa-1 text-indigo">(-)</span>
                </div>
              </v-col>
              <v-col  class="pa-1" cols="4">
                <div class="w-100 bg-white rounded-lg " style="height: 80px;">
                  <p class="mt-1 text-h6 text-pink-darken-4">Loan Date</p>
                  <p class="text-indigo " style="font-size: 18px;">{{ loandate }} </p>
                  <span class="pa-1 text-indigo">(=)</span>
                </div>
              </v-col>
              <v-col  class="pa-1" cols="4">
                <div class="w-100 bg-white rounded-lg " style="height: 80px;">
                  <p class="mt-1 text-h6 text-pink-darken-4">Difference</p>
                  <p class="text-indigo " style="font-size: 18px;">{{ days }}  <br><span>Days</span></p>
                </div>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col  class="pa-1" cols="12">
                <div class="w-100 pa-1 bg-pink-darken-3 rounded-lg " >
                  <p class="text-h6">That is = <span>{{ roundmonthv }}</span> Months & <span>{{ mdayv }}</span> Days</p>
                </div>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col  class="pa-1" cols="4">
                <div class="w-100 bg-white rounded-lg " style="height: 90px;">
                  <span class="mt-2 text-pink-darken-4" style="font-size: 18px;">Rounded <br> Months</span><br>
                  <div class="w-100 bg-indigo" style="height: 5px;"></div>
                  <span class="text-h6 text-indigo"><b>{{ rm }}.00 (-)</b></span>
                  <div class="w-100 bg-indigo" style="height: 5px;"></div>
                </div>
              </v-col>
              <v-col  class="pa-1" cols="4">
                <div class="w-100 bg-white rounded-lg" style="height: 90px;">
                  <div class="w-100 bg-white rounded-lg " style="height: 90px;">
                  <span class="mt-2 text-pink-darken-4" style="font-size: 18px;">Advance <br> Months</span><br>
                  <div class="w-100 bg-indigo" style="height: 5px;"></div>
                  <span class="text-h6 text-indigo"><b>1.00 (=)</b></span>
                  <div class="w-100 bg-indigo" style="height: 5px;"></div>
                </div>
                </div>
              </v-col>
              <v-col  class="pa-1" cols="4">
                <div class="w-100 bg-white rounded-lg" style="height: 90px;">
                  <div class="w-100 bg-white rounded-lg " style="height: 90px;">
                  <span class="mt-2 text-pink-darken-4" style="font-size: 18px;">Total <br> Months</span><br>
                  <div class="w-100 bg-indigo" style="height: 5px;"></div>
                  <span class="text-h6 text-indigo"><b>{{ monthsval }}.00</b></span>
                  <div class="w-100 bg-indigo" style="height: 5px;"></div>
                </div>
                </div>
              </v-col>
            </v-row>
        </v-tabs-window-item>

        <v-tabs-window-item value="three" class="bg-pink-lighten-3 pa-1">
          <div class="w-100 pa bg-white rounded-lg" style="border-bottom: 3px solid rebeccapurple;">
              <p class="text-h6 text-pink-darken-4">Discount Calculation @ <span>{{ discountRate }}.00</span> Paisa</p>
          </div> 
          <div class="w-100 mt-2 d-flex ga-2">
            <div class="w-25 pa-1 bg-white rounded-lg" >
              <p  class="text-left text-h6 text-pink-darken-4">{{ loanvalue }}.00</p>
             
              <p  class="text-left text-h6 text-pink-darken-4">X {{discountRate}}.00</p>
             
              <div class="w-100 bg-pink-darken-4" style="height: 5px;"></div>
              <p  class="text-left text-h6 text-pink-darken-4">{{perval}}</p>
              <div class="w-100 bg-pink-darken-4" style="height: 5px;"></div>
            </div>
            <div class="w-25 pa-1 bg-white rounded-lg" >
              <p  class="text-left text-h6 text-pink-darken-4">Discount <br> Months</p>
              <div class="w-100 bg-pink-darken-4" style="height: 5px;"></div>
              <p  class="text-left text-h6 text-pink-darken-4">{{ monthsval }}.00</p>
              <div class="w-100 bg-pink-darken-4" style="height: 5px;"></div>
            </div>
            <div class="w-50 pa-1 bg-white rounded-lg ">
              <p  class="text-right text-h6 text-pink-darken-4">Discount <br> Interest</p>
              <div class="w-100 bg-pink-darken-4" style="height: 5px;"></div>
              <p class="text-white text-h6 bg-pink-darken-4 mt-1">{{ interestamount }}</p>
              <div class="w-100 bg-pink-darken-4 mt-1" style="height: 5px;"></div>
            </div>

          </div>
          <div class="w-100 pa-1 d-flex justify-end ga-2">
            <div class="w-25 pa-1 " ></div>
              <div class="w-25 pa-1 bg-white rounded-lg d-flex justify-center" >
                <p  class="text-right text-h6 text-pink-darken-4">=</p>
              </div>
              <div class="w-50 pa-1 bg-white rounded-lg d-flex justify-center" >
                <p  class="text-right text-h6 text-pink-darken-4">=</p>
              </div>
          </div>

          <div class="w-100 pa-1 d-flex justify-end ga-2">
            <div class="w-25 pa-1 " ></div>
              <div class="w-25 pa-1 bg-white rounded-lg d-flex justify-start" >
                <p  class="text-left text-h6 text-pink-darken-4">Total <br> Months</p>
              </div>
              <div class="w-50 pa-1 bg-white rounded-lg d-flex justify-end" >
                <p  class="text-right text-h6 text-pink-darken-4">Total <br> Interest</p>
              </div>
          </div>

          <div class="w-100 pa-1 d-flex justify-end ga-2">
            <div class="w-25 pa-1 " ></div>
              <div class="w-25 pa-1 bg-black rounded-lg d-flex justify-start" >
                <p  class="text-left text-h6 text-white ">{{monthsval}}.00</p>
              </div>
              <div class="w-50 pa-1 bg-black rounded-lg d-flex justify-end" >
                <p  class="text-right text-h6 text-white ">{{ interestamount }}</p>
              </div>
          </div>
        </v-tabs-window-item>
        <v-tabs-window-item value="four" class="bg-pink-lighten-3 pa-1">
            <div class="w-100 d-flex ga-2" >
              <div class="w-75 pa-1 bg-white rounded-lg" style="border-bottom: 3px solid rebeccapurple;">
                <p class="text-left text-h6 text-pink-darken-4">Total Months</p>
              </div>
              <div class="w-25 pa-1 bg-white rounded-lg" style="border-bottom: 3px solid rebeccapurple;">
                <p class="text-left text-h6 text-pink-darken-4">{{ monthsval }}.00</p>
              </div>
            </div>
            <div class="w-100 pa-1 mt-2 d-flex ga-2" >
              <div class="w-75 pa-1 bg-white rounded-lg" style="border-bottom: 3px solid rebeccapurple;">
                <p class="text-left text-h6 text-pink-darken-4">Interest Amount</p>
              </div>
              <div class="w-25 pa-1 bg-white rounded-lg" style="border-bottom: 3px solid rebeccapurple;">
                <p class="text-left text-h6 text-pink-darken-4">{{ interestamount }}.00</p>
              </div>
            </div>
            <div class="w-100 pa-1 mt-2 d-flex justify-end" >
               <div class="w-25 bg-white d-flex justify-center  rounded-lg" style="border-bottom: 3px solid rebeccapurple;">
                <p class="text-left text-h6 text-indigo">+</p>
               </div>
            </div>
            <div class="w-100 pa-1 mt-2 d-flex ga-2" >
              <div class="w-75 pa-1 bg-white rounded-lg" style="border-bottom: 3px solid rebeccapurple;">
                <p class="text-left text-h6 text-pink-darken-4">Loan Value</p>
              </div>
              <div class="w-25 pa-1 bg-white rounded-lg" style="border-bottom: 3px solid rebeccapurple;">
                <p class="text-left text-h6 text-pink-darken-4">{{ loanvalue }}.00</p>
              </div>
            </div>
            <div class="w-100 pa-1 mt-2 d-flex justify-end" >
               <div class="w-25 bg-white d-flex justify-center  rounded-lg" style="border-bottom: 3px solid rebeccapurple;">
                <p class="text-left text-h6 text-indigo">=</p>
               </div>
            </div>
            <div class="w-100 pa-1 mt-2 d-flex ga-2" >
              <div class="w-75 pa-1 bg-indigo rounded-lg">
                <p class="text-left text-h6 text-white">Collected Amount</p>
              </div>
              <div class="w-25 pa-1 bg-indigo rounded-lg" style="border-bottom: 3px solid rebeccapurple;">
                <p class="text-left text-h6 text-white">{{ total }}</p>
              </div>
            </div>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card-text>
  </v-card>

        </v-card-text>
      </v-card>
    </v-bottom-sheet>
  </div>
</template>

<script setup>
import { ref, onMounted, watch , onBeforeMount} from 'vue';
import CryptoJS from 'crypto-js';
import { useRoute, useRouter } from 'vue-router';
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

const box1 = ref(0);
const box2 = ref(0);
const weight = ref('');
const details = ref('');
const name = ref('');
const address = ref('');
const mobilenumber = ref('');
const idtype = ref('');
const idnumber = ref('');
const loannumber = ref('');
const loantype = ref('');
const loanvalue = ref('');
const loandate = ref('');
const currentdate = ref(new Date().toISOString().split('T')[0]);

const discountRate = ref('');
const mydate = ref('');
const total = ref(0);
const givenamount = ref(0);
const interestamount = ref(0);
const offbook = ref(0);
const route = useRoute();
const secretKey = 'loannumber123456';
const encryptedId = route.query.encryptedId;
let decryptedId = null;
const monthsval=ref('')
const formattedDate = currentdate.value.split('-').reverse().join('-');
const sheet=ref(false)
const tab=ref(null)
const days=ref('')
const roundmonthv=ref('')
const mdayv=ref('')
const rm=ref('')
const dialog=ref(false)
const error=ref(null)
const loanappid=ref('')
const appid=ref('')

const nproof=ref('')
const nperson=ref('')
const nproul=ref('')
const setHeights = () => {
  const height = window.innerHeight;
  box1.value = height * 0.05; // 5% of the height
  box2.value = height * 0.95;  // 90% of the height
 
};

onMounted(() => {
  setHeights();
  window.addEventListener('resize', setHeights);

  return () => {
    window.removeEventListener('resize', setHeights);
  };
});

if (encryptedId) {
        try {
          const bytes = CryptoJS.AES.decrypt(encryptedId, secretKey);
          decryptedId = bytes.toString(CryptoJS.enc.Utf8);
        } catch (error) {
          console.error('Decryption error:', error);
        }
      }
  
      const loansearchpp = async () => {
        const apiurl = 'http://vaanam.w3webtechnologies.co.in/loandb/get_loanrow.php';
        const formdata = new FormData();
        formdata.append('loannumber', decryptedId);
  
        try {
          const response = await fetch(apiurl, { method: 'POST', body: formdata });
          if (!response.ok) throw new Error('Failed to fetch response. Try again!');
          const data = await response.json();
          mydate.value = data[0].Loan_Date;
          weight.value = data[0].Weight;
          loannumber.value = data[0].Loan_Number;
          loantype.value = data[0].Loan_Type;
          loanvalue.value = data[0].Loan_Value;
          loandate.value = formatDate(data[0].Loan_Date);
          details.value = data[0].Pawn_Details;
          name.value = data[0].Name;
          mobilenumber.value = data[0].MobileNum;
          address.value = data[0].Address1;
          idtype.value = data[0].ProofType;
          idnumber.value = data[0].ProofDtails;
          loanappid.value=data[0].Loan_appid
          appid.value=data[0].App_id
          nproof.value=data[0].nProof
          nperson.value=data[0].nPerson
          nproul.value=data[0].nPorul
          await interestval(data);
          calculation();
        } catch (error) {
          console.error(error.message);
        }
      };
  
      const formatDate = (dateString) => {
        const [year, month, day] = dateString.split('-');
        return `${day}-${month}-${year}`;
      };
  
      const interestval = async (loanData) => {
        const apiurl = 'http://vaanam.w3webtechnologies.co.in/loandb/calculate_condition.php';
        const formdata = new FormData();
        formdata.append('loantype', loanData[0].Loan_Type);
        formdata.append('loanvalue', loanData[0].Loan_Value);
  
        try {
          const response = await fetch(apiurl, { method: 'POST', body: formdata });
          if (!response.ok) throw new Error('Failed to fetch response. Try again!');
          const data = await response.json();
          discountRate.value = parseFloat(data[0].DiscountPeriod) || 0; // Convert to number
          calculation();
        } catch (error) {
          console.error('Interest calculation error:', error.message);
        }
      };
  

      const perval=ref(0)
      const calculation = () => {
        const loanamount = parseFloat(loanvalue.value) || 0;
        const interest = discountRate.value || 0;
      //  const interest = parseFloat(discountRate.value.replace('%', '')) || 0;
        const loanDate = new Date(mydate.value);
        const returnDate = new Date(currentdate.value);
  
        if (isNaN(loanamount) || isNaN(interest)) {
        console.error('Invalid values in calculation.');
        return;
      }
        const timeDiff = returnDate - loanDate;
        const diffDays = timeDiff / (1000 * 3600 * 24);
        days.value=diffDays
        const months = Math.max(0, Math.round(diffDays / 30));
        rm.value=months
        const fltmonth=months-1
        monthsval.value=fltmonth
        const interestPerMonth = (loanamount * interest/ 100)  / 12;
        const totalInterest = interestPerMonth * fltmonth;
        interestamount.value = totalInterest.toFixed(2);
        total.value = (loanamount + totalInterest).toFixed(2);



        const roundmonth = Math.floor(diffDays / 30);  // Divide by 30 to get full months
        const mday = diffDays % 30; 
        roundmonthv.value=roundmonth
        mdayv.value=mday 
  
        const givenAmountValue = parseFloat(givenamount.value) || 0;



        const intamt=((interest/100)/12) *loanamount
        perval.value=intamt.toFixed(2)
        if (givenAmountValue >= total.value) {
          offbook.value = givenAmountValue - total.value;
        } else {
          offbook.value = 0;
        }
      };
  
      const handleDiscountRateInput = () => {
        calculation();
      };
  
      const handleGivenAmountInput = () => {
        calculation();
      };
  
      watch([currentdate, discountRate, givenamount], calculation);
  
      loansearchpp();
const handleSubmit = async () => {
  if (
    !loannumber.value || 
    !loanvalue.value || 
    !loantype.value || 
    !loandate.value || 
    !currentdate.value || 
    !discountRate.value || 
    !givenamount.value || 
    !interestamount.value || 
    (offbook.value == null || String(offbook.value).trim() === '')
  ) {
    error.value = 'Please fill in all fields';
    console.log('Error detected');
    console.log(`offbook value: ${offbook.value}`);
    return;
  }

  await calculationSubmission();
 
};
const calculationSubmission = async () => {
  const apiUrl = 'http://localhost/loan db/calculation.php';
  const formData = new FormData();

  formData.append('appid', appid.value);
  formData.append('loanappid', loanappid.value);
  formData.append('loannumber', loannumber.value);
  formData.append('loanvalue', loanvalue.value);
  formData.append('loantype', loantype.value);
  formData.append('loandate', loandate.value);
  formData.append('totalamount', total.value);
  formData.append('interest', discountRate.value);
  formData.append('loanclosedate', currentdate.value);
  formData.append('givenamount', givenamount.value);
  formData.append('interestamount', interestamount.value);
  formData.append('offbook', offbook.value);

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to fetch response. Please try again!');
    }

    const data = await response.json();

    if (data.message === 'ok') {
      status()
     
    } 
   
  } catch (err) {
    console.error('Error submitting calculation:', err.message);
    error.value = err.message; // Ensure 'error' is properly defined
  } finally {
    dialog.value = false; // Ensure 'dialog' is properly defined
  }
};



const status = async () => {
  const apiUrl = 'http://localhost/loan db/closed.php';
  const formData = new FormData();

  formData.append('appid', appid.value);
  formData.append('loanappid', loanappid.value);
  formData.append('loannumber', loannumber.value);
  formData.append('status', 'Close');


  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to fetch response. Please try again!');
    }

    const data = await response.json();

  } catch (err) {
   
    error.value = err.message; 
  }
};



  const remove=()=>{
    error.value=false
  }
    
  
     
  
</script>

<style scoped>
.tab-one-active {
  background-color: blue !important; /* Tab 1 active background color */
  color: white !important;          /* Adjust text color for visibility */
}

.tab-two-active {
  background-color: red !important; /* Tab 2 active background color */
  color: white !important;
}

.tab-three-active {
  background-color: green !important; /* Tab 3 active background color */
  color: white !important;
}
.tab-four-active {
  background-color: green !important; /* Tab 3 active background color */
  color: white !important;
}


</style>
