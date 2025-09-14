# 📈 Investment Portfolio Manager (IPM)

A modern, feature-rich web application for tracking and managing your investment portfolio. Built with React, TypeScript, and Vite for optimal performance and developer experience.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-https://ipm-tufar.vercel.app/-green?style=for-the-badge)](https://ipm-tufar.vercel.app/)
![Portfolio Manager](https://img.shields.io/badge/React-18.2.0-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.1.5-646CFF?logo=vite)
![License](https://img.shields.io/badge/License-MIT-green)

## 🌐 Live Application

**🚀 [Try the live application here](https://ipm-tufar.vercel.app/)**

The application is deployed on Vercel with automatic deployments from GitHub. All features are fully functional in production.

## ✨ Features

### 🏠 **Portfolio Overview**
- Real-time portfolio valuation and performance metrics
- Total value, cost basis, and gain/loss calculations
- Performance percentage tracking
- Last updated timestamps
- Dynamic browser tab titles

### 📊 **Advanced Analytics**
- Comprehensive portfolio insights and key metrics
- Sector allocation with interactive pie charts
- Top and worst performing holdings
- Performance trends and analysis

### 💼 **Holdings Management**
- Detailed holdings list with individual stock information
- Current prices, 24h changes, and performance metrics
- Real-time price updates from Yahoo Finance API
- Gain/loss calculations for each position
- **Edit holdings** with modal interface
- **Delete holdings** with transaction cleanup
- Virtual scrolling for large portfolios

### 📈 **Performance Charts**
- Interactive performance charts using Recharts
- Historical portfolio value tracking
- Visual representation of portfolio growth
- Responsive chart design

### 💰 **Transaction Management**
- Add buy/sell transactions with detailed forms
- Transaction history with comprehensive records
- **Real-time stock search** with live API integration
- Smart search functionality for stock selection
- Transaction fees and notes tracking
- **Automatic holdings conversion** from transactions
- **Transaction cleanup** when holdings are deleted

### 🌙 **Dark Mode Support**
- Complete dark/light theme system
- Persistent theme preferences
- Theme-aware components and styling
- Smooth transitions between themes

### 🔄 **Real-time Data**
- Live stock price updates from Yahoo Finance API
- Manual refresh functionality with loading states
- **CORS proxy service** with multiple fallback options
- **Rate limiting** and error handling
- Fallback to mock data when APIs are unavailable
- **Real-time market data** with market status indicators

### 💾 **Data Persistence**
- Local storage integration
- Portfolio data persistence across sessions
- Automatic save/load functionality
- Data backup and restoration

### 📋 **Watchlist & Notifications**
- **Stock watchlist** with real-time price monitoring
- **Price alerts** and portfolio milestone notifications
- **Target price tracking** for watchlist items
- **Notes and tags** for watchlist items
- **Smart notifications** for portfolio changes

### 📊 **Advanced Analytics Dashboard**
- **Risk metrics** including volatility and beta calculations
- **Performance attribution** analysis
- **Correlation analysis** between holdings
- **Sector analysis** with detailed breakdowns
- **Portfolio comparison** against market indices
- **Advanced charting** with candlestick charts

### 🎨 **User Experience**
- **Loading skeletons** for better perceived performance
- **Error boundaries** with user-friendly error messages
- **Keyboard shortcuts** for power users
- **Mobile-optimized** responsive design
- **Performance optimization** with virtual scrolling

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ipm
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

### Deploy to Production

The application is automatically deployed to Vercel when changes are pushed to the main branch.

**Manual deployment:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to production
vercel --prod
```

**Live Application:** [https://ipm-tufar.vercel.app/](https://ipm-tufar.vercel.app/)

## 🛠️ Technology Stack

- **Frontend Framework**: React 18.2.0 with TypeScript
- **Build Tool**: Vite 7.1.5
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Styling**: Inline styles with theme system
- **State Management**: React Context API
- **Data Persistence**: Local Storage
- **APIs**: Yahoo Finance, Alpha Vantage, RapidAPI
- **Deployment**: Vercel with automatic GitHub integration
- **CORS Handling**: Custom proxy service with fallbacks

## 📱 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎯 Key Components

### Core Components
- **PortfolioOverview**: Main dashboard with key metrics
- **HoldingsList**: Detailed holdings management
- **PerformanceChart**: Interactive performance visualization
- **AddTransaction**: Transaction form with smart stock selection
- **TransactionHistory**: Complete transaction records
- **PortfolioAnalytics**: Advanced analytics and insights

### Utility Components
- **ThemeToggle**: Dark/light mode switcher
- **ThemeProvider**: Theme context management

## 🔧 Configuration

### API Configuration
The application supports multiple stock price APIs:
- **Primary**: RapidAPI (Yahoo Finance)
- **Fallback**: Alpha Vantage
- **Mock Data**: Comprehensive mock data for development

### Theme Configuration
The theme system supports:
- Light and dark modes
- Custom color schemes
- Persistent user preferences
- Smooth transitions

## 📊 Stock Data & Search

The application provides **real-time stock search** and data for thousands of stocks worldwide:

- **Real-time Search**: Live stock search with symbol and company name filtering
- **Global Coverage**: Access to stocks from major exchanges (NYSE, NASDAQ, etc.)
- **Live Data**: Real-time prices, changes, and market data from Yahoo Finance
- **Smart Filtering**: Instant search results with debouncing and caching
- **Fallback Support**: Mock data when APIs are unavailable

### Sample Popular Stocks:
- **Technology**: AAPL, GOOGL, MSFT, NVDA, META, AMZN, NFLX, ORCL, CRM, ADBE
- **Financial**: JPM, BAC, WFC, GS, C, AXP, BLK, SCHW
- **Healthcare**: JNJ, PFE, UNH, ABBV, GILD, AMGN, BIIB, MDT
- **Consumer**: WMT, KO, PEP, PG, HD, MCD, NKE, SBUX
- **Energy**: XOM, CVX, COP, EOG, SLB
- **Industrial**: BA, CAT, GE, HON, UPS

## 🎨 Features in Detail

### Smart Stock Selection
- **Search Functionality**: Type to filter stocks by symbol or name
- **Price Display**: Current prices shown in dropdown
- **Sector Organization**: Stocks grouped by industry
- **Real-time Filtering**: Instant search results

### Portfolio Analytics
- **Key Metrics**: Total value, cost basis, gain/loss, performance
- **Sector Allocation**: Visual breakdown of portfolio composition
- **Top Performers**: Best and worst performing holdings
- **Performance Trends**: Historical performance analysis

### Transaction Management
- **Comprehensive Forms**: Buy/sell transactions with all details
- **Transaction History**: Complete record of all transactions
- **Fee Tracking**: Support for transaction fees and notes
- **Date Management**: Flexible transaction dating

## 🔮 Future Enhancements

- [x] ~~Portfolio comparison against market indices~~ ✅ **Implemented**
- [x] ~~Price alerts and portfolio milestone notifications~~ ✅ **Implemented**
- [x] ~~Advanced chart types and interactive visualizations~~ ✅ **Implemented**
- [x] ~~Mobile optimization and responsive design~~ ✅ **Implemented**
- [x] ~~Real-time stock search and data~~ ✅ **Implemented**
- [x] ~~Advanced analytics dashboard~~ ✅ **Implemented**
- [x] ~~Holdings editing and deletion~~ ✅ **Implemented**
- [ ] CSV/JSON export and import functionality
- [ ] Portfolio rebalancing suggestions
- [ ] Tax reporting and capital gains tracking
- [ ] PWA features and offline mode
- [ ] AI/ML predictive analytics
- [ ] Social sharing and collaboration features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Recharts](https://recharts.org/) for beautiful charts
- [Lucide React](https://lucide.dev/) for icons
- [Vite](https://vitejs.dev/) for the amazing build tool
- [React](https://reactjs.org/) for the excellent framework

---

**Built with ❤️ using React, TypeScript, and Vite**
