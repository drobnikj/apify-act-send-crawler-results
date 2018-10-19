const Apify = require('apify');
const typeCheck = require('type-check').typeCheck;
const Handlebars = require('handlebars');
const rp = require('request-promise');
const querystring = require('querystring');


// Input data attributes types
const INPUT_DATA_TYPES = `{
        to: String,
        subject: String,
        text: Maybe String,
        html: Maybe String,
        attachResults: Maybe [Object],
        textContext: Maybe Object,
    }`;

const processHandlebars = (textTemplate, context) => {
    const compiler = Handlebars.compile(textTemplate);
    const text = compiler(context);
    return text;
};

Apify.main(async () => {
    // Get input of your act
    const input = await Apify.getValue('INPUT');
    const actId = input.actId;
    const executionId = input._id;
    const data = input.data ? JSON.parse(input.data) : {};
    const attachments = [];

    // Checks input
    if (!(data.text || data.html)) throw new Error('Invalid input data, text or html missing.');
    if (!typeCheck(INPUT_DATA_TYPES, data)) {
        console.log(`Invalid input:\n${JSON.stringify(input)}\nData types:\n${INPUT_DATA_TYPES}\nAct failed!`);
        throw new Error('Invalid input data');
    }

    // Replace handlebars
    const textContext = data.textContext ? Object.assign(data.textContext, { actId, executionId }) : { actId, executionId };
    const text = data.text ? processHandlebars(data.text, textContext) : null;
    const html = data.html ? processHandlebars(data.html, textContext) : null;
    const subject = processHandlebars(data.subject, textContext);


    // Download results and create attachments
    if (data.attachResults) {
        for (let attachOpts of data.attachResults) {
            const getResultsOpts = Object.assign(attachOpts, { attachment: 1 });
            const results = await rp(`https://api.apify.com/v1/execs/${executionId}/results?${querystring.stringify(getResultsOpts)}`, { encoding: null });
            attachments.push({
                filename: `${executionId}.${attachOpts.format}`,
                data: results.toString('base64'),
            })
        }
    }

    // Send mail
    const result = await Apify.call('apify/send-mail', {
        to: data.to,
        subject:subject,
        text:text,
        html:html,
        attachments: attachments,
    });
    console.log(result);
});
