const main = async (): Promise<void> => {
    console.log("Hello, world!");
};

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
