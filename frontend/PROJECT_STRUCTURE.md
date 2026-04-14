## 📁 Project Structure
 
```
snaptwix/
├── public/                  # Static assets
├── src/
│   ├── _auth/               # Auth layout and pages
│   │   └── forms/
│   │       ├── SignIn.tsx
│   │       └── SignUp.tsx
│   ├── _root/               # Main app layout and pages
│   │   └── pages/
│   │       ├── Home.tsx
│   │       ├── Explore.tsx
│   │       ├── Profile.tsx
│   │       ├── PostDetail.tsx
│   │       ├── CreatePost.tsx
│   │       └── EditPost.tsx
│   ├── components/
│   │   ├── shared/          # Reusable components (Navbar, PostCard, etc.)
│   │   └── ui/              # Base UI components (buttons, inputs, etc.)
│   ├── context/             # React context (AuthContext)
│   ├── hooks/               # Custom hooks
│   ├── lib/
│   │   ├── appwrite/
│   │   │   ├── api.ts       # All Appwrite API functions
│   │   │   └── config.ts    # Appwrite client configuration
│   │   ├── react-query/
│   │   │   ├── queries.ts   # All useQuery & useMutation hooks
│   │   │   └── queryKeys.ts # Centralized query key constants
│   │   └── utils.ts         # Helper functions
│   ├── types/               # TypeScript type definitions
│   ├── App.tsx
│   └── main.tsx
├── .env                     # Environment variables (never commit this)
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```