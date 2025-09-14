# 📈 Investment Portfolio Manager (IPM)

A modern, feature-rich web application for tracking and managing your investment portfolio. Built with React, TypeScript, and Vite for optimal performance and developer experience.

![Portfolio Manager](https://img.shields.io/badge/React-18.2.0-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.1.5-646CFF?logo=vite)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🏠 **Portfolio Overview**
- Real-time portfolio valuation and performance metrics
- Total value, cost basis, and gain/loss calculations
- Performance percentage tracking
- Last updated timestamps

### 📊 **Advanced Analytics**
- Comprehensive portfolio insights and key metrics
- Sector allocation with interactive pie charts
- Top and worst performing holdings
- Performance trends and analysis

### 💼 **Holdings Management**
- Detailed holdings list with individual stock information
- Current prices, 24h changes, and performance metrics
- Real-time price updates from financial APIs
- Gain/loss calculations for each position

### 📈 **Performance Charts**
- Interactive performance charts using Recharts
- Historical portfolio value tracking
- Visual representation of portfolio growth
- Responsive chart design

### 💰 **Transaction Management**
- Add buy/sell transactions with detailed forms
- Transaction history with comprehensive records
- Support for 50+ popular stocks across all sectors
- Smart search functionality for stock selection
- Transaction fees and notes tracking

### 🌙 **Dark Mode Support**
- Complete dark/light theme system
- Persistent theme preferences
- Theme-aware components and styling
- Smooth transitions between themes

### 🔄 **Real-time Data**
- Live stock price updates from multiple APIs
- Automatic price refresh every 5 minutes
- Manual refresh functionality
- Fallback to mock data when APIs are unavailable

### 💾 **Data Persistence**
- Local storage integration
- Portfolio data persistence across sessions
- Automatic save/load functionality
- Data backup and restoration

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

## 🛠️ Technology Stack

- **Frontend Framework**: React 18.2.0 with TypeScript
- **Build Tool**: Vite 7.1.5
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Styling**: Inline styles with theme system
- **State Management**: React Context API
- **Data Persistence**: Local Storage

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

## 📊 Supported Stocks

The application includes 50+ popular stocks across major sectors:

- **Technology**: Apple, Google, Microsoft, NVIDIA, Meta, Amazon, Netflix, Oracle, Salesforce, Adobe
- **Financial**: JPMorgan, Bank of America, Wells Fargo, Goldman Sachs
- **Healthcare**: Johnson & Johnson, Pfizer, UnitedHealth, AbbVie, Gilead, Amgen, Biogen
- **Consumer**: Walmart, Coca-Cola, Pepsi, P&G, Home Depot, McDonald's, Nike, Starbucks
- **Energy**: Exxon, Chevron, ConocoPhillips
- **Industrial**: Boeing, Caterpillar, General Electric
- **And many more...**

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

- [ ] Portfolio comparison against market indices
- [ ] CSV/JSON export and import functionality
- [ ] Mobile optimization and responsive design
- [ ] Price alerts and portfolio milestone notifications
- [ ] Advanced chart types and interactive visualizations
- [ ] Portfolio rebalancing suggestions
- [ ] Tax reporting and capital gains tracking

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
