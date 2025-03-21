document.addEventListener("DOMContentLoaded", () => { 
    const form = document.getElementById("download-form");
    const inputField = document.getElementById("tiktok-url");
    const downloadBtn = document.querySelector(".download-btn");

    // ✅ Handle Form Submission
    form.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent page reload

        const url = inputField.value.trim();

        if (!isValidTikTokUrl(url)) {
            alert("Please enter a valid TikTok video link!");
            return;
        }

        downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
        downloadBtn.disabled = true;

        // ✅ Use the deployed backend URL instead of localhost
        const apiUrl = `https://cliptok-git-main-purposefullylines-projects.vercel.app/download/tiktok?url=${encodeURIComponent(url)}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.videoUrl) {
                    window.location.href = data.videoUrl; // Redirect to the video download link
                } else {
                    alert("Failed to fetch the video. Please try again.");
                }
            })
            .catch(error => {
                console.error("Error:", error);
                alert("An error occurred while processing your request.");
            })
            .finally(() => {
                downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download';
                downloadBtn.disabled = false;
            });
    });

    // ✅ Function to validate TikTok URLs
    function isValidTikTokUrl(url) {
        const tiktokRegex = /^(https?:\/\/)?(www\.)?(tiktok\.com\/|vm\.tiktok\.com\/|vt\.tiktok\.com\/)/;
        return tiktokRegex.test(url);
    }
});
