// --- Get references to all necessary HTML elements ---
const modal = document.getElementById('instructions-modal');
const startBtn = document.getElementById('start-btn');
const testContainer = document.getElementById('test-container');
const video = document.getElementById('webcam');
const timerDisplay = document.getElementById('timer');
const warningsDisplay = document.getElementById('warnings');
const statusOverlay = document.getElementById('status-overlay');
const warningSound = document.getElementById('warning-sound');

// --- State variables to manage the test ---
let detector; // This will hold the AI model
let warningsLeft = 3;
let timerInterval;
let detectionInterval;
let isWarningCooldown = false; // Prevents spamming warnings

// --- Event Listener to start the test ---
startBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    testContainer.style.display = 'flex';
    startTest();
});

/**
 * Initializes the timer, camera, and AI detector.
 */
async function startTest() {
    startTimer(30 * 60); // 30 minutes in seconds
    await setupCameraAndDetector();
    if (detector) { // Only start detection if the AI model loaded successfully
        runDetection();
    }
}

/**
 * Sets up the webcam and loads the TensorFlow.js face detection model.
 */
async function setupCameraAndDetector() {
    try {
        // Access the user's webcam
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
        });
        video.srcObject = stream;
        await new Promise((resolve) => {
            video.onloadedmetadata = resolve;
        });

        // Configure the AI detector
        const detectorConfig = {
            runtime: 'mediapipe',
            solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh',
        };
        detector = await faceLandmarksDetection.createDetector(
            faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh, 
            detectorConfig
        );

        console.log("Proctoring system initialized successfully.");
    } catch (err) {
        console.error("Error initializing proctoring system:", err);
        alert("Could not initialize the proctoring system. Please ensure you have given camera permissions and have a stable internet connection. Refresh the page to try again.");
    }
}

/**
 * Runs the AI detection logic in a loop.
 */
async function runDetection() {
    detectionInterval = setInterval(async () => {
        if (!detector) return;

        try {
            const faces = await detector.estimateFaces(video, { flipHorizontal: false });

            let violationDetected = false;
            let reason = 'OK';

            // --- VIOLATION CHECKS ---
            if (faces.length === 0) {
                violationDetected = true;
                reason = "No person detected.";
            } else if (faces.length > 1) {
                violationDetected = true;
                reason = "Multiple people detected.";
            } else {
                const keypoints = faces[0].keypoints;
                const nose = keypoints.find(point => point.name === 'noseTip');
                const leftEye = keypoints.find(point => point.name === 'leftEye');
                const rightEye = keypoints.find(point => point.name === 'rightEye');

                if (nose && leftEye && rightEye) {
                    // Check if user is looking down
                    if (nose.y > (leftEye.y + rightEye.y) / 2) {
                        violationDetected = true;
                        reason = "User looking down.";
                    }
                    // Check if user is looking away
                    const eyeCenter = (leftEye.x + rightEye.x) / 2;
                    const horizontalDist = Math.abs(nose.x - eyeCenter);
                    const eyeWidth = Math.abs(leftEye.x - rightEye.x);
                    if (horizontalDist / eyeWidth > 0.35) { // Threshold for looking away
                        violationDetected = true;
                        reason = "User looking away from screen.";
                    }
                }
            }
            
            // --- Trigger warning or update status ---
            if (violationDetected) {
                triggerWarning(reason);
            } else {
                statusOverlay.textContent = 'STATUS: OK';
                statusOverlay.className = 'status-ok';
            }
        } catch (error) {
            console.error("Error during face detection:", error);
        }
    }, 1000); // Check every second
}

/**
 * Handles the logic for issuing a warning.
 */
function triggerWarning(reason) {
    if (isWarningCooldown) return; // Exit if a warning was recently triggered

    warningsLeft--;
    warningsDisplay.textContent = `Warnings Left: ${warningsLeft}`;
    statusOverlay.textContent = `WARNING: ${reason}`;
    statusOverlay.className = 'status-warn';
    
    warningSound.play().catch(e => console.error("Error playing sound:", e));

    isWarningCooldown = true;
    setTimeout(() => { isWarningCooldown = false; }, 3000); // 3-second cooldown

    if (warningsLeft <= 0) {
        endTest("Test terminated due to too many warnings.");
    }
}

/**
 * Ends the test, stops all processes, and redirects the user.
 */
function endTest(message) {
    clearInterval(timerInterval);
    clearInterval(detectionInterval);

    // Stop the camera stream
    const stream = video.srcObject;
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    
    alert(message);
    
    // ❗ IMPORTANT: Change this to your website's homepage or results page
    window.location.href = "/"; 
}

/**
 * Manages the 30-minute countdown timer.
 */
function startTimer(duration) {
    let timeLeft = duration;
    timerInterval = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        timerDisplay.textContent = `Time Left: ${minutes}:${seconds}`;
        
        if (--timeLeft < 0) {
            endTest("Time is up! Your test has been submitted.");
        }
    }, 1000);
}