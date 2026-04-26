# Deployment Memory - Vercel

This file records the Vercel project configuration to ensure persistent access for AI agents across different sessions.

## Project Details
- **Project Name**: `landing-linkedin`
- **Project ID**: `prj_nv4SslbWI6QvuO4CSw6IoprWzvGs`
- **Organization ID**: `team_esWXuj98c0QlLVml93Bbv0Bw` (nerickods-projects)
- **Deployment URL**: [https://landing-linkedin.vercel.app](https://landing-linkedin.vercel.app)

## Local Configuration
- **Token Location**: Stored as `VERCEL_TOKEN` in `.env.local` (Gitignored).
- **Vercel Config**: Local metadata stored in `.vercel/project.json`.

## Usage
To run Vercel commands in this environment, always use the `--token` flag if the CLI doesn't pick it up automatically:
```bash
npx vercel --token $VERCEL_TOKEN <command>
```
Most Vercel operations (like `deploy`) will automatically use the linked project settings in `.vercel/project.json`.
