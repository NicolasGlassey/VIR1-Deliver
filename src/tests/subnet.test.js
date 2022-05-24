const Subnet = require('../SubnetHelper.js');
const Vpc = require("../VpcHelper.js");

describe('Subnet', () => {
    test('describe_ExistingVpc_Success', async () => {
        // Given
        const givenVpcId = await Vpc.describe('vpc-paris').then(vpc => vpc.VpcId);
        const expectedSubnetCount = 1;

        // When
        const subnets = await Subnet.describe(givenVpcId);

        // Then
        expect(subnets.length).toEqual(expectedSubnetCount);
    });

    test("describe_NonExistingVpc_EmptyArray", async () => {
        // Given
        const wrongVpcId = "vpc-id-which-does-not-exist";
        const expectedSubnetIds = [];

        // When
        const subnets = await Subnet.describe(wrongVpcId);

        // Then
        expect(subnets).toEqual(expectedSubnetIds);
    });
});
