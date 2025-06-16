# Euro Clinical Trials

A comprehensive Clinical Trial Management System designed for European regulatory compliance. This web application provides tools for managing clinical trials, patients, and research sites with built-in GDPR compliance and EudraCT integration.

## 🚀 Features

- **Trial Management**: Create, track, and manage clinical trials with full lifecycle support
- **Patient Management**: Secure patient data handling with GDPR compliance
- **Site Management**: Multi-site clinical trial coordination and oversight
- **Regulatory Compliance**: Built-in support for European regulations and EudraCT
- **Audit Trail**: Comprehensive audit logging for regulatory requirements
- **Dashboard Analytics**: Real-time insights and reporting on trial progress
- **Authentication**: Secure OAuth-based authentication with GitHub integration

## 🛠️ Tech Stack

- **Framework**: [Nuxt 3](https://nuxt.com/) with Vue.js
- **Authentication**: nuxt-auth-utils with OAuth support
- **State Management**: Pinia for reactive state management
- **Database**: Redis for session storage and caching
- **Validation**: Zod for type-safe data validation
- **UI Components**: Custom UI library [`damourlabs/ui`](https://github.com/damourlabs/ui) with Shadcn UI components
- **TypeScript**: Full TypeScript support for type safety

## 🚀 Getting Started

### Installation

1. Clone the repository:
```bash
git clone  
cd euro-clinical-trials
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy and configure environment variables
cp .env.example .env
```

Configure the following environment variables:
- `NUXT_SESSION_PASSWORD`: Session encryption password (32+ characters)
- `NUXT_OAUTH_GITHUB_CLIENT_ID`: GitHub OAuth client ID
- `NUXT_OAUTH_GITHUB_CLIENT_SECRET`: GitHub OAuth client secret
- `NUXT_OAUTH_GITHUB_REDIRECT_URL`: OAuth redirect URL

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Building for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview

# Generate static files (if needed)
npm run generate
```

## 📁 Project Structure

```
euro-clinical-trials/
├── components/          # Vue components
│   ├── patient/        # Patient-related components
│   ├── site/          # Site management components
│   └── trial/         # Trial management components
├── composables/        # Vue composables for reusable logic
├── models/            # Data models and schemas
├── pages/             # Application pages/routes
│   ├── dashboard/     # Dashboard pages
│   ├── patients/      # Patient management pages
│   ├── sites/         # Site management pages
│   └── trials/        # Trial management pages
├── repositories/      # Data access layer
├── server/            # Server-side API routes
├── stores/            # Pinia stores
└── types/             # TypeScript type definitions
```

## 🔐 Security & Compliance

This application is designed with European clinical trial regulations in mind:

- **GDPR Compliance**: Built-in data protection and privacy controls
- **Audit Logging**: Comprehensive audit trails for all user actions
- **Secure Authentication**: OAuth-based authentication with session management
- **Data Validation**: Strict validation using Zod schemas
- **Encrypted Sessions**: AES-256-CBC encryption for session data

## 📊 Key Models

- **Trials**: Clinical trial definitions with phases, protocols, and regulatory info
- **Patients**: Patient enrollment and data with privacy controls
- **Sites**: Research site management and coordination
- **Audits**: Comprehensive audit trail logging
- **Compliance**: Regulatory compliance tracking and reporting

## 🤝 Contributing

Any contributions is welcome, if you encounter any bugs or would like to see a feature implemented, open a issue.

Pull requests are also welcome, please follow these instructions to contribute in this manner.  

1. Fork the repository
2. Create a feature branch (`git switch -c feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request



## 📝 License

This project is part of the DamourLabs portfolio

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository.

---

Built with ❤️ by DamourLabs
