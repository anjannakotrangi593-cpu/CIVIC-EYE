import { ComplaintCategory } from '../types';

export interface CategoryInfo {
  id: ComplaintCategory;
  name: string;
  shortName: string;
  iconName: string;
  description: string;
  subcategories: string[];
  isElectricalHazard?: boolean;
  department: string;
  badgeBg: string;
  badgeColor: string;
}

export const CATEGORIES: Record<ComplaintCategory, CategoryInfo> = {
  garbage: {
    id: 'garbage',
    name: 'Garbage Collection',
    shortName: 'Garbage',
    iconName: 'Trash2',
    description: 'Waste disposal, overflowing bins, uncollected trash, illegal dumping',
    subcategories: [
      'Garbage not collected for days',
      'Overflowing village public bin',
      'Waste dumped near public road',
      'Dead animal disposal',
      'Marketplace waste cleanup'
    ],
    department: 'Sanitation Department',
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
    badgeColor: '#D97706'
  },
  road: {
    id: 'road',
    name: 'Road Damage and Repairs',
    shortName: 'Road Damage',
    iconName: 'AlertTriangle',
    description: 'Potholes, broken roads, cave-ins, damaged culverts',
    subcategories: [
      'Potholes on main road',
      'Broken road or washed-out path',
      'Damaged culvert / bridge crack',
      'Fallen road signage or barrier',
      'Muddy or waterlogged road stretch'
    ],
    department: 'Public Works / Gram Panchayat Works',
    badgeBg: 'bg-orange-100 text-orange-800 border-orange-200',
    badgeColor: '#EA580C'
  },
  streetlight: {
    id: 'streetlight',
    name: 'Street Light Problems',
    shortName: 'Street Light',
    iconName: 'Lightbulb',
    description: 'Non-functional lights, flickering bulbs, damaged lamp posts',
    subcategories: [
      'Street light not working / dark street',
      'Flickering lamp or bulb burned out',
      'Damaged or tilted light pole',
      'Timer / switchboard malfunction',
      'Exposed wiring on street pole'
    ],
    department: 'Panchayat Electrical Maintenance',
    badgeBg: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    badgeColor: '#CA8A04'
  },
  water: {
    id: 'water',
    name: 'Water Supply Problems',
    shortName: 'Water Supply',
    iconName: 'Droplets',
    description: 'Interrupted water, pipeline leaks, contaminated drinking water',
    subcategories: [
      'Drinking water supply interrupted',
      'Underground pipeline burst / leak',
      'Contaminated / discolored water',
      'Public handpump broken',
      'Overhead water tank issue'
    ],
    department: 'Rural Water Supply Board',
    badgeBg: 'bg-blue-100 text-blue-800 border-blue-200',
    badgeColor: '#2563EB'
  },
  drainage: {
    id: 'drainage',
    name: 'Drainage & Sewage Problems',
    shortName: 'Drainage',
    iconName: 'Waves',
    description: 'Blocked gutters, sewage overflow, stagnant wastewater',
    subcategories: [
      'Blocked open drain / gutter clogged',
      'Sewage water overflowing on road',
      'Stagnant water breeding mosquitoes',
      'Broken drain cover / slab',
      'Septic tank leakage'
    ],
    department: 'Drainage & Public Health',
    badgeBg: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    badgeColor: '#0891B2'
  },
  electricity: {
    id: 'electricity',
    name: 'Electricity Services / Electrical Works',
    shortName: 'Electricity',
    iconName: 'Zap',
    description: 'Power outages, sparking transformers, exposed cables, fallen electric poles',
    subcategories: [
      'Unscheduled village power outage',
      'Fallen electric pole or sagging wire',
      'Exposed high-voltage live wire',
      'Faulty / sparking transformer',
      'Service line damaged or burnt meter'
    ],
    isElectricalHazard: true,
    department: 'State Electricity Distribution Co.',
    badgeBg: 'bg-red-100 text-red-800 border-red-200',
    badgeColor: '#DC2626'
  },
  other: {
    id: 'other',
    name: 'Other Village Services',
    shortName: 'Others',
    iconName: 'MoreHorizontal',
    description: 'Custom civic issue not covered by standard categories',
    subcategories: [
      'Community hall or school issue',
      'Public park / playground maintenance',
      'Tree branch trimming needed',
      'Public health / pest spraying',
      'Other civic grievance'
    ],
    department: 'Gram Panchayat General Admin',
    badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
    badgeColor: '#7C3AED'
  }
};
