# ChordBase

A comprehensive web application for managing and viewing guitar chord sheets. ChordBase allows users to browse, search, upload, and share chord sheets with features like transposition, chord visualization, playlists, and more.

## Features

### Core Features
-  **Chord Sheet Management** - Browse, search, and view chord sheets with synchronized lyrics and chords
-  **Transposition** - Transpose songs to different keys on the fly
-  **Chord Visualization** - Interactive chord diagrams with hover previews
-  **Instrument Support** - Support for different instruments (Guitar, Ukulele, etc.)
-  **Song Upload** - Upload and share your own chord sheets
-  **Favorites & Playlists** - Create and manage custom playlists
-  **Comments & Ratings** - Community engagement through comments and ratings
-  **Advanced Search** - Search by song title, artist, genre, or lyrics
-  **Chord Generator** - Interactive chord diagram generator

### User Features
-  **User Profiles** - Personalized user accounts with preferences
-  **Authentication** - Secure login with JWT and Google OAuth support
-  **Password Reset** - Email-based password recovery
-  **User Dashboard** - Track your uploads, favorites, and playlists

### Admin Features
-  **Admin Dashboard** - Comprehensive admin panel
-  **Song Management** - Moderate and manage chord sheets
-  **User Management** - Manage user accounts and permissions

## Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Routing**: React Router v6
- **Styling**: TailwindCSS
- **UI Components**: Radix UI
- **State Management**: Context API
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js with Express
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: Passport.js (Local & Google OAuth)
- **Security**: bcrypt, JWT
- **Email**: Nodemailer

## Project Structure

```
ChordBase/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context providers
│   │   ├── layouts/       # Layout components
│   │   ├── services/      # API service layer
│   │   └── utils/         # Utility functions
│   └── public/            # Static assets
├── server/                # Express backend
    └── src/
        ├── config/        # Configuration files
        ├── controllers/   # Route controllers
        ├── models/        # Sequelize models
        ├── routes/        # API routes
        ├── services/      # Business logic
        ├── middlewares/   # Custom middlewares
        └── utils/         # Utility functions


```

## Installation

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=chordbase
DB_USER=your_db_user
DB_PASSWORD=your_db_password

JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_password

PORT=your-port
NODE_ENV=development
```

4. Start the development server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the client directory:
```env
VITE_API_URL=http://localhost:your-backend-port
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Usage

### For Users

1. **Register/Login** - Create an account or login with Google
2. **Browse Songs** - Explore the chord sheet library
3. **Search** - Find songs by title, artist, or genre
4. **View Chord Sheets** - Click on any song to view the chord sheet
5. **Transpose** - Use the transpose controls to change the key
6. **Create Playlists** - Organize your favorite songs
7. **Upload** - Share your own chord sheets with the community
8. **Comment & Rate** - Engage with other users

### For Admins

1. Navigate to `/admin/dashboard`
2. Manage songs, users, and site content
3. Monitor user activity and moderate content

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/password-reset` - Request password reset
- `GET /api/auth/google` - Google OAuth login

### Songs
- `GET /api/songs` - Get all songs (with pagination, filtering)
- `GET /api/songs/:id` - Get song by ID
- `POST /api/songs` - Create new song
- `PUT /api/songs/:id` - Update song
- `DELETE /api/songs/:id` - Delete song

### Playlists
- `GET /api/playlists` - Get user playlists
- `POST /api/playlists` - Create playlist
- `PUT /api/playlists/:id` - Update playlist
- `DELETE /api/playlists/:id` - Delete playlist
- `POST /api/playlists/:id/songs` - Add song to playlist

### Comments & Ratings
- `POST /api/comments` - Add comment
- `GET /api/comments/:songId` - Get song comments
- `POST /api/ratings` - Add/update rating

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## Development

### Building for Production

```bash
# Build frontend
cd client
npm run build

# Build output will be in client/dist
```

### Code Style
- ESLint configuration included for both frontend and backend
- Run linting: `npm run lint`

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Chord diagrams powered by [react-chords](https://github.com/tombatossals/react-chords) and [chords-db](https://github.com/tombatossals/chords-db) from [tombatossals](https://github.com/tombatossals)
- UI components from Radix UI
- Icons from Lucide React

## Support

For issues, questions, or contributions, please open an issue on GitHub.

---

**ChordBase** - Your ultimate chord sheet companion