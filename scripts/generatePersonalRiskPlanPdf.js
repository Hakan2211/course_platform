const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'downloads');
const OUTPUT_PATH = path.join(OUTPUT_DIR, 'personal-risk-management-plan.pdf');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const doc = new PDFDocument({
  size: 'LETTER',
  margin: 48,
});

doc.pipe(fs.createWriteStream(OUTPUT_PATH));

const content = `╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║            PERSONAL RISK MANAGEMENT PLAN                          ║
║                                                                   ║
║            Trader: [YOUR NAME]                                    ║
║            Date Created: [DATE]                                   ║
║            Trading Style: [SCALPER/DAY/SWING/POSITION]            ║
║            Version: 1.0                                           ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝

═══════════════════════════════════════════════════════════════════

SECTION 1: TRADING STYLE & PHILOSOPHY
═══════════════════════════════════

My Trading Style: ____________________

Why I chose this style:
_______________________________________________________
_______________________________________________________

My trading philosophy:
_______________________________________________________
_______________________________________________________

My Prime Directive:
  "My first job is to SURVIVE. Capital preservation above all.
   I will follow this plan regardless of emotion."

═══════════════════════════════════════════════════════════════════

SECTION 2: POSITION SIZING RULES
═══════════════════════════════════

ACCOUNT SIZE: $__________

BASE RISK PER TRADE: ____% = $______

Position Size Formula:
_______________________________________________________

Adjustments:
  • Volatility: [YES/NO] Method: ___________________
  • Setup Quality: A-grade ___% / B-grade ___% / C-grade ____%

Example Calculation:
  Account: $________
  Risk: ___% = $______
  Stop: ____ pips/points
  Position size: ________

═══════════════════════════════════════════════════════════════════

SECTION 3: STOP-LOSS ARCHITECTURE
═══════════════════════════════════

Primary Method: ____________________

Stop Distance Guidelines:
  • Calm market: ____ × ATR = ____ pips/points
  • Normal market: ____ × ATR = ____ pips/points
  • Volatile market: ____ × ATR = ____ pips/points

Technical Buffer: ____ pips/points beyond S/R

Trailing Stop Rules:
  • At +___R profit: Move to ___________________
  • At +___R profit: Trail by _________________
  • Maximum trail method: ____________________

NON-NEGOTIABLES:
  ☑ Stop placed BEFORE entry, always
  ☑ Stop NEVER moved further from entry
  ☑ Stop placed in market (not mental)

═══════════════════════════════════════════════════════════════════

SECTION 4: RISK-REWARD TARGETS
═══════════════════════════════════

Minimum Acceptable RR: 1:____

Target RR Range: 1:____ to 1:____

Scaling Out Strategy:
  • ____% at 1:____
  • ____% at 1:____
  • ____% trailing stop

═══════════════════════════════════════════════════════════════════

SECTION 5: PORTFOLIO HEAT & POSITION LIMITS
═══════════════════════════════════════════════

MAXIMUM SIMULTANEOUS POSITIONS: ____

MAXIMUM PORTFOLIO HEAT: ____%

Correlation Rules:
  • Max same-currency positions: ____
  • Max same-sector positions: ____
  • If correlation >0.7: [Action] ________________

Weekend Protocol:
  • Max weekend heat: ____%
  • Friday routine: _______________________________

═══════════════════════════════════════════════════════════════════

SECTION 6: CIRCUIT BREAKERS
═══════════════════════════════════

DAILY (if applicable):
  🛑 Max trades: ____
  🛑 Loss limit: ____% ($______) → STOP FOR DAY
  🛑 Consecutive losses: ____ → Take ____-min break

WEEKLY:
  🛑 Loss limit: ____% ($______) → STOP ADDING TRADES
  🎯 Target: +____ to +____R

MONTHLY:
  🛑 Loss at ____% → Reduce size 50%
  🛑 Loss at ____% → STOP LIVE TRADING
  🎯 Target: +____ to +____R

═══════════════════════════════════════════════════════════════════

SECTION 7: DRAWDOWN RESPONSE PROTOCOL
═══════════════════════════════════════

At -5% Drawdown:
  Action: ___________________________________________

At -10% Drawdown:
  Action: ___________________________________________

At -15% Drawdown:
  Action: ___________________________________________

At -20% Drawdown:
  Action: ___________________________________________

═══════════════════════════════════════════════════════════════════

SECTION 8: VOLATILITY REGIME ADAPTATION
═══════════════════════════════════════════

REGIME DETECTION:
  • Check daily: YES / NO
  • Tools: ATR ratio, VIX (if applicable)

REGIME-BASED PARAMETERS:

CALM (ATR <0.8×):
  Risk: ____%  Stops: ___× ATR  Max positions: ____

NORMAL (ATR 0.8-1.3×):
  Risk: ____%  Stops: ___× ATR  Max positions: ____

VOLATILE (ATR 1.3-2×):
  Risk: ____%  Stops: ___× ATR  Max positions: ____

CRISIS (ATR >2× or VIX >60):
  Action: ___________________________________________

═══════════════════════════════════════════════════════════════════

SECTION 9: PSYCHOLOGICAL PROTOCOLS
═══════════════════════════════════

Pre-Trade Checklist: YES / NO (Mandatory)

Emotional State Check: YES / NO
  Trade only when: Calm (6-7/10)
  Don't trade when: <5 or >8 on emotional scale

After-Loss Protocol:
  • 30-minute break: YES / NO
  • Journal immediately: YES / NO
  • Review rule adherence: YES / NO

Revenge Trading Prevention:
  Action: ___________________________________________

Overconfidence Detection:
  After ____ consecutive wins: ___________________

═══════════════════════════════════════════════════════════════════

SECTION 10: PERFORMANCE TRACKING
═══════════════════════════════════

DAILY (if applicable): ____ minutes
  ☐ Log all trades
  ☐ Calculate daily R
  ☐ Note emotions
  ☐ Rule violations?

WEEKLY: ____ minutes (every ____day)
  ☐ Calculate weekly R
  ☐ Rule adherence score
  ☐ Regime check
  ☐ Next week setups

MONTHLY: ____ hours (first ____ of month)
  ☐ Monthly R total
  ☐ Expectancy calculation
  ☐ MAE/MFE analysis
  ☐ Strategy review
  ☐ Next month goals

QUARTERLY: ____ hours
  ☐ Full strategy audit
  ☐ Major lessons
  ☐ Adjustments needed

═══════════════════════════════════════════════════════════════════

SECTION 11: TOOLS & SYSTEMS
═══════════════════════════════════

Charting: _____________________
Broker: _____________________
Journal: _____________________
Position Calculator: _____________________
Portfolio Tracker: _____________________
Command Center: _____________________

═══════════════════════════════════════════════════════════════════

SECTION 12: ACCOUNTABILITY
═══════════════════════════════════

Self-Accountability:
  • Daily honest journal: YES / NO
  • Weekly self-review: YES / NO

External Accountability:
  • Mentor: _________________ (Check-in: _______)
  • Trading partner: _________________ (_______)
  • Community: _________________ (_______)

═══════════════════════════════════════════════════════════════════

SECTION 13: THE SACRED RULES (I WILL NOT VIOLATE)
═══════════════════════════════════════════════════

  ☑ I risk 1-2% per trade maximum, always
  ☑ I place stops before entering, always
  ☑ I NEVER move stops further from entry
  ☑ I NEVER add to losing positions
  ☑ I respect my circuit breakers without exception
  ☑ I go flat if I hit my loss limits
  ☑ I complete my pre-trade checklist every time
  ☑ I journal every trade, win or loss
  ☑ I check portfolio heat before every new trade
  ☑ I measure success by process, not profit

═══════════════════════════════════════════════════════════════════

COMMITMENT
═══════════════════════════════════

I, [YOUR NAME], commit to following this risk management plan
with absolute discipline, regardless of emotion, market conditions,
or recent results.

I understand that this plan was created when I was rational,
logical, and clear-headed.

When I am emotional, afraid, greedy, or desperate, THIS PLAN
is my guide. I will defer to these rules over my feelings.

My success depends not on being right about markets, but on
following this system with unwavering consistency.

Signature: _____________________

Date: _____________________
`;

doc.font('Courier').fontSize(10).text(content, {
  align: 'left',
  lineGap: 4,
});

doc.end();

console.log(`PDF written to ${OUTPUT_PATH}`);
