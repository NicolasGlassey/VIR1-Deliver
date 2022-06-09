const SubnetHelper = require("../SubnetHelper.js");
const VpcNotFoundException = require("../exceptions/vpc/VpcNotFoundException.js");

describe("Subnet", () => {
    let subnet;
    let givenVpcName;

    beforeEach(() => {
        subnet = new SubnetHelper();
        givenVpcName = "";
    });

    test("describe_ExistingVpc_Success", async () => {
        // Given
        givenVpcName = "vpc-deliver";
        const expectedSubnetCount = 1;

        // When
        const subnets = await subnet.describe(givenVpcName);

        // Then
        expect(subnets.length).toEqual(expectedSubnetCount);
    });

    test("describe_NonExistingVpc_ThrowException", async () => {
        // Given
        givenVpcName = "vpc-name-which-does-not-exist";

        // When
        await expect(subnet.describe(givenVpcName)).rejects.toThrow(
            VpcNotFoundException
        );

        // Then
        // Exception is thrown
    });
});
