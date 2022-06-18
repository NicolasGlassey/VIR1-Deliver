const AWS = require("aws-sdk");
const ec2 = new AWS.EC2({ region: "eu-west-3" });

const SecurityGroupHelper = require("../SecurityGroupHelper.js");

describe("SecurityGroupHelper", () => {
    let securityGroup;
    let securityGroupName;

    beforeEach(() => {
        securityGroup = new SecurityGroupHelper(ec2);
        securityGroupName = "";
    });

    test("exists_ExistingInstance_Success", async () => {
        // Given
        securityGroupName = "default";

        // When
        const result = await securityGroup.exists(securityGroupName);

        // Then
        expect(result).toBeTruthy();
    });

    test("exists_NonExistingInstance_Success", async () => {
        // Given
        securityGroupName = "non-existing";

        // When
        const result = await securityGroup.exists(securityGroupName);

        // Then
        expect(result).toBeFalsy();
    });

    test("describe_ExistingSecurityGroupName_Success", async () => {
        // Given
        securityGroupName = "default";
        const securityGroupDescription = "default VPC security group";
        const vpcName = "vpc-deliver";

        // When
        const securityGroups = await securityGroup.describe(
            vpcName,
            securityGroupName
        );

        // Then
        const actualSecurityGroup = securityGroups.find(
            (sg) => sg.GroupName === securityGroupName
        );
        expect(actualSecurityGroup.GroupName).toBe(securityGroupName);
        expect(actualSecurityGroup.Description).toBe(securityGroupDescription);
        expect(actualSecurityGroup.IpPermissions.length).toBeDefined();
        expect(actualSecurityGroup.IpPermissionsEgress.length).toBeDefined();
        expect(actualSecurityGroup.InboundSecurityRules).toBeDefined();
        expect(actualSecurityGroup.OutboundSecurityRules).toBeDefined();
    });

    test("describe_WithOnlyVpcName_Success", async () => {
        // Given
        const vpcName = "vpc-deliver";

        // When
        const securityGroups = await securityGroup.describe(vpcName);

        // Then
        securityGroups.forEach((sg) => {
            expect(sg.GroupName).toBeDefined();
            expect(sg.Description).toBeDefined();
            expect(sg.IpPermissions).toBeDefined();
            expect(sg.IpPermissionsEgress).toBeDefined();
            expect(sg.InboundSecurityRules).toBeDefined();
            expect(sg.OutboundSecurityRules).toBeDefined();
        });
    });

    test("describe_NonExistingSecurityGroupName_Success", async () => {
        // Given
        securityGroupName = "non-existing";
        const vpcName = "vpc-deliver";

        // When
        const securityGroups = await securityGroup.describe(
            vpcName,
            securityGroupName
        );

        // Then
        expect(securityGroups).toEqual([]);
    });
});
