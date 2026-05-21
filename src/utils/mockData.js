// Mock response database for the ChatGPT-like chatbot
// Each mock response includes:
// - keywords: words to match in the user prompt
// - thought: step-by-step thinking process (reasoning)
// - content: the markdown/rich text response
// - thoughtTime: how long (in seconds) the thinking process lasted

export const MOCK_RESPONSES = [
  {
    id: 'greet',
    keywords: ['hi', 'hello', 'hey', 'greetings', 'morning', 'afternoon', 'evening'],
    thought: `User initiated contact with a greeting.
1. Recognize greeting intent.
2. Determine current context: New session.
3. Formulate a polite, warm welcome.
4. Briefly list key actions the user can take (file upload, asking questions, data analysis).
5. Ensure a friendly and helpful tone.`,
    thoughtTime: 0.8,
    content: `Hello! I am **Antigravity**, your AI assistant for aircraft analysis and engineering. 

How can I help you today? Here are a few things we can do:
- **Analyze flight telemetry** (Upload a CSV/JSON file)
- **Review aircraft maintenance logs** (Upload a PDF or document)
- **Compare aircraft specifications** (Ask about Boeing, Airbus, etc.)
- **Write code or calculations** (Python, React, aerodynamic formulas)

Feel free to type your question or drag and drop a file to get started!`
  },
  {
    id: 'aircraft-compare',
    keywords: ['compare', 'boeing', 'airbus', 'aircraft', 'specifications', 'plane'],
    thought: `User wants to compare aircraft models.
1. Identify primary aircraft comparison categories: Range, capacity, fuel efficiency, cruise speed.
2. Draft a comparison table comparing Boeing 787 Dreamliner vs Airbus A350.
3. Add details on efficiency, materials (carbon composites), and passenger comfort.
4. Format output using markdown tables and bullet points for maximum readability.
5. Review aerodynamic specifications.`,
    thoughtTime: 2.1,
    content: `Certainly! Here is a comparison of two leading wide-body commercial aircraft: the **Boeing 787-9 Dreamliner** and the **Airbus A350-900**.

### Technical Specifications Comparison

| Parameter | Boeing 787-9 | Airbus A350-900 |
| :--- | :--- | :--- |
| **Length** | 63.0 m | 66.8 m |
| **Wingspan** | 60.1 m | 64.7 m |
| **Typical Seating** | 296 passengers | 300 - 350 passengers |
| **Maximum Range** | 14,010 km (7,565 nmi) | 15,000 km (8,100 nmi) |
| **Cruise Speed** | Mach 0.85 (903 km/h) | Mach 0.85 (903 km/h) |
| **Max Takeoff Weight**| 252,650 kg | 280,000 kg |
| **Primary Engine** | GEnx-1B / Trent 1000 | Rolls-Royce Trent XWB |

### Key Differences & Insights

1. **Materials & Weight**: Both aircraft make extensive use of advanced carbon-fiber composites (about 50% for 787, 53% for A350) which reduces structural weight and increases fuel efficiency by ~20-25% compared to older aluminum generations.
2. **Cabin Altitude**: The 787 features a lower cabin altitude pressurization (6,000 ft instead of standard 8,000 ft) and higher humidity levels, reducing jetlag. The A350 offers a slightly wider cabin cross-section (by about 5 inches), providing extra shoulder room.
3. **Control Systems**: Airbus uses a flight-envelope protected **Fly-By-Wire (FBW)** sidestick layout, while Boeing uses a traditional yoke system but with computerized FBW backup interfaces.

Would you like to analyze a specific flight log or dive deeper into the engine parameters?`
  },
  {
    id: 'telemetry-csv',
    keywords: ['.csv', 'csv', 'spreadsheet', 'data', 'table', 'upload', 'telemetry'],
    thought: `User uploaded a CSV spreadsheet or asked for data analysis.
1. Parse mock CSV upload structure.
2. Formulate an analysis of typical flight data parameters: Altitude, Airspeed, Fuel Flow, Pitch, and Roll.
3. Highlight an anomaly: Notice a transient dip in Fuel Flow at T+450s during cruise climb.
4. Create a markdown table presenting flight phase statistics.
5. Conclude with recommended action points (e.g., inspecting fuel injector valves).`,
    thoughtTime: 3.4,
    content: `I've successfully parsed and analyzed the uploaded CSV file (**\`flight_telemetry_log_2026.csv\`**, 2.4 MB). 

### Flight Profile Summary

The log spans a duration of **02:14:35** (8,075 sample points) at a 1Hz sampling rate. Here are the flight phase breakdowns:

| Phase | Duration | Avg Fuel Flow | Max Altitude | Anomaly Flags |
| :--- | :--- | :--- | :--- | :--- |
| **Taxi & Takeoff** | 00:12:10 | 4.2 kg/s | 1,200 ft | None |
| **Climb** | 00:22:45 | 3.8 kg/s | 35,000 ft | None |
| **Cruise** | 01:28:15 | 2.1 kg/s | 37,000 ft | **1 (Transient Fuel Dip)** |
| **Descent & Landing**| 00:11:25 | 0.8 kg/s | 35,000 ft | None |

### Key Finding: Fuel System Anomaly
* **Timestamp**: \`01:04:12\` (T+3852s)
* **Description**: A sudden **14.2% drop in Fuel Flow** on Engine #2 lasting for 4.2 seconds while maintaining a constant throttle resolver angle (TRA) of 72°. 
* **Correlated Variables**: Exhaust Gas Temperature (EGT) dropped by 18°C, and Turbine Speed (N2) dipped slightly. 
* **Potential Root Causes**: Transient fuel manifold vapor lock, or a sticky Fuel Metering Valve (FMV) actuator solenoid.

### Recommended Action Items
1. Run a **diagnostic test** on the Engine #2 fuel control unit (FCU/HMU).
2. Check maintenance logs for active Fault Codes related to EGT sensors or fuel bypass valves.
3. Monitor Engine #2 transient response during the next ground run.

Would you like me to plot the Fuel Flow vs. Throttle Resolver Angle curve from this log?`
  },
  {
    id: 'maintenance-pdf',
    keywords: ['.pdf', 'pdf', 'document', 'report', 'maintenance', 'log', 'logbook'],
    thought: `User uploaded a PDF document containing maintenance reports.
1. Detect document type. Simulate analyzing a PDF regarding C-Check inspection.
2. Outline key components checked: Landing gear, wings structure, engines, avionics.
3. Summarize findings: Visual inspection showed micro-cracking in landing gear trunnion housing, within tolerance limits but requiring monitoring.
4. Draft a structured summary with bold callouts and code quotes.`,
    thoughtTime: 2.8,
    content: `I have analyzed the uploaded PDF maintenance report (**\`C-Check_Inspections_B737_N891.pdf\`**, 8.2 MB). 

Here is a summary of the compliance audits and physical inspection findings:

### 1. Structure & Airframe Inspection
* **Wing Spars**: Non-Destructive Testing (NDT) eddy current scans revealed **zero** fatigue cracks on the wing spars or attach fittings.
* **Fuselage Skin**: Detected minor surface corrosion around the aft galley door threshold (Zone 432). Removed, treated, and primed with zinc chromate.
* **Landing Gear**: Visual inspection identified light pitting on the shock strut piston. Cylinders are fully pressurized; no seal leaks detected.

### 2. Propulsion System (CFM56-7B)
* **Fan Blades**: Lubrication and visual inspection completed. Leading edge erosion is within operational limits.
* **Borescope Inspection**: Engine #1 combustor chamber shows normal heat distress. Engine #2 High Pressure Turbine (HPT) blade tips show minor thermal barrier coating (TBC) spallation (~1.5 cm²), scheduled for re-inspection in 500 flight hours.

### 3. Avionics & Electrical
* **Flight Control Computers**: Firmware updated to revision \`v4.92\`. Self-test passed.
* **Backup Battery**: Capacity test passed at **94.2%** health.

> [!WARNING]
> **Aft Galley Corrosion (Zone 432)** was noted as "remedied" but is a recurring issue. Consider replacing the door seals during the next A-Check to prevent moisture ingress.

Let me know if you would like me to draft a work order for the door seal replacement.`
  },
  {
    id: 'formula-calc',
    keywords: ['lift', 'drag', 'formula', 'calculation', 'physics', 'equation', 'aerodynamic'],
    thought: `User is asking for an aerodynamic calculation or formula (e.g. lift equation).
1. Recall the Lift Equation: L = 0.5 * rho * V^2 * S * Cl.
2. Define each variable clearly (density, velocity, surface area, lift coefficient).
3. Present the equation in clean LaTeX / Markdown format.
4. Write a simple mock calculation (e.g., Cessna 172 cruising).
5. Format code blocks beautifully.`,
    thoughtTime: 1.9,
    content: `Aerodynamic forces are essential for understanding aircraft performance. The foundational equation is the **Lift Equation**:

$$L = \\frac{1}{2} \\rho V^2 S C_L$$

Where:
* **$L$** = Lift force (in Newtons)
* **$\\rho$** (rho) = Air density (typically $1.225 \\text{ kg/m}^3$ at sea level)
* **$V$** = True airspeed of the aircraft (in m/s)
* **$S$** = Wing planform area (in $\\text{m}^2$)
* **$C_L$** = Coefficient of lift (a dimensionless number determined by the wing profile and angle of attack)

### Example Calculation: Cessna 172
Let's calculate the lift generated by a Cessna 172 cruising at sea level under the following parameters:
- **Velocity ($V$)**: $55 \\text{ m/s}$ (~107 knots)
- **Wing Area ($S$)**: $16.2 \\text{ m}^2$
- **Lift Coefficient ($C_L$)**: $0.45$
- **Air Density ($\\rho$)**: $1.225 \\text{ kg/m}^3$

\`\`\`javascript
// Calculation code implementation
const rho = 1.225; // kg/m^3
const V = 55;      // m/s
const S = 16.2;    // m^2
const Cl = 0.45;   // unitless

const lift = 0.5 * rho * Math.pow(V, 2) * S * Cl;
console.log(\`Generated Lift: \${lift.toFixed(2)} N\`);
// Output: Generated Lift: 13506.66 Newtons
\`\`\`

The aircraft generates **13,506.66 N** of lift, which balances its weight of roughly 1,300 kg (12,753 N force) allowing for a stable climb or level flight.

Would you like to calculate the Drag Force using the drag coefficient ($C_D$) next?`
  },
  {
    id: 'general-code',
    keywords: ['code', 'react', 'javascript', 'html', 'css', 'python', 'function'],
    thought: `User wants to write some code.
1. Draft a high-quality React hook or Python script related to aircraft mechanics.
2. I'll provide a Python class to compute ISA (International Standard Atmosphere) parameters given an altitude.
3. Keep the code clean, well-commented, and ready to use.
4. Add thoughts explaining the equations for temperature lapse rates.`,
    thoughtTime: 2.5,
    content: `Here is a Python script that implements the **International Standard Atmosphere (ISA)** model. It computes temperature, pressure, and density up to the tropopause ($11,000 \\text{ m}$ / $36,089 \\text{ ft}$).

\`\`\`python
def compute_isa_properties(altitude_m):
    """
    Computes International Standard Atmosphere (ISA) properties.
    Valid from sea level to 11,000 meters.
    
    :param altitude_m: Altitude in meters
    :return: dict with 'temperature_K', 'pressure_Pa', 'density_kg_m3'
    """
    # Sea-level constants
    T0 = 288.15      # Kelvin (15 C)
    P0 = 101325.0    # Pascals
    g = 9.80665      # m/s^2
    R = 287.05       # Specific gas constant for air J/(kg*K)
    L = -0.0065      # Temperature lapse rate K/m (-6.5 C per km)
    
    if altitude_m > 11000:
        raise ValueError("Altitude exceeds troposphere limit (11,000 m)")
        
    # Temperature at altitude
    T = T0 + L * altitude_m
    
    # Pressure formula for constant lapse rate (troposphere)
    P = P0 * (T / T0) ** (-g / (R * L))
    
    # Ideal gas law for density: rho = P / (R * T)
    rho = P / (R * T)
    
    return {
        "temperature_K": round(T, 2),
        "temperature_C": round(T - 273.15, 2),
        "pressure_Pa": round(P, 1),
        "density_kg_m3": round(rho, 4)
    }

# Example usage for cruising altitude of a regional jet (10,000m)
stats = compute_isa_properties(10000)
print(f"At 10,000m: {stats['temperature_C']}°C, {stats['pressure_Pa']} Pa, {stats['density_kg_m3']} kg/m³")
# Output: At 10,000m: -50.0°C, 26499.9 Pa, 0.4135 kg/m³
\`\`\`

### Key Highlights
* **Lapse Rate ($L$)**: The temperature drops at a constant rate of $-6.5^\\circ\\text{C}$ per 1000 meters.
* **Density Drop**: Notice that at 10,000 meters, the air density is only **$0.4135 \\text{ kg/m}^3$** (about 33% of sea level), requiring engines to spin faster and wings to travel faster to produce the same lift.

Would you like to extend this script to cover the stratosphere (above 11,000m)?`
  }
];

// Fallback response for unhandled prompts
export const getFallbackResponse = (userPrompt) => {
  const wordsCount = userPrompt ? userPrompt.trim().split(/\s+/).length : 0;
  return {
    id: `fallback-${Date.now()}`,
    keywords: [],
    thought: `User prompt did not trigger any preset aircraft-specific keywords.
1. Review user input: "${userPrompt || 'Empty text'}".
2. Recognize general conversation intent.
3. Formulate a detailed, context-aware answer matching the length and complexity of the user's input.
4. Show capabilities in aircraft data processing, standard engineering math, and code.
5. Provide a constructive, polite closing suggesting file uploads.`,
    thoughtTime: 2.3,
    content: `I've analyzed your prompt. Since we are in demonstration mode, I've processed your query using my core reasoning module.

You asked: *"${userPrompt || 'Hello'}"*

To explore the full capability of this chatbot interface:
1. **Try Uploading a File**: Click the attachment button in the chat box or drag-and-drop a file (CSV, PDF, Image, etc.) here. The system will auto-detect the file type and simulate custom diagnostic summaries.
2. **Try Aircraft Queries**: Type terms like **"compare"**, **"Boeing"**, or **"Airbus"** to see responsive data tables.
3. **Try Code/Calculations**: Type **"formula"** or **"code"** to see syntax-highlighted examples and calculations.

What specific aspect of aircraft analysis or software development can I assist you with right now?`
  };
};

export const getResponseForPrompt = (prompt, attachedFiles = []) => {
  const cleanPrompt = prompt.toLowerCase();
  
  // If there are files, check files first
  if (attachedFiles.length > 0) {
    const mainFile = attachedFiles[0];
    const extension = mainFile.name.split('.').pop().toLowerCase();
    
    if (['csv', 'xls', 'xlsx'].includes(extension)) {
      return MOCK_RESPONSES.find(r => r.id === 'telemetry-csv');
    }
    if (['pdf', 'doc', 'docx', 'txt'].includes(extension)) {
      return MOCK_RESPONSES.find(r => r.id === 'maintenance-pdf');
    }
  }
  
  // Keyword matching
  for (const resp of MOCK_RESPONSES) {
    if (resp.keywords.some(keyword => cleanPrompt.includes(keyword))) {
      return resp;
    }
  }
  
  return getFallbackResponse(prompt);
};
