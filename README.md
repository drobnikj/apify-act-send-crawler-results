# Apify act send crawler results
This act downloads result from Apify crawler and send them to email as attachments.
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
  "to": "example@example.com"
  "subject": "Email subject"
  "text": "Email text",
  "attachResults" [
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

- `attachResults`(Array) - Array of types of results that will be attach to email. Attribute `format` is required for each type ([all types of format](https://www.apifier.com/api-reference#/reference/results)). It uses same attributes as [Get Execution results api endpoint](https://www.apifier.com/api-reference#/reference/results/execution-results/get-execution-results), so you can use `simplified`, `offset`, `limit` etc.