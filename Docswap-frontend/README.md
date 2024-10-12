# Docswap-frontend

## Table of contents
- [Getting Started](#getting-started)
  - [System Requirements](#system-requirements)
  - [Configuration](#configuration)
  - [Installation](#installation)
  - [Development Server](#development-server)
- [Environment Variables](#environment-variables)
- [Isomorphic and Next.js Resources](#isomorphic-and-nextjs-resources)
- [Deploy on Vercel](#deploy-on-vercel)

## Getting Started
This project is built from Next.js's "isomorphic" template code, so information about project structure can be found in the documentation linked in the [Isomorphic and Next.js Resources](#isomorphic-and-nextjs-resources) section.

### System Requirements
1. [Node.js 18.17^](https://nodejs.org/en) or later.
2. [pnpm - package manager](https://pnpm.io/installation#using-npm) (recommended)

### Installation
First, install dependencies:

```bash
npm i
# or
pnpm install
# or
yarn install
```

### Configuration
Then, set the following environment variables in a .env.local file in the project's root directory:
(This has been started for you in example.env.local, you just have to rename it to .env.local and fill in the missing values)

```bash
AZURE_AD_B2C_CLIENT_ID=""
AZURE_AD_B2C_CLIENT_SECRET=""
AZURE_AD_B2C_PRIMARY_USER_FLOW=""
AZURE_AD_B2C_TENANT_NAME=""
NEXTAUTH_SECRET=""
NEXTAUTH_URL="http://localhost:3000/" 
NEXT_PUBLIC_DOCSWAP_API_BASE_URL="<api-url>"
USER_ENDPOINT="/user/"
```

The values for each variable can be found in both our private documentation and in the "Environment Variables" section of the deployed Azure Web App.

For further details about each variable, see [Environment Variables](#environment-variables).

### Development Server
Now, you can run the development server:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The pages will auto-update as you edit them to learn more about the original template code please visit **[Official Documentation](https://isomorphic-doc.vercel.app/)**.


## Environment Variables
### `AZURE_AD_B2C_CLIENT_ID`
The client ID for the Azure B2C application. This is required for authentication with Azure B2C.
This `client_id` can be found in App Registration section of B2C by clicking on the client application and looking for "Application (client) ID" in the Overview.
```
AZURE_AD_B2C_CLIENT_ID="{client_id}"
```
<br>

### `AZURE_AD_B2C_CLIENT_SECRET`
The client secret for the Azure B2C application. This is used along with the client ID for secure communication with Azure B2C. This is created in a Registered app in B2C and the `client_secret` value can only be viewed upon creation. If it is ever lost you can create a new one in the App registration page.

```
AZURE_AD_B2C_CLIENT_SECRET="{client_secret}"
```
<br>

### `AZURE_AD_B2C_PRIMARY_USER_FLOW`
The name of the primary user flow for Azure B2C. This defines the user flow for authentication and authorization. The `user_flow` value will be the exact name of the user flow for login/registration defined under User Flows in B2C.

```
AZURE_AD_B2C_PRIMARY_USER_FLOW="{user_flow}"
```
<br>

### `AZURE_AD_B2C_TENANT_NAME`
The tenant name for Azure B2C. This identifies the tenant in Azure B2C for authentication purposes. 

```
AZURE_AD_B2C_TENANT_NAME="{tenant_name}"
```
<br>

### `NEXTAUTH_SECRET`
The secret used by NextAuth for encrypting session data and was made using this: https://generate-secret.vercel.app/32.

```
NEXTAUTH_SECRET="{secret}"
```
<br>

### `NEXTAUTH_URL`
The URL of the NextAuth instance, in our case it's the base URL of the application. This is used by NextAuth to build the callback URLs. For local development it should be set to:

```
NEXTAUTH_URL="http://localhost:3000/"
```
<br>

### `NEXT_PUBLIC_DOCSWAP_API_BASE_URL`
Defines the base URL for the backend API. This is used to make API requests from the frontend. For local development
this should be set to localhost:8080 as shown, but it can also be set to the actual domain of the backend server.

```
NEXT_PUBLIC_DOCSWAP_API_BASE_URL="http://localhost:8080/api/v1"
```
<br>

### `USER_ENDPOINT`
The endpoint for user-related API calls. This defines the path for accessing user-related data and actions.

```
USER_ENDPOINT="/user/"
```
<br>

## Isomorphic and Next.js Resources

To learn more about Isomorphic & Next.js, take a look at the following resources:

- [Isomorphic Documentation](https://isomorphic-doc.vercel.app/) - learn about Isomorphic.
- [RizzUI](https://www.rizzui.com/) - a react ui library by [REDQ](https://redq.io/).
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploying on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

https://www.youtube.com/watch?v=MAtaT8BZEAo