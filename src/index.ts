import { AssemblyAI } from "assemblyai";

const main = async (): Promise<void> => {
    const client = new AssemblyAI({
        apiKey: "e0fec45b18bf42d3ad1da58bb202d3b4",
    });

    const FILE_URL =
        "https://storage.googleapis.com/aai-web-samples/5_common_sports_injuries.mp3";

    const data = {
        audio_url: FILE_URL,
    };

    const transcript = await client.transcripts.transcribe(data);
    console.log(transcript.text);
};

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
