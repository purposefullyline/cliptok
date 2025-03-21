const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "*" })); // Allow frontend to access API
app.use(express.json());

// ✅ Function to Extract TikTok Video ID from URL
function extractTikTokVideoId(url) {
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?tiktok\.com\/(?:@[\w.-]+\/video\/|t\/|v\/|embed\/|)(\d+)/);
    return match ? match[1] : null;
}

// 🟢 TikTok Video Downloader API Endpoint
app.get("/download/tiktok", async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.status(400).json({ error: "TikTok URL is required" });

        // Extract Video ID
        const videoId = extractTikTokVideoId(url);
        if (!videoId) return res.status(400).json({ error: "Invalid TikTok URL" });

        console.log(`Fetching TikTok video: ${url}`);

        // ✅ Fetch Video from TikTok API
        const response = await axios.get(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`, {
            timeout: 10000, // Prevent API hang-ups
        });

        const videoData = response.data?.data;
        if (videoData?.play) {
            return res.json({ videoUrl: videoData.play }); // Return the direct video link
        }

        res.status(500).json({ error: "Failed to fetch TikTok video", details: response.data });
    } catch (error) {
        console.error("TikTok Download Error:", error.message);
        res.status(500).json({ 
            error: "Server Error: Could not process your request.", 
            details: error.response?.data || error.message 
        });
    }
});

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
