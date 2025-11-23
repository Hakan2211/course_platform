const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'downloads');
const OUTPUT_PATH = path.join(OUTPUT_DIR, 'personal-risk-management-plan.pdf');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Create document
const doc = new PDFDocument({
  size: 'LETTER',
  margin: 50,
  bufferPages: true,
});

doc.pipe(fs.createWriteStream(OUTPUT_PATH));

// Colors
const COLORS = {
  primary: '#10B981', // Emerald 500
  primaryDark: '#059669', // Emerald 600
  primaryLight: '#ECFDF5', // Emerald 50 - lighter for background
  text: '#1F2937', // Gray 800
  textLight: '#6B7280', // Gray 500
  line: '#E5E7EB', // Gray 200
  background: '#FFFFFF',
};

// Fonts
const FONT_BOLD = 'Helvetica-Bold';
const FONT_REGULAR = 'Helvetica';
const FONT_ITALIC = 'Helvetica-Oblique';

// --- Helpers ---

function drawHeader(title) {
  doc
    .font(FONT_BOLD)
    .fontSize(24)
    .fillColor(COLORS.primaryDark)
    .text(title, { align: 'center' });
  doc.moveDown(0.5);
}

function drawSectionTitle(number, title) {
  doc.moveDown(1);
  const y = doc.y;

  // Background pill
  doc.rect(50, y - 4, 512, 24).fill(COLORS.primaryLight);

  // Section Title
  doc
    .font(FONT_BOLD)
    .fontSize(12)
    .fillColor(COLORS.primaryDark)
    .text(`SECTION ${number}: ${title}`, 60, y + 3);

  doc.moveDown(1.5);
}

function drawLine(y, xStart = 50, xEnd = 562) {
  doc
    .strokeColor(COLORS.line)
    .lineWidth(1)
    .moveTo(xStart, y)
    .lineTo(xEnd, y)
    .stroke();
}

function drawCheckbox(label, checked = false) {
  const y = doc.y;
  // Draw box
  doc.rect(50, y, 12, 12).strokeColor(COLORS.textLight).lineWidth(1).stroke();

  // Label
  doc
    .font(FONT_REGULAR)
    .fontSize(10)
    .fillColor(COLORS.text)
    .text(label, 70, y + 2);

  doc.moveDown(0.5);
}

// Helper to ensure we don't write off the bottom of the page
function checkPageBreak(heightNeeded = 50) {
  if (doc.y + heightNeeded > doc.page.height - 50) {
    doc.addPage();
    return true;
  }
  return false;
}

// --- DOCUMENT CONTENT GENERATION ---

// 1. Header Area
drawHeader('PERSONAL RISK MANAGEMENT PLAN');

doc.moveDown(1);

// Trader Info Grid
const startY = doc.y;
doc
  .font(FONT_BOLD)
  .fontSize(10)
  .fillColor(COLORS.text)
  .text('Trader:', 50, startY);
doc.font(FONT_REGULAR).text('_______________________', 100, startY);

doc.font(FONT_BOLD).text('Date Created:', 300, startY);
doc.font(FONT_REGULAR).text('_______________________', 380, startY);

doc.moveDown(1.5);
const nextY = doc.y;
doc.font(FONT_BOLD).text('Trading Style:', 50, nextY);
doc.font(FONT_REGULAR).text('[ Scalper / Day / Swing / Position ]', 130, nextY);

doc.font(FONT_BOLD).text('Version:', 300, nextY);
doc.font(FONT_REGULAR).text('1.0', 380, nextY);

doc.moveDown(2);

// SECTION 1
checkPageBreak();
drawSectionTitle('1', 'TRADING STYLE & PHILOSOPHY');

doc
  .font(FONT_BOLD)
  .fontSize(10)
  .fillColor(COLORS.text)
  .text('My Trading Style:');
doc.moveDown(0.5);
drawLine(doc.y);
doc.moveDown(1.5);

doc.font(FONT_BOLD).text('Why I chose this style:');
doc.moveDown(0.5);
drawLine(doc.y);
doc.moveDown(1.5);
drawLine(doc.y);
doc.moveDown(1.5);

doc.font(FONT_BOLD).text('My Trading Philosophy:');
doc.moveDown(0.5);
drawLine(doc.y);
doc.moveDown(1.5);
drawLine(doc.y);
doc.moveDown(2);

// Quote Box
const quoteY = doc.y;
doc.rect(50, quoteY, 512, 50).fill(COLORS.primaryLight);
doc
  .fillColor(COLORS.primaryDark)
  .font(FONT_ITALIC)
  .fontSize(11)
  .text(
    '"My first job is to SURVIVE. Capital preservation above all. I will follow this plan regardless of emotion."',
    70,
    quoteY + 12,
    { width: 472, align: 'center' }
  );

doc.moveDown(4);

// SECTION 2
checkPageBreak();
drawSectionTitle('2', 'POSITION SIZING RULES');

doc
  .font(FONT_BOLD)
  .fontSize(10)
  .fillColor(COLORS.text)
  .text('ACCOUNT SIZE: $ ___________________', { continued: false });
doc.moveDown(1);
doc.text('BASE RISK PER TRADE: _______ %  =  $ ___________________');
doc.moveDown(1.5);

doc.font(FONT_BOLD).text('Position Size Formula:');
doc.moveDown(0.5);
drawLine(doc.y);
doc.moveDown(1.5);

doc.font(FONT_BOLD).text('Adjustments:');
doc.moveDown(0.5);
doc
  .font(FONT_REGULAR)
  .text('- Volatility Method: ________________________________________');
doc.moveDown(0.5);
doc
  .font(FONT_REGULAR)
  .text(
    '- Setup Quality:  A-grade ____%   /   B-grade ____%   /   C-grade ____%'
  );

// SECTION 3
checkPageBreak();
drawSectionTitle('3', 'STOP-LOSS ARCHITECTURE');

doc
  .font(FONT_BOLD)
  .text('Primary Method: ________________________________________');
doc.moveDown(1);

doc.font(FONT_BOLD).text('Stop Distance Guidelines:');
doc.moveDown(0.5);
doc
  .font(FONT_REGULAR)
  .text('- Calm market:      ____ x ATR  =  ____ pips/points');
doc.text('- Normal market:    ____ x ATR  =  ____ pips/points');
doc.text('- Volatile market:  ____ x ATR  =  ____ pips/points');
doc.moveDown(1);

doc
  .font(FONT_BOLD)
  .text('Technical Buffer: ', { continued: true })
  .font(FONT_REGULAR)
  .text('____ pips/points beyond S/R');
doc.moveDown(1);

doc.font(FONT_BOLD).text('Trailing Stop Rules:');
doc.moveDown(0.5);
doc.font(FONT_REGULAR).text('- At +___R profit: Move to _____________________');
doc.text('- At +___R profit: Trail by _____________________');
doc.text('- Maximum trail method: _____________________');

doc.moveDown(1);
doc.font(FONT_BOLD).fillColor(COLORS.primaryDark).text('NON-NEGOTIABLES:');
doc.fillColor(COLORS.text);
doc.moveDown(0.5);
drawCheckbox('Stop placed BEFORE entry, always');
drawCheckbox('Stop NEVER moved further from entry');
drawCheckbox('Stop placed in market (not mental)');

// SECTION 4
checkPageBreak();
drawSectionTitle('4', 'RISK-REWARD TARGETS');

doc.font(FONT_BOLD).text('Minimum Acceptable RR: 1 : ____');
doc.moveDown(1);
doc.text('Target RR Range: 1 : ____  to  1 : ____');
doc.moveDown(1);

doc.font(FONT_BOLD).text('Scaling Out Strategy:');
doc.moveDown(0.5);
doc.font(FONT_REGULAR).text('- ____ % at 1 : ____');
doc.text('- ____ % at 1 : ____');
doc.text('- ____ % trailing stop');

doc.addPage(); // Force New Page for cleaner layout

// SECTION 5
drawSectionTitle('5', 'PORTFOLIO HEAT & POSITION LIMITS');

doc.font(FONT_BOLD).text('MAXIMUM SIMULTANEOUS POSITIONS: ____');
doc.moveDown(1);
doc.text('MAXIMUM PORTFOLIO HEAT: ____ %');
doc.moveDown(1);

doc.font(FONT_BOLD).text('Correlation Rules:');
doc.moveDown(0.5);
doc.font(FONT_REGULAR).text('- Max same-currency positions: ____');
doc.text('- Max same-sector positions: ____');
doc.text('- If correlation > 0.7: ________________________________________');
doc.moveDown(1);

doc.font(FONT_BOLD).text('Weekend Protocol:');
doc.moveDown(0.5);
doc.font(FONT_REGULAR).text('- Max weekend heat: ____ %');
doc.text('- Friday routine: ________________________________________');

// SECTION 6
checkPageBreak();
drawSectionTitle('6', 'CIRCUIT BREAKERS');

// Table-like structure for Circuit Breakers
const drawCBBox = (title, items, y) => {
  doc.font(FONT_BOLD).fontSize(11).fillColor(COLORS.text).text(title, 50, y);
  let currY = y;
  items.forEach((item) => {
    doc.font(FONT_REGULAR).fontSize(10).text(item, 150, currY);
    currY += 15;
  });
  return currY;
};

let cbY = doc.y;
cbY = drawCBBox(
  'DAILY:',
  [
    'Max trades: ____',
    'Loss limit: ____% ($_______) -> STOP FOR DAY',
    'Consecutive losses: ____ -> Take ____-min break',
  ],
  cbY
);

doc.moveDown(3); // Spacer calculation roughly
cbY += 10;

cbY = drawCBBox(
  'WEEKLY:',
  [
    'Loss limit: ____% ($_______) -> STOP ADDING TRADES',
    'Target: +____ to +____ R',
  ],
  cbY
);

doc.moveDown(2);
cbY += 10;

cbY = drawCBBox(
  'MONTHLY:',
  [
    'Loss at ____% -> Reduce size 50%',
    'Loss at ____% -> STOP LIVE TRADING',
    'Target: +____ to +____ R',
  ],
  cbY
);

// Restore cursor
doc.y = cbY + 20;

// SECTION 7
checkPageBreak();
drawSectionTitle('7', 'DRAWDOWN RESPONSE PROTOCOL');

function drawDrawdownItem(percent) {
  doc.font(FONT_BOLD).text(`At -${percent}% Drawdown:`);
  doc.moveDown(0.5);
  doc
    .font(FONT_REGULAR)
    .text(
      'Action: __________________________________________________________________'
    );
  doc.moveDown(1);
}

drawDrawdownItem('5');
drawDrawdownItem('10');
drawDrawdownItem('15');
drawDrawdownItem('20');

// SECTION 8
checkPageBreak(150);
drawSectionTitle('8', 'VOLATILITY REGIME ADAPTATION');

doc.font(FONT_BOLD).text('REGIME DETECTION:');
doc
  .font(FONT_REGULAR)
  .text('- Check daily: YES / NO    - Tools: ATR ratio, VIX');
doc.moveDown(1);

doc.font(FONT_BOLD).text('REGIME-BASED PARAMETERS:');
doc.moveDown(0.5);

doc.font(FONT_BOLD).fontSize(10).text('CALM (ATR < 0.8x):');
doc
  .font(FONT_REGULAR)
  .text('Risk: ____%   Stops: ___ x ATR   Max positions: ____');
doc.moveDown(0.5);

doc.font(FONT_BOLD).fontSize(10).text('NORMAL (ATR 0.8-1.3x):');
doc
  .font(FONT_REGULAR)
  .text('Risk: ____%   Stops: ___ x ATR   Max positions: ____');
doc.moveDown(0.5);

doc.font(FONT_BOLD).fontSize(10).text('VOLATILE (ATR 1.3-2x):');
doc
  .font(FONT_REGULAR)
  .text('Risk: ____%   Stops: ___ x ATR   Max positions: ____');
doc.moveDown(0.5);

doc.font(FONT_BOLD).fontSize(10).text('CRISIS (ATR > 2x or VIX > 60):');
doc
  .font(FONT_REGULAR)
  .text('Action: __________________________________________________');

doc.addPage(); // NEW PAGE

// SECTION 9
drawSectionTitle('9', 'PSYCHOLOGICAL PROTOCOLS');

doc
  .font(FONT_BOLD)
  .fontSize(10)
  .text('Pre-Trade Checklist: YES / NO (Mandatory)');
doc.moveDown(1);

doc.text('Emotional State Check: YES / NO');
doc.font(FONT_REGULAR).text('- Trade only when: Calm (6-7/10)');
doc.text("- Don't trade when: <5 or >8 on emotional scale");
doc.moveDown(1);

doc.font(FONT_BOLD).text('After-Loss Protocol:');
doc.font(FONT_REGULAR).text('- 30-minute break: YES / NO');
doc.text('- Journal immediately: YES / NO');
doc.text('- Review rule adherence: YES / NO');
doc.moveDown(1);

doc.font(FONT_BOLD).text('Revenge Trading Prevention Action:');
doc.moveDown(0.5);
drawLine(doc.y);
doc.moveDown(1.5);

doc.font(FONT_BOLD).text('Overconfidence Detection:');
doc
  .font(FONT_REGULAR)
  .text(
    'After ____ consecutive wins: ________________________________________'
  );

// SECTION 10
checkPageBreak();
drawSectionTitle('10', 'PERFORMANCE TRACKING');

// Helper for tracking section to avoid manual coordinate math
function drawTrackingSection(title, duration, items) {
  const startY = doc.y;

  // Title and Duration
  doc.font(FONT_BOLD).text(title, 50, startY);
  const titleWidth = doc.widthOfString(title);
  doc.font(FONT_REGULAR).text(duration, 50 + titleWidth + 10, startY);

  // Checkbox items - move to next line for clean layout
  let itemY = startY + 15;
  items.forEach((item, i) => {
    // 2 items per row
    const xCol = i % 2 === 0 ? 70 : 300;
    const yRow = itemY + Math.floor(i / 2) * 15;
    doc.text(item, xCol, yRow);
  });

  // Advance cursor for next section
  const rowCount = Math.ceil(items.length / 2);
  doc.y = itemY + rowCount * 15 + 10;
}

drawTrackingSection('DAILY:', '__ mins', [
  '[ ] Log all trades',
  '[ ] Calc daily R',
  '[ ] Note emotions',
]);

drawTrackingSection('WEEKLY:', '__ mins (Every ____day)', [
  '[ ] Calc weekly R',
  '[ ] Rule adherence score',
  '[ ] Next week setups',
  '[ ] Review journal',
]);

drawTrackingSection('MONTHLY:', '__ hours (First ____ of month)', [
  '[ ] Monthly R total',
  '[ ] Expectancy calc',
  '[ ] MAE/MFE analysis',
  '[ ] Strategy review',
  '[ ] Next month goals',
]);

drawTrackingSection('QUARTERLY:', '__ hours', [
  '[ ] Full strategy audit',
  '[ ] Major lessons',
  '[ ] Adjustments needed',
]);

doc.moveDown(1);

// SECTION 11
checkPageBreak();
drawSectionTitle('11', 'TOOLS & SYSTEMS');

const tools = [
  'Charting:',
  'Broker:',
  'Journal:',
  'Position Calculator:',
  'Portfolio Tracker:',
  'Command Center:',
];

tools.forEach((tool) => {
  doc.font(FONT_BOLD).text(tool, { continued: true });
  doc
    .font(FONT_REGULAR)
    .text(' __________________________________________________');
  doc.moveDown(0.5);
});

// SECTION 12
checkPageBreak();
drawSectionTitle('12', 'ACCOUNTABILITY');

doc.font(FONT_BOLD).text('Self-Accountability:');
doc
  .font(FONT_REGULAR)
  .text('- Daily honest journal: YES / NO      - Weekly self-review: YES / NO');
doc.moveDown(1);

doc.font(FONT_BOLD).text('External Accountability:');
doc
  .font(FONT_REGULAR)
  .text('- Mentor: ________________________ (Check-in: ________)');
doc.text('- Partner: _______________________ (Check-in: ________)');
doc.text('- Community: _____________________ (Check-in: ________)');

// SECTION 13
checkPageBreak();
drawSectionTitle('13', 'THE SACRED RULES');

const sacredRules = [
  'I risk 1-2% per trade maximum, always',
  'I place stops before entering, always',
  'I NEVER move stops further from entry',
  'I NEVER add to losing positions',
  'I respect my circuit breakers without exception',
  'I go flat if I hit my loss limits',
  'I complete my pre-trade checklist every time',
  'I journal every trade, win or loss',
  'I check portfolio heat before every new trade',
  'I measure success by process, not profit',
];

sacredRules.forEach((rule) => {
  drawCheckbox(rule);
});

doc.moveDown(2);

// COMMITMENT
checkPageBreak(200);

// Save Start Y for Box
const boxStartY = doc.y;
const boxHeight = 150;

doc
  .rect(50, boxStartY, 512, boxHeight)
  .strokeColor(COLORS.primaryDark)
  .lineWidth(2)
  .stroke();

const commitY = boxStartY + 25;

doc
  .font(FONT_BOLD)
  .fontSize(14)
  .fillColor(COLORS.primaryDark)
  .text('COMMITMENT', 50, commitY, { align: 'center', width: 512 });

doc.moveDown(1);

doc
  .font(FONT_ITALIC)
  .fontSize(11)
  .fillColor(COLORS.text)
  .text(
    'I, [YOUR NAME], commit to following this risk management plan with absolute discipline, regardless of emotion, market conditions, or recent results. I understand that this plan was created when I was rational, logical, and clear-headed. When I am emotional, THIS PLAN is my guide.',
    80,
    doc.y,
    { width: 452, align: 'center' }
  );

// Force cursor below box for Signature
doc.y = boxStartY + boxHeight + 20;

doc
  .font(FONT_BOLD)
  .fontSize(10)
  .text(
    'Signature: __________________________      Date: __________________________',
    { align: 'center' }
  );

// Finalize
doc.end();

console.log(`PDF written to ${OUTPUT_PATH}`);
