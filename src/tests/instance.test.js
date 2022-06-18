const AWS = require("aws-sdk");
const ec2 = new AWS.EC2({ region: "eu-west-3" });

const VpcHelper = require("../VpcHelper.js");
const InstanceHelper = require("../InstanceHelper.js");

describe("Instance", () => {
    let instance;
    let givenVpcId;
    let givenInstanceName;

    beforeEach(async () => {
        instance = new InstanceHelper(ec2);
        givenVpcId = await new VpcHelper(ec2)
            .describe("vpc-paris")
            .then((result) => result.VpcId);
        givenInstanceName = "";
    });

    test("describe_ExistingInstance_Success", async () => {
        // Given
        givenInstanceName = "debian";
        const expectedInstanceKeyName = "test";
        const expectedInstancePlatform = "Linux/UNIX";

        // When
        const result = await instance.describe(givenVpcId).then((result) => {
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
