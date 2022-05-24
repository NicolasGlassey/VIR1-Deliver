const Vpc = require("../VpcHelper.js");
const VpcNotFoundException = require("../exceptions/vpc/VpcNotFoundException.js");

describe("Vpc", () => {
    test("exists_ExistingVpc_True", async () => {
        // Given
        const givenVpcName = "vpc-paris";
        const expectedResult = true;

        // When
        const result = await Vpc.exists(givenVpcName);

        // Then
        expect(result).toBe(expectedResult);
    });

    test("exists_NonExistingVpc_False", async () => {
        // Given
        const givenVpcName = "vpc-name-which-does-not-exist";
        const expectedResult = false;

        // When
        const result = await Vpc.exists(givenVpcName);

        // Then
        expect(result).toBe(expectedResult);
    });

    test("describe_ExistingVpc_Success", async () => {
        // Given
        const expectedVpcName = "vpc-paris";
        const expectedSubnetCount = 1;

        // When
        const vpc = await Vpc.describe(expectedVpcName);

        // Then
        expect(vpc.Name).toEqual(expectedVpcName);
        expect(vpc.Subnets.length).toEqual(expectedSubnetCount);
    });

    test("describe_NonExistingVpc_ThrowException", async () => {
        // Given
        const givenVpcName = "vpc-name-which-does-not-exist";

        // When
        await expect(Vpc.describe(givenVpcName)).rejects.toThrow(
            VpcNotFoundException
        );

        // Then
        // Exception is thrown
    });

    test("securityGroups_ExistingVpc_Success", async () => {
        // Given
        const expectedVpcId = "vpc-08584e8bf7e83d040";
        const vpc = await Vpc.find(expectedVpcId);

        // When
        const securityGroups = await vpc.securityGroups;

        // Then
        expect(securityGroups.length).toBeGreaterThan(0);
    });
});
