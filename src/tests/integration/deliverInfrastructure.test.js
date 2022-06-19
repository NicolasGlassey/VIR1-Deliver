'use strict'

const { AwsCloudClientImpl } = require("vir1-core");

const DescribeInfra = require('../../DescribeInfra');
const Credentials = require('../../Credentials');
const fs = require('fs');
const path = require('path');

describe('deliver infrastructure - integration', () => {
    let client;

    let describeInfra;
    let credentials;
    let outputDir;

    beforeAll(async () => {
        client = await AwsCloudClientImpl.initialize("eu-west-3");
        outputDir = path.join(__dirname, 'output');
    });

    beforeEach(() => {
        deleteOutputDir();

        describeInfra = new DescribeInfra(client.connection);
        credentials = new Credentials(client.connection, outputDir);
    });

    test('deliverInfrastructure_ExistingVpc_Success', async () => {
        // Given
        const vpcName = 'vpc-paris';
        const expectedInfraType = 'string';

        // When
        const vpcExist = await client.exists(AwsCloudClientImpl.VPC, vpcName);
        const infra = await describeInfra.describe(vpcName);
        await credentials.describeLinuxSshKeys();
        await credentials.describeWindowsPasswords();

        // Then
        expect(vpcExist).toBe(true);
        expect(typeof infra).toBe(expectedInfraType);
        expect(infra.length).toBeGreaterThan(0);
        expect(JSON.parse(infra).vpcName).toBe(vpcName);

        const credentialsFiles = fs.readdirSync(outputDir);
        expect(credentialsFiles.length).toBeGreaterThan(0);
        credentialsFiles.forEach(file => {
            expect(file.length).toBeGreaterThan(0);
        });
    });

    afterAll(() => {
        deleteOutputDir();
    });

    function deleteOutputDir() {
        if (!fs.existsSync(outputDir)) return;

        fs.rmSync(outputDir, { recursive: true, force: true });
    }
});
