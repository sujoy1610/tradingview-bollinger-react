import { OHLCVData, BollingerBandsOptions, BollingerBandsPoint } from '../types';

/**
 * Calculate Simple Moving Average
 */
function calculateSMA(values: number[], length: number): number[] {
  const smaValues: number[] = [];
  
  for (let i = 0; i < values.length; i++) {
    if (i < length - 1) {
      smaValues.push(NaN);
    } else {
      const sum = values.slice(i - length + 1, i + 1).reduce((acc, val) => acc + val, 0);
      smaValues.push(sum / length);
    }
  }
  
  return smaValues;
}

/**
 * Calculate Standard Deviation (population formula)
 * Using population formula: sqrt(sum((x - mean)^2) / n)
 */
function calculateStdDev(values: number[], length: number, means: number[]): number[] {
  const stdDevValues: number[] = [];
  
  for (let i = 0; i < values.length; i++) {
    if (i < length - 1 || isNaN(means[i])) {
      stdDevValues.push(NaN);
    } else {
      const mean = means[i];
      const slice = values.slice(i - length + 1, i + 1);
      const sumSquaredDiffs = slice.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0);
      const variance = sumSquaredDiffs / length; // Population formula
      stdDevValues.push(Math.sqrt(variance));
    }
  }
  
  return stdDevValues;
}

/**
 * Apply offset to shift the series by N bars
 */
function applyOffset<T>(values: (T | null)[], offset: number): (T | null)[] {
  if (offset === 0) return values;
  
  const result: (T | null)[] = new Array(values.length).fill(null);
  
  if (offset > 0) {
    // Shift forward (delay)
    for (let i = offset; i < values.length; i++) {
      result[i] = values[i - offset];
    }
  } else {
    // Shift backward (advance)
    const absOffset = Math.abs(offset);
    for (let i = 0; i < values.length - absOffset; i++) {
      result[i] = values[i + absOffset];
    }
  }
  
  return result;
}

/**
 * Compute Bollinger Bands indicator
 * 
 * Formula:
 * 1. Basis (middle band) = SMA(source, length)
 * 2. StdDev = standard deviation of last length values (population formula)
 * 3. Upper Band = Basis + (StdDev * multiplier)
 * 4. Lower Band = Basis - (StdDev * multiplier)
 * 5. Offset = shift series by N bars
 */
export function computeBollingerBands(
  data: OHLCVData[], 
  options: BollingerBandsOptions
): BollingerBandsPoint[] {
  const { length, source, stdDev: multiplier, offset } = options;
  
  if (data.length === 0) return [];
  
  // Extract source values
  const sourceValues = data.map(candle => candle[source]);
  
  // Calculate SMA (basis/middle band)
  const smaValues = calculateSMA(sourceValues, length);
  
  // Calculate Standard Deviation
  const stdDevValues = calculateStdDev(sourceValues, length, smaValues);
  
  // Calculate upper and lower bands
  const upperValues = smaValues.map((sma, i) => {
    const stdDev = stdDevValues[i];
    return isNaN(sma) || isNaN(stdDev) ? null : sma + (stdDev * multiplier);
  });
  
  const lowerValues = smaValues.map((sma, i) => {
    const stdDev = stdDevValues[i];
    return isNaN(sma) || isNaN(stdDev) ? null : sma - (stdDev * multiplier);
  });
  
  const basisValues = smaValues.map(val => isNaN(val) ? null : val);
  
  // Apply offset
  const offsetBasisValues = applyOffset(basisValues, offset);
  const offsetUpperValues = applyOffset(upperValues, offset);
  const offsetLowerValues = applyOffset(lowerValues, offset);
  
  // Combine results
  return data.map((candle, i) => ({
    timestamp: candle.timestamp,
    basis: offsetBasisValues[i],
    upper: offsetUpperValues[i],
    lower: offsetLowerValues[i]
  }));
}