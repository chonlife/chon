# CHON Personality Test Backend

This backend provides an API for the CHON Personality Test application, collecting and storing user responses to the personality test questions.

## Database Structure

The application uses Supabase (PostgreSQL) with the following tables:

### `intro_choices`

Stores responses to the introduction question ("Mothers are born leaders") with yes/no counts. This table has exactly two rows, one for 'yes' and one for 'no'.

| Column      | Type      | Description                           |
|-------------|-----------|---------------------------------------|
| choice      | VARCHAR   | Primary key, either 'yes' or 'no'     |
| count       | INTEGER   | Number of users selecting this option |

### `question_responses`

Stores responses to multiple-choice and scale questions.

| Column             | Type      | Description                                       |
|--------------------|-----------|---------------------------------------------------|
| id                 | SERIAL    | Primary key                                       |
| questionnaire_type | VARCHAR   | Type of questionnaire (mother/corporate/other/both) |
| question_id        | INTEGER   | Question ID                                       |
| question_type      | VARCHAR   | Type of question (multiple-choice/scale-question) |
| response_value     | VARCHAR   | The user's response (option ID or scale value)    |
| count              | INTEGER   | Number of users selecting this response           |
| created_at         | TIMESTAMP | Record creation time                              |
| updated_at         | TIMESTAMP | Record last updated time                          |

### `text_responses`

Stores free-text responses.

| Column             | Type      | Description                                       |
|--------------------|-----------|---------------------------------------------------|
| id                 | SERIAL    | Primary key                                       |
| questionnaire_type | VARCHAR   | Type of questionnaire (mother/corporate/other/both) |
| question_id        | INTEGER   | Question ID                                       |
| response_text      | TEXT      | The user's text response                          |
| created_at         | TIMESTAMP | Record creation time                              |
| updated_at         | TIMESTAMP | Record last updated time                          |

## API Endpoints

### Update Intro Choice

```
POST /api/intro-choice
```

Updates the count for the introduction question (yes/no). This is saved in real-time as soon as a user makes a choice.

**Request Body:**
```json
{
  "choice": "yes" // or "no"
}
```

**Response:**
```json
{
  "message": "Updated count for choice 'yes' to 26"
}
```

### Store Question Response

```
POST /api/question-response
```

Stores a single response for a questionnaire question.

**Request Body:**
```json
{
  "questionnaire_type": "mother", // mother/corporate/other/both
  "question_id": 1,
  "question_type": "scale-question", // multiple-choice/scale-question/text-input
  "response_value": "3" // option ID, scale value, or text
}
```

**Response:**
```json
{
  "message": "Question response stored successfully"
}
```

### Store Batch Question Responses

```
POST /api/batch-question-responses
```

Stores multiple question responses in a single request. This is used when a user completes an entire questionnaire and submits all answers at once.

**Request Body:**
```json
{
  "responses": [
    {
      "questionnaire_type": "mother",
      "question_id": 1,
      "question_type": "multiple-choice",
      "response_value": "A"
    },
    {
      "questionnaire_type": "mother",
      "question_id": 2,
      "question_type": "text-input",
      "response_value": "Some text response"
    },
    // More responses...
  ]
}
```

**Response:**
```json
{
  "message": "Batch processed 42 out of 42 responses successfully"
}
```

### Get Intro Stats

```
GET /api/get-intro-stats
```

Retrieves the current counts for the introduction question (yes/no).

**Response:**
```json
{
  "data": [
    {
      "choice": "yes",
      "count": 25
    },
    {
      "choice": "no",
      "count": 15
    }
  ]
}
```

### Get Question Stats

```
GET /api/get-question-stats?questionnaire_type=mother&question_id=1
```

Retrieves statistics for a specific question.

**Query Parameters:**
- `questionnaire_type`: Type of questionnaire (mother/corporate/other/both)
- `question_id`: Question ID

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "questionnaire_type": "mother",
      "question_id": 1,
      "question_type": "multiple-choice",
      "response_value": "A",
      "count": 10,
      "created_at": "2023-04-08T12:00:00.000Z",
      "updated_at": "2023-04-08T12:00:00.000Z"
    },
    {
      "id": 2,
      "questionnaire_type": "mother",
      "question_id": 1,
      "question_type": "multiple-choice",
      "response_value": "B",
      "count": 15,
      "created_at": "2023-04-08T12:00:00.000Z",
      "updated_at": "2023-04-08T12:00:00.000Z"
    }
  ]
}
```

## Setup Instructions

1. Create a `.env` file in the backend directory with the following content:
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

2. Run the database migrations in the `migrations` folder against your Supabase project.

3. Install dependencies:
```bash
poetry install
```

4. Run the server:
```bash
poetry run python app.py
``` 