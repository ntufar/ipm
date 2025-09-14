# Real Market Data Setup Guide

This guide explains how to integrate real market data into your Investment Portfolio Manager.

## 🔍 Current Status

**The application currently uses simulated data** for demonstration purposes. All price movements, news, and market data are generated randomly to show how the real-time features work.

## 🌐 Available Data Sources

### 1. **Alpha Vantage (Recommended for Free Tier)**
- **Cost**: Free tier available (5 calls per minute)
- **Features**: Real-time quotes, historical data, news sentiment
- **Setup**: 
  1. Get free API key at [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
  2. Update `src/config/marketDataConfig.ts`:
     ```typescript
     export const currentConfig: MarketDataConfig = alphaVantageConfig
     ```
  3. Add your API key to `src/services/realMarketDataService.ts`

### 2. **Yahoo Finance (Free)**
- **Cost**: Completely free
- **Features**: Real-time quotes, historical data
- **Setup**:
  1. Install yahoo-finance2: `npm install yahoo-finance2`
  2. Update `src/config/marketDataConfig.ts`:
     ```typescript
     export const currentConfig: MarketDataConfig = yahooFinanceConfig
     ```

### 3. **IEX Cloud (Professional)**
- **Cost**: Paid service (starts at $9/month)
- **Features**: Real-time quotes, news, financial data
- **Setup**:
  1. Get API key at [IEX Cloud](https://iexcloud.io/)
  2. Update `src/config/marketDataConfig.ts`:
     ```typescript
     export const currentConfig: MarketDataConfig = iexCloudConfig
     ```
  3. Add your API key to `src/services/iexCloudService.ts`

## 🚀 Quick Setup (Alpha Vantage)

1. **Get API Key**:
   - Go to [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
   - Sign up for free account
   - Copy your API key

2. **Update Configuration**:
   ```typescript
   // In src/config/marketDataConfig.ts
   export const currentConfig: MarketDataConfig = {
     dataSource: 'alpha-vantage',
     apiKey: 'YOUR_ACTUAL_API_KEY_HERE',
     updateInterval: 60000, // 1 minute
     enableNews: true,
     enableRealTime: true
   }
   ```

3. **Update Service**:
   ```typescript
   // In src/services/realMarketDataService.ts
   const ALPHA_VANTAGE_API_KEY = 'YOUR_ACTUAL_API_KEY_HERE'
   ```

4. **Restart Application**:
   ```bash
   npm run dev
   ```

## 📊 What You'll Get

With real market data, you'll see:

- **Live Stock Prices**: Actual current prices from the market
- **Real Price Changes**: Actual daily gains/losses
- **Market Hours**: Real market open/close times
- **Financial News**: Real news with sentiment analysis
- **Volume Data**: Actual trading volume
- **High/Low/Open**: Real market data

## ⚠️ Important Notes

### Rate Limits
- **Alpha Vantage**: 5 calls per minute (free tier)
- **Yahoo Finance**: No official limits, but be respectful
- **IEX Cloud**: Depends on your plan

### API Keys
- **Never commit API keys to version control**
- Use environment variables in production
- Consider using a `.env` file for local development

### Error Handling
- All services include error handling
- Fallback to simulated data if API fails
- Rate limit warnings in console

## 🔧 Advanced Configuration

### Environment Variables
Create a `.env` file:
```env
ALPHA_VANTAGE_API_KEY=your_key_here
IEX_CLOUD_API_KEY=your_key_here
```

### Custom Update Intervals
```typescript
export const customConfig: MarketDataConfig = {
  dataSource: 'alpha-vantage',
  apiKey: process.env.ALPHA_VANTAGE_API_KEY,
  updateInterval: 30000, // 30 seconds
  enableNews: true,
  enableRealTime: true
}
```

### Multiple Data Sources
You can use different sources for different features:
- Real-time quotes from Yahoo Finance
- News from Alpha Vantage
- Market status from IEX Cloud

## 🐛 Troubleshooting

### Common Issues

1. **"API key not set" error**:
   - Make sure you've added your API key to the service file
   - Check that the key is correct

2. **Rate limit exceeded**:
   - Increase the update interval
   - Consider upgrading to a paid plan

3. **No data returned**:
   - Check if the market is open
   - Verify the stock symbols are correct
   - Check the API service status

4. **CORS errors**:
   - Use a proxy server for development
   - Deploy to a server for production

### Debug Mode
Enable debug logging:
```typescript
// In any service file
console.log('Fetching quote for:', symbol)
console.log('API response:', data)
```

## 📈 Performance Tips

1. **Cache Data**: Services cache recent quotes to reduce API calls
2. **Batch Requests**: Fetch multiple quotes in one request when possible
3. **Smart Updates**: Only update when market is open
4. **Error Recovery**: Automatic retry with exponential backoff

## 🔒 Security

- Store API keys securely
- Use HTTPS in production
- Implement rate limiting
- Monitor API usage
- Rotate keys regularly

## 📞 Support

If you need help setting up real market data:

1. Check the API documentation
2. Look at the console for error messages
3. Test with a simple API call first
4. Consider starting with the free tier

---

**Remember**: The simulated data is perfect for development and demonstration. Real market data is only needed for production use or if you want to see actual market movements.
