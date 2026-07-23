# Deploying NETRA AI to Zoho Catalyst (AppSail)

This document provides a step-by-step guide for deploying the monolithic FastAPI backend to Zoho Catalyst using the Container-as-a-Service (AppSail) architecture.

## 1. Prerequisites
1. A **Zoho Catalyst** Account.
2. The **Catalyst CLI** installed (`npm install -g zcatalyst-cli`).
3. An active **Google Gemini API Key**.
4. An active **Neo4j** AuraDB cluster (for graph intelligence).

## 2. Infrastructure Setup (Catalyst Web Console)
Before pushing the code, configure the internal Catalyst datastores:
1. Navigate to **Storage > Data Store** and verify it is initialized.
2. Navigate to **Storage > File Store** and create a folder named `Evidence`. Note the Folder ID.
3. Navigate to **Settings > Environments**. Add the variables listed in `.env.production.example` to the `Production` environment.

## 3. Deployment Configuration
The repository is already configured with:
- `catalyst.json`: Root definition.
- `apps/backend/app-config.json`: Tells AppSail to run `uvicorn` on the dynamic `$X_ZOHO_CATALYST_LISTEN_PORT`.
- `apps/backend/Dockerfile`: A slim Python 3.11 container optimized for fast boot times.

## 4. Manual Deployment
To deploy manually from your terminal:
```bash
# 1. Login to Catalyst
catalyst login

# 2. Select the Catalyst Project
catalyst project:use

# 3. Deploy the AppSail service
catalyst deploy
```

## 5. Automated Deployment (CI/CD)
The `.github/workflows/catalyst-deploy.yml` file is configured to auto-deploy on every push to the `main` branch. 
To enable this:
1. Generate a Deploy Token: `catalyst token:generate`
2. Add the token to your GitHub Repository Secrets as `CATALYST_DEPLOY_TOKEN`.
3. Add your Catalyst Project ID as `CATALYST_PROJECT_ID`.

## 6. Verifying the Deployment
Once Catalyst returns the live AppSail URL:
1. Navigate to `https://<your-catalyst-url>/api/v1/health/ready`.
2. Ensure it returns `{"data": {"postgres": true, "neo4j": true, "redis": true}}`.
