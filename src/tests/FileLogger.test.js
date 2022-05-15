const FileLogger = require("../FileLogger");
const fs = require("fs");

describe('FileLogger', () => {
    beforeAll(() => {
        fs.readdirSync("./logs").forEach(file =>
            fs.unlinkSync(`./logs/${file}`)
        );
    });

    test('info_LogInInfoLogFile_Success', async () => {
        expect.hasAssertions();

        // Given
        const message = "Test info message";

        // When
        FileLogger.info(message);

        // Then
        await waitForFileToBeWritten();
        const logFile = fs.readFileSync("./logs/INFO.log", "utf8");
        expect(logFile).toContain(message);
    });

    test('error_LogInErrorLogFile_Success', async () => {
        expect.hasAssertions();

        // Given
        const message = "Test error message";

        // When
        FileLogger.error(message);

        // Then
        await waitForFileToBeWritten();
        const logFile = fs.readFileSync("./logs/ERROR.log", "utf8");
        expect(logFile).toContain(message);
    });
});

async function waitForFileToBeWritten() {
    await new Promise(resolve => setTimeout(resolve, 10));
}
