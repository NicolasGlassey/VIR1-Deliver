"use strict";

const { AwsCloudClientImpl } = require("vir1-core");

const WindowsPasswordHelper = require("../WindowsPasswordHelper.js");

describe("WindowsPassword", () => {
    let client;

    let windowsPassword;

    beforeAll(async () => {
        client = (await AwsCloudClientImpl.initialize("eu-west-3")).connection;
    });

    beforeEach(() => {
        windowsPassword = new WindowsPasswordHelper(client);
    });

    test("describe_All_Success", async () => {
        // Given
        const expectedPasswordsCountMin = 1;

        // When
        const result = await windowsPassword.describe();

        // Then
        result.forEach((password) => {
            expect(password.PasswordData).toBeDefined();
            expect(password.PasswordData.length).toBeGreaterThanOrEqual(
                expectedPasswordsCountMin
            );
            expect(password.Timestamp).toBeInstanceOf(Date);
        });
    });
});
