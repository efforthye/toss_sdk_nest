# toss_sdk_nest

NestJS backend server for Toss Payments integration

## 🚀 Getting Started

This is a NestJS backend service that integrates with Toss Payments API to handle payment processing for the Flutter client.

### Prerequisites
- Node.js (18.0 or higher)
- npm or yarn
- Toss Payments API credentials

### Installation

1. Clone the repository
```bash
git clone https://github.com/efforthye/toss_sdk_nest.git
cd toss_sdk_nest
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Configure the required values in .env file
```

4. Run the server
```bash
# Development
npm run start:dev

# Production
npm run start:prod
```

## 📁 Project Structure

```
src/
├── main.ts                 # Application entry point
├── app.module.ts          # Root module
├── payment/
│   ├── payment.module.ts   # Payment module
│   ├── payment.controller.ts # Payment API endpoints
│   ├── payment.service.ts  # Payment business logic
│   └── dto/               # Data transfer objects
├── common/
│   ├── filters/           # Exception filters
│   ├── interceptors/      # Interceptors
│   └── pipes/             # Validation pipes
└── config/
    └── configuration.ts   # App configuration
```

## 🛠 Tech Stack

- **Framework**: NestJS
- **HTTP Client**: Axios
- **Validation**: class-validator
- **Documentation**: Swagger
- **Environment**: dotenv

## 🔧 API Endpoints

### Payment
- `POST /api/payment/create` - Create payment
- `POST /api/payment/confirm` - Confirm payment
- `GET /api/payment/success` - Payment success callback
- `GET /api/payment/fail` - Payment failure callback

## 📝 Environment Variables

```
TOSS_CLIENT_KEY=your_toss_client_key
TOSS_SECRET_KEY=your_toss_secret_key
TOSS_API_BASE_URL=https://api.tosspayments.com
PORT=3001
FRONTEND_URL=http://localhost:3000
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📄 License

MIT License