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
let detector;
let warningsLeft = 3;
let timerInterval;
let detectionInterval;
let isWarningCooldown = false;
let isTestActive = false; // NEW: State to check if the test is running

// --- Event Listener to start the test ---
startBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    testContainer.style.display = 'flex';
    startTest();
});

/**
 * Initializes the timer, camera, AI detector, and new proctoring features.
 */
async function startTest() {
    isTestActive = true;
    startTimer(30 * 60);

    // NEW FEATURE: Request full screen when the test starts
    document.documentElement.requestFullscreen().catch(err => {
        alert(`Error enabling full-screen: ${err.message}. Please enable it manually.`);
    });

    // NEW FEATURE: Add event listeners for the new checks
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullScreenChange);

    await setupCameraAndDetector();
    if (detector) {
        runDetection();
    }
}

// --- NEW FEATURE: Handlers for tab focus and full-screen events ---

/**
 * Triggers a warning if the user switches tabs or minimizes the window.
 */
function handleVisibilityChange() {
    if (document.hidden && isTestActive) {
        triggerWarning("Tab switch detected.");
    }
}

/**
 * Triggers a warning if the user exits full-screen mode.
 */
function handleFullScreenChange() {
    if (!document.fullscreenElement && isTestActive) {
        triggerWarning("Exited full-screen mode.");
    }
}


/**
 * Sets up the webcam and loads the TensorFlow.js face detection model.
 */
async function setupCameraAndDetector() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        video.srcObject = stream;
        await new Promise((resolve) => { video.onloadedmetadata = resolve; });

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
        alert("Could not initialize the proctoring system. Please check permissions and refresh.");
    }
}

/**
 * Runs the AI detection logic in a loop.
 */
async function runDetection() {
    detectionInterval = setInterval(async () => {
        if (!detector || !isTestActive) return;
        try {
            const faces = await detector.estimateFaces(video, { flipHorizontal: false });
            let violationDetected = false;
            let reason = 'OK';

            if (faces.length === 0) {
                violationDetected = true;
                reason = "No person detected.";
            } else if (faces.length > 1) {
                violationDetected = true;
                reason = "Multiple people detected.";
            } else {
                const keypoints = faces[0].keypoints;
                const nose = keypoints.find(p => p.name === 'noseTip');
                const leftEye = keypoints.find(p => p.name === 'leftEye');
                const rightEye = keypoints.find(p => p.name === 'rightEye');
                if (nose && leftEye && rightEye) {
                    if (nose.y > (leftEye.y + rightEye.y) / 2) {
                        violationDetected = true;
                        reason = "User looking down.";
                    }
                    const eyeCenter = (leftEye.x + rightEye.x) / 2;
                    const hDist = Math.abs(nose.x - eyeCenter);
                    const eyeWidth = Math.abs(leftEye.x - rightEye.x);
                    if (hDist / eyeWidth > 0.35) {
                        violationDetected = true;
                        reason = "User looking away.";
                    }
                }
            }

            if (violationDetected) {
                triggerWarning(reason);
            } else {
                statusOverlay.textContent = 'STATUS: OK';
                statusOverlay.className = 'status-ok';
            }
        } catch (error) {
            console.error("Error during face detection:", error);
        }
    }, 1000);
}

/**
 * Handles the logic for issuing a warning.
 */
function triggerWarning(reason) {
    if (isWarningCooldown || !isTestActive) return;
    warningsLeft--;
    warningsDisplay.textContent = `Warnings Left: ${warningsLeft}`;
    statusOverlay.textContent = `WARNING: ${reason}`;
    statusOverlay.className = 'status-warn';
    warningSound.play().catch(e => console.error("Error playing sound:", e));
    isWarningCooldown = true;
    setTimeout(() => { isWarningCooldown = false; }, 3000);
    if (warningsLeft <= 0) {
        endTest("Test terminated due to too many warnings.");
    }
}

/**
 * Ends the test, stops all processes, and redirects the user.
 */
function endTest(message) {
    if (!isTestActive) return; // Prevent this from running multiple times
    isTestActive = false;
    clearInterval(timerInterval);
    clearInterval(detectionInterval);

    // NEW: Clean up event listeners to prevent memory leaks
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    document.removeEventListener('fullscreenchange', handleFullScreenChange);

    const stream = video.srcObject;
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }

    // NEW: Exit full screen when the test is over
    if (document.fullscreenElement) {
        document.exitFullscreen();
    }

    alert(message);
    window.location.href = "/"; // Redirect to homepage
}

/**
 * Manages the countdown timer.
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