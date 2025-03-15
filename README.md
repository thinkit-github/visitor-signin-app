# Visitor Sign-In App

A touch-screen friendly application for tracking visitors and contractors with sign-in/sign-out functionality.

![Visitor Sign-In App](https://via.placeholder.com/800x400?text=Visitor+Sign-In+App)

## Features

- **Visitor and Contractor Sign-In/Sign-Out**: Track different types of visitors
- **Digital Signature Capture**: Collect signatures during sign-in
- **Welcome and Goodbye Messages**: Personalized messages for visitors
- **Admin Dashboard**: View and manage visitor logs
- **Responsive Design**: Touch-friendly UI that works on tablets and desktops
- **Search and Filter**: Find visitor records easily
- **SQLite Database**: Simple local setup with no external dependencies

## Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Styling**: TailwindCSS
- **Database**: SQLite with Prisma ORM
- **Form Handling**: React Hook Form
- **Date Formatting**: date-fns

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/visitor-signin-app.git
   cd visitor-signin-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up the database:
   ```bash
   npx prisma migrate dev --name init
   # or
   yarn prisma migrate dev --name init
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

### Visitor Sign-In

1. From the home page, click on "Sign In"
2. Fill out the required information (name, phone, purpose, etc.)
3. Sign using the signature pad at the bottom
4. Submit the form to complete sign-in

### Visitor Sign-Out

1. From the home page, click on "Sign Out"
2. Enter your name and phone number
3. Submit the form to complete sign-out

### Admin Dashboard

1. From the home page, click on "Admin Panel" link at the bottom
2. View all visitor records
3. Filter by active/completed visits, search by name/company, or filter by date
4. Manually sign out visitors who forgot to sign out

## Database Schema

The application uses two main models:

- **Visitor**: Stores information about individuals who visit
  - Name, company, email, phone, type (Contractor/Visitor), etc.

- **Visit**: Records each visit instance with sign-in and sign-out times
  - Sign-in time, sign-out time, host name, notes, etc.

## Deployment

This application can be deployed to any hosting platform that supports Next.js applications:

1. Build the application:
   ```bash
   npm run build
   # or
   yarn build
   ```

2. Start the production server:
   ```bash
   npm start
   # or
   yarn start
   ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Next.js team for the amazing framework
- TailwindCSS for the utility-first CSS framework
- Prisma team for the excellent ORM 