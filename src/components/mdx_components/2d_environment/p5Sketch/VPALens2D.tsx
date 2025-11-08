'use client';

import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import type p5 from 'p5';
import P5Sketch from '@/components/mdx_components/2d_environment/p5Sketch/p5SketchContainer';

export type VPAMode = 'micro' | 'macro' | 'global';
export type VPAPattern =
  | 'accumulation'
  | 'distribution'
  | 'testing'
  | 'sellingClimax'
  | 'buyingClimax';

export interface Candle {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface VPALens2DProps {
  mode: VPAMode;
  pattern: VPAPattern;
  step: number;
  showInsights: boolean;
  onHoverReadingChange?: (text: string | null) => void;
  totalBars?: number;
}

const DEFAULT_BARS = 40;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function makeCandle(
  prevClose: number,
  delta: number,
  volatility: number,
  volume: number
): Candle {
  const open = prevClose;
  const close = clamp(prevClose + delta, 10, 90);
  const body = Math.abs(close - open);
  const wickScale = 0.2 + volatility * 0.8;
  const upperWick = body * (0.3 + wickScale * 0.7);
  const lowerWick = body * (0.3 + wickScale * 0.7);
  const high = Math.max(open, close) + upperWick;
  const low = Math.min(open, close) - lowerWick;
  return {
    open,
    high: clamp(high, 5, 95),
    low: clamp(low, 5, 95),
    close,
    volume: Math.max(volume, 0.001),
  };
}

function generateSequence(pattern: VPAPattern, bars: number): Candle[] {
  const seq: Candle[] = [];
  let price = 50;

  const push = (
    delta: number,
    vol: number,
    volNoise = 0.2,
    volFloor = 0.05
  ) => {
    const v = Math.max(
      vol * (0.8 + Math.random() * 0.4) + Math.random() * volNoise,
      volFloor
    );
    const c = makeCandle(price, delta, Math.random(), v);
    seq.push(c);
    price = c.close;
  };

  switch (pattern) {
    case 'accumulation': {
      // Range-bound with spikes on down bars, then subtle markup
      for (let i = 0; i < Math.min(bars, 24); i++) {
        const drift = (Math.random() - 0.5) * 0.6;
        const isDown = drift < 0;
        const vol = isDown ? 0.8 : 0.35; // spikes on down bars
        push(drift, vol, 0.15, 0.05);
      }
      for (let i = seq.length; i < bars; i++) {
        const drift = 0.2 + Math.random() * 0.4; // gentle markup
        const vol = 0.5 + Math.random() * 0.3;
        push(drift, vol, 0.15, 0.1);
      }
      break;
    }
    case 'distribution': {
      // Flat top, high volume on up bars, then markdown
      for (let i = 0; i < Math.min(bars, 18); i++) {
        const drift = Math.random() * 0.4; // push into flat top
        const vol = 0.7; // participation on up moves
        push(drift, vol, 0.2, 0.1);
      }
      for (let i = seq.length; i < Math.min(bars, 28); i++) {
        const drift = (Math.random() - 0.5) * 0.2; // stall at top
        const vol = 0.5 + (drift > 0 ? 0.2 : -0.1);
        push(drift, vol, 0.15, 0.08);
      }
      for (let i = seq.length; i < bars; i++) {
        const drift = -(0.4 + Math.random() * 0.6); // markdown
        const vol = 0.6 + Math.random() * 0.3;
        push(drift, vol, 0.2, 0.12);
      }
      break;
    }
    case 'sellingClimax': {
      for (let i = 0; i < Math.min(bars, 20); i++) {
        const drift = -(0.1 + Math.random() * 0.3);
        const vol = 0.35 + Math.random() * 0.2;
        push(drift, vol);
      }
      // Climax bar
      push(-(2.2 + Math.random() * 0.8), 1.0, 0.1, 0.8);
      // Test
      push(0.1 + Math.random() * 0.2, 0.15, 0.05, 0.05);
      while (seq.length < bars) {
        const drift = (Math.random() - 0.4) * 0.3;
        const vol = 0.25 + Math.random() * 0.2;
        push(drift, vol);
      }
      break;
    }
    case 'buyingClimax': {
      for (let i = 0; i < Math.min(bars, 20); i++) {
        const drift = 0.1 + Math.random() * 0.3;
        const vol = 0.35 + Math.random() * 0.2;
        push(drift, vol);
      }
      // Climax bar
      push(2.2 + Math.random() * 0.8, 1.0, 0.1, 0.8);
      // Test
      push(-(0.1 + Math.random() * 0.2), 0.15, 0.05, 0.05);
      while (seq.length < bars) {
        const drift = (0.4 - Math.random()) * 0.3;
        const vol = 0.25 + Math.random() * 0.2;
        push(drift, vol);
      }
      break;
    }
    case 'testing': {
      for (let i = 0; i < Math.min(bars, 15); i++) {
        const drift = (Math.random() - 0.5) * 0.5;
        const vol = 0.4 + Math.random() * 0.2;
        push(drift, vol);
      }
      // Simulate preceding climax
      push(1.8 * (Math.random() > 0.5 ? 1 : -1), 0.95, 0.1, 0.8);
      // Testing bar: small candle, low volume
      push((Math.random() - 0.5) * 0.2, 0.12, 0.05, 0.05);
      while (seq.length < bars) {
        const drift = (Math.random() - 0.5) * 0.3;
        const vol = 0.25 + Math.random() * 0.2;
        push(drift, vol);
      }
      break;
    }
  }

  return seq;
}

function classifyEffortVsResult(
  current: Candle,
  previous: Candle | null,
  maxVolume: number
) {
  const body = Math.abs(current.close - current.open);
  const prevBody = previous ? Math.abs(previous.close - previous.open) : body;
  const volRatio = current.volume / Math.max(maxVolume, 0.0001);
  const bodyChange = previous ? body - prevBody : 0;
  const volChange = previous ? current.volume - previous.volume : 0;
  const direction = current.close >= current.open ? 1 : -1;

  let label: string | null = null;
  if (volRatio > 0.7 && body < prevBody * 0.6) {
    label = 'Effort > Result → Absorption';
  } else if (volRatio < 0.35 && body > prevBody * 1.3) {
    label = 'Result > Effort → Weak Move';
  } else if (volChange < -0.02 && bodyChange > 0.4) {
    label = 'Effort ↓, Result ↑ → Hidden Strength';
  } else if (volChange > 0.02 && bodyChange < -0.4) {
    label = 'Effort ↑, Result ↓ → Hidden Weakness';
  }

  const agreement =
    (bodyChange >= 0 && volChange >= 0) || (bodyChange <= 0 && volChange <= 0);

  return { label, agreement, direction, body, volRatio };
}

export const VPALens2D: React.FC<VPALens2DProps> = ({
  mode,
  pattern,
  step,
  showInsights,
  onHoverReadingChange,
  totalBars = DEFAULT_BARS,
}) => {
  const patternRef = useRef<VPAPattern>(pattern);
  const modeRef = useRef<VPAMode>(mode);
  const stepRef = useRef<number>(step);
  const showInsightsRef = useRef<boolean>(showInsights);
  const hoverTextRef = useRef<string | null>(null);

  useEffect(() => {
    patternRef.current = pattern;
  }, [pattern]);
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);
  useEffect(() => {
    stepRef.current = step;
  }, [step]);
  useEffect(() => {
    showInsightsRef.current = showInsights;
  }, [showInsights]);
  useEffect(() => {
    if (onHoverReadingChange) onHoverReadingChange(hoverTextRef.current);
  }, [onHoverReadingChange]);

  const sequenceCacheKey = useMemo(
    () => `${pattern}-${totalBars}`,
    [pattern, totalBars]
  );

  const sketch = useCallback(
    (p: p5, parentEl: HTMLDivElement) => {
      let candles: Candle[] = [];
      let cachedKey = '';
      let hoverIndex: number | null = null;

      const getLeftWidth = () => Math.floor(parentEl.clientWidth);
      const getTopHeight = () => Math.floor(parentEl.clientHeight);

      const chartPadding = 40;
      const priceAreaHeightRatio = 0.7; // price area: 70%, volume: 30%

      function ensureSequence() {
        const key = `${patternRef.current}-${DEFAULT_BARS}`;
        if (key !== cachedKey) {
          candles = generateSequence(patternRef.current, DEFAULT_BARS);
          cachedKey = key;
        }
      }

      function getVisibleWindow(total: number, mode: VPAMode, stepIdx: number) {
        const currentCount = clamp(stepIdx, 1, total);
        if (mode === 'micro') {
          const start = Math.max(currentCount - 1, 0);
          return { start, end: start + 1 };
        }
        if (mode === 'macro') {
          const span = 8;
          const end = currentCount;
          const start = Math.max(end - span, 0);
          return { start, end };
        }
        return { start: 0, end: currentCount };
      }

      function drawPatternOverlay(
        x1: number,
        y1: number,
        w: number,
        h: number
      ) {
        p.noStroke();
        switch (patternRef.current) {
          case 'accumulation':
            p.fill(50, 200, 120, 35);
            p.rect(x1, y1 + h * (1 - priceAreaHeightRatio) * 0.3, w, h * 0.5);
            p.fill(160, 255, 200, 160);
            p.text('Smart Money Accumulating', x1 + 10, y1 + 20);
            break;
          case 'distribution':
            p.fill(255, 80, 100, 35);
            p.rect(x1, y1 + h * 0.1, w, h * 0.5);
            p.fill(255, 180, 190, 160);
            p.text('Smart Money Distributing', x1 + 10, y1 + 20);
            break;
          case 'testing':
            p.fill(255, 220, 100, 190);
            p.text('Testing Supply/Demand', x1 + 10, y1 + 20);
            break;
          case 'sellingClimax':
            p.fill(255, 120, 120, 190);
            p.text('Panic / Capitulation', x1 + 10, y1 + 20);
            break;
          case 'buyingClimax':
            p.fill(140, 220, 255, 190);
            p.text('Euphoria / Exhaustion', x1 + 10, y1 + 20);
            break;
        }
      }

      p.setup = () => {
        p.createCanvas(getLeftWidth(), getTopHeight());
        p.textFont('sans-serif');
      };

      p.mouseMoved = () => {
        const leftX = 0;
        const topY = 0;
        const chartW = p.width;
        const chartH = p.height;
        const padding = chartPadding;
        const areaW = chartW - padding * 2;
        const areaH = chartH - padding * 2;

        if (
          p.mouseX < leftX + padding ||
          p.mouseX > leftX + chartW - padding ||
          p.mouseY < topY + padding ||
          p.mouseY > topY + chartH - padding
        ) {
          hoverIndex = null;
          hoverTextRef.current = null;
          if (onHoverReadingChange) onHoverReadingChange(null);
          return;
        }

        ensureSequence();
        const visible = getVisibleWindow(
          candles.length,
          modeRef.current,
          stepRef.current
        );
        const n = Math.max(1, visible.end - visible.start);
        const candleW = areaW / Math.max(n, 1);
        const idx =
          Math.floor((p.mouseX - (leftX + padding)) / candleW) + visible.start;
        hoverIndex = clamp(idx, visible.start, visible.end - 1);

        const c = candles[hoverIndex];
        const prev = hoverIndex > 0 ? candles[hoverIndex - 1] : null;
        const maxVolume = candles
          .slice(visible.start, visible.end)
          .reduce((m, v) => Math.max(m, v.volume), 0.0001);
        const info = classifyEffortVsResult(c, prev, maxVolume);
        const dirText = c.close >= c.open ? 'Up' : 'Down';
        const base = `Candle ${hoverIndex + 1} (${dirText}) • Effort=${(
          c.volume / maxVolume
        ).toFixed(2)}, Result=${Math.abs(c.close - c.open).toFixed(2)}`;
        hoverTextRef.current = info.label ? `${base} • ${info.label}` : base;
        if (onHoverReadingChange) onHoverReadingChange(hoverTextRef.current);
      };

      p.windowResized = () => {
        p.resizeCanvas(getLeftWidth(), getTopHeight());
      };

      p.draw = () => {
        ensureSequence();
        p.background(18, 20, 28);

        const padding = chartPadding;
        const chartX = padding;
        const chartY = padding;
        const chartW = p.width - padding * 2;
        const chartH = p.height - padding * 2;

        // Frame
        p.noFill();
        p.stroke(60, 60, 75);
        p.rect(chartX, chartY, chartW, chartH);

        // Title
        p.noStroke();
        p.fill(220);
        p.textSize(14);
        p.textAlign(p.CENTER, p.TOP);
        p.text(
          'The Three-Level VPA Lens — Price & Volume',
          chartX + chartW / 2,
          chartY - 24
        );

        // Visible range / zoom
        const visible = getVisibleWindow(
          candles.length,
          modeRef.current,
          stepRef.current
        );
        const slice = candles.slice(visible.start, visible.end);
        if (slice.length === 0) return;

        // Price/Volume ranges
        let minPrice = Infinity;
        let maxPrice = -Infinity;
        let maxVolume = 0;
        slice.forEach((c) => {
          minPrice = Math.min(minPrice, c.low);
          maxPrice = Math.max(maxPrice, c.high);
          maxVolume = Math.max(maxVolume, c.volume);
        });
        const pricePadding = (maxPrice - minPrice || 1) * 0.08;
        const priceAreaH = chartH * priceAreaHeightRatio;
        const priceStartY = chartY;
        const volumeAreaH = chartH * (1 - priceAreaHeightRatio);
        const volumeStartY = chartY + priceAreaH;

        // Grid
        p.stroke(45, 48, 60);
        p.strokeWeight(1);
        for (let i = 0; i <= 4; i++) {
          const y = priceStartY + (priceAreaH / 4) * i;
          p.line(chartX, y, chartX + chartW, y);
        }

        // Pattern overlay (subtle hint)
        if (showInsightsRef.current) {
          drawPatternOverlay(chartX, chartY, chartW, chartH);
        }

        // Candle width
        const candleW = chartW / slice.length;

        // Draw volume bars first
        p.noStroke();
        slice.forEach((c, i) => {
          const x = chartX + i * candleW + candleW * 0.1;
          const volH =
            (c.volume / Math.max(maxVolume, 0.0001)) * (volumeAreaH * 0.9);
          const isUp = c.close >= c.open;
          p.fill(isUp ? 100 : 255, isUp ? 255 : 100, 120, 170);
          p.rect(x, volumeStartY + volumeAreaH - volH, candleW * 0.8, volH);
        });

        // Draw price candles and annotations
        let lastLabelY = chartY + 8;
        slice.forEach((c, i) => {
          const globalIndex = visible.start + i;
          const xCenter = chartX + i * candleW + candleW / 2;
          const isUp = c.close >= c.open;

          const norm = (price: number) =>
            priceStartY +
            ((maxPrice + pricePadding - price) /
              (maxPrice - minPrice + pricePadding * 2)) *
              priceAreaH;

          const highY = norm(c.high);
          const lowY = norm(c.low);
          const openY = norm(c.open);
          const closeY = norm(c.close);

          p.stroke(isUp ? 100 : 255, isUp ? 255 : 100, 120);
          p.strokeWeight(1.5);
          p.line(xCenter, highY, xCenter, lowY);

          const bodyTop = Math.min(openY, closeY);
          const bodyBottom = Math.max(openY, closeY);
          const bodyH = Math.max(2, bodyBottom - bodyTop);
          const volRatio = c.volume / Math.max(maxVolume, 0.0001);
          const bodyW = candleW * (0.45 + volRatio * 0.25);

          p.fill(isUp ? 100 : 255, isUp ? 255 : 100, 120);
          p.noStroke();
          p.rect(xCenter - bodyW / 2, bodyTop, bodyW, bodyH);

          // Divergence / Agreement line between body center and volume top
          if (i > 0 && showInsightsRef.current) {
            const prev = slice[i - 1];
            const prevBody = Math.abs(prev.close - prev.open);
            const bodyChange = bodyH - Math.max(2, prevBody);
            const volChange = c.volume - prev.volume;
            const agree =
              (bodyChange >= 0 && volChange >= 0) ||
              (bodyChange <= 0 && volChange <= 0);
            const volTopY =
              volumeStartY +
              volumeAreaH -
              (c.volume / Math.max(maxVolume, 0.0001)) * (volumeAreaH * 0.9);
            p.stroke(agree ? p.color(120, 255, 160) : p.color(255, 120, 120));
            p.strokeWeight(1.5);
            p.line(xCenter, bodyTop + bodyH / 2, xCenter, volTopY);
          }

          // Labels for effort vs result
          if (showInsightsRef.current) {
            const prev = i > 0 ? slice[i - 1] : null;
            const info = classifyEffortVsResult(c, prev, maxVolume);
            if (info.label && globalIndex === stepRef.current - 1) {
              p.fill(255, 255, 180);
              p.textSize(12);
              p.textAlign(p.LEFT, p.TOP);
              const y = lastLabelY;
              p.text(info.label, chartX + 10, y);
              lastLabelY = y + 16;
            }
          }
        });

        // Hover tooltip
        if (
          hoverIndex !== null &&
          hoverIndex >= visible.start &&
          hoverIndex < visible.end
        ) {
          const i = hoverIndex - visible.start;
          const xCenter = chartX + i * candleW + candleW / 2;
          p.stroke(160, 160, 220, 140);
          p.strokeWeight(1);
          p.line(xCenter, priceStartY, xCenter, priceStartY + priceAreaH);
          if (hoverTextRef.current) {
            p.noStroke();
            p.fill(22, 22, 32, 230);
            const text = hoverTextRef.current;
            p.textSize(12);
            const tw = p.textWidth(text) + 16;
            const th = 22;
            const tx = clamp(p.mouseX + 12, chartX, chartX + chartW - tw);
            const ty = clamp(p.mouseY + 12, chartY, chartY + chartH - th);
            p.rect(tx, ty, tw, th, 6);
            p.fill(230);
            p.textAlign(p.LEFT, p.CENTER);
            p.text(text, tx + 8, ty + th / 2);
          }
        }

        // Axis labels
        p.fill(180);
        p.textSize(10);
        p.textAlign(p.RIGHT, p.CENTER);
        for (let i = 0; i <= 4; i++) {
          const y = priceStartY + (priceAreaH / 4) * i;
          const val = lerp(
            maxPrice + pricePadding,
            minPrice - pricePadding,
            i / 4
          );
          p.text(val.toFixed(1), chartX - 6, y);
        }
      };
    },
    [sequenceCacheKey]
  );

  return (
    <div className="w-full h-full">
      <P5Sketch sketch={sketch} />
    </div>
  );
};

export default VPALens2D;
