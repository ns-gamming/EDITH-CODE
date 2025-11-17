
# EDITH IDE - Deployment Guide

## Environment Variables Required

Before deploying to Vercel, make sure you have the following environment variables set:

### Supabase Configuration
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### AI API Keys (at least one required)
```
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key (optional)
ANTHROPIC_API_KEY=your_anthropic_api_key (optional)
```

### GitHub OAuth (for GitHub login)
```
VITE_GITHUB_OAUTH_CLIENT_ID=your_github_client_id
```

## Vercel Deployment Steps

1. **Connect your repository to Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository

2. **Configure Environment Variables**
   - In Vercel project settings, add all the environment variables listed above

3. **GitHub OAuth Callback URL**
   - Set the callback URL in your GitHub OAuth app to:
   ```
   https://your-app-name.vercel.app/auth
   ```

4. **Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `dist/public`
   - Install Command: `npm install`

5. **Deploy**
   - Click "Deploy" and wait for the build to complete

## Post-Deployment Checklist

- [ ] Verify all environment variables are set
- [ ] Test authentication flow
- [ ] Test AI agent functionality
- [ ] Test terminal commands
- [ ] Verify file upload works
- [ ] Check dashboard loads properly

## Troubleshooting

If the dashboard doesn't load:
1. Check browser console for errors
2. Verify Supabase credentials are correct
3. Ensure GitHub OAuth callback URL matches your Vercel domain
4. Clear browser cache and cookies

If AI agent doesn't work:
1. Verify at least one AI API key is set
2. Check API key permissions
3. Review server logs in Vercel dashboard
