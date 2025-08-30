export interface OHLCVData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface BollingerBandsOptions {
  length: number;
  source: 'close' | 'open' | 'high' | 'low';
  stdDev: number;
  offset: number;
  maType: 'SMA';
}

export interface BollingerBandsResult {
  upper: number;
  basis: number;
  lower: number;
}

export interface BollingerBandsPoint {
  timestamp: number;
  upper: number | null;
  basis: number | null;
  lower: number | null;
}

export interface BollingerBandsStyle {
  basis: {
    show: boolean;
    color: string;
    lineWidth: number;
    lineStyle: 'solid' | 'dashed';
  };
  upper: {
    show: boolean;
    color: string;
    lineWidth: number;
    lineStyle: 'solid' | 'dashed';
  };
  lower: {
    show: boolean;
    color: string;
    lineWidth: number;
    lineStyle: 'solid' | 'dashed';
  };
  fill: {
    show: boolean;
    opacity: number;
  };
}