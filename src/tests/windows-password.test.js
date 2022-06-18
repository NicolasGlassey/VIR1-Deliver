const AWS = require("aws-sdk");
const ec2 = new AWS.EC2({ region: "eu-west-3" });

const WindowsPasswordHelper = require("../WindowsPasswordHelper.js");

describe("WindowsPassword", () => {
    let windowsPassword;

    beforeEach(async () => {
        windowsPassword = new WindowsPasswordHelper(ec2);
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
