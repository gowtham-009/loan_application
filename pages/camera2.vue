<template>
	<div class="camera-container">
	  <button v-if="!cameraActive" @click="openCamera">Open Camera</button>
  
	  <div v-if="cameraActive" class="face-container">
		<video ref="video" class="video-feed" autoplay playsinline></video>
		<canvas ref="canvas" class="canvas-overlay"></canvas>
	  </div>
  
	  <div v-if="cameraActive" class="controls">
		<button @click="closeCamera">Close Camera</button>
	  </div>
	</div>
  </template>
  
  <script>
  export default {
	data() {
	  return {
		cameraActive: false,
		faceMesh: null,
		camera: null,
	  };
	},
	methods: {
	  async loadExternalLibraries() {
		// Dynamically load TensorFlow.js and MediaPipe FaceMesh
		await Promise.all([
		  this.loadScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs'),
		  this.loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js'),
		  this.loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js')
		]);
	  },
	  loadScript(src) {
		return new Promise((resolve, reject) => {
		  const script = document.createElement('script');
		  script.src = src;
		  script.onload = resolve;
		  script.onerror = reject;
		  document.head.appendChild(script);
		});
	  },
	  async openCamera() {
		await this.loadExternalLibraries();
  
		this.cameraActive = true;
  
		const videoElement = this.$refs.video;
		const canvasElement = this.$refs.canvas;
		const canvasCtx = canvasElement.getContext('2d');
  
		// Initialize MediaPipe FaceMesh
		this.faceMesh = new FaceMesh({
		  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
		});
  
		this.faceMesh.setOptions({
		  maxNumFaces: 1,
		  refineLandmarks: true,
		  minDetectionConfidence: 0.5,
		  minTrackingConfidence: 0.5,
		});
  
		this.faceMesh.onResults((results) => {
		  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
		  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
  
		  if (results.multiFaceLandmarks) {
			for (const landmarks of results.multiFaceLandmarks) {
			  this.drawFaceMesh(canvasCtx, landmarks);
			}
		  }
		});
  
		this.startCamera(videoElement, canvasElement);
	  },
	  startCamera(videoElement, canvasElement) {
		const onFrame = async () => {
		  await this.faceMesh.send({ image: videoElement });
		  requestAnimationFrame(onFrame);
		};
  
		this.camera = new Camera(videoElement, {
		  onFrame,
		  width: 640,
		  height: 480,
		});
		this.camera.start();
  
		canvasElement.width = videoElement.videoWidth;
		canvasElement.height = videoElement.videoHeight;
	  },
	  drawFaceMesh(ctx, landmarks) {
		ctx.beginPath();
		ctx.strokeStyle = 'green';
		ctx.lineWidth = 1;
  
		for (let i = 0; i < landmarks.length; i++) {
		  const x = landmarks[i].x * this.$refs.canvas.width;
		  const y = landmarks[i].y * this.$refs.canvas.height;
  
		  if (i === 0) {
			ctx.moveTo(x, y);
		  } else {
			ctx.lineTo(x, y);
		  }
		}
  
		ctx.closePath();
		ctx.stroke();
	  },
	  closeCamera() {
		this.cameraActive = false;
		if (this.camera) {
		  this.camera.stop();
		}
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
  
  .face-container {
	position: relative;
  }
  
  .video-feed {
	width: 640px;
	height: 480px;
	display: block;
  }
  
  .canvas-overlay {
	position: absolute;
	top: 0;
	left: 0;
	width: 640px;
	height: 480px;
	pointer-events: none;
  }
  </style>
  