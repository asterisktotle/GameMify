# SimpleBlog

A modern blog application built with React, TypeScript, Redux Toolkit, and Supabase. This project demonstrates a full-stack blog implementation with features like authentication, blog post management, and responsive design.

## 🚀 Features

- User authentication and authorization
- Create, read, update, and delete blog posts
- Responsive design using Tailwind CSS
- State management with Redux Toolkit
- Real-time database with Supabase
- TypeScript for type safety
- Modern UI with React Icons
- Pagination support

## 🛠️ Tech Stack

- **Frontend Framework:** React 19
- **Language:** TypeScript
- **State Management:** Redux Toolkit
- **Database & Authentication:** Supabase
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **Build Tool:** Vite
- **Icons:** React Icons
- **Pagination:** React Paginate

## 📦 Installation

1. Clone the repository:

```bash
git clone https://github.com/asterisktotle/GameMify/tree/main
cd SimpleBlog
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:

```bash
npm run dev
```

## 🏗️ Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview the production build locally

## 🏗️ Project Structure

```
SimpleBlog/
├── src/
│   ├── components/     # Reusable UI components
│   ├── features/       # Redux slices and features
│   ├── pages/         # Page components
│   ├── services/      # API and service functions
│   ├── store/         # Redux store configuration
│   ├── types/         # TypeScript type definitions
│   └── utils/         # Utility functions
├── public/            # Static assets
└── tests/            # Test files
```

## 🔒 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```
