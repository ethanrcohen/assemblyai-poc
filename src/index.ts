import {
    AssemblyAI,
    FinalTranscript,
    PartialTranscript,
    RealtimeTranscript,
} from "assemblyai";
import mic from "mic";

const main = async (): Promise<void> => {
    const sampleRateHertz = 16000;
    const micInstance = mic({
        rate: sampleRateHertz,
        channels: "1",
        debug: false,
        exitOnSilence: 6,
    });

    const client = new AssemblyAI({
        apiKey: "e0fec45b18bf42d3ad1da58bb202d3b4",
    });

    const transcriber = client.realtime.transcriber();

    transcriber.on("open", ({ sessionId, expiresAt }) =>
        console.log("Session ID:", sessionId, "Expires at:", expiresAt)
    );
    transcriber.on("close", (code: number, reason: string) =>
        console.log("Closed", code, reason)
    );
    transcriber.on("transcript", (transcript: RealtimeTranscript) =>
        console.log("Transcript:", transcript)
    );
    transcriber.on("transcript.partial", (transcript: PartialTranscript) =>
        console.debug("Partial transcript:", transcript)
    );
    transcriber.on("transcript.final", (transcript: FinalTranscript) =>
        console.log("Final transcript:", transcript)
    );
    transcriber.on("error", (error: Error) => console.error("Error", error));

    await transcriber.connect();

    micInstance.start();

    const micInputStream = micInstance.getAudioStream();
    /** Raw audio stream */
    micInputStream.on("data", (data) => {
        console.log("Got data from Microphone: " + data.length);
        // Push audio from Microphone to websocket connection
        transcriber.sendAudio(data);
    });

    micInputStream.on("error", function (err) {
        console.log("Error in Input Stream: " + err);
    });

    micInputStream.on("startComplete", function () {
        console.log("Started listening to Microphone.");
    });

    micInputStream.on("silence", function () {
        console.debug("Got SIGNAL silence");
    });
};

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
