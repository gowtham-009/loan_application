import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
export default defineNuxtConfig({
 


  app: {
    head: {
 
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' }
      ],
     
      link:[
        {
           rel:"stylesheet" ,
         href:"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        }
      ],
      script: [
        { src: 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs', defer: true },
        { src: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js', defer: true },
        { src: 'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js', defer: true },
      // { src: 'https://docs.opencv.org/4.x/opencv.js', defer: true }
      ]
    },
  },

  devtools: { enabled: true },
  
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    //...
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
})
