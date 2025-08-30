# Bollinger Bands Trading Chart

A professional Bollinger Bands indicator built with KLineCharts, delivering TradingView-quality candlestick charts with full customization.

![Bollinger Bands Chart](https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop)

## 🚀 Setup

```sh
npm install
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) to see the chart in action.

## 📊 Features

### Core Functionality
- **Bollinger Bands Calculation**: Standard deviation-based bands with configurable parameters
- **Professional Charting**: KLineCharts integration with TradingView-inspired styling
- **Real-time Updates**: Instant indicator recalculation on parameter changes
- **Crosshair Tooltips**: Hover to see Basis, Upper, and Lower band values

### Configurable Inputs
- **Length**: Period for moving average calculation (default: 20)
- **Source**: Price source - Close, Open, High, or Low (default: Close)
- **StdDev Multiplier**: Standard deviation multiplier (default: 2.0)
- **Offset**: Shift bands by N bars forward/backward (default: 0)
- **MA Type**: Moving average type - SMA supported (extensible)

### Style Customization
- **Individual Band Control**: Toggle, color, width, and line style for each band
- **Background Fill**: Semi-transparent fill between upper and lower bands
- **Professional Color Scheme**: Default colors optimized for dark trading theme

## 🧮 Mathematical Implementation

### Formulas Used

1. **Basis (Middle Band)**:
   ```
   Basis = SMA(source, length)
   ```

2. **Standard Deviation** (Population Formula):
   ```
   σ = √(Σ(x - μ)² / N)
   ```
   Where μ is the mean (basis) and N is the period length.

3. **Upper Band**:
   ```
   Upper = Basis + (σ × multiplier)
   ```

4. **Lower Band**:
   ```
   Lower = Basis - (σ × multiplier)
   ```

5. **Offset Application**:
   - Positive offset: Shifts bands forward (delayed signal)
   - Negative offset: Shifts bands backward (advanced signal)

### StdDev Variant
This implementation uses the **population standard deviation formula** (dividing by N), which is consistent with most trading platforms. This provides slightly different results compared to the sample formula (dividing by N-1).

## 🛠 Technical Stack

- **Framework**: React 18 + Vite + TypeScript
- **Charting**: KLineCharts v10.0.0-alpha5
- **UI Components**: Shadcn/ui + Tailwind CSS
- **State Management**: React hooks
- **Styling**: Professional dark trading theme

## 📁 Project Structure

```
src/
├── components/
│   ├── Chart.tsx              # KLineCharts wrapper with Bollinger overlay
│   └── BollingerSettings.tsx   # Settings modal with Inputs/Style tabs
├── lib/
│   ├── indicators/
│   │   └── bollinger.ts       # Core calculation utilities
│   └── types.ts               # TypeScript interfaces
├── pages/
│   └── Index.tsx              # Main application page
└── public/data/
    └── ohlcv.json             # Demo OHLCV data (200+ candles)
```

## 🎯 Performance

- **Smooth rendering** with 200-1,000+ candles
- **Efficient calculations** with optimized algorithms
- **Real-time updates** without chart reinitialization
- **Memory efficient** overlay management

## 🎨 Design System

The application uses a professional trading interface design system:

- **Dark Theme**: Optimized for extended trading sessions
- **Semantic Colors**: HSL-based color tokens for consistency
- **Typography**: Clear, readable fonts for data-heavy interfaces
- **Responsive**: Works on desktop and tablet viewports

## 📈 Usage

1. **Add Indicator**: Click "Add Bollinger Bands" to enable the indicator
2. **Configure Settings**: Use the settings modal to adjust parameters and styling
3. **View Data**: Hover over the chart to see band values in the crosshair tooltip
4. **Customize**: Modify colors, line styles, and visibility for each band

## 🔧 Customization

The indicator is built with extensibility in mind:

- **Additional MA Types**: Extend the calculation engine for EMA, WMA, etc.
- **Color Themes**: Modify the design system in `src/index.css`
- **Data Sources**: Replace demo data with live market feeds
- **Chart Features**: Add volume indicators, additional overlays

## 📚 KLineCharts Version

This project uses **KLineCharts v10.0.0-alpha5**, which provides:
- Modern overlay API for custom indicators
- Professional styling options
- Efficient rendering for large datasets
- Comprehensive crosshair and tooltip system

## 🎬 Demo

The chart includes 200 demo candles with realistic OHLCV data, demonstrating:
- **Volatility expansion/contraction**
- **Trend following behavior**
- **Mean reversion signals**
- **Offset functionality**

---

Built with ❤️ for professional traders and developers.