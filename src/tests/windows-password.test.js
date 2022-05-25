const WindowsPassword = require('../WindowsPasswordHelper.js');
const InstanceNotFoundException = require('../exceptions/instance/InstanceNotFoundException.js');
const UnavailableInstancePasswordException = require("../exceptions/instance/UnavailableInstancePasswordException.js");

describe('WindowsPassword', () => {
    test('describe_ExistingInstanceName_Success', async () => {
        // Given
        const instanceName = 'WINDOWS_INSTANCE';
        const expectedInstanceId = 'i-0e7dcbe8cf352ad91';

        // When
        const result = await WindowsPassword.describe(instanceName);

        // Then
        expect(result.InstanceId).toEqual(expectedInstanceId);
        expect(result.PasswordData).toBeDefined();
        expect(result.Timestamp).toBeInstanceOf(Date);
    });

    test('describe_NonExistingInstanceName_ThrowException', async () => {
        // Given
        const instanceName = 'WINDOWS_INSTANCE_NON_EXISTING';

        // When
        await expect(WindowsPassword.describe(instanceName)).rejects.toThrow(InstanceNotFoundException);

        // Then
        // Exception is thrown
    });

    test('describe_LinuxInstanceName_ThrowException', async () => {
        // Given
        const instanceId = 'debian';

        // When
        await expect(WindowsPassword.describe(instanceId)).rejects.toThrow(UnavailableInstancePasswordException);

        // Then
        // Exception is thrown
    });
});
