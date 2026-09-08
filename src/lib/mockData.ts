import { useEffect, useState } from 'react';

export type ProjectStatus = 'Planning' | 'In Progress' | 'On Hold' | 'Completed';
export type ProjectType = 'Residential' | 'Commercial' | 'Industrial';

export type Project = {
  id: string;
  name: string;
  client: string;
  location: string;
  type: ProjectType;
  status: ProjectStatus;
  progress: number;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  thumbnail: string;
  description: string;
  team: { name: string; role: string; initials: string }[];
  masterInfo: MasterProjectInfo;
};

export type MasterProjectInfo = {
  ownerName: string;
  plotNumber: string;
  surveyNumber: string;
  plotArea: string;
  address: string;
  village: string;
  taluka: string;
  district: string;
};

export type FormDoc = {
  id: string;
  name: string;
  category: string;
  status: 'Synced' | 'Needs Review' | 'Draft';
  lastSync: string;
  uploadedAt: string;
  fields: { key: string; label: string; value: string; sourceForm?: string }[];
};

export type Expense = {
  id: string;
  date: string;
  category: string;
  vendor: string;
  description: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  invoice?: string;
};

export type Material = {
  id: string;
  name: string;
  category: string;
  vendor: string;
  plannedQty: number;
  actualQty: number;
  unit: string;
  plannedCost: number;
  actualCost: number;
};

export type ProjectDocument = {
  id: string;
  name: string;
  type: 'Drawing' | 'Invoice' | 'Report' | 'Estimate' | 'Other';
  size: string;
  uploadedAt: string;
  uploadedBy: string;
  versions: { version: string; date: string; by: string; note: string; size: string }[];
};

type MockDataListener = () => void;
const mockDataListeners = new Set<MockDataListener>();

export function subscribeMockData(listener: MockDataListener) {
  mockDataListeners.add(listener);
  return () => mockDataListeners.delete(listener);
}

function notifyMockDataChanged() {
  mockDataListeners.forEach((listener) => listener());
}

export function useMockDataVersion() {
  const [, setVersion] = useState(0);
  useEffect(() => {
    const unsubscribe = subscribeMockData(() => setVersion((version) => version + 1));
    return () => { unsubscribe(); };
  }, []);
}

export type AIQA = {
  question: string;
  answer: string;
  sources: { label: string; type: string }[];
};

const PROJECT_IDS = {
  patel: 'patel-residence',
  shah: 'shah-villa',
  mehta: 'mehta-commercial',
  desai: 'desai-residence',
  kutch: 'kutch-industrial',
};

export const projects: Project[] = [
  {
    id: PROJECT_IDS.patel,
    name: 'Patel Residence',
    client: 'Ramesh Patel',
    location: 'Bhuj',
    type: 'Residential',
    status: 'In Progress',
    progress: 62,
    budget: 4500000,
    spent: 2790000,
    startDate: '2026-01-15',
    endDate: '2026-08-30',
    thumbnail: 'patel',
    description: 'G+1 residential bungalow with 4 BHK, car porch and landscaped front yard.',
    team: [
      { name: 'Ramesh Patel', role: 'Owner', initials: 'RP' },
      { name: 'Jignesh Mehta', role: 'Architect', initials: 'JM' },
      { name: 'Suresh Joshi', role: 'Contractor', initials: 'SJ' },
    ],
    masterInfo: {
      ownerName: 'Ramesh Patel',
      plotNumber: 'Plot 14, Krishnanagar',
      surveyNumber: '245/2',
      plotArea: '2,400 sq.ft',
      address: 'Plot 14, Krishnanagar, Bhuj',
      village: 'Bhuj (Municipality)',
      taluka: 'Bhuj',
      district: 'Kutch',
    },
  },
  {
    id: PROJECT_IDS.shah,
    name: 'Shah Villa',
    client: 'Krunal Shah',
    location: 'Bhuj',
    type: 'Residential',
    status: 'Planning',
    progress: 15,
    budget: 6200000,
    spent: 930000,
    startDate: '2026-03-01',
    endDate: '2027-01-15',
    thumbnail: 'shah',
    description: 'Modern villa with basement, double-height living area and rooftop terrace.',
    team: [
      { name: 'Krunal Shah', role: 'Owner', initials: 'KS' },
      { name: 'Anita Desai', role: 'Architect', initials: 'AD' },
    ],
    masterInfo: {
      ownerName: 'Krunal Shah',
      plotNumber: 'Plot 7, Hill View',
      surveyNumber: '188/5',
      plotArea: '3,200 sq.ft',
      address: 'Plot 7, Hill View Scheme, Bhuj',
      village: 'Bhuj (Municipality)',
      taluka: 'Bhuj',
      district: 'Kutch',
    },
  },
  {
    id: PROJECT_IDS.mehta,
    name: 'Mehta Commercial Building',
    client: 'Nikhil Mehta',
    location: 'Gandhidham',
    type: 'Commercial',
    status: 'In Progress',
    progress: 48,
    budget: 18500000,
    spent: 8880000,
    startDate: '2025-11-10',
    endDate: '2026-10-20',
    thumbnail: 'mehta',
    description: 'G+3 commercial complex with retail ground floor and office upper floors.',
    team: [
      { name: 'Nikhil Mehta', role: 'Owner', initials: 'NM' },
      { name: 'Rajiv Kothari', role: 'Structural Engineer', initials: 'RK' },
      { name: 'Suresh Joshi', role: 'Contractor', initials: 'SJ' },
      { name: 'Pooja Bhatt', role: 'Interior Designer', initials: 'PB' },
    ],
    masterInfo: {
      ownerName: 'Nikhil Mehta',
      plotNumber: 'Shop 3-6, GIDC Main Road',
      surveyNumber: '412/1',
      plotArea: '5,400 sq.ft',
      address: 'GIDC Main Road, Gandhidham',
      village: 'Gandhidham (Municipality)',
      taluka: 'Anjar',
      district: 'Kutch',
    },
  },
  {
    id: PROJECT_IDS.desai,
    name: 'Desai Residence',
    client: 'Hardik Desai',
    location: 'Anjar',
    type: 'Residential',
    status: 'Completed',
    progress: 100,
    budget: 3200000,
    spent: 3050000,
    startDate: '2025-06-01',
    endDate: '2026-02-28',
    thumbnail: 'desai',
    description: 'Compact 3 BHK bungalow with traditional courtyard and modern interiors.',
    team: [
      { name: 'Hardik Desai', role: 'Owner', initials: 'HD' },
      { name: 'Jignesh Mehta', role: 'Architect', initials: 'JM' },
    ],
    masterInfo: {
      ownerName: 'Hardik Desai',
      plotNumber: 'Plot 22, Nana Anjar',
      surveyNumber: '156/3',
      plotArea: '1,800 sq.ft',
      address: 'Plot 22, Nana Anjar',
      village: 'Anjar (Municipality)',
      taluka: 'Anjar',
      district: 'Kutch',
    },
  },
  {
    id: PROJECT_IDS.kutch,
    name: 'Kutch Industrial Shed',
    client: 'Kutch Fabrics Pvt Ltd',
    location: 'Mundra',
    type: 'Industrial',
    status: 'On Hold',
    progress: 34,
    budget: 9800000,
    spent: 3332000,
    startDate: '2025-12-05',
    endDate: '2026-09-15',
    thumbnail: 'kutch',
    description: 'PEB industrial shed for textile processing with loading bay and office block.',
    team: [
      { name: 'Manish Agarwal', role: 'Owner Rep', initials: 'MA' },
      { name: 'Rajiv Kothari', role: 'Structural Engineer', initials: 'RK' },
    ],
    masterInfo: {
      ownerName: 'Kutch Fabrics Pvt Ltd',
      plotNumber: 'Survey 78, Mundra GIDC',
      surveyNumber: '78/4',
      plotArea: '12,000 sq.ft',
      address: 'Plot 78, Mundra GIDC Phase II',
      village: 'Mundra',
      taluka: 'Mundra',
      district: 'Kutch',
    },
  },
];

export function getProject(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

export type SyncFieldKey = 'plotArea';

export const syncExample = {
  fieldKey: 'plotArea' as SyncFieldKey,
  fieldLabel: 'Plot Area',
  oldValue: '2,400 sq.ft',
  newValue: '2,500 sq.ft',
  affectedForms: [
    { id: 'form-1', name: 'Building Permission Application', impact: 'Plot area field will update to 2,500 sq.ft' },
    { id: 'form-2', name: 'Property Tax Assessment Form', impact: 'Taxable area recalculation required' },
    { id: 'form-3', name: 'Structural Stability Certificate', impact: 'FAR computation will change' },
    { id: 'form-4', name: 'Land Use Verification', impact: 'Plot area reference will update' },
  ],
};

export const formsByProject: Record<string, FormDoc[]> = {
  [PROJECT_IDS.patel]: [
    {
      id: 'form-1',
      name: 'Building Permission Application',
      category: 'Approval',
      status: 'Needs Review',
      lastSync: '2026-09-05T10:30:00',
      uploadedAt: '2026-01-20T09:00:00',
      fields: [
        { key: 'ownerName', label: 'Owner Name', value: 'Ramesh Patel', sourceForm: 'Master' },
        { key: 'plotNumber', label: 'Plot Number', value: 'Plot 14, Krishnanagar', sourceForm: 'Master' },
        { key: 'surveyNumber', label: 'Survey Number', value: '245/2', sourceForm: 'Master' },
        { key: 'plotArea', label: 'Plot Area', value: '2,400 sq.ft', sourceForm: 'Master' },
        { key: 'address', label: 'Address', value: 'Plot 14, Krishnanagar, Bhuj', sourceForm: 'Master' },
        { key: 'village', label: 'Village', value: 'Bhuj (Municipality)', sourceForm: 'Master' },
        { key: 'taluka', label: 'Taluka', value: 'Bhuj', sourceForm: 'Master' },
        { key: 'district', label: 'District', value: 'Kutch', sourceForm: 'Master' },
        { key: 'proposedUse', label: 'Proposed Use', value: 'Residential — G+1' },
        { key: 'buildingHeight', label: 'Building Height', value: '7.2 m' },
      ],
    },
    {
      id: 'form-2',
      name: 'Property Tax Assessment Form',
      category: 'Tax',
      status: 'Synced',
      lastSync: '2026-09-05T10:30:00',
      uploadedAt: '2026-01-22T11:00:00',
      fields: [
        { key: 'ownerName', label: 'Owner Name', value: 'Ramesh Patel', sourceForm: 'Master' },
        { key: 'plotNumber', label: 'Plot Number', value: 'Plot 14, Krishnanagar', sourceForm: 'Master' },
        { key: 'plotArea', label: 'Plot Area', value: '2,400 sq.ft', sourceForm: 'Master' },
        { key: 'address', label: 'Address', value: 'Plot 14, Krishnanagar, Bhuj', sourceForm: 'Master' },
        { key: 'district', label: 'District', value: 'Kutch', sourceForm: 'Master' },
        { key: 'taxAssessment', label: 'Assessment Year', value: '2026-27' },
      ],
    },
    {
      id: 'form-3',
      name: 'Structural Stability Certificate',
      category: 'Compliance',
      status: 'Needs Review',
      lastSync: '2026-09-01T14:00:00',
      uploadedAt: '2026-02-01T09:00:00',
      fields: [
        { key: 'ownerName', label: 'Owner Name', value: 'Ramesh Patel', sourceForm: 'Master' },
        { key: 'plotArea', label: 'Plot Area', value: '2,400 sq.ft', sourceForm: 'Master' },
        { key: 'surveyNumber', label: 'Survey Number', value: '245/2', sourceForm: 'Master' },
        { key: 'structuralType', label: 'Structural Type', value: 'RCC Frame' },
        { key: 'foundationType', label: 'Foundation', value: 'Isolated Footing' },
      ],
    },
    {
      id: 'form-4',
      name: 'Land Use Verification',
      category: 'Approval',
      status: 'Synced',
      lastSync: '2026-08-28T09:00:00',
      uploadedAt: '2026-01-25T09:00:00',
      fields: [
        { key: 'ownerName', label: 'Owner Name', value: 'Ramesh Patel', sourceForm: 'Master' },
        { key: 'plotNumber', label: 'Plot Number', value: 'Plot 14, Krishnanagar', sourceForm: 'Master' },
        { key: 'surveyNumber', label: 'Survey Number', value: '245/2', sourceForm: 'Master' },
        { key: 'plotArea', label: 'Plot Area', value: '2,400 sq.ft', sourceForm: 'Master' },
        { key: 'village', label: 'Village', value: 'Bhuj (Municipality)', sourceForm: 'Master' },
        { key: 'taluka', label: 'Taluka', value: 'Bhuj', sourceForm: 'Master' },
        { key: 'landUse', label: 'Land Use Zone', value: 'Residential' },
      ],
    },
    {
      id: 'form-5',
      name: 'Completion Certificate Application',
      category: 'Compliance',
      status: 'Draft',
      lastSync: '2026-08-15T09:00:00',
      uploadedAt: '2026-08-15T09:00:00',
      fields: [
        { key: 'ownerName', label: 'Owner Name', value: 'Ramesh Patel', sourceForm: 'Master' },
        { key: 'address', label: 'Address', value: 'Plot 14, Krishnanagar, Bhuj', sourceForm: 'Master' },
        { key: 'buildingHeight', label: 'Building Height', value: '7.2 m' },
      ],
    },
  ],
  default: [
    {
      id: 'form-1',
      name: 'Building Permission Application',
      category: 'Approval',
      status: 'Synced',
      lastSync: '2026-09-03T10:00:00',
      uploadedAt: '2026-03-01T09:00:00',
      fields: [
        { key: 'ownerName', label: 'Owner Name', value: 'Owner Name', sourceForm: 'Master' },
        { key: 'plotNumber', label: 'Plot Number', value: 'Plot Number', sourceForm: 'Master' },
        { key: 'plotArea', label: 'Plot Area', value: 'Plot Area', sourceForm: 'Master' },
        { key: 'address', label: 'Address', value: 'Address', sourceForm: 'Master' },
      ],
    },
  ],
};

projects.forEach((project) => {
  if (formsByProject[project.id]) return;
  formsByProject[project.id] = [
    {
      id: 'form-1',
      name: 'Building Permission Application',
      category: 'Approval',
      status: 'Synced',
      lastSync: '2026-09-03T10:00:00',
      uploadedAt: '2026-03-01T09:00:00',
      fields: [
        { key: 'ownerName', label: 'Owner Name', value: project.masterInfo.ownerName, sourceForm: 'Master' },
        { key: 'plotNumber', label: 'Plot Number', value: project.masterInfo.plotNumber, sourceForm: 'Master' },
        { key: 'plotArea', label: 'Plot Area', value: project.masterInfo.plotArea, sourceForm: 'Master' },
        { key: 'address', label: 'Address', value: project.masterInfo.address, sourceForm: 'Master' },
      ],
    },
    {
      id: 'form-2',
      name: 'Property Tax Assessment Form',
      category: 'Tax',
      status: 'Synced',
      lastSync: '2026-09-02T10:00:00',
      uploadedAt: '2026-03-02T09:00:00',
      fields: [
        { key: 'ownerName', label: 'Owner Name', value: project.masterInfo.ownerName, sourceForm: 'Master' },
        { key: 'plotArea', label: 'Plot Area', value: project.masterInfo.plotArea, sourceForm: 'Master' },
        { key: 'district', label: 'District', value: project.masterInfo.district, sourceForm: 'Master' },
      ],
    },
    {
      id: 'form-3',
      name: 'Site Progress Certificate',
      category: 'Compliance',
      status: 'Synced',
      lastSync: '2026-08-28T09:00:00',
      uploadedAt: '2026-03-04T09:00:00',
      fields: [
        { key: 'ownerName', label: 'Owner Name', value: project.masterInfo.ownerName, sourceForm: 'Master' },
        { key: 'surveyNumber', label: 'Survey Number', value: project.masterInfo.surveyNumber, sourceForm: 'Master' },
        { key: 'plotArea', label: 'Plot Area', value: project.masterInfo.plotArea, sourceForm: 'Master' },
      ],
    },
  ];
});

export function getForms(projectId: string): FormDoc[] {
  return formsByProject[projectId] ?? [];
}

export function addForm(projectId: string, form: FormDoc) {
  formsByProject[projectId] = [...(formsByProject[projectId] ?? []), form];
  notifyMockDataChanged();
}

const expensesByProject: Record<string, Expense[]> = {
  [PROJECT_IDS.patel]: [
    { id: 'e1', date: '2026-09-04', category: 'Cement', vendor: 'ABC Traders', description: '50 cement bags', amount: 23500, status: 'Paid', invoice: 'INV-2026-001' },
    { id: 'e2', date: '2026-08-28', category: 'Steel', vendor: 'Kutch Steel Works', description: 'TMT bars 12mm — 1.2 tonne', amount: 78000, status: 'Paid', invoice: 'INV-2026-002' },
    { id: 'e3', date: '2026-08-20', category: 'Labour', vendor: 'Joshi Labour Contractor', description: 'Masonry labour — August', amount: 85000, status: 'Pending' },
    { id: 'e4', date: '2026-08-15', category: 'Sand', vendor: 'Bhuj Sand Supply', description: 'River sand — 3 units', amount: 42000, status: 'Paid' },
    { id: 'e5', date: '2026-08-10', category: 'Electrical', vendor: 'Power Elec Solutions', description: 'Wiring & switchgear', amount: 34000, status: 'Paid', invoice: 'INV-2026-003' },
    { id: 'e6', date: '2026-07-28', category: 'Plumbing', vendor: 'Aqua Flow Pipes', description: 'PVC pipes & fittings', amount: 28000, status: 'Overdue', invoice: 'INV-2026-004' },
    { id: 'e7', date: '2026-07-20', category: 'Steel', vendor: 'Kutch Steel Works', description: 'TMT bars 8mm — 0.5 tonne', amount: 32000, status: 'Paid' },
    { id: 'e8', date: '2026-07-15', category: 'Cement', vendor: 'ABC Traders', description: '40 cement bags', amount: 18800, status: 'Paid' },
    { id: 'e9', date: '2026-07-05', category: 'Labour', vendor: 'Joshi Labour Contractor', description: 'Plastering labour — July', amount: 72000, status: 'Paid' },
    { id: 'e10', date: '2026-06-28', category: 'Bricks', vendor: 'Anjar Brick Works', description: 'Fly ash bricks — 15,000 units', amount: 90000, status: 'Paid' },
    { id: 'e11', date: '2026-06-15', category: 'Transport', vendor: 'Kutch Logistics', description: 'Material transport — June', amount: 21000, status: 'Paid' },
    { id: 'e12', date: '2026-06-01', category: 'Cement', vendor: 'ABC Traders', description: '60 cement bags', amount: 28200, status: 'Paid' },
  ],
  default: [
    { id: 'e1', date: '2026-08-28', category: 'Cement', vendor: 'ABC Traders', description: '20 cement bags', amount: 9400, status: 'Paid' },
    { id: 'e2', date: '2026-08-15', category: 'Labour', vendor: 'Local Contractor', description: 'Site labour — August', amount: 45000, status: 'Pending' },
  ],
};

projects.forEach((project, index) => {
  if (expensesByProject[project.id]) return;
  expensesByProject[project.id] = [
    { id: 'e1', date: '2026-09-02', category: 'Cement', vendor: `${project.name} Suppliers`, description: `${40 + index * 10} cement bags`, amount: 18800 + index * 4700, status: 'Paid', invoice: `INV-${index + 1}-001` },
    { id: 'e2', date: '2026-08-18', category: 'Labour', vendor: 'Local Contractor', description: `Site labour — ${project.location}`, amount: 45000 + index * 12000, status: 'Pending' },
    { id: 'e3', date: '2026-07-25', category: 'Transport', vendor: `${project.location} Logistics`, description: 'Material transport', amount: 21000 + index * 3500, status: 'Paid' },
  ];
});

export function getExpenses(projectId: string): Expense[] {
  return expensesByProject[projectId] ?? [];
}

export function addExpense(projectId: string, expense: Expense) {
  expensesByProject[projectId] = [...(expensesByProject[projectId] ?? []), expense];
  notifyMockDataChanged();
}

const materialsByProject: Record<string, Material[]> = {
  [PROJECT_IDS.patel]: [
    { id: 'm1', name: 'Cement', category: 'Concrete', vendor: 'ABC Traders', plannedQty: 200, actualQty: 150, unit: 'bags', plannedCost: 94000, actualCost: 70500 },
    { id: 'm2', name: 'TMT Steel Bars', category: 'Reinforcement', vendor: 'Kutch Steel Works', plannedQty: 3.5, actualQty: 1.7, unit: 'tonne', plannedCost: 227500, actualCost: 110000 },
    { id: 'm3', name: 'River Sand', category: 'Aggregate', vendor: 'Bhuj Sand Supply', plannedQty: 6, actualQty: 3, unit: 'units', plannedCost: 84000, actualCost: 42000 },
    { id: 'm4', name: 'Fly Ash Bricks', category: 'Masonry', vendor: 'Anjar Brick Works', plannedQty: 18000, actualQty: 15000, unit: 'units', plannedCost: 108000, actualCost: 90000 },
    { id: 'm5', name: 'PVC Pipes', category: 'Plumbing', vendor: 'Aqua Flow Pipes', plannedQty: 120, actualQty: 85, unit: 'm', plannedCost: 38000, actualCost: 28000 },
    { id: 'm6', name: 'Electrical Wiring', category: 'Electrical', vendor: 'Power Elec Solutions', plannedQty: 500, actualQty: 320, unit: 'm', plannedCost: 48000, actualCost: 34000 },
    { id: 'm7', name: 'Paint & Primer', category: 'Finishing', vendor: 'Asian Paints Dealer', plannedQty: 80, actualQty: 0, unit: 'litres', plannedCost: 56000, actualCost: 0 },
    { id: 'm8', name: 'Tiles', category: 'Finishing', vendor: 'Kutch Tile Mart', plannedQty: 1200, actualQty: 0, unit: 'sq.ft', plannedCost: 84000, actualCost: 0 },
  ],
  default: [
    { id: 'm1', name: 'Cement', category: 'Concrete', vendor: 'ABC Traders', plannedQty: 100, actualQty: 20, unit: 'bags', plannedCost: 47000, actualCost: 9400 },
    { id: 'm2', name: 'Steel', category: 'Reinforcement', vendor: 'Kutch Steel Works', plannedQty: 1, actualQty: 0, unit: 'tonne', plannedCost: 65000, actualCost: 0 },
  ],
};

projects.forEach((project, index) => {
  if (materialsByProject[project.id]) return;
  materialsByProject[project.id] = [
    { id: 'm1', name: 'Cement', category: 'Concrete', vendor: `${project.name} Suppliers`, plannedQty: 100 + index * 20, actualQty: 20 + index * 10, unit: 'bags', plannedCost: 47000 + index * 9000, actualCost: 9400 + index * 4700 },
    { id: 'm2', name: 'Steel', category: 'Reinforcement', vendor: 'Kutch Steel Works', plannedQty: 1 + index * 0.5, actualQty: index * 0.2, unit: 'tonne', plannedCost: 65000 + index * 14000, actualCost: index * 13000 },
    { id: 'm3', name: 'River Sand', category: 'Aggregate', vendor: 'Regional Sand Supply', plannedQty: 4 + index, actualQty: 1 + index * 0.5, unit: 'units', plannedCost: 56000 + index * 8000, actualCost: 14000 + index * 5000 },
  ];
});

export function getMaterials(projectId: string): Material[] {
  return materialsByProject[projectId] ?? [];
}

export function addMaterial(projectId: string, material: Material) {
  materialsByProject[projectId] = [...(materialsByProject[projectId] ?? []), material];
  notifyMockDataChanged();
}

const documentsByProject: Record<string, ProjectDocument[]> = {
  [PROJECT_IDS.patel]: [
    {
      id: 'doc-2',
      name: 'Architectural Drawings — First Floor.dwg',
      type: 'Drawing',
      size: '8.7 MB',
      uploadedAt: '2026-02-10T09:00:00',
      uploadedBy: 'Jignesh Mehta',
      versions: [
        { version: 'v4', date: '2026-08-20', by: 'Jignesh Mehta', note: 'Revised balcony railing detail', size: '8.7 MB' },
        { version: 'v3', date: '2026-05-15', by: 'Jignesh Mehta', note: 'Updated room dimensions per owner request', size: '8.5 MB' },
        { version: 'v2', date: '2026-03-10', by: 'Jignesh Mehta', note: 'Added car porch layout', size: '8.2 MB' },
        { version: 'v1', date: '2026-02-10', by: 'Jignesh Mehta', note: 'Initial drawings', size: '7.9 MB' },
      ],
    },
    {
      id: 'doc-3',
      name: 'Estimate — Patel Residence.xlsx',
      type: 'Estimate',
      size: '340 KB',
      uploadedAt: '2026-01-25T09:00:00',
      uploadedBy: 'Suresh Joshi',
      versions: [
        { version: 'v2', date: '2026-07-10', by: 'Suresh Joshi', note: 'Updated rates for steel and cement', size: '340 KB' },
        { version: 'v1', date: '2026-01-25', by: 'Suresh Joshi', note: 'Initial estimate', size: '295 KB' },
      ],
    },
    {
      id: 'doc-4',
      name: 'Cost Estimate — Phase 1.pdf',
      type: 'Estimate',
      size: '1.2 MB',
      uploadedAt: '2026-02-05T09:00:00',
      uploadedBy: 'Suresh Joshi',
      versions: [
        { version: 'v1', date: '2026-02-05', by: 'Suresh Joshi', note: 'Initial cost estimate', size: '1.2 MB' },
      ],
    },
    {
      id: 'doc-5',
      name: 'Invoice — ABC Traders.pdf',
      type: 'Invoice',
      size: '680 KB',
      uploadedAt: '2026-09-04T09:00:00',
      uploadedBy: 'Suresh Joshi',
      versions: [
        { version: 'v1', date: '2026-09-04', by: 'Suresh Joshi', note: 'Cement purchase invoice', size: '680 KB' },
      ],
    },
    {
      id: 'doc-6',
      name: 'Site Progress Report — August.pdf',
      type: 'Report',
      size: '3.1 MB',
      uploadedAt: '2026-08-31T09:00:00',
      uploadedBy: 'Suresh Joshi',
      versions: [
        { version: 'v2', date: '2026-08-31', by: 'Suresh Joshi', note: 'Added photographs', size: '3.1 MB' },
        { version: 'v1', date: '2026-08-30', by: 'Suresh Joshi', note: 'Draft report', size: '2.8 MB' },
      ],
    },
  ],
  default: [
    {
      id: 'doc-1',
      name: 'Project Summary Report.pdf',
      type: 'Report',
      size: '2.0 MB',
      uploadedAt: '2026-03-01T09:00:00',
      uploadedBy: 'Architect',
      versions: [{ version: 'v1', date: '2026-03-01', by: 'Architect', note: 'Initial report upload', size: '2.0 MB' }],
    },
  ],
};

projects.forEach((project) => {
  if (documentsByProject[project.id]) return;
  documentsByProject[project.id] = [
    'Drawing', 'Invoice', 'Report', 'Estimate', 'Other',
  ].map((type, index) => ({
    id: `doc-${index + 1}`,
    name: `${type} — ${project.name}.${type === 'Drawing' ? 'dwg' : 'pdf'}`,
    type: type as ProjectDocument['type'],
    size: `${index + 1}.2 MB`,
    uploadedAt: '2026-08-20T09:00:00',
    uploadedBy: project.team[0]?.name || 'Project Team',
    versions: [{ version: 'v1', date: '2026-08-20', by: project.team[0]?.name || 'Project Team', note: `Initial ${type.toLowerCase()} upload`, size: `${index + 1}.2 MB` }],
  }));
});

export function getDocuments(projectId: string): ProjectDocument[] {
  return documentsByProject[projectId] ?? [];
}

export function addDocument(projectId: string, document: ProjectDocument) {
  documentsByProject[projectId] = [...(documentsByProject[projectId] ?? []), document];
  notifyMockDataChanged();
}

export function updateDocument(projectId: string, document: ProjectDocument) {
  documentsByProject[projectId] = (documentsByProject[projectId] ?? []).map((item) => item.id === document.id ? document : item);
  notifyMockDataChanged();
}

export function addProject(project: Project) {
  projects.push(project);
  formsByProject[project.id] = [];
  expensesByProject[project.id] = [];
  materialsByProject[project.id] = [];
  documentsByProject[project.id] = [];
  notifyMockDataChanged();
}

export function getAIQA(project: Project): AIQA[] {
  const remaining = project.budget - project.spent;
  const spentPct = Math.round((project.spent / project.budget) * 100);
  return [
    {
      question: 'How much have we spent on steel?',
      answer: `As of the latest expense records, you have spent ₹1,42,000 on steel for ${project.name}. This includes two purchases from Kutch Steel Works — ₹78,000 for 1.2 tonne of 12mm TMT bars (28 Aug) and ₹32,000 for 0.5 tonne of 8mm bars (20 Jul), plus an additional ₹32,000 recorded under steel reinforcement in the materials tracker.`,
      sources: [
        { label: 'Expense — Kutch Steel Works (28 Aug)', type: 'Expense' },
        { label: 'Expense — Kutch Steel Works (20 Jul)', type: 'Expense' },
        { label: 'Materials — TMT Steel Bars', type: 'Material' },
      ],
    },
    {
      question: 'Which forms contain the plot number?',
      answer: `The plot number "${project.masterInfo.plotNumber}" appears in 4 of your project forms: Building Permission Application, Property Tax Assessment Form, Land Use Verification, and Structural Stability Certificate. All four are synced from the Master Project Information. The Completion Certificate Application does not currently include the plot number and is marked as a draft.`,
      sources: [
        { label: 'Building Permission Application', type: 'Form' },
        { label: 'Property Tax Assessment Form', type: 'Form' },
        { label: 'Land Use Verification', type: 'Form' },
        { label: 'Structural Stability Certificate', type: 'Form' },
      ],
    },
    {
      question: 'What is currently over budget?',
      answer: `Overall, ${project.name} is within budget — you have spent ₹${(project.spent / 100000).toFixed(1)}L of ₹${(project.budget / 100000).toFixed(1)}L (${spentPct}%). However, the Cement category is trending slightly above the proportional spend rate at ${Math.round(spentPct * 1.1)}% of its allocated budget, and the Plumbing expense from Aqua Flow Pipes (₹28,000, dated 15 Jul) is marked as Overdue. I recommend reviewing the cement procurement plan for the finishing phase.`,
      sources: [
        { label: 'Budget Summary', type: 'Project' },
        { label: 'Expense — Aqua Flow Pipes (Overdue)', type: 'Expense' },
        { label: 'Materials — Cement', type: 'Material' },
      ],
    },
    {
      question: `What is the plot area for ${project.name}?`,
      answer: `The plot area recorded in the Master Project Information is ${project.masterInfo.plotArea} (Survey No. ${project.masterInfo.surveyNumber}). This field is currently under review — a proposed change from 2,400 sq.ft to 2,500 sq.ft is pending synchronization across 4 linked forms.`,
      sources: [
        { label: 'Master Project Information', type: 'Project' },
        { label: 'Form Sync — Plot Area', type: 'Form' },
      ],
    },
    {
      question: 'Give me a budget summary for this project.',
      answer: `Here is the budget summary for ${project.name}:\n\n• Total Budget: ₹${(project.budget / 100000).toFixed(1)}L\n• Spent: ₹${(project.spent / 100000).toFixed(1)}L (${spentPct}%)\n• Remaining: ₹${(remaining / 100000).toFixed(1)}L (${100 - spentPct}%)\n• Top spending categories: Steel, Labour, Bricks\n• Overdue payments: 1 (₹28,000 — Aqua Flow Pipes)\n\nThe project is financially on track at ${project.progress}% completion.`,
      sources: [
        { label: 'Budget Summary', type: 'Project' },
        { label: 'Expenses Ledger', type: 'Expense' },
      ],
    },
  ];
}
