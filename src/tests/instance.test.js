const InstanceHelper = require("../InstanceHelper.js");
const InstanceNotFoundException = require("../exceptions/instance/InstanceNotFoundException.js");

describe("Instance", () => {
    let instance = null;
    let givenInstanceName = null;

    beforeEach(() => {
        instance = new InstanceHelper();
    });

    test("describe_ExistingInstance_Success", async () => {
        // Given
        givenInstanceName = "debian";
        const expectedInstanceKeyName = "test";
        const expectedInstancePlatform = "Linux/UNIX";

        // When
        const result = await instance.describe(givenInstanceName);

        // Then
        expect(result.Tags[0].Value).toEqual(givenInstanceName);
        expect(result.KeyName).toEqual(expectedInstanceKeyName);
        expect(result.PlatformDetails).toEqual(expectedInstancePlatform);
    });

    test("describe_NonExistingInstance_ThrowsException", async () => {
        // Given
        givenInstanceName = "non-existing-instance";

        // When
        await expect(instance.describe(givenInstanceName)).rejects.toThrow(
            InstanceNotFoundException
        );

        // Then
        // Exception is thrown
    });

    test("exists_ExistingInstance_Success", async () => {
        // Given
        givenInstanceName = "debian";

        // When
        expect(await instance.exists(givenInstanceName)).toEqual(true);

        // Then
    });

    test("exists_NonExistingInstance_Success", async () => {
        // Given
        givenInstanceName = "non-existing-instance";

        // When
        expect(await instance.exists(givenInstanceName)).toEqual(false);

        // Then
    });
});
