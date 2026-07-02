import { IAssessment, IScopeTarget } from "../types/assessment";

// Cascading Scope Metadata (Centralized Data Service)
export const SCOPE_METADATA = {
  devices: ["Smart TV", "Home Appliances", "Mobile Phones", "Air Conditioners"],
  brands: {
    "Smart TV": ["Samsung", "LG", "Sony", "Singer"],
    "Home Appliances": ["LG", "Whirlpool", "Bosch", "Samsung"],
    "Mobile Phones": ["Samsung", "Apple", "Xiaomi", "Vivo"],
    "Air Conditioners": ["Gree", "Samsung", "LG", "Carrier"]
  } as Record<string, string[]>,
  models: {
    "Samsung": {
      "Smart TV": ["OLED QN90D", "Neo QLED 8K", "Crystal UHD DU8000", "Frame TV LS03D"],
      "Mobile Phones": ["Galaxy S24 Ultra", "Galaxy Z Fold 6", "Galaxy A55", "Galaxy M34"],
      "Air Conditioners": ["WindFree Deluxe 1.5 Ton", "Inverter 2.0 Ton"]
    },
    "LG": {
      "Smart TV": ["OLED C4 65-inch", "QNED85 NanoCell", "UHD UT80 Smart"],
      "Home Appliances": ["InstaView Door-in-Door Refrigerator", "AI DD 9kg Front Load Washer", "Dual Inverter Dryer"],
      "Air Conditioners": ["Dual Inverter 1.5 Ton", "Artcool Inverter 2.0 Ton"]
    },
    "Sony": {
      "Smart TV": ["Bravia 9 Mini-LED", "Bravia 8 OLED", "Bravia 3 Basic LED"]
    },
    "Singer": {
      "Smart TV": ["Singer Prime LED", "Singer Google TV 43-inch"]
    },
    "Whirlpool": {
      "Home Appliances": ["Intellifresh Double Door Fridge", "Supreme Clean Dishwasher"]
    },
    "Bosch": {
      "Home Appliances": ["Series 6 Refrigerator", "VarioPerfect Washing Machine"]
    },
    "Apple": {
      "Mobile Phones": ["iPhone 15 Pro Max", "iPhone 15", "iPhone 14 Plus", "iPhone SE 3rd Gen"]
    },
    "Xiaomi": {
      "Mobile Phones": ["Redmi Note 13 Pro", "Xiaomi 14 Ultra", "Poco F6"]
    },
    "Vivo": {
      "Mobile Phones": ["Vivo V30 Pro", "Vivo Y200", "Vivo T3 5G"]
    },
    "Gree": {
      "Air Conditioners": ["Fairy Inverter 1.5 Ton", "Lomo Inverter 1.0 Ton", "Pular Inverter 2.0 Ton"]
    },
    "Carrier": {
      "Air Conditioners": ["Carrier Superia 1.5 Ton", "Carrier Novello Inverter"]
    }
  } as Record<string, Record<string, string[]>>
};

// ── JWT SECURITY STORAGE SERVICE ──────────────────────────────────────────
const JWT_COOKIE_NAME = "transcom_lms_auth_token";

export const securityService = {
  // Store JWT
  setToken: (token: string) => {
    if (typeof window !== "undefined") {
      // 1. LocalStorage backup
      localStorage.setItem(JWT_COOKIE_NAME, token);
      
      // 2. Cookie storage (Secure & Path configured)
      const isSecure = window.location.protocol === "https:";
      document.cookie = `${JWT_COOKIE_NAME}=${encodeURIComponent(token)}; path=/; max-age=86400; ${isSecure ? "Secure;" : ""} SameSite=Lax`;
    }
  },

  // Retrieve JWT
  getToken: (): string | null => {
    if (typeof window === "undefined") return null;

    // Try cookie first
    const nameEQ = JWT_COOKIE_NAME + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }

    // Fallback to localStorage
    return localStorage.getItem(JWT_COOKIE_NAME);
  },

  // Clear JWT (Log Out)
  clearToken: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(JWT_COOKIE_NAME);
      document.cookie = `${JWT_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
    }
  }
};

// ── FRONTEND API SERVICE LAYER (FUTURE PROOF) ─────────────────────────────
// Symmetrical to future C# Controller routes
export const assessmentApiService = {
  // GET: api/assessment
  getAll: async (): Promise<IAssessment[]> => {
    // Symmetrical placeholder representing a future HTTP fetch
    console.log("API CALL: GET api/assessment");
    
    // Simulate latency
    await new Promise(resolve => setTimeout(resolve, 550));
    
    const stored = localStorage.getItem("transcom_mock_assessments");
    return stored ? JSON.parse(stored) : [];
  },

  // GET: api/assessment/{id}
  getById: async (id: string): Promise<IAssessment | null> => {
    console.log(`API CALL: GET api/assessment/${id}`);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const stored = localStorage.getItem("transcom_mock_assessments");
    if (!stored) return null;
    const items: IAssessment[] = JSON.parse(stored);
    return items.find(item => item.id === id) || null;
  },

  // POST: api/assessment
  create: async (assessment: IAssessment): Promise<IAssessment> => {
    console.log("API CALL: POST api/assessment", assessment);
    await new Promise(resolve => setTimeout(resolve, 800));

    const newAssessment: IAssessment = {
      ...assessment,
      id: "ASM-" + Math.floor(1000 + Math.random() * 9000),
      createdAt: new Date().toISOString()
    };

    const stored = localStorage.getItem("transcom_mock_assessments");
    const items: IAssessment[] = stored ? JSON.parse(stored) : [];
    items.unshift(newAssessment);
    localStorage.setItem("transcom_mock_assessments", JSON.stringify(items));

    return newAssessment;
  },

  // DELETE: api/assessment/{id}
  delete: async (id: string): Promise<boolean> => {
    console.log(`API CALL: DELETE api/assessment/${id}`);
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const stored = localStorage.getItem("transcom_mock_assessments");
    if (!stored) return false;
    
    const items: IAssessment[] = JSON.parse(stored);
    const filtered = items.filter(item => item.id !== id);
    localStorage.setItem("transcom_mock_assessments", JSON.stringify(filtered));
    return true;
  }
};
