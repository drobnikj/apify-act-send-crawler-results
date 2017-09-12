const Apify = require('apify');
const typeCheck = require('type-check').typeCheck;

// Input data attributes types
const INPUT_DATA_TYPES = `{
        to: String,
        subject: String,
        text: String,
        attachResults: Maybe [Object]
    }`;

Apify.main(async () => {
    // Get input of your act
    const input = await Apify.getValue('INPUT');
    const actId = input.actId;
    const executionId = input._id;
    const data = input.data ? JSON.parse(input.data) : {};
    const attachments = [];

    // Checks input
    if (!typeCheck(INPUT_DATA_TYPES, data)) {
        console.log(`Invalid input:\n${JSON.stringify(input)}\nData types:\n${INPUT_TYPES}\nAct failed!`);
        throw new Error('Invalid input data');
    }

    // Download results and create attachments
    if (data.attachResults) {
        for(let attachOpts of data.attachResults) {
            const getResultsOpts = Object.assign(attachOpts, { executionId, attachment: 1 });
            const results = await Apify.client.crawlers.getExecutionResults(getResultsOpts);
            attachments.push({
                filename: `${executionId}.${attachOpts.format}`,
                data: Buffer.from(results.items, 'utf8').toString('base64'),
            })
        }
    }

    // Send mail
    const result = await Apify.call({
        actId: 'apify/send-mail',
        input: {
            contentType: 'application/json',
            body: JSON.stringify({
                to: data.to,
                subject: data.subject,
                text: data.text,
                attachments: attachments,
            })
        }
    });
    console.log(result)
});