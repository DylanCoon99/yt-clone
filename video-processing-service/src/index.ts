import express from "express";
import ffmpeg from "fluent-ffmpeg";



const app = express();
app.use(express.json())


app.post("/process-video", (req, res) => {
	// Body contains the path of the input video file
	const inputFilePath = req.body.inputFilePath;
	const outputFilePath = req.body.outputFilePath;

	if (!inputFilePath || !outputFilePath) {
		// bad request
		res.status(400).send("Bad request: Missing file path")
	}

	ffmpeg(inputFilePath)
		.outputOptions("-vf", "scale=-1:360") // convert into 360p
		// on the end event
		.on("end", () => {
			res.status(200).send("Video finished processing successfully.");
			console.log("Video finished processing successfully.");
		})
		// on the error event
		.on("error", (err) => {
			console.log(`Error processing video: ${err.message}`);
			res.status(500).send(`Error processing video: ${err.message}`);
			return;
		})
		.save(outputFilePath);

	//res.status(200).send("Video processing started"); // Can't write to header twice


});

const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});

