"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post("/process-video", (req, res) => {
    // Body contains the path of the input video file
    const inputFilePath = req.body.inputFilePath;
    const outputFilePath = req.body.outputFilePath;
    if (!inputFilePath || !outputFilePath) {
        // bad request
        res.status(400).send("Bad request: Missing file path");
    }
    (0, fluent_ffmpeg_1.default)(inputFilePath)
        .outputOptions("-vf", "scale=-1:360") // convert into 360p
        // on the end event
        .on("end", () => {
        res.status(200).send("Video finished processing successfully.");
    })
        // on the error event
        .on("error", (err) => {
        console.log(`Error processing video: ${err.message}`);
        res.status(500).send(`Error processing video: ${err.message}`);
    })
        .save(outputFilePath);
    res.status(200).send("Video processing started");
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
