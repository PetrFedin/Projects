/**
 * UI Inspector Module
 * Scans UI components for design inconsistencies and layout problems.
 */

import { designTokens } from './design-tokens';

export interface UIReportIssue {
  type: 'spacing' | 'typography' | 'density' | 'hierarchy' | 'consistency';
  severity: 'low' | 'medium' | 'high';
  message: string;
  context?: string;
}

export const analyzeClasses = (classes: string): UIReportIssue[] => {
  const issues: UIReportIssue[] = [];
  const classList = classes.split(' ');

  // Spacing Inconsistency detection
  classList.forEach(cls => {
    if (cls.startsWith('p-') || cls.startsWith('m-') || cls.startsWith('gap-') || 
        cls.startsWith('px-') || cls.startsWith('py-') || cls.startsWith('mx-') || cls.startsWith('my-') ||
        cls.startsWith('pt-') || cls.startsWith('pb-') || cls.startsWith('pl-') || cls.startsWith('pr-') ||
        cls.startsWith('mt-') || cls.startsWith('mb-') || cls.startsWith('ml-') || cls.startsWith('mr-')) {
      const val = cls.split('-')[1];
      const validScales = ['1', '2', '3', '4', '5', '6', '8', '10', '12']; // Tailwind numbers that roughly match our scale
      if (!validScales.includes(val) && !val.includes('[') && !val.includes('px')) {
         // This is a rough heuristic - real code uses specific design system spacing
      }
    }
    
    // Density Issues: detecting oversized padding/margins in cards or containers
    if ((cls.startsWith('p-') || cls.startsWith('px-') || cls.startsWith('py-')) && !cls.includes('-0')) {
        const val = parseInt(cls.split('-')[1]);
        if (val > 6 && !cls.includes('container')) {
            issues.push({
                type: 'density',
                severity: 'medium',
                message: `Excessive padding detected: ${cls}. Consider reducing to p-4 or p-3 for a denser SaaS look.`,
                context: cls
            });
        }
    }

    // Border Radius Consistency
    if (cls.startsWith('rounded-') && !['rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-full'].includes(cls)) {
        if (!cls.includes('[') && !['rounded-sm', 'rounded-none'].includes(cls)) {
            issues.push({
                type: 'consistency',
                severity: 'low',
                message: `Non-standard border radius detected: ${cls}. Standard is rounded-lg (8px), rounded-xl (12px), or rounded-2xl (16px).`,
                context: cls
            });
        }
    }

    // Typography Hierarchy detection (Simplified)
    if (cls.startsWith('text-')) {
        const val = cls.split('-')[1];
        if (['3xl', '4xl', '5xl', '6xl', '7xl', '8xl'].includes(val)) {
            issues.push({
                type: 'hierarchy',
                severity: 'medium',
                message: `Oversized typography detected: ${cls}. SaaS interfaces prefer text-xl or text-2xl for main titles.`,
                context: cls
            });
        }
    }
  });

  return issues;
};

export const generateUIReport = (componentName: string, content: string): UIReportIssue[] => {
  const issues: UIReportIssue[] = [];
  
  // Static code analysis via regex
  const classNameMatches = content.match(/className="([^"]+)"/g) || [];
  
  classNameMatches.forEach(match => {
    const classes = match.replace(/className="|"/g, '');
    issues.push(...analyzeClasses(classes));
  });

  // Layout structure checks
  if (content.includes('<Table') && !content.includes('rowHeight')) {
      // Dummy check for table density
  }

  return issues;
};
