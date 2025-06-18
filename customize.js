document.addEventListener('DOMContentLoaded', function() {
    
    const photoCustomPreview = document.getElementById('photoPreview')
    const pinkBtn = document.getElementById('pinkBtnFrame')
    const blueBtn = document.getElementById('blueBtnFrame')
    const yellowBtn = document.getElementById('yellowBtnFrame')
    const brownBtn = document.getElementById('brownBtnFrame')
    const redBtn = document.getElementById('redBtnFrame')

    const matchaBtn = document.getElementById('matchaBtnFrame')
    const purpleBtn = document.getElementById('purpleBtnFrame')
    // const ribbonBtn = document.getElementById('ribbonBtnFrame')
    const whiteBtn = document.getElementById('whiteBtnFrame')
    const blackBtn = document.getElementById('blackBtnFrame')

    const customBack = document.getElementById('customBack');
    const customNext = document.getElementById('customNext');

    const dateCheckbox = document.getElementById('dateCheckbox');

    let finalCanvas = null;

    if (customBack) {
        customBack.addEventListener('click', () => {
            window.location.href = 'canvas.html'
        })
        
    }

    if (dateCheckbox) {
        dateCheckbox.addEventListener('change', () => {
            redrawCanvas();
        });
    }
    
    // Retrieve stored images array from sessionStorage
    const storedImages = JSON.parse(sessionStorage.getItem('photoArray'));

    if (!storedImages || storedImages.length !== 3) {
        console.log("No valid images found in sessionStorage");
    } else {
        console.log("Loaded images:", storedImages);
    }

    // Default background color
    let backgroundType = 'white';

    // Function to set new background and redraw canvas
    function setBackground(type) {
        console.log(`Changing to: ${type}`);
        backgroundType = type;
        redrawCanvas();
    }

    // Event listeners for background change buttons
    if (pinkBtn) pinkBtn.addEventListener('click', () => setBackground('#FFC2D1'));
    if (blueBtn) blueBtn.addEventListener('click', () => setBackground('#CAF0F8'));
    if (yellowBtn) yellowBtn.addEventListener('click', () => setBackground('#FFF8A5'));
    if (matchaBtn) matchaBtn.addEventListener('click', () => setBackground('#90a955'));
    if (purpleBtn) purpleBtn.addEventListener('click', () => setBackground('#c19ee0'));
    if (brownBtn) brownBtn.addEventListener('click', () => setBackground('#DDBEA9'));
    if (redBtn) redBtn.addEventListener('click', () => setBackground('#780000'));
    if (whiteBtn) whiteBtn.addEventListener('click', () => setBackground('#FFFFFF'));
    if (blackBtn) blackBtn.addEventListener('click', () => setBackground('#000000'));
    // if (ribbonBtn) ribbonBtn.addEventListener('click', () => setBackground('ribbon'));

    function drawTextAndDate(ctx, canvas) {
        ctx.fillStyle = (backgroundType === '#000000' || backgroundType === '#780000') ? '#FFFFFF' : 'black';
        ctx.font = 'bold 24px Arial, Roboto, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('photobooth', canvas.width / 2, canvas.height - 75);
    
        if (dateCheckbox.checked) {
            const currentDate = new Date();
            const dateString = currentDate.toLocaleDateString();
            ctx.font = '18px Arial, Roboto, sans-serif';
            ctx.fillText(dateString, canvas.width / 2, canvas.height - 50);
        }
    }

    // Function to redraw the canvas with stored images & selected background
    function redrawCanvas() {
        console.log(`Redrawing canvas with background: ${backgroundType}`);

        const stackedCanvas = document.createElement('canvas');
        const ctx = stackedCanvas.getContext('2d');

        const canvasWidth = 592;
        const canvasHeight = 1352;
        const borderWidth = 40;
        const spacing = 20;
        const bottomPadding = 100;

        const availableHeight = canvasHeight - (borderWidth * 2) - (spacing * 2) - bottomPadding;
        const photoHeight = availableHeight / 3;
        const photoWidth = canvasWidth - (borderWidth * 2);

        stackedCanvas.width = canvasWidth;
        stackedCanvas.height = canvasHeight;

        // if (backgroundType === 'ribbon') {
        //     Use ribbon-bg
        //     const bgImage = new Image();
        //     bgImage.src = 'assets/ribbon-bg.png';
        //     bgImage.onload = function () {
        //         ctx.drawImage(bgImage, 0, 0, canvasWidth, canvasHeight);
                
        //     };


        //     bgImage.onload = function () {
        //         redrawCanvas();
        //     };

        // } else {
        //     ctx.fillStyle = backgroundType;
        //     ctx.fillRect(0, 0, stackedCanvas.width, stackedCanvas.height);

        // }
        ctx.fillStyle = backgroundType;
        ctx.fillRect(0, 0, stackedCanvas.width, stackedCanvas.height);

        if(backgroundType !== '#000000' && backgroundType !== '#780000') {
            ctx.fillStyle = 'black';
        }
        else {
            ctx.fillStyle = '#FFFFFF';
        }

        ctx.font = 'bold 24px Arial, Roboto, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('photobooth', stackedCanvas.width / 2, stackedCanvas.height - 75);

        // Check if date checkbox is checked and add the date
        if (dateCheckbox.checked) {
            const currentDate = new Date();
            const dateString = currentDate.toLocaleDateString();
            ctx.fillStyle = (backgroundType === '#000000' || backgroundType === '#780000') ? '#FFFFFF' : 'black';
            ctx.font = '18px Arial, Roboto, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(dateString, stackedCanvas.width / 2, stackedCanvas.height - 55);
        }
        
        // updatePreview(stackedCanvas);

        // Draw stored images if available
        if (storedImages && storedImages.length === 3) {
            let loadedImages = 0;

            storedImages.forEach((imgData, index) => {
                const img = new Image();
                img.src = imgData;
                img.onload = function () {
                    const x = borderWidth;
                    const y = borderWidth + index * (photoHeight + spacing);
                    ctx.drawImage(img, x, y, photoWidth, photoHeight);
                    
                    loadedImages++;
                    if (loadedImages === 3) {
                        updatePreview(stackedCanvas);
                        
                    }
                };
            });
        } else {
            console.log("No stored images found.");
        }
    }

    
    // update preview of canvas
    function updatePreview(canvas) {
        if (photoCustomPreview) {
            photoCustomPreview.innerHTML = ''; // Clear old content
            photoCustomPreview.appendChild(canvas); // Append new canvas

            canvas.style.width = "170px";
            if(backgroundType == '#FFFFFF') {
                canvas.style.border = '1px solid black';
            }
            
        }
    }

    // finalizes customization 
    if (customNext) {
        customNext.addEventListener('click', () => {
            const stackedCanvas = document.createElement('canvas');
            const ctx = stackedCanvas.getContext('2d');

            const canvasWidth = 592;
            const canvasHeight = 1352;
            const borderWidth = 40;
            const spacing = 20;
            const bottomPadding = 100;

            const availableHeight = canvasHeight - (borderWidth * 2) - (spacing * 2) - bottomPadding;
            const photoHeight = availableHeight / 3;
            const photoWidth = canvasWidth - (borderWidth * 2);

            stackedCanvas.width = canvasWidth;
            stackedCanvas.height = canvasHeight;

            ctx.fillStyle = backgroundType;
            ctx.fillRect(0, 0, stackedCanvas.width, stackedCanvas.height);

            if (storedImages && storedImages.length === 3) {
                let loadedImages = 0;

                storedImages.forEach((imgData, index) => {
                    const img = new Image();
                    img.src = imgData;
                    img.onload = function () {
                        const x = borderWidth;
                        const y = borderWidth + index * (photoHeight + spacing);
                        ctx.drawImage(img, x, y, photoWidth, photoHeight);

                        loadedImages++;
                        if (loadedImages === 3) {
                            // 🎯 Draw text & date after all images load
                            drawTextAndDate(ctx, stackedCanvas);

                            // Save and redirect
                            const finalImage = stackedCanvas.toDataURL('image/png');
                            sessionStorage.setItem('updatedImage', finalImage);
                            console.log('Final image saved!');
                            window.location.href = 'result.html';
                        }
                    };
                });
            }
        });
    }

    window.onload = () => {
        redrawCanvas();
    };
})