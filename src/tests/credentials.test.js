'use strict';

const fs = require("fs");
const path = require("path");
const Credentials = require("../Credentials");

describe('Credentials', () => {
    let credentials;
    const outputDir = path.join(__dirname, 'output');

    beforeEach(() => {
        deleteOutputDir();

        credentials = new Credentials(outputDir);
    })

    test('describeLinuxSshKeys_All_Success', async () => {
        // Given
        expect.hasAssertions();

        // When
        await credentials.describeLinuxSshKeys();

        // Then
        fs.readdirSync(outputDir).forEach(file => {
            expect(file.length).toBeGreaterThan(0);
        });
    });

    test('describeWindowsPasswords_All_Success', async () => {
        // Given
        expect.hasAssertions();

        // When
        await credentials.describeWindowsPasswords();

        // Then
        fs.readdirSync(outputDir).forEach(file => {
            expect(file.length).toBeGreaterThan(0);
        });
    });

    afterAll(() => {
        deleteOutputDir();
    });

    function deleteOutputDir() {
        if (!fs.existsSync(outputDir)) return;

        fs.rmdirSync(outputDir, { recursive: true });
    }
});
