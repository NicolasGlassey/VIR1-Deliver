'use strict';

const AWS = require('aws-sdk');
const ec2 = new AWS.EC2({ region: 'eu-west-3' });

const Logger = require('./FileLogger')
const KeyPair = require('./KeyPair')
const Vpc = require('./Vpc')

const InstanceNotFoundException = require('./exceptions/instance/InstanceNotFoundException.js');

module.exports = class Instance {
    //region private attributes
    #id;
    #name;
    #keyName;
    #platform;
    #vpcId;

    //endregion private attributes

    //region public methods

    constructor(id, name, keyName, platform, vpcId) {
        this.#id = id;
        this.#name = name;
        this.#keyName = keyName;
        this.#platform = platform;
        this.#vpcId = vpcId;
    }

    /*
     * @brief Fetch an instance from an id
     * @returns {Promise<Instance>}
     * @exception InstanceNotFoundException is thrown if the there is no instances with that id
     * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeInstances-property
     */
    static async findById(id) {
        let instance = await this.#findBy('instance-id', id);
        return instance[0];
    }

    /*
     * @brief Fetch an instance from a vpc id
     * @returns {Promise<[Instance]>}
     * @exception InstanceNotFoundException is thrown if the there is no instances with that vpc id
     * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeInstances-property
     */
    static async findByVpcId(id) {
        return await this.#findBy('vpc-id', id);
    }

    /**
     * @brief Fetches an instanced based on one of its properties
     * @returns {Promise<Instance[]>}
     * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeInstances-property
     */
    static async #findBy(filter, value) {
        let params = { Filters: [{ Name: filter, Values: [value] }] };

        // describe instances returns empty reservations if no instance was found
        const result = await ec2.describeInstances(params)
                                .promise()

        const reservations = result.Reservations;
        if (reservations.length === 0) {
            throw new InstanceNotFoundException();
        }

        Logger.info(`Describe Instances filtered by ${filter} with value ${value}`);
        return reservations.map(reservation => {
            const instance = reservation.Instances[0]
            return new Instance(instance.InstanceId, instance.Tags[0].Value, instance.KeyName, instance.PlatformDetails, instance.VpcId);
        });
    }

    get id() {
        return this.#id;
    }

    get name() {
        return this.#name;
    }

    get keyName() {
        return this.#keyName;
    }

    get platform() {
        return this.#platform;
    }

    get vpcId() {
        return this.#vpcId;
    }

    /**
     * @brief Fetches the keypair of the current instance
     * @returns {Promise<KeyPair>}
     */
    get keyPair() {
        return KeyPair.findByName(this.keyName);
    }

    /**
     * @brief Fetches the vpc of the current instance
     * @returns {Promise<Vpc>}
     */
    get vpc() {
        return Vpc.find(this.vpcId);
    }
};
