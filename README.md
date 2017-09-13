# Apify act send crawler results
This act downloads results from Apify crawler and send them to email as attachments.
It is designed to run from [crawler finish webhook](https://www.apifier.com/docs#finishWebhookUrl).

## Usage

For a specific crawler set the following parameters:

### Finish webhook URL (`finishWebhookUrl`)
```
https://api.apifier.com/v2/acts/drobnikj~send-crawler-results/runs?token=APIFIER_API_TOKEN
```

You can find your API token on [your Apifier account page](https://www.apifier.com/account#api-integrations).

### Finish webhook data (`finishWebhookData`)
**Example:**
```json
{
  "to": "example@example.com",
  "subject": "Execution ID: {{executionId}} results",
  "text": "Link to html results: https://api.apifier.com/v1/execs/{{executionId}}/results?format=html&simplified=1",
  "attachResults": [
    {
        "format": "csv",
        "simplified": 1
    }
  ]
}
```

**Parameters:**

- `to`(String) - Email address

- `subject`(String) - Email subject

- `text`(String) - Email text

- `attachResults`(Array) - Array of types of results that will be attach to email. Attribute `format` is required for each type ([all types of format](https://www.apifier.com/api-reference#/reference/results)). Use same attributes as [Get Execution results api endpoint](https://www.apifier.com/api-reference#/reference/results/execution-results/get-execution-results), `simplified`, `offset`, `limit` etc.

- `textContext`(Object) - This object is used for process `subject` and `text`. It replace all {{key}} in `subject` and `text` with proper value from this object. By default object has `executionId` and `actId` attributes. Same behavior as (HandlebarsJS)[http://handlebarsjs.com/]
