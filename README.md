# Apify actor to send results ([Apify store](https://www.apify.com/drobnikj/send-crawler-results))
This actor downloads results from Apify scraper/crawler and send them to email as attachments.
It is designed to run from finish webhook of [Legacy PhantomJS Crawler](https://apify.com/apify/legacy-phantomjs-crawler).

# Usage

## From [Legacy PhantomJS Crawler](https://apify.com/apify/legacy-phantomjs-crawler) task

For a specific task set the following parameters:

### Finish webhook URL (`finishWebhookUrl`)
```
https://api.apify.com/v2/acts/drobnikj~send-crawler-results/runs?token=APIFY_API_TOKEN
```

You can find your API token on [your Apify account page](https://my.apify.com/account#/integrations).

### Finish webhook data (`finishWebhookData`)
**Example:**
```json
{
  "to": "example@example.com",
  "subject": "Execution ID: {{executionId}} results",
  "text": "Link to html results: https://api.apify.com/v1/execs/{{executionId}}/results?format=html&simplified=1",
  "html":  "Link to html <a href=\"https://api.apify.com/v1/execs/{{executionId}}/results?format=html&simplified=1\"> results </a>",
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

- `html`(String) - Email html body

- `attachResults`(Array) - Array of types of results that will be attach to email. Attribute `format` is required for each type ([all types of format](https://apify.com/docs/api/v2#/reference/datasets/item-collection/get-items)). Use same attributes as [Get dataset items api endpoint](https://apify.com/docs/api/v2#/reference/datasets/item-collection/get-items), `simplified`, `offset`, `limit` etc.

- `textContext`(Object) - This object is used for process `subject` and `text`. It replace all {{key}} in `subject` and `text` with proper value from this object. By default object has all attributes attributes gets on input. Same behavior as [HandlebarsJS](http://handlebarsjs.com/).

