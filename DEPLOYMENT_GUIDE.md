# Deployment Guide: Frontend to Vercel

## Prerequisites
- Node.js and npm installed
- A Vercel account (free at vercel.com)
- GitHub account with your repository

## Local Testing

Before deploying, test the connection to your backend:

```bash
cd frontend
npm install
REACT_APP_API_URL=http://localhost:5000 npm start
```


For production build:
```bash
REACT_APP_API_URL=https://kdhs-erp-system.onrender.com npm run build
```

## Deployment Steps

### Step 1: Prepare Your Repository
Push your code to GitHub with the following structure:
```
kdhs/
├── backend/
├── frontend/
│   ├── .env.production
│   ├── .env.local (NOT in Git)
│   └── ... other files
└── README.md
```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend directory
cd frontend

# Deploy
vercel
```

You'll be prompted to:
- Link to your GitHub project
- Confirm the project name
- Set environment variables

#### Option B: GitHub Integration
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select the `frontend` directory as the root
5. Add environment variables in Vercel dashboard

### Step 3: Configure Environment Variables

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add the following variable:
   - **Key**: `REACT_APP_API_URL`
   - **Value**: `https://kdhs-erp-system.onrender.com`
   - **Environments**: Select "Production", "Preview", and "Development"
3. Click "Save"

### Step 4: Configure Build Settings

In Vercel dashboard, go to **Settings** → **Build & Development**:
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Root Directory**: `./` (or select frontend folder)

## CORS Configuration (If Needed)

If you encounter CORS errors, update your backend (`server.js`):

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-vercel-domain.vercel.app'
  ],
  credentials: true
}));
```

Replace `your-vercel-domain` with your actual Vercel domain.

## Troubleshooting

### API calls returning 404
- Verify `REACT_APP_API_URL` is set correctly in Vercel
- Check that your backend is running and accessible
- Review browser console for CORS errors

### Build fails
- Check that `npm run build` works locally
- Ensure all dependencies are in `package.json`
- Check Node.js version compatibility

### Environment variables not working
- Restart deployment after adding variables
- Clear build cache in Vercel settings
- Ensure variable names match exactly (case-sensitive)

## Monitoring Deployment

Once deployed:
1. Vercel automatically monitors your site
2. View logs: **Vercel Dashboard** → **Functions** or **Deployments**
3. Check build logs for errors

## Update Process

For future updates:
```bash
git commit -am "Update frontend"
git push origin main
```

Vercel will automatically detect changes and redeploy.

## Useful Links
- [Vercel Documentation](https://vercel.com/docs)
- [React Environment Variables](https://create-react-app.dev/docs/adding-custom-environment-variables/)
- [Vercel Deployment Troubleshooting](https://vercel.com/support/articles)
