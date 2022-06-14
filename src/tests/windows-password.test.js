const WindowsPasswordHelper = require('../WindowsPasswordHelper.js');
const InstanceNotFoundException = require('../exceptions/instance/InstanceNotFoundException.js');
const UnavailableInstancePasswordException = require("../exceptions/instance/UnavailableInstancePasswordException.js");

describe('WindowsPassword', () => {
    /** @type {WindowsPasswordHelper} */
    let windowsPassword;

    /** @type {string} */
    let instanceName;

    beforeEach(async () => {
        windowsPassword = new WindowsPasswordHelper();
        instanceName = '';
    });

    test('describe_ExistingInstanceName_Success', async () => {
        // Given
        instanceName = 'WINDOWS_INSTANCE';

        // When
        const result = await windowsPassword.describe(instanceName);

        // Then
        expect(result.PasswordData).toBeDefined();
        expect(result.Timestamp).toBeInstanceOf(Date);
    });

    test('describe_NonExistingInstanceName_ThrowException', async () => {
        // Given
        instanceName = 'WINDOWS_INSTANCE_NON_EXISTING';

        // When
        await expect(windowsPassword.describe(instanceName)).rejects.toThrow(InstanceNotFoundException);

        // Then
        // Exception is thrown
    });

    test('describe_LinuxInstanceName_ThrowException', async () => {
        // Given
        instanceName = 'debian';

        // When
        await expect(windowsPassword.describe(instanceName)).rejects.toThrow(UnavailableInstancePasswordException);

        // Then
        // Exception is thrown
    });
});
