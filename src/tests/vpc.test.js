const Vpc = require("../VpcHelper.js");
const VpcNotFoundException = require("../exceptions/vpc/VpcNotFoundException.js");

describe("Vpc", () => {
    let vpc = null;
    let givenVpcName = null;

    beforeAll(() => {
        vpc = new Vpc();
    });

    test("exists_ExistingVpc_Success", async () => {
        // Given
        givenVpcName = "vpc-deliver";
        const expectedResult = true;

        // When
        const result = await vpc.exists(givenVpcName);

        // Then
        expect(result).toBe(expectedResult);
    });

    test("exists_NonExistingVpc_Success", async () => {
        // Given
        givenVpcName = "vpc-name-which-does-not-exist";
        const expectedResult = false;

        // When
        const result = await vpc.exists(givenVpcName);

        // Then
        expect(result).toBe(expectedResult);
    });

    test("describe_ExistingVpc_Success", async () => {
        // Given
        givenVpcName = "vpc-deliver";

        // When
        const result = await vpc.describe(givenVpcName);

        // Then
        expect(result.Name).toEqual(givenVpcName);
    });

    test("describe_NonExistingVpc_ThrowException", async () => {
        // Given
        givenVpcName = "vpc-name-which-does-not-exist";

        // When
        await expect(vpc.describe(givenVpcName)).rejects.toThrow(
            VpcNotFoundException
        );

        // Then
        // Exception is thrown
    });
});
