document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('video');
    const blackScreen = document.getElementById('blackScreen');
    const countdownText = document.getElementById('countdownText');
    const progressCounter = document.getElementById('progressCounter');
    const startBtn = document.getElementById('startBtn');
    const invertBtn = document.getElementById('invertBtn');
    // const downloadBtn = document.getElementById('downloadBtn');
    const doneBtn = document.getElementById('doneBtn');
    const flash = document.getElementById('flash');
    const photoContainer = document.getElementById('photoContainer');

    const bnwFilter = document.getElementById('bnwFilterId');
    const sepiaFilter = document.getElementById('sepiaFilterId');
    const normalFilter = document.getElementById('normalFilterId');

    if(bnwFilter) {
        bnwFilter.addEventListener('click', () => {
            applyFilter("grayscale");
        });
    }

    if(sepiaFilter) {
        sepiaFilter.addEventListener('click', () => {
            applyFilter("sepia");
        });
    }

    if(normalFilter) {
        normalFilter.addEventListener('click', () => {
            applyFilter("none");
        });
    }

    function applyFilter(filterClass) {
        // Remove existing filters
        video.classList.remove("sepia", "grayscale");

        // Apply new filter if not 'none'
        if (filterClass !== "none") {
            video.classList.add(filterClass);
        }
    }

    const canvas = document.createElement('canvas');
    let images = [];

    let invertBtnState = false;

    if(invertBtn) {
        invertBtn.addEventListener('click', () => {
            invertBtnState =!invertBtnState;
            // alert(invertBtnState)
            cameraInvertSwitch()
        });
    }

    function cameraInvertSwitch() {
        if (invertBtnState == true) {
            photoContainer.style.transform = 'scaleX(-1)'
            video.style.transform = 'scaleX(-1)'
        }
        else {
            photoContainer.style.transform = 'scaleX(1)'
            video.style.transform = 'scaleX(1)'
        }
    }

    if (window.location.pathname.endsWith("canvas.html") || window.location.pathname === "canvas.html") {
        function stopCameraStream() {
            if (video.srcObject) {
                video.srcObject.getTracks().forEach(track => track.stop()); // Stop all tracks
                video.srcObject = null;
            }
        }

        
        function startCamera() {
            stopCameraStream(); 

            navigator.mediaDevices.getUserMedia({ video: true })
                .then(stream => {
                    video.srcObject = stream;

                    setTimeout(() => {
                        blackScreen.style.opacity = 0; 
                        setTimeout(() => blackScreen.style.display = 'none', 1000); 
                    }, 500);
                })
                .catch(err => console.error("Camera Access Denied", err));
        }

        startCamera();
    }

    async function startPhotobooth() {
        images = []; 
        photoContainer.innerHTML = ''; 
        startBtn.innerHTML = 'Capturing...';
        progressCounter.textContent = "0/3"; 

        for (let i = 0; i < 3; i++) {
            await showCountdown(); 

            // Flash Effect
            flash.style.opacity = 1;
            setTimeout(() => flash.style.opacity = 0, 200);

            // Capture Image with Filter Applied
            const ctx = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Apply current video filter to the canvas
            ctx.filter = getComputedStyle(video).filter;  //  Apply active filter
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
            
            const imageData = canvas.toDataURL('image/png');
            console.log("Captured Image: ", imageData);
            images.push(imageData);  


            // preview image
            const imgElement = document.createElement('img');
            imgElement.src = imageData;
            imgElement.classList.add('photo');
            // imgElement.style.filter = getComputedStyle(video).filter; // apply filter to preview
            photoContainer.appendChild(imgElement);

            progressCounter.textContent = `${i + 1}/3`;

            if (i < 2) await new Promise(res => setTimeout(res, 1000)); // Wait before next capture
        }

        if (images.length === 3) {
            startBtn.innerHTML = 'Retake';
            doneBtn.style.display = 'block';
        }

        // delete when done debugging
        // if (doneBtn) {
        //     doneBtn.addEventListener('click', (e) => {
        //         e.preventDefault()
        //         window.location.href = 'customize.html'
        //     })
        // }
    }

    async function showCountdown() {
        countdownText.style.display = "block";
        for (let countdown = 3; countdown > 0; countdown--) {
            countdownText.textContent = countdown;
            await new Promise(res => setTimeout(res, 1000));
        }
        countdownText.style.display = "none";
    }

    function storeImageArray() {
        let loadedImages = 0;
        let storedImages = [];
    
        images.forEach((imgData, index) => {
            const img = new Image();
            img.src = imgData;
            img.onload = () => {
                
                if (invertBtnState) {
                    // Create an offscreen canvas to mirror the image
                    const tempCanvas = document.createElement('canvas');
                    const tempCtx = tempCanvas.getContext('2d');
    
                    tempCanvas.width = img.width;
                    tempCanvas.height = img.height;
    
                    // Apply mirroring
                    tempCtx.translate(img.width, 0);
                    tempCtx.scale(-1, 1);
                    tempCtx.drawImage(img, 0, 0, img.width, img.height);
    
                    // Convert to base64 data URL
                    storedImages[index] = tempCanvas.toDataURL('image/png');
                } else {
                    // Store the original image if not mirrored
                    storedImages[index] = imgData;
                }
                loadedImages++;
    
                if (loadedImages === 3) { 
                    sessionStorage.setItem('photoArray', JSON.stringify(storedImages)); // Store the array
                    
                    console.log("All 3 images stored in sessionStorage!");
                    window.location.href = 'customize.html'; 
                }
            };
        });
    }
    
    if(startBtn) {
        startBtn.addEventListener('click', () => startPhotobooth());
    }

    if (doneBtn) {
        doneBtn.addEventListener('click', () => storeImageArray());
    }
    
    // downloadBtn.addEventListener('click', () => downloadStackedImages());
})