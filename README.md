# Personal Finance Visualizer

A comprehensive web application for tracking personal finances with advanced visualization and budgeting features.

## Features

### Stage 1: Basic Transaction Tracking
- ✅ Add/Edit/Delete transactions (amount, date, description)
- ✅ Transaction list view with search and filtering
- ✅ Monthly expenses bar chart
- ✅ Form validation and error handling

### Stage 2: Categories
- ✅ Predefined categories for transactions
- ✅ Category-wise pie chart
- ✅ Dashboard with summary cards
- ✅ Total expenses, category breakdown, most recent transactions

### Stage 3: Budgeting
- ✅ Set monthly category budgets
- ✅ Budget vs actual comparison chart
- ✅ Spending insights and alerts
- ✅ Progress tracking for each category

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **Charts**: Recharts
- **Database**: MongoDB
- **Deployment**: Render (or Vercel)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or cloud)
- Git

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/personal-finance-visualizer.git
   cd personal-finance-visualizer
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   Create a \`.env.local\` file in the root directory:
   \`\`\`env
   MONGODB_URI=mongodb://localhost:27017/personal-finance
   # OR for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/personal-finance
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### MongoDB Setup

#### Option 1: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: \`mongodb://localhost:27017/personal-finance\`

#### Option 2: MongoDB Atlas (Recommended)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Replace the MONGODB_URI in your \`.env.local\` file

## Deployment on Render

### Step 1: Prepare for Deployment

1. **Create a production build**
   \`\`\`bash
   npm run build
   \`\`\`

2. **Test the production build locally**
   \`\`\`bash
   npm start
   \`\`\`

### Step 2: Deploy to Render

1. **Push your code to GitHub**
   \`\`\`bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   \`\`\`

2. **Create a Render account**
   - Go to [render.com](https://render.com)
   - Sign up with your GitHub account

3. **Create a new Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure the service:
     - **Name**: personal-finance-visualizer
     - **Environment**: Node
     - **Build Command**: \`npm install && npm run build\`
     - **Start Command**: \`npm start\`

4. **Add Environment Variables**
   In the Render dashboard, add:
   - **MONGODB_URI**: Your MongoDB connection string
   - **NODE_ENV**: production

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Your app will be available at: \`https://your-app-name.onrender.com\`

## Project Structure

\`\`\`
personal-finance-visualizer/
├── app/
│   ├── api/
│   │   ├── transactions/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   └── budgets/
│   │       └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   ├── dashboard.tsx
│   ├── transaction-form.tsx
│   ├── transaction-list.tsx
│   ├── monthly-expenses-chart.tsx
│   ├── category-pie-chart.tsx
│   ├── budget-form.tsx
│   └── budget-comparison.tsx
├── lib/
│   ├── mongodb.ts
│   └── constants.ts
├── types/
│   └── index.ts
├── package.json
├── tailwind.config.js
├── next.config.js
└── README.md
\`\`\`

## Usage

### Adding Transactions
1. Click "Add Transaction" button
2. Fill in amount, date, description, and category
3. Click "Add Transaction" to save

### Setting Budgets
1. Click "Set Budget" button
2. Select category and set monthly budget amount
3. View budget vs actual spending in the dashboard

### Viewing Analytics
- **Monthly Expenses**: Bar chart showing spending trends
- **Category Breakdown**: Pie chart of expenses by category
- **Budget Comparison**: Track spending against budgets
- **Summary Cards**: Quick overview of key metrics

## Features Overview

### Dashboard
- Summary cards showing total expenses, top category, and recent transactions
- Monthly expenses bar chart
- Category-wise pie chart
- Budget vs actual comparison

### Transaction Management
- Add, edit, and delete transactions
- Search and filter transactions
- Sort by date, amount, or category
- Form validation with error messages

### Budget Tracking
- Set monthly budgets by category
- Visual progress indicators
- Spending insights and alerts
- Over/under budget notifications

### Responsive Design
- Mobile-friendly interface
- Adaptive layouts for different screen sizes
- Touch-friendly interactions

## Contributing

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
# Assignment-19
