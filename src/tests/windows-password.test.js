const WindowsPassword = require("../WindowsPassword.js");
const InstanceNotFoundException = require("../exceptions/instance/InstanceNotFoundException.js");
const UnavailableInstancePasswordException = require("../exceptions/instance/UnavailableInstancePasswordException.js");

describe('WindowsPassword', () => {
    test('find_ExistingInstanceId_Success', async () => {
        // Given
        const instanceId = "i-0e7dcbe8cf352ad91";

        // When
        const result = await WindowsPassword.find(instanceId);

        // Then
        expect(result.instanceId).toEqual(instanceId);
        expect(result.password).toBeDefined();
        expect(result.timestamp).toBeInstanceOf(Date);
    });

    test('find_NonExistingInstanceId_ThrowException', async () => {
        // Given
        const instanceId = "i-0e7dcbe8cf352ad92";

        // When
        await expect(WindowsPassword.find(instanceId)).rejects.toThrow(InstanceNotFoundException);

        // Then
        // Exception is thrown
    });

    test('find_MalformedInstanceId_ThrowException', async () => {
        // Given
        const instanceId = "i-0e7dcbe8cf352ad91-invalid";

        // When
        await expect(WindowsPassword.find(instanceId)).rejects.toThrow(InstanceNotFoundException);

        // Then
        // Exception is thrown
    });

    test('find_LinuxInstanceId_ThrowException', async () => {
        // Given
        const instanceId = "i-03d46dee061af282b";

        // When
        await expect(WindowsPassword.find(instanceId)).rejects.toThrow(UnavailableInstancePasswordException);

        // Then
        // Exception is thrown
    });
});
