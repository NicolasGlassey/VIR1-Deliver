'use strict';

const { AwsCloudClientImpl } = require("vir1-core");

const fs = require("fs");
const path = require("path");
const Credentials = require("../Credentials");

describe('Credentials', () => {
    let client;

    let credentials;
    let outputDir;

    beforeAll(async () => {
        client = (await AwsCloudClientImpl.initialize("eu-west-3")).connection;
        outputDir = path.join(__dirname, 'output')
    });

    beforeEach(() => {
        deleteOutputDir();

        credentials = new Credentials(client, outputDir);
    })

    test('describeLinuxSshKeys_All_Success', async () => {
        // Given
        expect.hasAssertions();

        // When
        await credentials.describeLinuxSshKeys();

        // Then
        fs.readdirSync(outputDir).forEach(file => {
            const content = fs.readFileSync(path.join(outputDir, file));
            expect(content.length).toBeGreaterThan(0);
        });
    });

    test('describeWindowsPasswords_All_Success', async () => {
        // Given
        expect.hasAssertions();

        // When
        await credentials.describeWindowsPasswords();

        // Then
        fs.readdirSync(outputDir).forEach(file => {
            const content = fs.readFileSync(path.join(outputDir, file));
            expect(content.length).toBeGreaterThan(0);
        });
    });

    afterAll(() => {
        deleteOutputDir();
    });

    function deleteOutputDir() {
        if (!fs.existsSync(outputDir)) return;

        fs.rmSync(outputDir, { recursive: true, force: true });
    }
});
