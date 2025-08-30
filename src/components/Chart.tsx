import { useEffect, useRef, useState } from 'react';
import { init, Chart as KLineChart, dispose } from 'klinecharts';
import { OHLCVData, BollingerBandsOptions, BollingerBandsStyle } from '@/lib/types';

interface ChartProps {
  data: OHLCVData[];
  bollingerOptions: BollingerBandsOptions;
  bollingerStyle: BollingerBandsStyle;
  showBollinger: boolean;
}

export function Chart({ data, bollingerOptions, bollingerStyle, showBollinger }: ChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<KLineChart | null>(null);
  const [isChartReady, setIsChartReady] = useState(false);

  // Initialize chart
  useEffect(() => {
    if (!chartRef.current) return;

    const chart = init(chartRef.current, {
      styles: {
        candle: {
          bar: {
            upColor: '#26a69a',
            downColor: '#ef5350',
            noChangeColor: '#888888'
          }
        },
        grid: {
          show: true,
          horizontal: {
            color: 'hsl(var(--chart-grid))'
          },
          vertical: {
            color: 'hsl(var(--chart-grid))'
          }
        },
        crosshair: {
          show: true,
          horizontal: {
            line: {
              color: 'hsl(var(--primary))',
              size: 1
            }
          },
          vertical: {
            line: {
              color: 'hsl(var(--primary))',
              size: 1
            }
          }
        },
        yAxis: {
          show: true,
          axisLine: {
            color: 'hsl(var(--border))'
          },
          tickLine: {
            color: 'hsl(var(--border))'
          },
          tickText: {
            color: 'hsl(var(--muted-foreground))'
          }
        },
        xAxis: {
          show: true,
          axisLine: {
            color: 'hsl(var(--border))'
          },
          tickLine: {
            color: 'hsl(var(--border))'
          },
          tickText: {
            color: 'hsl(var(--muted-foreground))'
          }
        }
      }
    });

    if (chart) {
      chartInstanceRef.current = chart;
      setIsChartReady(true);
    }

    return () => {
      if (chartInstanceRef.current && chartRef.current) {
        dispose(chartRef.current.id || 'chart');
        chartInstanceRef.current = null;
        setIsChartReady(false);
      }
    };
  }, []);

  // Update chart data
  useEffect(() => {
    if (!chartInstanceRef.current || !isChartReady) return;

    const klineData = data.map(item => ({
      timestamp: item.timestamp,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      volume: item.volume
    }));

    chartInstanceRef.current.applyNewData(klineData);
  }, [data, isChartReady]);

  // Simple Bollinger Bands indicator using built-in BOLL indicator
  useEffect(() => {
    if (!chartInstanceRef.current || !isChartReady) return;

    // Remove existing indicators
    try {
      chartInstanceRef.current.removeIndicator({ name: 'BOLL' });
    } catch (e) {
      // Indicator might not exist
    }

    if (showBollinger) {
      // Add Bollinger Bands technical indicator
      try {
        chartInstanceRef.current.createIndicator({
          name: 'BOLL',
          calcParams: [bollingerOptions.length, bollingerOptions.stdDev]
        });
      } catch (e) {
        console.warn('Failed to create BOLL indicator:', e);
      }
    }
  }, [showBollinger, bollingerOptions, bollingerStyle, isChartReady]);

  return (
    <div 
      ref={chartRef} 
      className="w-full h-[500px] bg-chart-background rounded-lg border border-border"
      style={{ backgroundColor: 'hsl(var(--chart-background))' }}
    />
  );
}