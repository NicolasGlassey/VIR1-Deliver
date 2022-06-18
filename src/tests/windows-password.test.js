const WindowsPasswordHelper = require('../WindowsPasswordHelper.js');

describe('WindowsPassword', () => {
    /** @type {WindowsPasswordHelper} */
    let windowsPassword;

    beforeEach(async () => {
        windowsPassword = new WindowsPasswordHelper();
    });

    test('describe_All_Success', async () => {
        // Given
        const expectedPasswordsCountMin = 1;

        // When
        const result = await windowsPassword.describe();

        // Then
        result.forEach(password => {
            expect(password.PasswordData).toBeDefined();
            expect(password.PasswordData.length).toBeGreaterThanOrEqual(expectedPasswordsCountMin);
            expect(password.Timestamp).toBeInstanceOf(Date);
        })
    });
});
