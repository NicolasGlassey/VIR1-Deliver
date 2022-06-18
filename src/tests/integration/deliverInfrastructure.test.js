'use strict'

const DescribeInfra = require('../../DescribeInfra');
const Credentials = require('../../Credentials');
const fs = require('fs');
const path = require('path');

describe('deliver infrastructure - integration', () => {
    /** @type {DescribeInfra} */
    let describeInfra;

    /** @type {Credentials} */
    let credentials;

    let outputDir;

    beforeAll(() => {
        outputDir = path.join(__dirname, 'output');
    });

    beforeEach(() => {
        deleteOutputDir();

        describeInfra = new DescribeInfra();
        credentials = new Credentials(outputDir);
    });

    test('deliverInfrastructure_ExistingVpc_Success', async () => {
        // Given
        const vpcName = 'vpc-paris';
        const expectedInfraType = 'string';

        // When
        const infra = await describeInfra.describe(vpcName);
        await credentials.describeLinuxSshKeys();
        await credentials.describeWindowsPasswords();

        // Then
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
