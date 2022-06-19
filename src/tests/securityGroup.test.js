"use strict";

const { AwsCloudClientImpl } = require("vir1-core");

const SecurityGroupHelper = require("../SecurityGroupHelper.js");

describe("SecurityGroupHelper", () => {
    let client;

    let securityGroup;
    let securityGroupName;
    let givenVpcName;

    beforeAll(async () => {
        client = await AwsCloudClientImpl.initialize("eu-west-3");
    });

    beforeEach(() => {
        securityGroup = new SecurityGroupHelper(client.connection);
        securityGroupName = "";
        givenVpcName = "";
    });

    test("describe_ExistingSecurityGroupName_Success", async () => {
        // Given
        securityGroupName = "default";
        const securityGroupDescription = "default VPC security group";

        givenVpcName = "vpc-deliver";

        // When
        const vpcExist = await client.exists(AwsCloudClientImpl.VPC, givenVpcName);
        const securityGroups = await securityGroup.describe(
            givenVpcName,
            securityGroupName
        );

        // Then
        const actualSecurityGroup = securityGroups.find(
            (sg) => sg.GroupName === securityGroupName
        );
        expect(vpcExist).toBe(true);
        expect(actualSecurityGroup.GroupName).toBe(securityGroupName);
        expect(actualSecurityGroup.Description).toBe(securityGroupDescription);
        expect(actualSecurityGroup.IpPermissions.length).toBeDefined();
        expect(actualSecurityGroup.IpPermissionsEgress.length).toBeDefined();
        expect(actualSecurityGroup.InboundSecurityRules).toBeDefined();
        expect(actualSecurityGroup.OutboundSecurityRules).toBeDefined();
    });

    test("describe_WithOnlyVpcName_Success", async () => {
        // Given
        givenVpcName = "vpc-deliver";

        // When
        const vpcExist = await client.exists(
            AwsCloudClientImpl.VPC,
            givenVpcName
        );
        const securityGroups = await securityGroup.describe(givenVpcName);

        // Then
        expect(vpcExist).toBe(true);
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
        givenVpcName = "vpc-deliver";
        securityGroupName = "non-existing";

        // When
        const vpcExist = await client.exists(
            AwsCloudClientImpl.VPC,
            givenVpcName
        );
        const securityGroups = await securityGroup.describe(
            givenVpcName,
            securityGroupName
        );

        // Then
        expect(vpcExist).toBe(true);
        expect(securityGroups).toEqual([]);
    });
});
