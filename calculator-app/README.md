# Calculator App

A modern, full-featured calculator built with Next.js, TypeScript, and SQLite.

## Features

- **Full Calculator**: Basic arithmetic, decimals, percentages, and sign toggle
- **Calculation History**: All calculations saved to SQLite database
- **Search History**: Find past calculations quickly
- **Share Calculations**: Copy result snippets or generate shareable links
- **Keyboard Support**: Full keyboard input support
- **Responsive Design**: Works on desktop and mobile

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite via TypeORM and better-sqlite3

## Getting Started

### Local Development

```bash
# Install dependencies
npm i

# Create data directory
mkdir -p data

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Docker

```bash
# Build and run with Docker Compose
docker-compose up --build
```

### Environment Variables

```env
DATABASE_PATH=./data/calculator.db
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/calculations` | Get calculation history |
| POST | `/api/calculations` | Save a calculation |
| DELETE | `/api/calculations/:id` | Delete a calculation |
| POST | `/api/share` | Generate a share link |
| GET | `/api/share?shareId=X` | Get shared calculation |

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `0-9` | Numbers |
| `.` | Decimal |
| `+`, `-`, `*`, `/` | Operators |
| `Enter` or `=` | Calculate |
| `Backspace` | Delete last digit |
| `Escape` | Clear |
| `%` | Percentage |
