const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const CustomerRawData = require('../models/customerRawData.model');
const CustomerData = require('../models/customerData.model');
const CustomerInvalidData = require('../models/customerInvalidData.model');
const fs = require('fs');
const {customValidation} = require("../middlewares");


exports.serviceFormUpload = (req, res, next) => {

    const file = req.file;

    const chunkSize = 1024 * 512; // .5MB

    // // create a read stream with the chunk size
    const readStream = fs.createReadStream(file.path, {highWaterMark: chunkSize});

    let bytesRead = 0;

    let lineNumber = 1;
    let fileContent = '';
    let startTime = Date.now();
    let endTime = '';

    readStream.on('data', async function (chunk) {

        let customerRawData = [];
        let customerInvalidData = [];

        const lines = chunk.toString().split('\n');
        for await (const line of lines) {
            if (line !== '') {
                fileContent += `${lineNumber}: ${line}\n`;
                lineNumber++;

                let rawData = line ? line.trim() : '';
                let splitRawData = []
                splitRawData = rawData ? rawData.split(",") : [];
                if (splitRawData.length > 0) {
                    let phoneNumber = splitRawData[5] ? splitRawData[5].trim() : '';
                    let emailAdd = splitRawData[6] ? splitRawData[6].trim() : '';


                    const customerRawDataObj = {
                        first_name: splitRawData[0] ? splitRawData[0].trim() : '',
                        last_name: splitRawData[1] ? splitRawData[1].trim() : '',
                        city: splitRawData[2] ? splitRawData[2].trim() : '',
                        statecode: splitRawData[3] ? splitRawData[3].trim() : '',
                        postcode: splitRawData[4] ? splitRawData[4].trim() : '',
                        phone: phoneNumber,
                        email: emailAdd,
                        ip: splitRawData[7] ? splitRawData[7].trim() : '',
                        status: 1
                    };


                    if (!customValidation.validatePhone(phoneNumber) || !customValidation.validateEmail(emailAdd)) {
                        customerInvalidData.push(customerRawDataObj);
                    }

                    customerRawData.push(customerRawDataObj);
                }

            }
        }

        try {
            await CustomerRawData.bulkCreate(customerRawData);
            await CustomerInvalidData.bulkCreate(customerInvalidData);
            console.log('Users created successfully!');
        } catch (error) {
            console.error('Error creating users:', error);
        }

        bytesRead += chunk.length;


    });


    readStream.on('end', function () {
        endTime = Date.now();
       let executionTime = endTime - startTime;
        console.log(`Read ${bytesRead} bytes from file`);
        res.send(`File read successfully! Read complete ${bytesRead} bytes from file. Execution time: ${executionTime}ms`);
    });

    readStream.on('error', function (err) {
        console.error('Error reading file:', err);
        res.status(500).send('Error reading file');
    });


};

exports.migrateValidCustomerData = async function (req, res, next) {
    try {

        const startTime = Date.now();

        // Set batch size
        const batchSize = 50000;

        // Get total count of records
        const totalCount = await CustomerRawData.count();

        // Calculate total number of batches
        const totalBatches = Math.ceil(totalCount / batchSize);

        // Loop through batches
        for (let i = 0; i < totalBatches; i++) {
            // Get records for current batch
            const batchRecords = await CustomerRawData.findAll({
                raw: true,
                offset: i * batchSize,
                limit: batchSize
            });

            // Create an array to store valid records for current batch
            const validRecords = [];

            // Loop through records and validate each record
            for (const record of batchRecords) {
                if (customValidation.validatePhone(record.phone) && customValidation.validateEmail(record.email)) {
                    const isValid = await validateRecord(record);
                    // If record is valid, add it to the array of valid records
                    if (isValid) {
                        validRecords.push(record);
                    }
                }

            }

            // Bulk insert the valid records into the CustomerData table
            await CustomerData.bulkCreate(validRecords);
        }


        const endTime = Date.now();
        const executionTime = endTime - startTime;

        res.status(200).json({message: `Migration successful. Execution time: ${executionTime}ms`});

    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Migration failed'});
    }
};


// Validate a single record and return true if it's valid, otherwise return false
async function validateRecord(record) {
    // Your validation logic goes here, for example checking for duplicate records

    const isDuplicate = await CustomerData.findOne({
        where: {
            [Op.or]: [{email: record.email}, {phone: record.phone}]
        }
    });

    if (isDuplicate) {
        console.log(`Duplicate record: ${record.email}`);
        return false;
    }

    return true;
}