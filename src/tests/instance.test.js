const AWS = require("aws-sdk");
const ec2 = new AWS.EC2({ region: "eu-west-3" });

const InstanceHelper = require("../InstanceHelper.js");

describe("Instance", () => {
    let instance;
    let givenInstanceName;

    beforeEach(async () => {
        instance = new InstanceHelper(ec2);
        givenInstanceName = "";
    });

    test("describe_ExistingInstance_Success", async () => {
        // Given
        givenInstanceName = "debian";
        const giveVpcName = "vpc-paris";
        const expectedInstanceKeyName = "test";
        const expectedInstancePlatform = "Linux/UNIX";

        // When
        const result = await instance.describe(giveVpcName).then((result) => {
            return result.filter((instance) =>
                instance.Tags.find(
                    (tag) =>
                        tag.Key === "Name" && tag.Value === givenInstanceName
                )
            )[0];
        });

        // Then
        expect(result.Tags.find((tag) => tag.Key === "Name").Value).toEqual(
            givenInstanceName
        );
        expect(result.KeyName).toEqual(expectedInstanceKeyName);
        expect(result.PlatformDetails).toEqual(expectedInstancePlatform);
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
