import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Settings, Plus } from 'lucide-react';
import { Chart } from '@/components/Chart';
import { BollingerSettings } from '@/components/BollingerSettings';
import { OHLCVData, BollingerBandsOptions, BollingerBandsStyle } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [ohlcvData, setOhlcvData] = useState<OHLCVData[]>([]);
  const [showBollinger, setShowBollinger] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [bollingerOptions, setBollingerOptions] = useState<BollingerBandsOptions>({
    length: 20,
    source: 'close',
    stdDev: 2,
    offset: 0,
    maType: 'SMA'
  });

  const [bollingerStyle, setBollingerStyle] = useState<BollingerBandsStyle>({
    basis: {
      show: true,
      color: '#3b82f6',
      lineWidth: 2,
      lineStyle: 'solid'
    },
    upper: {
      show: true,
      color: '#06b6d4',
      lineWidth: 1,
      lineStyle: 'solid'
    },
    lower: {
      show: true,
      color: '#06b6d4',
      lineWidth: 1,
      lineStyle: 'solid'
    },
    fill: {
      show: true,
      opacity: 0.1
    }
  });

  // Load OHLCV data
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data/ohlcv.json');
        if (!response.ok) throw new Error('Failed to load data');
        const data = await response.json();
        setOhlcvData(data);
      } catch (error) {
        console.error('Error loading OHLCV data:', error);
        toast({
          title: "Error",
          description: "Failed to load chart data",
          variant: "destructive"
        });
      }
    };

    loadData();
  }, [toast]);

  const handleAddIndicator = () => {
    setShowBollinger(true);
    setSettingsOpen(true);
    toast({
      title: "Bollinger Bands Added",
      description: "Indicator has been added to the chart"
    });
  };

  const handleRemoveIndicator = () => {
    setShowBollinger(false);
    toast({
      title: "Bollinger Bands Removed",
      description: "Indicator has been removed from the chart"
    });
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Bollinger Bands Chart</h1>
              <p className="text-muted-foreground">Professional trading indicator with KLineCharts</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {showBollinger && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSettingsOpen(true)}
                className="gap-2"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Button>
            )}
            
            {!showBollinger ? (
              <Button onClick={handleAddIndicator} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Bollinger Bands
              </Button>
            ) : (
              <Button variant="destructive" onClick={handleRemoveIndicator}>
                Remove Indicator
              </Button>
            )}
          </div>
        </div>

        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>BTC/USD Candlestick Chart</span>
              {showBollinger && (
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-0.5 bg-[#3b82f6]"></div>
                    <span className="text-muted-foreground">Basis (SMA {bollingerOptions.length})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-0.5 bg-[#06b6d4]"></div>
                    <span className="text-muted-foreground">Upper/Lower (±{bollingerOptions.stdDev}σ)</span>
                  </div>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              data={ohlcvData}
              bollingerOptions={bollingerOptions}
              bollingerStyle={bollingerStyle}
              showBollinger={showBollinger}
            />
          </CardContent>
        </Card>

        {/* Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Formula</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <div>Basis = SMA(Close, 20)</div>
              <div>Upper = Basis + (2 × σ)</div>
              <div>Lower = Basis - (2 × σ)</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Data Points</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <div>{ohlcvData.length} candles loaded</div>
              <div>Population StdDev formula</div>
              <div>Real-time updates</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Features</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <div>Configurable parameters</div>
              <div>Custom styling options</div>
              <div>Crosshair tooltips</div>
            </CardContent>
          </Card>
        </div>

        {/* Settings Modal */}
        <BollingerSettings
          isOpen={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          options={bollingerOptions}
          style={bollingerStyle}
          onOptionsChange={setBollingerOptions}
          onStyleChange={setBollingerStyle}
        />
      </div>
    </div>
  );
};

export default Index;
