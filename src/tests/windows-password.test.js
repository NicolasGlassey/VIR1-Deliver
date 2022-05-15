const WindowsPassword = require("../WindowsPassword");

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
});
