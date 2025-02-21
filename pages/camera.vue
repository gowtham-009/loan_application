<template>
	<div class="camera-container">
	  <div class="credit-card-container">
		<video ref="video" class="video-feed" autoplay playsinline></video>
	  </div>
  
	  <div class="controls">
		<button @click="switchCamera">{{ cameraFacing === 'user' ? 'Switch to Back Camera' : 'Switch to Front Camera' }}</button>
		<button v-if="!capturedImage" @click="captureImage">Capture</button>
		<button v-if="capturedImage" @click="retakeImage">Retake</button>
	  </div>
  
	  <div v-if="capturedImage" class="image-preview">
		<img :src="capturedImage" alt="Captured Image" />
	  </div>
	</div>
  </template>
  
  <script>
  export default {
	data() {
	  return {
		videoStream: null,
		cameraFacing: 'user', // 'user' for front, 'environment' for back
		capturedImage: null,
	  };
	},
	mounted() {
	  this.startCamera();
	},
	methods: {
	  async startCamera() {
		const constraints = {
		  video: {
			facingMode: this.cameraFacing, // 'user' for front, 'environment' for back camera
			width: 300,
			height: 180,
		  },
		};
		try {
		  this.videoStream = await navigator.mediaDevices.getUserMedia(constraints);
		  this.$refs.video.srcObject = this.videoStream;
		} catch (error) {
		  console.error('Error accessing the camera:', error);
		}
	  },
	  switchCamera() {
		this.cameraFacing = this.cameraFacing === 'user' ? 'environment' : 'user';
		if (this.videoStream) {
		  this.videoStream.getTracks().forEach((track) => track.stop());
		}
		this.startCamera();
	  },
	  captureImage() {
		const canvas = document.createElement('canvas');
		canvas.width = 300;
		canvas.height = 180;
		const context = canvas.getContext('2d');
		context.drawImage(this.$refs.video, 0, 0, canvas.width, canvas.height);
		this.capturedImage = canvas.toDataURL('image/png');
		this.videoStream.getTracks().forEach((track) => track.stop()); // Stop the video stream after capture
	  },
	  retakeImage() {
		this.capturedImage = null;
		this.startCamera();
	  },
	},
  };
  </script>
  
  <style scoped>
  .camera-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 20px;
  }
  
  .credit-card-container {
	width: 300px;
	height: 180px;
	border: 2px solid #000;
	border-radius: 10px;
	overflow: hidden;
	margin-bottom: 10px;
	background-color: #f0f0f0;
  }
  
  .video-feed {
	width: 100%;
	height: 100%;
	object-fit: cover;
  }
  
  .controls {
	margin-bottom: 10px;
  }
  
  .image-preview img {
	width: 300px;
	height: 180px;
	object-fit: cover;
  }
  </style>
  