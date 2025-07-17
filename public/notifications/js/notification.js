document.getElementById("notification-icon").addEventListener("click", async () => {
    const username = localStorage.getItem("username");

    if (!username) {
        console.error("No username found in localStorage.");
        return;
    }

    try {
        // Step 1: Get updated skills from backend
        const skillRes = await fetch(`/api/user/skills/${username}`);
        const skillData = await skillRes.json();

        if (!skillData || !skillData.skills || skillData.skills.length === 0) {
            console.error("No skills found.");
            return;
        }

        // Step 2: Send updated skills to recommendation ML API
        const recRes = await fetch("/api/recommend", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ skills: skillData.skills }),
        });

        const recData = await recRes.json();

        const recBox = document.getElementById("notification-box");
        recBox.innerHTML = "";

        if (recData.recommendations && recData.recommendations.length > 0) {
            recData.recommendations.forEach((rec) => {
                const item = document.createElement("div");
                item.className = "notification-item";
                item.innerText = rec;
                recBox.appendChild(item);
            });
        } else {
            recBox.innerHTML = "<div class='notification-item'>No recommendations found.</div>";
        }
    } catch (error) {
        console.error("Error fetching notifications:", error);
    }
});
