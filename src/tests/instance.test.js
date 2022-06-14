const VpcHelper = require("../VpcHelper.js");
const InstanceHelper = require("../InstanceHelper.js");
const InstanceNotFoundException = require("../exceptions/instance/InstanceNotFoundException.js");

describe("Instance", () => {
    let vpc;
    let givenVpcId;
    let givenInstanceName;

    beforeEach(async () => {
        instance = new InstanceHelper();
        vpc = new VpcHelper();
        givenVpcId = await vpc.describe("vpc-paris").then((result) => result.VpcId);
        givenInstanceName = "";
    });

    test("describe_ExistingInstance_Success", async () => {
        // Given
        givenInstanceName = "debian";
        const expectedInstanceKeyName = "test";
        const expectedInstancePlatform = "Linux/UNIX";

        // When
        const result = await instance.describe(givenVpcId).then((result) => {
            return result.filter((instance) => instance.Tags.find((tag) => tag.Key === "Name" && tag.Value === givenInstanceName))[0];
        });

        // Then
        expect(result.Tags.find((tag) => tag.Key === "Name").Value).toEqual(givenInstanceName);
        expect(result.KeyName).toEqual(expectedInstanceKeyName);
        expect(result.PlatformDetails).toEqual(expectedInstancePlatform);
    });

    test("describe_NonExistingInstance_ThrowsException", async () => {
        // Given
        givenVpcId = "non-existing-instance";

        // When
        await expect(instance.describe(givenVpcId)).rejects.toThrow(
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
