import React, { useState, useEffect, useCallback } from 'react';
import { LogIn, Shield, Globe, Users, Target, Briefcase, MessageSquare, X, CheckCircle, AlertCircle, Lock, Key, User, Settings, Zap, Compass, DollarSign, BookOpen, Clock, BarChart, Bell, ChevronRight, LayoutDashboard, Command, HardDrive, ScrollText, Binary, Fingerprint, ScanEye, Network, LogOut, Phone, MapPin, TrendingUp, TrendingDown, GitFork, UserX, FlaskConical, CircleDot, FileText, ClipboardList, Megaphone, Scale, Vault, FolderOpen, FileWarning, Search, PlusCircle, PenTool, Swords, Plane, Handshake, Info, TrendingUpIcon, TrendingDownIcon, Eye } from 'lucide-react';

// --- Utility Components ---

// A simple Modal component for secure communication or alerts
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-red-700 rounded-lg shadow-xl max-w-lg w-full p-6 relative">
        <div className="flex justify-between items-center pb-3 border-b border-gray-700">
          <h2 className="text-xl font-bold text-red-400">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="py-4 text-gray-200">
          {children}
        </div>
        <div className="pt-4 border-t border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-800 transition-colors shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Data Simulation (Initial State) ---
const initialSimulatedData = {
  users: [
    { username: 'president', password: 'secureKontur123!', securityCode: '98765', role: 'President', clearance_level: 1 },
    // Merged FSB Director and Internal Affairs Minister into one role: Internal Affairs Minister
    { username: 'internal_minister', password: 'intMinSecure!', securityCode: '66778', role: 'Internal Affairs Minister', clearance_level: 1 },
    { username: 'defense_minister', password: 'defMinSecure!', securityCode: '33445', role: 'Minister of Defense', clearance_level: 2 },
    { username: 'foreign_minister', password: 'forMinSecure!', securityCode: '99001', role: 'Minister of Foreign Affairs', clearance_level: 2 },
    { username: 'finance_minister', password: 'finMinSecure!', securityCode: '22334', role: 'Minister of Finance', clearance_level: 2 },
    { username: 'advisor_ops', password: 'opsAdvisor!', securityCode: '55667', role: 'Advisor / Special Ops', clearance_level: 3 },
  ],
  threats: [
    { id: 1, origin: 'NATO Cyber Command', type: 'Cyber Offensive', severity: 'Critical', status: 'Active', details: 'Large-scale DDoS and infiltration attempts detected on critical infrastructure networks. Source tracing ongoing.', coordinates: [52.52, 13.40], impact: 'National Infrastructure' },
    { id: 2, origin: 'Internal Dissident Cell', type: 'Information Leak', severity: 'High', status: 'Monitoring', details: 'Encrypted communications intercepted. Potential leak of classified defense plans. Location pinpointing in progress.', coordinates: [55.75, 37.61], impact: 'National Security' },
    { id: 3, origin: 'Rogue State Actor (Simulated)', type: 'WMD Proliferation', severity: 'Critical', status: 'Confirmed', details: 'Satellite imagery confirms illicit enrichment activities. Urgent diplomatic and covert responses being prepared.', coordinates: [33.51, 36.27], impact: 'Global Stability' },
    { id: 4, origin: 'Economic Sabotage (Foreign)', type: 'Market Manipulation', severity: 'Medium', status: 'Detected', details: 'Unusual trading patterns observed in key commodity markets, likely foreign-orchestrated to destabilize.', coordinates: [40.71, -74.00], impact: 'National Economy' },
    { id: 5, origin: 'Natural Disaster (Simulated)', type: 'Seismic Activity', severity: 'High', status: 'Imminent', details: 'High probability of major seismic event in Far East region within 48 hours. Emergency response units on standby.', coordinates: [43.11, 131.87], impact: 'Regional Stability' },
  ],
  orders: [
    { id: 1, title: 'Deploy Cyber Defense Unit', status: 'Active', assigned_to: 'Cyber Warfare Division 7', priority: 'High', deadline: '2025-07-16 23:59 UTC' },
    { id: 2, title: 'Investigate Minister Smirnov', status: 'Ongoing', assigned_to: 'FSB Counter-Intel', priority: 'Critical', deadline: '2025-07-20' },
    { id: 3, title: 'Prepare for Arctic Resource Extraction', status: 'Planning', assigned_to: 'Initiative Polar Star', priority: 'Medium', deadline: '2025-08-01' },
  ],
  auditLog: [
    { id: 1, timestamp: '2025-07-15 10:00:00 UTC', type: 'SYSTEM', event: 'Integrity Check Initiated', details: 'Automated system integrity scan completed with 98% integrity.', user: 'SYSTEM', linked_docs: [] },
    { id: 2, timestamp: '2025-07-15 10:01:30 UTC', type: 'SECURITY', event: 'Unauthorized Access Attempt', details: 'Failed login attempt from external IP 192.168.1.100. Credentials: admin/incorrectpass/12345.', user: 'UNKNOWN', linked_docs: [] },
    { id: 3, timestamp: '2025-07-15 10:02:15 UTC', type: 'SYSTEM', event: 'Threat Level Update', details: 'Threat level elevated to AMBER due to increased cyber activity.', user: 'SYSTEM', linked_docs: [] },
  ],
  battlePlans: [
    { id: 1, title: 'Western Front Counter-Offensive Plan Alpha', status: 'Draft', access: ['Minister of Defense', 'President'], details: 'Detailed plan for reclaiming territory in the Western Front. Requires significant troop reallocation.', last_modified: '2025-07-14', roll_result: null, effectiveness: null, linked_docs: [] },
    { id: 2, title: 'Arctic Defense Strategy 2025', status: 'Approved', access: ['Minister of Defense', 'President', 'Internal Affairs Minister'], details: 'Long-term strategy for securing Arctic resources and maritime routes.', last_modified: '2025-06-01', roll_result: null, effectiveness: null, linked_docs: [] },
  ],
  fsbOps: [
    { id: 1, name: 'Operation "Clean Sweep"', type: 'Internal Purge', status: 'Active', target: 'Corrupt Officials in Ministry of Health', risk: 'Medium', progress: 40, access: ['Internal Affairs Minister', 'President'], roll_result: null, effectiveness: null, linked_docs: [] },
    { id: 2, name: 'Project "Night Owl"', type: 'Foreign Espionage', status: 'Ongoing', target: 'Western Intelligence Networks', risk: 'High', progress: 75, access: ['Internal Affairs Minister', 'President'], roll_result: null, effectiveness: null, linked_docs: [] },
  ],
  foreignOps: [
    { id: 1, name: 'Diplomatic Pressure on Baltic States', type: 'Covert Diplomacy', status: 'Active', target: 'EU Cohesion', effectiveness: 60, access: ['Minister of Foreign Affairs', 'Internal Affairs Minister', 'President'], roll_result: null, linked_docs: [] },
    { id: 2, name: 'Disinformation Campaign: "Unity"', type: 'Disinformation', status: 'Planning', target: 'Domestic Opposition', effectiveness: 0, access: ['Minister of Foreign Affairs', 'Internal Affairs Minister', 'President'], roll_result: null, linked_docs: [] },
  ],
  propagandaProjects: [
    { id: 1, name: 'National Unity Campaign', effectiveness: 75, target_audience: 'General Public', region: 'All', status: 'Active', budget: '100M RUB', roll_result: null, linked_docs: [] },
    { id: 2, name: 'Economic Prosperity Narrative', effectiveness: 50, target_audience: 'Business Sector', region: 'Major Cities', status: 'Ongoing', budget: '50M RUB', roll_result: null, linked_docs: [] },
  ],
  blackBudget: {
    available_funds: 12500000000,
    allocations: [
      { id: 1, project: 'Project "Shadow Fall"', amount: 500000000, approved_by: 'president', timestamp: '2025-07-15 10:00:00 UTC', linked_docs: [] },
      { id: 2, project: 'Operation "Iron Curtain"', amount: 200000000, approved_by: 'internal_minister', timestamp: '2025-07-15 10:00:00 UTC', linked_docs: [] },
    ]
  },
  corruptionLevels: {
    Budget: { level: 3, status: 'Reduced Efficiency', last_audit_roll: null, last_audit_effectiveness: null }, // 1-5 scale, 5 being highest corruption
    Economy: { level: 2, status: 'Minor Inefficiencies', last_audit_roll: null, last_audit_effectiveness: null },
    Safety: { level: 1, status: 'Optimal Efficiency (Minor Buff)', last_audit_roll: null, last_audit_effectiveness: null },
    Growth: { level: 4, status: 'Significant Obstacles', last_audit_roll: null, last_audit_effectiveness: null },
  },
  classifiedArchives: [
    { id: 'REPORT-001', title: 'Report on Foreign Interference in Elections 2024', redacted_title: 'Report on Foreign Interference in Elections XXXX', date: '2024-12-01', classification: 'Presidential', tags: ['Presidential', 'Intelligence'], summary: 'Detailed analysis of foreign attempts to influence recent elections.', full_text: 'Full classified text of report...', redacted_text: 'Full classified text of report... [REDACTED SECTION]', hidden_from_president: false, internal_affairs_only: false, access_code: null, access_expires: null },
    { id: 'FSB-OP-002', title: 'FSB Internal Purge Protocol "Viper"', redacted_title: 'FSB Internal Purge Protocol "XXXXX"', date: '2023-03-15', classification: 'Internal Affairs ONLY', tags: ['Internal Affairs ONLY', 'Internal Security'], summary: 'Operational guidelines for neutralizing internal threats to state security.', full_text: 'Full classified text of protocol...', redacted_text: 'Full classified text of protocol... [REDACTED SECTION]', hidden_from_president: false, internal_affairs_only: true, access_code: null, access_expires: null },
    { id: 'PROJECT-003', title: 'Project "Deep State" - Asset List', redacted_title: 'Project "Deep State" - Asset List [CLASSIFIED]', date: '2022-07-20', classification: 'TOP SECRET', tags: ['Internal Affairs ONLY', 'Covert Ops'], summary: 'List of highly sensitive assets within foreign governments.', full_text: 'Full classified text of asset list...', redacted_text: 'Full classified text of asset list... [REDACTED SECTION]', hidden_from_president: true, internal_affairs_only: true, access_code: null, access_expires: null },
    { id: 'REPORT-004', title: 'Declassified Report on Agricultural Output 2020', redacted_title: 'Declassified Report on Agricultural Output 2020', date: '2021-01-10', classification: 'Declassified', tags: ['Declassified', 'Economy'], summary: 'Overview of agricultural production and distribution for 2020.', full_text: 'Full declassified text of report.', redacted_text: 'Full declassified text of report.', hidden_from_president: false, internal_affairs_only: false, access_code: null, access_expires: null },
  ],
  systemStatus: {
    integrity: 98, // Percentage
    airGapActive: true,
    lastAudit: '2025-07-14 03:00 UTC',
    threatLevel: 'Amber', // Green, Amber, Red
    lastGlobalAuditTimestamp: null, // New: To track global audit cooldown
  },
  lastLeakDate: null, // To track when the last leak occurred
  // New: Document request system
  documentRequests: [], // { docId: 'REPORT-001', requesterUsername: 'advisor_ops', status: 'pending' | 'approved' | 'denied', requestedTimestamp: '...', approvedBy: '', approvedTimestamp: '' }
};

// --- Helper Functions ---
const rollDice = (sides) => Math.floor(Math.random() * sides) + 1;

const generateAccessCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

const getUniversalOutcome = (roll) => {
  if (roll >= 90) return { success: true, description: "Critical Success: Achieved objectives with unforeseen positive side effects. Boost to national morale and international standing." };
  if (roll >= 70) return { success: true, description: "Major Success: Objectives achieved efficiently. Minimal collateral damage, positive impact on relevant metrics." };
  if (roll >= 51) return { success: true, description: "Moderate Success: Objectives mostly achieved, with minor unexpected complications or delays. Acceptable outcome." };
  if (roll >= 30) return { success: false, description: "Minor Failure: Objectives partially met, but significant obstacles or negative consequences emerged. Requires reassessment." };
  if (roll >= 10) return { success: false, description: "Major Failure: Objectives largely unmet. Significant negative repercussions, potential loss of assets or influence. Critical review needed." };
  return { success: false, description: "Catastrophic Failure: Complete failure of objectives, severe unintended consequences, and major losses. Immediate damage control required." };
};

const getDomesticCrisisEvent = (roll) => {
  if (roll >= 40) return "Public Protests: Widespread discontent over economic policies. Requires swift media intervention.";
  if (roll >= 30) return "Regional Instability: Localized civil unrest in a key industrial region. Disrupts supply chains.";
  if (roll >= 20) return "Cyber Attack on Civilian Infrastructure: Affects public services, causes widespread panic.";
  if (roll >= 10) return "Key Personnel Defection: A high-ranking official has defected, potentially leaking sensitive information.";
  return "Major Natural Disaster: Unforeseen environmental catastrophe impacting a major population center. Diverts significant resources.";
};

const calculateEffectiveness = (roll) => {
  if (roll >= 51) {
    // For successful rolls (51-100), effectiveness equals the roll
    return roll;
  } else {
    // For crisis/failure rolls (1-50), effectiveness is in a lower range (e.g., 10-50)
    // This ensures a minimum effectiveness even on low rolls, but caps it below success range
    return Math.max(10, Math.min(50, roll + 10));
  }
};

const getCorruptionStatus = (level) => {
  switch (level) {
    case 1: return 'Optimal Efficiency (Minor Buff)';
    case 2: return 'Minor Inefficiencies';
    case 3: return 'Reduced Efficiency';
    case 4: return 'Significant Obstacles';
    case 5: return 'Critical Dysfunction (Major Debuff)';
    default: return 'Unknown';
  }
};

// Moved getProgressColor to a global utility function
const getProgressColor = (progress) => {
  if (progress >= 80) return 'bg-green-600';
  if (progress >= 40) return 'bg-yellow-600';
  return 'bg-red-600';
};

const sendDiscordWebhook = (message) => {
  const webhookUrl = "https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN"; // Placeholder: Replace with your actual Discord webhook URL
  console.log(`[DISCORD WEBHOOK - SIMULATED] Sending message:\n${message}`);
  console.log(`[DISCORD WEBHOOK - SIMULATED] To URL: ${webhookUrl}`);
  // In a real application, you would use fetch:
  /*
  fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content: message }),
  })
  .then(response => {
    if (!response.ok) {
      console.error(`[DISCORD WEBHOOK] Failed to send message: ${response.statusText}`);
    }
  })
.catch(error => console.error('[DISCORD WEBHOOK] Error sending message:', error));
  */
};

// Custom hook for persistent state
const usePersistentState = (key, initialState) => {
  const [state, setState] = useState(() => {
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : initialState;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return initialState;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  }, [key, state]);

  return [state, setState];
};

// --- Roleplay Time Calculation ---
const REAL_WORLD_START_DATE_STR = "2025-07-16T17:45:00-07:00"; // July 16th, 5:45 PM PDT
const RP_START_DATE_STR = "2003-08-01T00:00:00+03:00"; // August 1st, 2003, Moscow time (UTC+3)

const getRoleplayTime = () => {
  const realWorldStartDate = new Date(REAL_WORLD_START_DATE_STR);
  const rpStartDate = new Date(RP_START_DATE_STR);
  const now = new Date();

  const elapsedRealWorldMs = now.getTime() - realWorldStartDate.getTime();
  const elapsedRealWorldDays = elapsedRealWorldMs / (1000 * 60 * 60 * 24);

  // 1 real-world day = 2 roleplay months
  const elapsedRpMonths = elapsedRealWorldDays * 2;

  // Calculate milliseconds for elapsed RP months
  // Average days in a month: 30.4375 (365.25 / 12)
  const avgDaysInRpMonth = 30.4375;
  const elapsedRpDays = elapsedRpMonths * avgDaysInRpMonth;
  const elapsedRpMs = elapsedRpDays * (1000 * 60 * 60 * 24);

  const currentRpTimeMs = rpStartDate.getTime() + elapsedRpMs;
  const currentRpDate = new Date(currentRpTimeMs);

  // Format to Moscow time (UTC+3)
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Europe/Moscow',
    hour12: false
  };
  return currentRpDate.toLocaleString('en-US', options) + ' MSK';
};


// --- Login Page Component ---
const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [securityCode, setSecurityCode] = useState(''); // Renamed from quantumKey
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate login delay and validation
    setTimeout(() => {
      const userFound = initialSimulatedData.users.find(
        user =>
          user.username === username &&
          user.password === password &&
          user.securityCode === securityCode // Changed to securityCode
      );

      if (userFound) {
        console.log(`[KONTUR] Access Granted for: ${userFound.username} (Role: ${userFound.role})`);
        onLogin(userFound); // Pass the entire user object
      } else {
        setError('Access Denied: Invalid credentials or security code. This incident will be logged.'); // Changed message
        console.warn(`[KONTUR] Failed login attempt for username: ${username}. Security Code: ${securityCode}.`); // Changed message
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 to-red-950 p-4">
      <div className="bg-gray-900 border border-red-800 rounded-xl shadow-2xl p-8 md:p-10 w-full max-w-md animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <Shield className="text-red-600 mb-4 animate-pulse-slow" size={64} />
          <h1 className="text-3xl md:text-4xl font-extrabold text-red-500 mb-2 tracking-wide text-center">Security Council of Russia</h1>
          <p className="text-gray-400 text-sm italic text-center">Executive Command Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-gray-300 text-sm font-semibold mb-2">
              Authorized Personnel ID
            </label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                id="username"
                className="w-full pl-10 pr-4 py-3 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 transition-all"
                placeholder="Enter ID"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="off"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-300 text-sm font-semibold mb-2">
              Encrypted Passphrase
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="password"
                id="password"
                className="w-full pl-10 pr-4 py-3 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 transition-all"
                placeholder="Enter passphrase"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="off"
              />
            </div>
          </div>

          <div>
            <label htmlFor="securityCode" className="block text-gray-300 text-sm font-semibold mb-2">
              Security Code Input (Simulated)
            </label>
            <div className="relative">
              <Key size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                id="securityCode"
                className="w-full pl-10 pr-4 py-3 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 transition-all"
                placeholder="Enter 5-digit code"
                maxLength="5"
                value={securityCode}
                onChange={(e) => setSecurityCode(e.target.value)}
                required
                autoComplete="off"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-900 bg-opacity-30 border border-red-700 text-red-300 px-4 py-3 rounded-lg flex items-center space-x-2">
              <AlertCircle size={20} />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className={`w-full py-3 rounded-lg font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-2
              ${loading ? 'bg-red-800 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl'}
            `}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <LogIn size={20} />
                <span>Access Portal</span>
              </>
            )}
          </button>
        </form>
        <p className="text-center text-gray-500 text-xs mt-6">
          All access attempts are logged and monitored. Unauthorized access is strictly prohibited.
        </p>
      </div>
    </div>
  );
};

// --- Main Layout Component ---
const MainLayout = ({ currentView, setView, onLogout, systemStatus, currentUser, simulatedData, setSimulatedData }) => {
  const [isSecureCommModalOpen, setIsSecureCommModalOpen] = useState(false);
  const [isLogoutConfirmModalOpen, setIsLogoutConfirmModalOpen] = useState(false); // New state for logout confirmation

  // Auto-logout timer
  const [lastActivity, setLastActivity] = useState(Date.now());
  const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutes

  const resetActivityTimer = useCallback(() => {
    setLastActivity(Date.now());
  }, []);

  useEffect(() => {
    const activityEvents = ['mousemove', 'keydown', 'click'];
    activityEvents.forEach(event => window.addEventListener(event, resetActivityTimer));

    const interval = setInterval(() => {
      if (Date.now() - lastActivity > INACTIVITY_TIMEOUT) {
        setIsLogoutConfirmModalOpen(true); // Open modal for inactivity logout
        // Auto-logout after 3 seconds if modal is shown for inactivity
        setTimeout(onLogout, 3000);
      }
    }, 5000); // Check every 5 seconds

    return () => {
      activityEvents.forEach(event => window.removeEventListener(event, resetActivityTimer));
      clearInterval(interval);
    };
  }, [lastActivity, onLogout, resetActivityTimer]);


  // Simulate audit logging
  useEffect(() => {
    console.log(`[AUDIT LOG] User accessed: ${currentView} (Role: ${currentUser.role}, Level: ${currentUser.clearance_level})`);
  }, [currentView, currentUser]);

  const getStatusColor = (level) => {
    switch (level) {
      case 'Green': return 'text-green-500';
      case 'Amber': return 'text-yellow-500';
      case 'Red': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  // Access control logic for sidebar navigation
  const canAccess = (requiredRoles, requiredLevel) => {
    if (currentUser.clearance_level === 1) return true; // President & Internal Affairs Minister have full access
    if (requiredLevel && currentUser.clearance_level > requiredLevel) return false;
    if (requiredRoles && !requiredRoles.includes(currentUser.role)) return false;
    return true;
  };

  return (
    <div className="flex min-h-screen bg-gray-950 text-gray-100 font-inter">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-gray-900 border-r border-red-900 flex flex-col p-6 shadow-xl">
        <div className="flex items-center mb-10">
          <Shield className="text-red-600 mr-3" size={32} />
          <h2 className="text-2xl font-bold text-red-500 tracking-wide leading-tight">Security Council of Russia</h2>
        </div>
        <nav className="flex-grow">
          <ul className="space-y-3">
            {canAccess(null, 1) && (
              <li>
                <button
                  onClick={() => setView('CommandRoom')}
                  className={`flex items-center w-full p-3 rounded-lg text-left transition-colors duration-200
                    ${currentView === 'CommandRoom' ? 'bg-red-700 text-white shadow-inner' : 'hover:bg-gray-800 text-gray-300'}
                  `}
                >
                  <LayoutDashboard size={20} className="mr-3" />
                  Command Room
                </button>
              </li>
            )}
            {canAccess(null, 1) && (
              <li>
                <button
                  onClick={() => setView('ClassifiedLogs')}
                  className={`flex items-center w-full p-3 rounded-lg text-left transition-colors duration-200
                    ${currentView === 'ClassifiedLogs' ? 'bg-red-700 text-white shadow-inner' : 'hover:bg-gray-800 text-gray-300'}
                  `}
                >
                  <FileText size={20} className="mr-3" />
                  Classified Logs
                </button>
              </li>
            )}
            {/* War Planning: Only Defense Minister and President */}
            {(currentUser.role === 'Minister of Defense' || currentUser.role === 'President') && (
              <li>
                <button
                  onClick={() => setView('WarPlanning')}
                  className={`flex items-center w-full p-3 rounded-lg text-left transition-colors duration-200
                    ${currentView === 'WarPlanning' ? 'bg-red-700 text-white shadow-inner' : 'hover:bg-gray-800 text-gray-300'}
                  `}
                >
                  <Swords size={20} className="mr-3" />
                  War Planning
                </button>
              </li>
            )}
            {canAccess(['President', 'Internal Affairs Minister'], 1) && (
              <li>
                <button
                  onClick={() => setView('FSBOps')}
                  className={`flex items-center w-full p-3 rounded-lg text-left transition-colors duration-200
                    ${currentView === 'FSBOps' ? 'bg-red-700 text-white shadow-inner' : 'hover:bg-gray-800 text-gray-300'}
                  `}
                >
                  <Eye size={20} className="mr-3" />
                  FSB / GRU Ops
                </button>
              </li>
            )}
            {canAccess(['President', 'Minister of Foreign Affairs', 'Internal Affairs Minister'], 2) && (
              <li>
                <button
                  onClick={() => setView('ForeignAffairsDestabilization')}
                  className={`flex items-center w-full p-3 rounded-lg text-left transition-colors duration-200
                    ${currentView === 'ForeignAffairsDestabilization' ? 'bg-red-700 text-white shadow-inner' : 'hover:bg-gray-800 text-gray-300'}
                  `}
                >
                  <Handshake size={20} className="mr-3" />
                  Foreign Affairs / Destabilization
                </button>
              </li>
            )}
            {canAccess(['President', 'Minister of Foreign Affairs'], 2) && (
              <li>
                <button
                  onClick={() => setView('PropagandaInfluence')}
                  className={`flex items-center w-full p-3 rounded-lg text-left transition-colors duration-200
                    ${currentView === 'PropagandaInfluence' ? 'bg-red-700 text-white shadow-inner' : 'hover:bg-gray-800 text-gray-300'}
                  `}
                >
                  <Megaphone size={20} className="mr-3" />
                  Propaganda & Influence
                </button>
              </li>
            )}
            {canAccess(['President', 'Minister of Finance', 'Internal Affairs Minister'], 2) && (
              <li>
                <button
                  onClick={() => setView('BlackBudget')}
                  className={`flex items-center w-full p-3 rounded-lg text-left transition-colors duration-200
                    ${currentView === 'BlackBudget' ? 'bg-red-700 text-white shadow-inner' : 'hover:bg-gray-800 text-gray-300'}
                  `}
                >
                  <DollarSign size={20} className="mr-3" />
                  Black Budget
                </button>
              </li>
            )}
            {/* Corruption Audit: Only President */}
            {currentUser.role === 'President' && (
              <li>
                <button
                  onClick={() => setView('CorruptionAudit')}
                  className={`flex items-center w-full p-3 rounded-lg text-left transition-colors duration-200
                    ${currentView === 'CorruptionAudit' ? 'bg-red-700 text-white shadow-inner' : 'hover:bg-gray-800 text-gray-300'}
                  `}
                >
                  <Scale size={20} className="mr-3" />
                  Corruption Audit
                </button>
              </li>
            )}
            {/* Classified Archives: Only President and Internal Affairs Minister */}
            {(currentUser.role === 'President' || currentUser.role === 'Internal Affairs Minister') && (
              <li>
                <button
                  onClick={() => setView('ClassifiedArchives')}
                  className={`flex items-center w-full p-3 rounded-lg text-left transition-colors duration-200
                    ${currentView === 'ClassifiedArchives' ? 'bg-red-700 text-white shadow-inner' : 'hover:bg-gray-800 text-gray-300'}
                  `}
                >
                  <FolderOpen size={20} className="mr-3" />
                  Classified Archives
                </button>
              </li>
            )}
             {/* For other users, they can still access Classified Archives through a different flow */}
             {!(currentUser.role === 'President' || currentUser.role === 'Internal Affairs Minister') && (
              <li>
                <button
                  onClick={() => setView('ClassifiedArchives')}
                  className={`flex items-center w-full p-3 rounded-lg text-left transition-colors duration-200
                    ${currentView === 'ClassifiedArchives' ? 'bg-red-700 text-white shadow-inner' : 'hover:bg-gray-800 text-gray-300'}
                  `}
                >
                  <FolderOpen size={20} className="mr-3" />
                  Classified Archives (Request Access)
                </button>
              </li>
            )}
          </ul>
        </nav>
        <div className="mt-auto pt-6 border-t border-gray-800">
          <div className="mb-3 text-gray-400 text-sm">
            Logged in as: <span className="font-semibold text-red-300">{currentUser.role} (Level {currentUser.clearance_level})</span>
          </div>
          <button
            onClick={() => setIsSecureCommModalOpen(true)}
            className="flex items-center w-full p-3 rounded-lg text-left bg-red-800 text-white hover:bg-red-700 transition-colors duration-200 mb-3 shadow-md"
          >
            <MessageSquare size={20} className="mr-3" />
            Secure Communication
          </button>
          <button
            onClick={() => setIsLogoutConfirmModalOpen(true)}
            className="flex items-center w-full p-3 rounded-lg text-left text-gray-400 hover:bg-gray-800 hover:text-red-400 transition-colors duration-200"
          >
            <LogOut size={20} className="mr-3" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-gray-900 border-b border-red-900 p-4 flex flex-col sm:flex-row justify-between items-center shadow-lg">
          <div className="flex items-center mb-2 sm:mb-0">
            <h1 className="text-xl font-semibold text-gray-100">
              {currentView === 'CommandRoom' && 'Command Room'}
              {currentView === 'ClassifiedLogs' && 'Classified Logs'}
              {currentView === 'WarPlanning' && 'War Planning'}
              {currentView === 'FSBOps' && 'FSB / GRU Operations'}
              {currentView === 'ForeignAffairsDestabilization' && 'Foreign Affairs / Destabilization'}
              {currentView === 'PropagandaInfluence' && 'Propaganda & Influence'}
              {currentView === 'BlackBudget' && 'Black Budget'}
              {currentView === 'CorruptionAudit' && 'Corruption Audit'}
              {currentView === 'ClassifiedArchives' && 'Classified Archives'}
            </h1>
            <ChevronRight size={18} className="text-gray-500 mx-2 hidden sm:block" />
            <span className="text-gray-400 text-sm hidden sm:block">Classified Access</span>
          </div>
          <div className="w-full sm:w-auto text-center sm:text-right text-red-400 font-bold text-sm bg-red-900 bg-opacity-20 p-2 rounded-md border border-red-700">
            ⚠️ UNAUTHORIZED ACCESS IS A VIOLATION OF STATE SECURITY LAW – ARTICLE 13
          </div>
          <div className="flex items-center space-x-4 mt-2 sm:mt-0">
            <div className="flex items-center text-sm">
              <Shield size={16} className="text-blue-400 mr-2" />
              <span className="font-medium">Integrity:</span>
              <span className="ml-1 text-blue-300">{systemStatus.integrity}%</span>
            </div>
            <div className="flex items-center text-sm">
              <Network size={16} className="text-green-400 mr-2" />
              <span className="font-medium">Air Gap:</span>
              <span className="ml-1 text-green-300" title="An 'Air Gap' refers to a security measure where one or more computers or networks are physically isolated from unsecured networks, such as the public internet or an unsecured local area network. This prevents unauthorized access or data breaches. In this portal, 'ACTIVE' means the system is operating under full physical isolation protocols.">ACTIVE</span>
            </div>
            <div className="flex items-center text-sm">
              <Zap size={16} className={`${getStatusColor(systemStatus.threatLevel)} mr-2`} />
              <span className="font-medium">Threat:</span>
              <span className={`ml-1 font-bold ${getStatusColor(systemStatus.threatLevel)}`}>{systemStatus.threatLevel.toUpperCase()}</span>
            </div>
            <div className="flex items-center text-sm text-gray-400">
              <Clock size={16} className="mr-2" />
              <span>{getRoleplayTime()}</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          {currentView === 'CommandRoom' && <CommandRoom data={simulatedData} currentUser={currentUser} />}
          {currentView === 'ClassifiedLogs' && <ClassifiedLogs data={simulatedData} currentUser={currentUser} setSimulatedData={setSimulatedData} />}
          {currentView === 'WarPlanning' && <WarPlanning data={simulatedData} currentUser={currentUser} setSimulatedData={setSimulatedData} />}
          {currentView === 'FSBOps' && <FSBOps data={simulatedData} currentUser={currentUser} setSimulatedData={setSimulatedData} />}
          {currentView === 'ForeignAffairsDestabilization' && <ForeignAffairsDestabilization data={simulatedData} currentUser={currentUser} setSimulatedData={setSimulatedData} />}
          {currentView === 'PropagandaInfluence' && <PropagandaInfluence data={simulatedData} currentUser={currentUser} setSimulatedData={setSimulatedData} />}
          {currentView === 'BlackBudget' && <BlackBudget data={simulatedData} currentUser={currentUser} setSimulatedData={setSimulatedData} />}
          {currentView === 'CorruptionAudit' && <CorruptionAudit data={simulatedData} currentUser={currentUser} setSimulatedData={setSimulatedData} />}
          {currentView === 'ClassifiedArchives' && <ClassifiedArchives data={simulatedData} currentUser={currentUser} setSimulatedData={setSimulatedData} />}
        </div>
      </main>

      {/* Secure Communication Modal */}
      <Modal
        isOpen={isSecureCommModalOpen}
        onClose={() => setIsSecureCommModalOpen(false)}
        title="Secure Communication Channel"
      >
        <p className="text-lg text-gray-300 mb-4">
          Initiate a highly encrypted, untraceable communication link with authorized personnel.
        </p>
        <div className="space-y-4">
          <div>
            <label htmlFor="recipient" className="block text-gray-400 text-sm font-semibold mb-2">Recipient</label>
            <select
              id="recipient"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              <option value="">Select Authorized Contact...</option>
              {initialSimulatedData.users.map(user => (
                <option key={user.username} value={user.username}>{user.username} ({user.role})</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="message" className="block text-gray-400 text-sm font-semibold mb-2">Message (End-to-End Encrypted)</label>
            <textarea
              id="message"
              rows="5"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="Enter classified message..."
            ></textarea>
          </div>
          <div className="flex items-center text-green-400">
            <CheckCircle size={20} className="mr-2" />
            <span className="text-sm">Quantum Encryption Protocol Active</span>
          </div>
          <button className="w-full py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-md">
            Transmit Secure Message
          </button>
        </div>
      </Modal>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={isLogoutConfirmModalOpen}
        onClose={() => setIsLogoutConfirmModalOpen(false)}
        title="Confirm Logout"
      >
        <p className="text-lg text-gray-300 mb-4">
          WARNING: Initiating logout. All active sessions will be terminated. Are you sure you want to proceed?
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setIsLogoutConfirmModalOpen(false)}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors shadow-md"
          >
            Cancel
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-800 transition-colors shadow-md"
          >
            Confirm Logout
          </button>
        </div>
      </Modal>
    </div>
  );
};

// --- Module Components ---

const CommandRoom = ({ data, currentUser }) => {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical': return 'bg-red-800 text-red-100';
      case 'High': return 'bg-orange-700 text-orange-100';
      case 'Medium': return 'bg-yellow-600 text-yellow-100';
      case 'Low': return 'bg-green-700 text-green-100';
      default: return 'bg-gray-700 text-gray-100';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      <div className="lg:col-span-2 bg-gray-900 border border-red-900 rounded-xl p-6 shadow-lg flex flex-col">
        <h2 className="text-2xl font-bold text-red-400 mb-5 flex items-center">
          <LayoutDashboard size={24} className="mr-3" /> Executive Dashboard
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2 flex items-center"><Zap size={20} className="mr-2 text-red-400" /> Current Threats</h3>
            {data.threats.slice(0, 2).map(threat => (
              <p key={threat.id} className="text-gray-300 text-sm mb-1">
                <span className={`font-bold ${getSeverityColor(threat.severity).split(' ')[1]}`}>{threat.severity}:</span> {threat.origin} - {threat.type}
              </p>
            ))}
            <button className="mt-3 px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-800 text-sm">Review All Threats</button>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2 flex items-center"><ClipboardList size={20} className="mr-2 text-blue-400" /> Active Orders</h3>
            {data.orders.slice(0, 2).map(order => (
              <p key={order.id} className="text-gray-300 text-sm mb-1">
                <span className="font-bold text-yellow-400">{order.status}:</span> {order.title} ({order.assigned_to})
              </p>
            ))}
            <button className="mt-3 px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 text-sm">Review Active Orders</button>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-red-900 rounded-xl p-6 shadow-lg flex flex-col">
        <h2 className="text-2xl font-bold text-red-400 mb-5 flex items-center">
          <Info size={24} className="mr-3" /> System Overview
        </h2>
        <div className="space-y-4">
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2 flex items-center"><Shield size={20} className="mr-2 text-green-400" /> Integrity Status</h3>
            <p className="text-gray-300 text-xl font-bold">{data.systemStatus.integrity}%</p>
            <p className="text-gray-400 text-sm">Last Audit: {data.systemStatus.lastAudit}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2 flex items-center"><Network size={20} className="mr-2 text-blue-400" /> Air Gap Status</h3>
            <p className="text-gray-300 text-xl font-bold">{data.systemStatus.airGapActive ? 'ACTIVE' : 'INACTIVE'}</p>
            <p className="text-gray-400 text-sm">Network Isolation: Operational</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2 flex items-center"><Clock size={20} className="mr-2 text-yellow-400" /> Current Time</h3>
            <p className="text-gray-300 text-xl font-bold">{getRoleplayTime()}</p>
            <p className="text-gray-400 text-sm">{new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ClassifiedLogs = ({ data, currentUser, setSimulatedData }) => {
  const [logActionType, setLogActionType] = useState('');
  const [logActionDetails, setLogActionDetails] = useState('');
  const [logLinkedDocs, setLogLinkedDocs] = useState('');

  const handleLogNewAction = () => {
    if (logActionType && logActionDetails) {
      const newLogEntry = {
        id: data.auditLog.length + 1,
        timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
        type: 'USER_ACTION',
        event: logActionType,
        details: logActionDetails,
        user: currentUser.username,
        linked_docs: logLinkedDocs.split(',').map(link => link.trim()).filter(link => link !== ''),
      };
      setSimulatedData(prev => ({
        ...prev,
        auditLog: [...prev.auditLog, newLogEntry]
      }));
      setLogActionType('');
      setLogActionDetails('');
      setLogLinkedDocs('');
      alert('New action logged successfully!');
      console.log('[KONTUR] New action logged:', newLogEntry);
    } else {
      alert('Please fill in both action type and details.');
    }
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'SYSTEM': return 'text-blue-400';
      case 'SECURITY': return 'text-red-400';
      case 'USER_ACTION': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const canLogAction = currentUser.clearance_level <= 2; // Only Level 1 and 2 can log actions

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      <div className="lg:col-span-2 bg-gray-900 border border-red-900 rounded-xl p-6 shadow-lg flex flex-col">
        <h2 className="text-2xl font-bold text-red-400 mb-5 flex items-center">
          <FileText size={24} className="mr-3" /> Executive Decision & Audit Log
        </h2>
        <p className="text-gray-300 mb-4">
          Comprehensive record of all system events, intelligence actions, and high-level executive directives.
        </p>
        <div className="flex-grow overflow-y-auto pr-2">
          {data.auditLog.slice().reverse().map(log => (
            <div key={log.id} className="mb-3 p-3 rounded-lg bg-gray-800 border border-gray-700">
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-400 text-xs">{log.timestamp}</span>
                <span className={`text-xs font-semibold ${getEventTypeColor(log.type)}`}>{log.type}</span>
              </div>
              <h3 className="text-lg font-semibold text-white">{log.event}</h3>
              <p className="text-gray-300 text-sm">{log.details}</p>
              {log.linked_docs && log.linked_docs.length > 0 && (
                <div className="mt-2">
                  <p className="text-gray-400 text-xs font-semibold">Linked Documents:</p>
                  <ul className="list-disc list-inside text-gray-300 text-xs">
                    {log.linked_docs.map((docLink, index) => (
                      <li key={index}><a href={docLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{docLink}</a></li>
                    ))}
                  </ul>
                </div>
              )}
              <p className="text-gray-400 text-xs italic">User: {log.user}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-900 border border-red-900 rounded-xl p-6 shadow-lg flex flex-col">
        <h2 className="text-2xl font-bold text-red-400 mb-5 flex items-center">
          <PlusCircle size={24} className="mr-3" /> Log New Action
        </h2>
        {canLogAction ? (
          <>
            <p className="text-gray-300 mb-4">
              Record a new secret executive decision, covert operation, or intelligence action.
            </p>
            <input
              type="text"
              placeholder="Action Type (e.g., Covert Op Approval, Policy Directive)"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-600 mb-3"
              value={logActionType}
              onChange={(e) => setLogActionType(e.target.value)}
            />
            <textarea
              rows="4"
              placeholder="Detailed description of the action..."
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-600 mb-3"
              value={logActionDetails}
              onChange={(e) => setLogActionDetails(e.target.value)}
            ></textarea>
            <input
              type="text"
              placeholder="Linked Document URLs (comma-separated)"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-600 mb-4"
              value={logLinkedDocs}
              onChange={(e) => setLogLinkedDocs(e.target.value)}
            />
            <button
              onClick={handleLogNewAction}
              className="w-full py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-md"
            >
              <PenTool size={20} className="inline-block mr-2" /> Log New Action
            </button>
          </>
        ) : (
          <p className="text-red-400 text-lg italic text-center py-10">
            Access Denied: Insufficient clearance to log new actions.
          </p>
        )}
      </div>
    </div>
  );
};

const WarPlanning = ({ data, currentUser, setSimulatedData }) => {
  const [newPlanTitle, setNewPlanTitle] = useState('');
  const [newPlanDetails, setNewPlanDetails] = useState('');
  const [newPlanLinkedDocs, setNewPlanLinkedDocs] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleCreateBattlePlan = () => {
    if (newPlanTitle && newPlanDetails) {
      const roll = rollDice(100);
      let outcomeDescription;
      let effectiveness = calculateEffectiveness(roll);

      if (roll <= 50) {
        outcomeDescription = `Domestic Crisis Event (Roll: ${roll}): ${getDomesticCrisisEvent(roll)}`;
      } else {
        const outcome = getUniversalOutcome(roll);
        outcomeDescription = `Universal Outcome (Roll: ${roll}): ${outcome.description}`;
      }

      const newPlan = {
        id: data.battlePlans.length + 1,
        title: newPlanTitle,
        status: 'Draft',
        access: ['Minister of Defense', 'President'], // Updated access
        details: newPlanDetails,
        last_modified: new Date().toISOString().slice(0, 10),
        roll_result: outcomeDescription,
        effectiveness: effectiveness,
        linked_docs: newPlanLinkedDocs.split(',').map(link => link.trim()).filter(link => link !== ''),
      };

      setSimulatedData(prev => ({
        ...prev,
        battlePlans: [...prev.battlePlans, newPlan],
        auditLog: [...prev.auditLog, {
          id: prev.auditLog.length + 1,
          timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
          type: 'USER_ACTION',
          event: 'Battle Plan Created',
          details: `Battle Plan "${newPlanTitle}" created. Roll: ${roll}. Outcome: ${outcomeDescription}. Effectiveness: ${effectiveness}%. Linked Docs: ${newPlanLinkedDocs}`,
          user: currentUser.username,
        }]
      }));

      alert(`Battle Plan "${newPlanTitle}" created!\nOutcome: ${outcomeDescription}\nEffectiveness: ${effectiveness}%`);
      sendDiscordWebhook(`✅ Battle Plan "${newPlanTitle}" has been created with ${effectiveness}% efficiency. Outcome: ${outcomeDescription}`);

      setNewPlanTitle('');
      setNewPlanDetails('');
      setNewPlanLinkedDocs('');
    } else {
      alert('Please fill in title and details for the battle plan.');
    }
  };

  const canViewPlan = (plan) => {
    if (currentUser.role === 'President' || currentUser.role === 'Minister of Defense') return true;
    return false; // Only President and Defense Minister can view
  };

  const canCreatePlan = currentUser.role === 'President' || currentUser.role === 'Minister of Defense'; // Only President and Defense Minister can create plans

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      <div className="lg:col-span-2 bg-gray-900 border border-red-900 rounded-xl p-6 shadow-lg flex flex-col">
        <h2 className="text-2xl font-bold text-red-400 mb-5 flex items-center">
          <Swords size={24} className="mr-3" /> Battle Plans & Troop Movements
        </h2>
        <p className="text-gray-300 mb-4">
          Submit and track classified battle plans and monitor opposition forces.
        </p>
        <div className="flex-grow overflow-y-auto pr-2">
          {data.battlePlans.map(plan => (
            <div key={plan.id} className="mb-4 p-4 rounded-lg bg-gray-800 border border-gray-700 cursor-pointer" onClick={() => setSelectedPlan(plan)}>
              <h3 className="text-lg font-semibold text-white">{plan.title}</h3>
              <p className="text-gray-400 text-sm">Status: {plan.status} | Last Modified: {plan.last_modified}</p>
              <p className="text-gray-400 text-xs italic">Access: {plan.access.join(', ')}</p>
            </div>
          ))}
        </div>
        {selectedPlan && (
          <div className="mt-6 pt-6 border-t border-gray-800">
            <h3 className="text-xl font-bold text-red-300 mb-3">Plan Details: {selectedPlan.title}</h3>
            {canViewPlan(selectedPlan) ? (
              <>
                <p className="text-gray-300 text-sm leading-relaxed mb-2">{selectedPlan.details}</p>
                {selectedPlan.roll_result && (
                  <p className="text-gray-300 text-sm mb-2">
                    <span className="font-bold">Outcome:</span> {selectedPlan.roll_result}
                  </p>
                )}
                {selectedPlan.effectiveness !== null && (
                  <p className="text-gray-300 text-sm mb-2">
                    <span className="font-bold">Effectiveness:</span> {selectedPlan.effectiveness}%
                  </p>
                )}
                {selectedPlan.linked_docs && selectedPlan.linked_docs.length > 0 && (
                  <div className="mt-2">
                    <p className="text-gray-400 text-sm font-semibold">Linked Documents:</p>
                    <ul className="list-disc list-inside text-gray-300 text-sm">
                      {selectedPlan.linked_docs.map((docLink, index) => (
                        <li key={index}><a href={docLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{docLink}</a></li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <p className="text-red-400 text-sm italic">Access Denied: Insufficient clearance to view full plan details.</p>
            )}
            <button
              onClick={() => setSelectedPlan(null)}
              className="mt-4 px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 transition-colors text-sm"
            >
              Close Details
            </button>
          </div>
        )}
      </div>

      <div className="bg-gray-900 border border-red-900 rounded-xl p-6 shadow-lg flex flex-col">
        <h2 className="text-2xl font-bold text-red-400 mb-5 flex items-center">
          <PlusCircle size={24} className="mr-3" /> Create Battle Plan
        </h2>
        {canCreatePlan ? (
          <>
            <p className="text-gray-300 mb-4">
              Draft a new classified battle plan for review by high command.
            </p>
            <input
              type="text"
              placeholder="Battle Plan Title"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-600 mb-3"
              value={newPlanTitle}
              onChange={(e) => setNewPlanTitle(e.target.value)}
            />
            <textarea
              rows="6"
              placeholder="Detailed battle plan, objectives, troop movements, etc."
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-600 mb-3"
              value={newPlanDetails}
              onChange={(e) => setNewPlanDetails(e.target.value)}
            ></textarea>
            <input
              type="text"
              placeholder="Linked Document URLs (comma-separated)"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-600 mb-4"
              value={newPlanLinkedDocs}
              onChange={(e) => setNewPlanLinkedDocs(e.target.value)}
            />
            <button
              onClick={handleCreateBattlePlan}
              className="w-full py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-md"
            >
              <PenTool size={20} className="inline-block mr-2" /> Create Battle Plan
            </button>
          </>
        ) : (
          <p className="text-red-400 text-lg italic text-center py-10">
            Access Denied: Insufficient clearance to create battle plans.
          </p>
        )}
      </div>
    </div>
  );
};

const FSBOps = ({ data, currentUser, setSimulatedData }) => {
  const [newOpName, setNewOpName] = useState('');
  const [newOpType, setNewOpType] = useState('Internal Purge');
  const [newOpTarget, setNewOpTarget] = useState('');
  const [newOpLinkedDocs, setNewOpLinkedDocs] = useState('');

  const handleStartNewOperation = () => {
    if (newOpName && newOpTarget) {
      const roll = rollDice(100);
      let outcomeDescription;
      let effectiveness = calculateEffectiveness(roll);

      if (roll <= 50) {
        outcomeDescription = `Domestic Crisis Event (Roll: ${roll}): ${getDomesticCrisisEvent(roll)}`;
      } else {
        const outcome = getUniversalOutcome(roll);
        outcomeDescription = `Universal Outcome (Roll: ${roll}): ${outcome.description}`;
      }

      const newOp = {
        id: data.fsbOps.length + 1,
        name: newOpName,
        type: newOpType,
        status: 'Planning',
        target: newOpTarget,
        risk: 'Medium', // Default
        progress: 0,
        access: ['Internal Affairs Minister', 'President'], // Updated access
        roll_result: outcomeDescription,
        effectiveness: effectiveness,
        linked_docs: newOpLinkedDocs.split(',').map(link => link.trim()).filter(link => link !== ''),
      };

      setSimulatedData(prev => ({
        ...prev,
        fsbOps: [...prev.fsbOps, newOp],
        auditLog: [...prev.auditLog, {
          id: prev.auditLog.length + 1,
          timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
          type: 'USER_ACTION',
          event: `FSB/GRU Op Started: ${newOpName}`,
          details: `Operation "${newOpName}" (${newOpType}) started. Roll: ${roll}. Outcome: ${outcomeDescription}. Effectiveness: ${effectiveness}%.`,
          user: currentUser.username,
          linked_docs: newOp.linked_docs,
        }]
      }));

      alert(`New FSB/GRU Operation "${newOpName}" started!\nOutcome: ${outcomeDescription}\nEffectiveness: ${effectiveness}%`);
      sendDiscordWebhook(`✅ FSB/GRU Operation "${newOpName}" has been started with ${effectiveness}% efficiency. Outcome: ${outcomeDescription}`);

      setNewOpName('');
      setNewOpType('Internal Purge');
      setNewOpTarget('');
      setNewOpLinkedDocs('');
    } else {
      alert('Please fill in operation name and target.');
    }
  };

  const canViewOp = (op) => {
    if (currentUser.clearance_level === 1) return true;
    return op.access.includes(currentUser.role);
  };

  const canStartOp = currentUser.clearance_level <= 1; // Only Level 1 can start FSB ops

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
      <div className="bg-gray-900 border border-red-900 rounded-xl p-6 shadow-lg flex flex-col">
        <h2 className="text-2xl font-bold text-red-400 mb-5 flex items-center">
          <Eye size={24} className="mr-3" /> Active FSB / GRU Operations
        </h2>
        <p className="text-gray-300 mb-4">
          Monitor and manage highly sensitive internal purges, foreign espionage, and black ops.
        </p>
        <div className="flex-grow overflow-y-auto pr-2">
          {data.fsbOps.map(op => (
            <div key={op.id} className="mb-3 p-3 rounded-lg bg-gray-800 border border-gray-700">
              <h3 className="text-lg font-semibold text-white">{op.name} ({op.type})</h3>
              {canViewOp(op) ? (
                <>
                  <p className="text-gray-400 text-sm">Target: {op.target} | Status: {op.status}</p>
                  <p className="text-gray-400 text-xs">Risk: {op.risk} | Progress: {op.progress}%</p>
                  {op.roll_result && (
                    <p className="text-gray-300 text-sm mb-2">
                      <span className="font-bold">Outcome:</span> {op.roll_result}
                    </p>
                  )}
                  {op.effectiveness !== null && (
                    <p className="text-gray-300 text-sm mb-2">
                      <span className="font-bold">Effectiveness:</span> {op.effectiveness}%
                    </p>
                  )}
                  {op.linked_docs && op.linked_docs.length > 0 && (
                    <div className="mt-2">
                      <p className="text-gray-400 text-xs font-semibold">Linked Documents:</p>
                      <ul className="list-disc list-inside text-gray-300 text-xs">
                        {op.linked_docs.map((docLink, index) => (
                          <li key={index}><a href={docLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{docLink}</a></li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
                      <div className={`${getProgressColor(op.progress)} h-2.5 rounded-full`} style={{width: `${op.progress}%`}}></div>
                  </div>
                </>
              ) : (
                <p className="text-red-400 text-sm italic">Access Denied: Insufficient clearance to view operation details.</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-900 border border-red-900 rounded-xl p-6 shadow-lg flex flex-col">
        <h2 className="text-2xl font-bold text-red-400 mb-5 flex items-center">
          <PlusCircle size={24} className="mr-3" /> Start New Operation
        </h2>
        {canStartOp ? (
          <>
            <p className="text-gray-300 mb-4">
              Initiate a new classified FSB or GRU operation.
            </p>
            <input
              type="text"
              placeholder="Operation Name (e.g., Project 'Viper')"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-600 mb-3"
              value={newOpName}
              onChange={(e) => setNewOpName(e.target.value)}
            />
            <select
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-600 mb-3"
              value={newOpType}
              onChange={(e) => setNewOpType(e.target.value)}
            >
              <option value="Internal Purge">Internal Purge</option>
              <option value="Foreign Espionage">Foreign Espionage</option>
              <option value="Black Op">Black Op</option>
            </select>
            <textarea
              rows="4"
              placeholder="Target or objective details..."
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-600 mb-3"
              value={newOpTarget}
              onChange={(e) => setNewOpTarget(e.target.value)}
            ></textarea>
            <input
              type="text"
              placeholder="Linked Document URLs (comma-separated)"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-600 mb-4"
              value={newOpLinkedDocs}
              onChange={(e) => setNewOpLinkedDocs(e.target.value)}
            />
            <button
              onClick={handleStartNewOperation}
              className="w-full py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-md"
            >
              <Zap size={20} className="inline-block mr-2" /> Start New Operation
            </button>
          </>
        ) : (
          <p className="text-red-400 text-lg italic text-center py-10">
            Access Denied: Insufficient clearance to start new operations.
          </p>
        )}
      </div>
    </div>
  );
};

const ForeignAffairsDestabilization = ({ data, currentUser, setSimulatedData }) => {
  const [newOpName, setNewOpName] = useState('');
  const [newOpType, setNewOpType] = useState('Covert Diplomacy');
  const [newOpTarget, setNewOpTarget] = useState('');
  const [newOpLinkedDocs, setNewOpLinkedDocs] = useState('');

  const handleLaunchForeignOp = () => {
    if (newOpName && newOpTarget) {
      const roll = rollDice(100);
      let outcomeDescription;
      let effectiveness = calculateEffectiveness(roll);

      const outcome = getUniversalOutcome(roll);
      outcomeDescription = `Universal Outcome (Roll: ${roll}): ${outcome.description}`;

      const newOp = {
        id: data.foreignOps.length + 1,
        name: newOpName,
        type: newOpType,
        status: 'Planning',
        target: newOpTarget,
        effectiveness: effectiveness,
        access: ['Minister of Foreign Affairs', 'Internal Affairs Minister', 'President'], // Updated access
        roll_result: outcomeDescription,
        linked_docs: newOpLinkedDocs.split(',').map(link => link.trim()).filter(link => link !== ''),
      };

      setSimulatedData(prev => ({
        ...prev,
        foreignOps: [...prev.foreignOps, newOp],
        auditLog: [...prev.auditLog, {
          id: prev.auditLog.length + 1,
          timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
          type: 'USER_ACTION',
          event: `Foreign Op Launched: ${newOpName}`,
          details: `Operation "${newOpName}" (${newOpType}) launched. Roll: ${roll}. Outcome: ${outcomeDescription}. Effectiveness: ${effectiveness}%.`,
          user: currentUser.username,
          linked_docs: newOp.linked_docs,
        }]
      }));

      alert(`New Foreign Operation "${newOpName}" launched!\nOutcome: ${outcomeDescription}\nEffectiveness: ${effectiveness}%`);
      sendDiscordWebhook(`✅ Foreign Operation "${newOpName}" has been launched with ${effectiveness}% efficiency. Outcome: ${outcomeDescription}`);

      setNewOpName('');
      setNewOpType('Covert Diplomacy');
      setNewOpTarget('');
      setNewOpLinkedDocs('');
    } else {
      alert('Please fill in operation name and target.');
    }
  };

  const canLaunchOp = currentUser.clearance_level <= 2 && (currentUser.role === 'Minister of Foreign Affairs' || currentUser.role === 'President' || currentUser.role === 'Internal Affairs Minister');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
      <div className="bg-gray-900 border border-red-900 rounded-xl p-6 shadow-lg flex flex-col">
        <h2 className="text-2xl font-bold text-red-400 mb-5 flex items-center">
          <Handshake size={24} className="mr-3" /> Active Foreign Operations
        </h2>
        <p className="text-gray-300 mb-4">
          Monitor and manage covert diplomacy, destabilization actions, and disinformation campaigns.
        </p>
        <div className="flex-grow overflow-y-auto pr-2">
          {data.foreignOps.map(op => (
            <div key={op.id} className="mb-3 p-3 rounded-lg bg-gray-800 border border-gray-700">
              <h3 className="text-lg font-semibold text-white">{op.name} ({op.type})</h3>
              {canLaunchOp ? ( // Assuming if they can launch, they can view details
                <>
                  <p className="text-gray-400 text-sm">Target: {op.target} | Status: {op.status}</p>
                  <p className="text-gray-400 text-xs">Effectiveness: {op.effectiveness}%</p>
                  {op.roll_result && (
                    <p className="text-gray-300 text-sm mb-2">
                      <span className="font-bold">Outcome:</span> {op.roll_result}
                    </p>
                  )}
                  {op.linked_docs && op.linked_docs.length > 0 && (
                    <div className="mt-2">
                      <p className="text-gray-400 text-xs font-semibold">Linked Documents:</p>
                      <ul className="list-disc list-inside text-gray-300 text-xs">
                        {op.linked_docs.map((docLink, index) => (
                          <li key={index}><a href={docLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{docLink}</a></li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-red-400 text-sm italic">Access Denied: Insufficient clearance to view operation details.</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-900 border border-red-900 rounded-xl p-6 shadow-lg flex flex-col">
        <h2 className="text-2xl font-bold text-red-400 mb-5 flex items-center">
          <PlusCircle size={24} className="mr-3" /> Launch New Foreign Operation
        </h2>
        {canLaunchOp ? (
          <>
            <p className="text-gray-300 mb-4">
              Initiate a new foreign affairs operation.
            </p>
            <input
              type="text"
              placeholder="Operation Name"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-600 mb-3"
              value={newOpName}
              onChange={(e) => setNewOpName(e.target.value)}
            />
            <select
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-600 mb-3"
              value={newOpType}
              onChange={(e) => setNewOpType(e.target.value)}
            >
              <option value="Covert Diplomacy">Covert Diplomacy</option>
              <option value="Destabilization">Destabilization</option>
              <option value="Disinformation Campaign">Disinformation Campaign</option>
            </select>
            <textarea
              rows="4"
              placeholder="Target region or objective details..."
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-600 mb-3"
              value={newOpTarget}
              onChange={(e) => setNewOpTarget(e.target.value)}
            ></textarea>
            <input
              type="text"
              placeholder="Linked Document URLs (comma-separated)"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-600 mb-4"
              value={newOpLinkedDocs}
              onChange={(e) => setNewOpLinkedDocs(e.target.value)}
            />
            <button
              onClick={handleLaunchForeignOp}
              className="w-full py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-md"
            >
              <Plane size={20} className="inline-block mr-2" /> Launch Foreign Op
            </button>
          </>
        ) : (
          <p className="text-red-400 text-lg italic text-center py-10">
            Access Denied: Insufficient clearance to launch foreign operations.
          </p>
        )}
      </div>
    </div>
  );
};

const PropagandaInfluence = ({ data, currentUser, setSimulatedData }) => {
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectAudience, setNewProjectAudience] = useState('');
  const [newProjectRegion, setNewProjectRegion] = useState('');
  const [newProjectLinkedDocs, setNewProjectLinkedDocs] = useState('');

  const handleCreatePropagandaProject = () => {
    if (newProjectName && newProjectAudience && newProjectRegion) {
      const roll = rollDice(100);
      let effectiveness = calculateEffectiveness(roll);

      const newProject = {
        id: data.propagandaProjects.length + 1,
        name: newProjectName,
        effectiveness: effectiveness,
        target_audience: newProjectAudience,
        region: newProjectRegion,
        status: 'Planning',
        budget: 'TBD',
        roll_result: `Initial Roll: ${roll}.`,
        linked_docs: newProjectLinkedDocs.split(',').map(link => link.trim()).filter(link => link !== ''),
      };

      setSimulatedData(prev => ({
        ...prev,
        propagandaProjects: [...prev.propagandaProjects, newProject],
        auditLog: [...prev.auditLog, {
          id: prev.auditLog.length + 1,
          timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
          type: 'USER_ACTION',
          event: `Propaganda Project Created: ${newProjectName}`,
          details: `Project "${newProjectName}" created. Initial Roll: ${roll}. Effectiveness: ${effectiveness}%.`,
          user: currentUser.username,
          linked_docs: newProject.linked_docs,
        }]
      }));

      alert(`New Propaganda Project "${newProjectName}" created!\nInitial Effectiveness: ${effectiveness}%`);
      sendDiscordWebhook(`✅ Propaganda Project "${newProjectName}" has been created with ${effectiveness}% efficiency.`);

      setNewProjectName('');
      setNewProjectAudience('');
      setNewProjectRegion('');
      setNewProjectLinkedDocs('');
    } else {
      alert('Please fill in all fields for the propaganda project.');
    }
  };

  const canCreateProject = currentUser.clearance_level <= 2 && (currentUser.role === 'Minister of Foreign Affairs' || currentUser.role === 'President');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
      <div className="bg-gray-900 border border-red-900 rounded-xl p-6 shadow-lg flex flex-col">
        <h2 className="text-2xl font-bold text-red-400 mb-5 flex items-center">
          <Megaphone size={24} className="mr-3" /> Active Propaganda Projects
        </h2>
        <p className="text-gray-300 mb-4">
          Launch and monitor domestic propaganda and psychological operations.
        </p>
        <div className="flex-grow overflow-y-auto pr-2">
          {data.propagandaProjects.map(project => (
            <div key={project.id} className="mb-3 p-3 rounded-lg bg-gray-800 border border-gray-700">
              <h3 className="text-lg font-semibold text-white">{project.name} ({project.type})</h3>
              {canCreateProject ? ( // Assuming if they can create, they can view details
                <>
                  <p className="text-gray-400 text-sm">Audience: {project.target_audience} | Region: {project.region}</p>
                  <p className="text-gray-400 text-xs">Status: {project.status} | Effectiveness: {project.effectiveness}%</p>
                  {project.roll_result && (
                    <p className="text-gray-300 text-sm mb-2">
                      <span className="font-bold">Initial Roll:</span> {project.roll_result}
                    </p>
                  )}
                  {project.linked_docs && project.linked_docs.length > 0 && (
                    <div className="mt-2">
                      <p className="text-gray-400 text-xs font-semibold">Linked Documents:</p>
                      <ul className="list-disc list-inside text-gray-300 text-xs">
                        {project.linked_docs.map((docLink, index) => (
                          <li key={index}><a href={docLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{docLink}</a></li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-red-400 text-sm italic">Access Denied: Insufficient clearance to view project details.</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-900 border border-red-900 rounded-xl p-6 shadow-lg flex flex-col">
        <h2 className="text-2xl font-bold text-red-400 mb-5 flex items-center">
          <PlusCircle size={24} className="mr-3" /> Create Propaganda Project
        </h2>
        {canCreateProject ? (
          <>
            <p className="text-gray-300 mb-4">
              Design a new propaganda or influence campaign.
            </p>
            <input
              type="text"
              placeholder="Project Name (e.g., 'National Unity Campaign')"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-600 mb-3"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Target Audience (e.g., General Public, Youth)"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-600 mb-3"
              value={newProjectAudience}
              onChange={(e) => setNewProjectAudience(e.target.value)}
            />
            <input
              type="text"
              placeholder="Target Region (e.g., All, Major Cities, Rural Areas)"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-600 mb-3"
              value={newProjectRegion}
              onChange={(e) => setNewProjectRegion(e.target.value)}
            />
            <input
              type="text"
              placeholder="Linked Document URLs (comma-separated)"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-600 mb-4"
              value={newProjectLinkedDocs}
              onChange={(e) => setNewProjectLinkedDocs(e.target.value)}
            />
            <button
              onClick={handleCreatePropagandaProject}
              className="w-full py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-md"
            >
              <PenTool size={20} className="inline-block mr-2" /> Create Propaganda Project
            </button>
          </>
        ) : (
          <p className="text-red-400 text-lg italic text-center py-10">
            Access Denied: Insufficient clearance to create propaganda projects.
          </p>
        )}
      </div>
    </div>
  );
};

const BlackBudget = ({ data, currentUser, setSimulatedData }) => {
  const [allocateAmount, setAllocateAmount] = useState('');
  const [allocateProject, setAllocateProject] = useState('');
  const [allocateLinkedDocs, setAllocateLinkedDocs] = useState('');


  const handleAllocateFunds = () => {
    const amount = parseFloat(allocateAmount);
    if (amount > 0 && allocateProject) {
      if (currentUser.clearance_level === 1 || currentUser.role === 'Minister of Finance' || currentUser.role === 'Internal Affairs Minister') { // Updated access
        if (amount <= data.blackBudget.available_funds) {
          const newAllocation = {
            id: data.blackBudget.allocations.length + 1,
            project: allocateProject,
            amount: amount,
            approved_by: currentUser.username,
            timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
            linked_docs: allocateLinkedDocs.split(',').map(link => link.trim()).filter(link => link !== ''),
          };

          setSimulatedData(prev => ({
            ...prev,
            blackBudget: {
              ...prev.blackBudget,
              available_funds: prev.blackBudget.available_funds - amount,
              allocations: [...prev.blackBudget.allocations, newAllocation]
            },
            auditLog: [...prev.auditLog, {
              id: prev.auditLog.length + 1,
              timestamp: newAllocation.timestamp,
              type: 'USER_ACTION',
              event: 'Black Budget Allocation',
              details: `₽${amount.toLocaleString()} allocated to "${allocateProject}".`,
              user: currentUser.username,
              linked_docs: newAllocation.linked_docs,
            }]
          }));

          alert(`₽${amount.toLocaleString()} allocated to "${allocateProject}"!`);
          console.log(`[KONTUR] Black Budget: ₽${amount} allocated to ${allocateProject} by ${currentUser.username}`);
          setAllocateAmount('');
          setAllocateProject('');
          setAllocateLinkedDocs('');
        } else {
          alert('Insufficient funds in black budget.');
        }
      } else {
        alert('Access Denied: Only President, Internal Affairs Minister, or Finance Minister can allocate black budget funds.'); // Updated message
      }
    } else {
      alert('Please enter a valid amount and project name.');
    }
  };

  const canAllocateFunds = currentUser.clearance_level <= 2 && (currentUser.role === 'Minister of Finance' || currentUser.role === 'President' || currentUser.role === 'Internal Affairs Minister'); // Updated access

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
      <div className="bg-gray-900 border border-red-900 rounded-xl p-6 shadow-lg flex flex-col">
        <h2 className="text-2xl font-bold text-red-400 mb-5 flex items-center">
          <DollarSign size={24} className="mr-3" /> Black Budget Overview
        </h2>
        <p className="text-gray-300 mb-4">
          Manage and allocate untraceable funds to highly sensitive projects.
        </p>
        <div className="bg-gray-800 p-4 rounded-lg mb-4 border border-gray-700">
          <p className="text-gray-400 text-sm">Available Black Funds:</p>
          <p className="text-3xl font-bold text-green-400">₽ {data.blackBudget.available_funds.toLocaleString()}</p>
        </div>

        <h3 className="text-xl font-bold text-red-300 mb-4 flex items-center">
          <TrendingUp size={20} className="mr-2" /> Recent Allocations
        </h3>
        <div className="flex-grow overflow-y-auto pr-2">
          {data.blackBudget.allocations.slice().reverse().map(alloc => (
            <div key={alloc.id} className="mb-3 p-3 rounded-lg bg-gray-800 border border-gray-700">
              <p className="text-white font-semibold">{alloc.project}</p>
              <p className="text-gray-400 text-sm">Amount: ₽{alloc.amount.toLocaleString()}</p>
              <p className="text-gray-400 text-xs italic">Approved by: {alloc.approved_by} on {alloc.timestamp}</p>
              {alloc.linked_docs && alloc.linked_docs.length > 0 && (
                <div className="mt-2">
                  <p className="text-gray-400 text-xs font-semibold">Linked Documents:</p>
                  <ul className="list-disc list-inside text-gray-300 text-xs">
                    {alloc.linked_docs.map((docLink, index) => (
                      <li key={index}><a href={docLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{docLink}</a></li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-900 border border-red-900 rounded-xl p-6 shadow-lg flex flex-col">
        <h2 className="text-2xl font-bold text-red-400 mb-5 flex items-center">
          <PlusCircle size={24} className="mr-3" /> Allocate Covert Funds
        </h2>
        {canAllocateFunds ? (
          <>
            <p className="text-gray-300 mb-4">
              Allocate funds to a specific project or operation.
            </p>
            <input
              type="number"
              placeholder="Amount (RUB)"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-600 mb-3"
              value={allocateAmount}
              onChange={(e) => setAllocateAmount(e.target.value)}
            />
            <input
              type="text"
              placeholder="Project/Operation Name"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-600 mb-3"
              value={allocateProject}
              onChange={(e) => setAllocateProject(e.target.value)}
            />
            <input
              type="text"
              placeholder="Linked Document URLs (comma-separated)"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-600 mb-4"
              value={allocateLinkedDocs}
              onChange={(e) => setAllocateLinkedDocs(e.target.value)}
            />
            <button
              onClick={handleAllocateFunds}
              className="w-full py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-md"
            >
              <DollarSign size={20} className="inline-block mr-2" /> Allocate Covert Funds
            </button>
          </>
        ) : (
          <p className="text-red-400 text-lg italic text-center py-10">
            Access Denied: Insufficient clearance to allocate black budget funds.
          </p>
        )}
      </div>
    </div>
  );
};

const CorruptionAudit = ({ data, currentUser, setSimulatedData }) => {
  const getCorruptionColor = (level) => {
    if (level >= 4) return 'text-red-400';
    if (level >= 2) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getCorruptionStatus = (level) => {
    switch (level) {
      case 1: return 'Optimal Efficiency (Minor Buff)';
      case 2: return 'Minor Inefficiencies';
      case 3: return 'Reduced Efficiency';
      case 4: return 'Significant Obstacles';
      case 5: return 'Critical Dysfunction (Major Debuff)';
      default: return 'Unknown';
    }
  };

  const handleInitiateAudit = (sector) => {
    // Only President can initiate audit
    if (currentUser.role !== 'President') {
      alert('Access Denied: Only the President can initiate a corruption audit.');
      return;
    }

    const now = Date.now();
    const COOLDOWN_PERIOD_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    if (data.systemStatus.lastGlobalAuditTimestamp && (now - data.systemStatus.lastGlobalAuditTimestamp < COOLDOWN_PERIOD_MS)) {
      const remainingTimeMs = COOLDOWN_PERIOD_MS - (now - data.systemStatus.lastGlobalAuditTimestamp);
      const remainingHours = Math.ceil(remainingTimeMs / (1000 * 60 * 60));
      alert(`Audit cooldown active. Please wait ${remainingHours} hour(s) before initiating another audit.`);
      return;
    }

    const roll = rollDice(100);
    const effectiveness = calculateEffectiveness(roll);
    let newCorruptionLevel = data.corruptionLevels[sector].level;

    // Logic to adjust corruption based on roll and effectiveness
    if (effectiveness >= 80) { // Very good audit, significantly reduces corruption
      newCorruptionLevel = Math.max(1, newCorruptionLevel - 2);
    } else if (effectiveness >= 60) { // Good audit, reduces corruption
      newCorruptionLevel = Math.max(1, newCorruptionLevel - 1);
    } else if (effectiveness < 30) { // Poor audit, might increase corruption
      newCorruptionLevel = Math.min(5, newCorruptionLevel + 1);
    }
    // If between 30-59, corruption level might stay the same or fluctuate slightly

    const newCorruptionLevels = {
      ...data.corruptionLevels,
      [sector]: {
        level: newCorruptionLevel,
        status: getCorruptionStatus(newCorruptionLevel),
        last_audit_roll: roll,
        last_audit_effectiveness: effectiveness,
      }
    };

    setSimulatedData(prev => ({
      ...prev,
      corruptionLevels: newCorruptionLevels,
      systemStatus: {
        ...prev.systemStatus,
        lastGlobalAuditTimestamp: now, // Update global audit timestamp
      },
      auditLog: [...prev.auditLog, {
        id: prev.auditLog.length + 1,
        timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
        type: 'USER_ACTION',
        event: `Audit Initiated: ${sector} Sector`,
        details: `Corruption audit for ${sector} sector completed. Roll: ${roll}. Effectiveness: ${effectiveness}%. New Corruption Level: ${newCorruptionLevel}. Status: ${getCorruptionStatus(newCorruptionLevel)}.`,
        user: currentUser.username
      }]
    }));

    alert(`Audit for ${sector} sector completed with ${effectiveness}% effectiveness. Corruption level adjusted to ${newCorruptionLevel}. Status: ${getCorruptionStatus(newCorruptionLevel)}.`);
    sendDiscordWebhook(`🧾 Sector Audit Complete: ${sector} audit completed with ${effectiveness}% effectiveness. Corruption level adjusted to ${newCorruptionLevel}. Status: ${getCorruptionStatus(newCorruptionLevel)}.`);
  };

  const canInitiateAudit = currentUser.role === 'President';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
      <div className="bg-gray-900 border border-red-900 rounded-xl p-6 shadow-lg flex flex-col">
        <h2 className="text-2xl font-bold text-red-400 mb-5 flex items-center">
          <Scale size={24} className="mr-3" /> Corruption Levels Overview
        </h2>
        <p className="text-gray-300 mb-4">
          Monitor corruption levels across key governmental sectors. High levels can generate "debuffs".
        </p>
        <div className="flex-grow overflow-y-auto pr-2">
          {Object.entries(data.corruptionLevels).map(([sector, info]) => (
            <div key={sector} className="mb-4 p-4 rounded-lg bg-gray-800 border border-gray-700">
              <h3 className="text-lg font-semibold text-white">{sector} Sector</h3>
              <p className="text-gray-400 text-sm">Level: <span className={`font-bold ${getCorruptionColor(info.level)}`}>{info.level}</span>/5</p>
              <p className="text-gray-400 text-sm">Status: {info.status}</p>
              {info.last_audit_effectiveness !== null && (
                <p className="text-gray-400 text-sm">Last Audit Effectiveness: {info.last_audit_effectiveness}% (Roll: {info.last_audit_roll})</p>
              )}
              {canInitiateAudit && (
                <button
                  onClick={() => handleInitiateAudit(sector)}
                  className="mt-3 px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 text-sm"
                >
                  Initiate Sector Audit
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-900 border border-red-900 rounded-xl p-6 shadow-lg flex flex-col">
        <h2 className="text-2xl font-bold text-red-400 mb-5 flex items-center">
          <ClipboardList size={24} className="mr-3" /> Decision Log & Audit Details
        </h2>
        <p className="text-gray-300 mb-4">
          Review past audit decisions and their outcomes.
        </p>
        <div className="flex-grow overflow-y-auto pr-2">
          {data.auditLog.filter(log => log.event.includes('Audit Initiated')).slice().reverse().map(log => (
            <div key={log.id} className="mb-3 p-3 rounded-lg bg-gray-800 border border-gray-700">
              <h3 className="text-lg font-semibold text-white">{log.event}</h3>
              <p className="text-gray-300 text-sm">{log.details}</p>
              <p className="text-gray-400 text-xs italic">Initiated by: {log.user} on {log.timestamp}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ClassifiedArchives = ({ data, currentUser, setSimulatedData }) => {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [accessCodeInput, setAccessCodeInput] = useState('');
  const [accessError, setAccessError] = useState('');

  const isPresidentOrInternalMinister = currentUser.role === 'President' || currentUser.role === 'Internal Affairs Minister';

  const handleRequestAccess = (docId) => {
    // Check if a request already exists for this document by this user
    const existingRequest = data.documentRequests.find(
      req => req.docId === docId && req.requesterUsername === currentUser.username
    );

    if (existingRequest) {
      alert(`You have already ${existingRequest.status} a request for this document.`);
      return;
    }

    const newRequest = {
      id: `req-${Date.now()}`,
      docId: docId,
      requesterUsername: currentUser.username,
      status: 'pending',
      requestedTimestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
      approvedBy: '',
      approvedTimestamp: '',
    };

    setSimulatedData(prev => ({
      ...prev,
      documentRequests: [...prev.documentRequests, newRequest],
      auditLog: [...prev.auditLog, {
        id: prev.auditLog.length + 1,
        timestamp: newRequest.requestedTimestamp,
        type: 'USER_ACTION',
        event: 'Document Access Request',
        details: `User ${currentUser.username} requested access to document ID: ${docId}. Status: Pending.`,
        user: currentUser.username,
        linked_docs: [],
      }]
    }));
    alert('Document access request submitted. The President will review your request.');
    setSelectedDocument(prev => ({ ...prev, userRequestStatus: 'pending' })); // Update local state for immediate feedback
  };

  const handleApproveDenyRequest = (requestId, status) => {
    if (currentUser.role !== 'President') {
      alert('Access Denied: Only the President can approve or deny document requests.');
      return;
    }

    setSimulatedData(prev => {
      const updatedRequests = prev.documentRequests.map(req => {
        if (req.id === requestId) {
          return {
            ...req,
            status: status,
            approvedBy: currentUser.username,
            approvedTimestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
          };
        }
        return req;
      });

      const request = updatedRequests.find(req => req.id === requestId);
      const doc = prev.classifiedArchives.find(d => d.id === request.docId);

      return {
        ...prev,
        documentRequests: updatedRequests,
        auditLog: [...prev.auditLog, {
          id: prev.auditLog.length + 1,
          timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
          type: 'USER_ACTION',
          event: `Document Access ${status === 'approved' ? 'Approved' : 'Denied'}`,
          details: `President ${currentUser.username} ${status} access to document "${doc.redacted_title}" (ID: ${doc.id}) for user ${request.requesterUsername}.`,
          user: currentUser.username,
          linked_docs: [],
        }]
      };
    });
    alert(`Request ${requestId} has been ${status}.`);
  };

  const getDocumentRequestStatus = (docId) => {
    const request = data.documentRequests.find(
      req => req.docId === docId && req.requesterUsername === currentUser.username
    );
    return request ? request.status : 'none';
  };

  const canViewFullText = (doc) => {
    // President and Internal Affairs Minister always have full access
    if (isPresidentOrInternalMinister) {
      return true;
    }

    // For other users, check if their request for this document is approved
    const requestStatus = getDocumentRequestStatus(doc.id);
    return requestStatus === 'approved';
  };

  const getClassificationColor = (classification) => {
    switch (classification) {
      case 'Presidential': return 'text-purple-400';
      case 'Internal Affairs ONLY': return 'text-red-400';
      case 'TOP SECRET': return 'text-orange-400';
      case 'Declassified': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const pendingRequests = data.documentRequests.filter(req => req.status === 'pending');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      <div className="lg:col-span-2 bg-gray-900 border border-red-900 rounded-xl p-6 shadow-lg flex flex-col">
        <h2 className="text-2xl font-bold text-red-400 mb-5 flex items-center">
          <Vault size={24} className="mr-3" /> Classified Document Archives
        </h2>
        <p className="text-gray-300 mb-4">
          Internal classified documents database. Access is strictly controlled by clearance level.
        </p>
        <div className="flex-grow overflow-y-auto pr-2">
          {data.classifiedArchives.map(doc => {
            const requestStatus = getDocumentRequestStatus(doc.id);
            // Determine if the document should be shown at all based on user role and specific document restrictions
            const isDocVisible = () => {
              if (isPresidentOrInternalMinister) return true; // President/Internal Affairs Minister see all
              // For others, only show if not hidden from president AND not internal affairs only
              return !doc.hidden_from_president && !doc.internal_affairs_only;
            };

            if (!isDocVisible()) {
              return null; // Don't render documents that are not visible to the current user's role
            }

            return (
              <div key={doc.id} className="mb-4 p-4 rounded-lg bg-gray-800 border border-gray-700 cursor-pointer" onClick={() => setSelectedDocument(doc)}>
                <h3 className="text-lg font-semibold text-white">{doc.redacted_title}</h3>
                <p className="text-gray-400 text-sm">Date: {doc.date} | Classification: <span className={getClassificationColor(doc.classification)}>{doc.classification}</span></p>
                <p className="text-gray-400 text-xs italic">Tags: {doc.tags.join(', ')}</p>
                {!isPresidentOrInternalMinister && requestStatus !== 'none' && (
                  <p className={`mt-2 text-sm font-bold ${
                    requestStatus === 'pending' ? 'text-yellow-400' :
                    requestStatus === 'approved' ? 'text-green-400' :
                    'text-red-400'
                  }`}>
                    Request Status: {requestStatus.toUpperCase()}
                  </p>
                )}
              </div>
            );
          })}
        </div>
        {selectedDocument && (
          <div className="mt-6 pt-6 border-t border-gray-800">
            <h3 className="text-xl font-bold text-red-300 mb-3">Document: {selectedDocument.redacted_title}</h3>
            <p className="text-gray-300 text-sm mb-2">Original Title: {selectedDocument.title}</p>
            <p className="text-gray-300 text-sm mb-2">Date: {selectedDocument.date} | Classification: <span className={getClassificationColor(selectedDocument.classification)}>{selectedDocument.classification}</span></p>
            <p className="text-gray-300 text-sm mb-2">Summary: {selectedDocument.summary}</p>
            <div className="mt-4 p-4 bg-gray-700 rounded-lg max-h-64 overflow-y-auto pr-2">
              <h4 className="text-lg font-bold text-red-300 mb-2">Full Text:</h4>
              {canViewFullText(selectedDocument) ? (
                <p className="text-gray-200 text-sm leading-relaxed">{selectedDocument.full_text}</p>
              ) : (
                <>
                  <p className="text-red-400 text-sm italic mb-2">
                    <FileWarning size={20} className="inline-block mr-2" /> ACCESS DENIED: Insufficient clearance for full document text.
                  </p>
                  <p className="text-gray-400 text-sm">Showing redacted view:</p>
                  <p className="text-gray-200 text-sm leading-relaxed mt-2">{selectedDocument.redacted_text}</p>
                  {/* Request Access / Pending / Denied UI for non-privileged users */}
                  {!isPresidentOrInternalMinister && (
                    <div className="mt-4">
                      {getDocumentRequestStatus(selectedDocument.id) === 'none' && (
                        <button
                          onClick={() => handleRequestAccess(selectedDocument.id)}
                          className="w-full py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-md mb-2"
                        >
                          Request Access to Document
                        </button>
                      )}
                      {getDocumentRequestStatus(selectedDocument.id) === 'pending' && (
                        <p className="text-yellow-400 text-lg italic text-center py-2">
                          <Clock size={20} className="inline-block mr-2" /> Request Pending Review
                        </p>
                      )}
                      {getDocumentRequestStatus(selectedDocument.id) === 'approved' && (
                        <p className="text-green-400 text-lg italic text-center py-2">
                          <CheckCircle size={20} className="inline-block mr-2" /> Request Approved! You can now view the document.
                        </p>
                      )}
                      {getDocumentRequestStatus(selectedDocument.id) === 'denied' && (
                        <p className="text-red-400 text-lg italic text-center py-2">
                          <UserX size={20} className="inline-block mr-2" /> Request Denied
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
            <button
              onClick={() => { setSelectedDocument(null); setAccessCodeInput(''); setAccessError(''); }}
              className="mt-4 px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 transition-colors text-sm w-full"
            >
              Close Document
            </button>
          </div>
        )}
      </div>

      <div className="bg-gray-900 border border-red-900 rounded-xl p-6 shadow-lg flex flex-col">
        {currentUser.role === 'President' ? (
          <>
            <h2 className="text-2xl font-bold text-red-400 mb-5 flex items-center">
              <ClipboardList size={24} className="mr-3" /> Pending Document Requests
              {pendingRequests.length > 0 && <span className="ml-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">{pendingRequests.length}</span>}
            </h2>
            {pendingRequests.length > 0 ? (
              <div className="flex-grow overflow-y-auto pr-2">
                {pendingRequests.map(request => {
                  const doc = data.classifiedArchives.find(d => d.id === request.docId);
                  return (
                    <div key={request.id} className="mb-3 p-3 rounded-lg bg-gray-800 border border-yellow-700">
                      <p className="text-white font-semibold">Request for: "{doc ? doc.redacted_title : 'Unknown Document'}"</p>
                      <p className="text-gray-400 text-sm">From: {request.requesterUsername}</p>
                      <p className="text-gray-400 text-xs italic">Requested on: {request.requestedTimestamp}</p>
                      <div className="flex space-x-2 mt-3">
                        <button
                          onClick={() => handleApproveDenyRequest(request.id, 'approved')}
                          className="px-3 py-1 bg-green-700 text-white rounded-md hover:bg-green-800 text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleApproveDenyRequest(request.id, 'denied')}
                          className="px-3 py-1 bg-red-700 text-white rounded-md hover:bg-red-800 text-sm"
                        >
                          Deny
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-400 text-lg italic text-center py-10">
                No pending document requests.
              </p>
            )}
            <h2 className="text-2xl font-bold text-red-400 mt-6 mb-5 flex items-center">
              <Search size={24} className="mr-3" /> Document Request Log
            </h2>
            <div className="flex-grow overflow-y-auto pr-2">
              {data.auditLog.filter(log => log.event.includes('Document Access Request') || log.event.includes('Document Access Approved') || log.event.includes('Document Access Denied')).slice().reverse().map(log => (
                <div key={log.id} className="mb-3 p-3 rounded-lg bg-gray-800 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white">{log.event}</h3>
                  <p className="text-gray-300 text-sm">{log.details}</p>
                  <p className="text-gray-400 text-xs italic">User: {log.user} on {log.timestamp}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-red-400 mb-5 flex items-center">
              <Search size={24} className="mr-3" /> My Document Request Log
            </h2>
            <p className="text-gray-300 mb-4">
              Review your past document access requests and their outcomes.
            </p>
            <div className="flex-grow overflow-y-auto pr-2">
              {data.auditLog.filter(log => log.user === currentUser.username && (log.event.includes('Document Access Request') || log.event.includes('Document Access Approved') || log.event.includes('Document Access Denied'))).slice().reverse().map(log => (
                <div key={log.id} className="mb-3 p-3 rounded-lg bg-gray-800 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white">{log.event}</h3>
                  <p className="text-gray-300 text-sm">{log.details}</p>
                  <p className="text-gray-400 text-xs italic">On: {log.timestamp}</p>
                </div>
              ))}
              {data.auditLog.filter(log => log.user === currentUser.username && (log.event.includes('Document Access Request') || log.event.includes('Document Access Approved') || log.event.includes('Document Access Denied'))).length === 0 && (
                <p className="text-gray-400 text-lg italic text-center py-10">
                  No document requests submitted yet.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};


// --- Main App Component ---
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('CommandRoom');
  const [simulatedData, setSimulatedData] = usePersistentState('russia_rp_data', initialSimulatedData);

  const [systemStatus, setSystemStatus] = useState(simulatedData.systemStatus);

  useEffect(() => {
    const checkLeak = () => {
      const now = new Date();
      const today = now.getDay();
      const lastLeak = simulatedData.lastLeakDate ? new Date(simulatedData.lastLeakDate) : null;

      if (today !== 6 && (!lastLeak || (now.getTime() - lastLeak.getTime() > 7 * 24 * 60 * 60 * 1000))) {
        const leakRoll = rollDice(100);
        if (leakRoll > 70) {
          const leakableDocs = simulatedData.classifiedArchives.filter(doc => !doc.internal_affairs_only && !doc.hidden_from_president);
          if (leakableDocs.length > 0) {
            const docToLeak = leakableDocs[Math.floor(Math.random() * leakableDocs.length)];
            const leakMessage = `🚨 CLASSIFIED LEAK EXPOSED\nDocument [${docToLeak.id}] has been leaked to the public.\nTitle: "${docToLeak.title}" | Estimated Sensitivity: ${docToLeak.classification.toUpperCase()}`;
            sendDiscordWebhook(leakMessage);
            setSimulatedData(prev => ({
              ...prev,
              lastLeakDate: now.toISOString(),
              auditLog: [...prev.auditLog, {
                id: prev.auditLog.length + 1,
                timestamp: now.toISOString().slice(0, 19).replace('T', ' '),
                type: 'SECURITY',
                event: 'Document Leak Detected',
                details: `Document "${docToLeak.title}" (ID: ${docToLeak.id}) leaked to public.`,
                user: 'SYSTEM',
                linked_docs: [],
              }]
            }));
            alert(`[SECURITY ALERT] Document "${docToLeak.title}" has been leaked! Check console for simulated Discord message.`);
          }
        }
      }
    };

    const leakInterval = setInterval(checkLeak, 24 * 60 * 60 * 1000);
    checkLeak();
    return () => clearInterval(leakInterval);
  }, [simulatedData, setSimulatedData]);


  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStatus(prevStatus => ({
        ...prevStatus,
        integrity: Math.max(90, Math.min(100, prevStatus.integrity + (Math.random() > 0.5 ? 1 : -1))),
        threatLevel: Math.random() > 0.8 ? 'Red' : (Math.random() > 0.5 ? 'Amber' : 'Green'),
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleLogin = (user) => {
    setIsLoggedIn(true);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentView('CommandRoom');
    console.log("[KONTUR] User logged out. Session terminated.");
  };

  return (
    <div className="App">
      {isLoggedIn ? (
        <MainLayout
          currentView={currentView}
          setView={setCurrentView}
          onLogout={handleLogout}
          systemStatus={systemStatus}
          currentUser={currentUser}
          simulatedData={simulatedData}
          setSimulatedData={setSimulatedData}
        />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
