# Lithuanian Economics Portal Backend

## Local Development

1. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the server:
   ```bash
   cd backend
   python main.py
   ```

## API Documentation

Interactive docs: [http://localhost:8000/docs](http://localhost:8000/docs)

### Authentication
- Register: `POST /users/register`
  ```json
  {
    "username": "testuser",
    "email": "testuser@example.com",
    "password_hash": "testpassword"
  }
  ```
- Login: `POST /users/login` (form data: `username`, `password`)
  - Returns: `{ "access_token": "...", "token_type": "bearer" }`

### Economic Reports
- List: `GET /reports?title=GDP&date=2024-04-01&sort_by=date&sort_order=desc&limit=5&offset=0`
- Get: `GET /reports/{id}`
- Create: `POST /reports`
  ```json
  {
    "title": "Lithuanian GDP 2024",
    "content": "GDP grew by 3% in Q1.",
    "date": "2024-04-01"
  }
  ```
- Update: `PUT /reports/{id}`
- Delete: `DELETE /reports/{id}`

### Datasets
- List: `GET /datasets?name=inflation&sort_by=created_at&sort_order=desc&limit=5&offset=0`
- Get: `GET /datasets/{id}`
- Create: `POST /datasets`
  ```json
  {
    "name": "Inflation Data",
    "description": "Monthly inflation rates for Lithuania.",
    "source_url": "https://example.com/inflation.csv"
  }
  ```
- Update: `PUT /datasets/{id}`
- Delete: `DELETE /datasets/{id}`

### Dashboards
- List: `GET /dashboards`
- Get: `GET /dashboards/{id}`
- Create: `POST /dashboards`
  ```json
  {
    "title": "Main Economic Dashboard",
    "description": "Key indicators for Lithuania."
  }
  ```
- Update: `PUT /dashboards/{id}`
- Delete: `DELETE /dashboards/{id}`

## Filtering, Sorting, Pagination
- All list endpoints support `limit` and `offset` for pagination.
- Reports: filter by `title`, `date`; sort by `date` or `title`.
- Datasets: filter by `name`; sort by `created_at` or `name`.

## Notes
- All endpoints return JSON.
- Use the access token from login as a Bearer token for protected endpoints (future).
- For more, see the interactive docs at `/docs`. 