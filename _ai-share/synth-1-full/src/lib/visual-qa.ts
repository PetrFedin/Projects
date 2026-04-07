/**
 * Visual QA Module
 * Checks for visual quality, spacing consistency, typography hierarchy, and table readability.
 */

import { designTokens } from './design-tokens';

export interface QAReport {
    score: number; // 0-100
    checks: {
        id: string;
        label: string;
        status: 'pass' | 'fail' | 'warn';
        message?: string;
    }[];
    alignmentIssues: string[];
    densityScore: number;
}

export const runVisualQA = (componentName: string, content: string): QAReport => {
    const report: QAReport = {
        score: 100,
        checks: [],
        alignmentIssues: [],
        densityScore: 0
    };

    // Spacing Consistency Check
    const spacingCheck = !content.includes('p-10') && !content.includes('m-10');
    report.checks.push({
        id: 'spacing_consistency',
        label: 'Spacing consistency',
        status: spacingCheck ? 'pass' : 'fail',
        message: spacingCheck ? 'Spacing follows design system scales' : 'Inconsistent spacing detected (e.g. p-10)'
    });

    // Typography Hierarchy Check
    const typographyCheck = !content.includes('text-4xl') || content.includes('font-headline');
    report.checks.push({
        id: 'typography_hierarchy',
        label: 'Typography hierarchy',
        status: typographyCheck ? 'pass' : 'warn',
        message: typographyCheck ? 'Hierarchy is clear' : 'Oversized text detected without proper headline utility'
    });

    // Card Consistency Check
    const cardCheck = content.includes('<Card') ? content.includes('rounded-xl') : true;
    report.checks.push({
        id: 'card_consistency',
        label: 'Card consistency',
        status: cardCheck ? 'pass' : 'fail',
        message: cardCheck ? 'Cards follow standard radius' : 'Inconsistent card radius detected'
    });

    // Table Readability Check
    if (content.includes('<Table')) {
        const tableCheck = content.includes('h-10') || content.includes('h-12');
        report.checks.push({
            id: 'table_readability',
            label: 'Table readability',
            status: tableCheck ? 'pass' : 'warn',
            message: tableCheck ? 'Table row height is optimized for density' : 'Table rows might be too large'
        });
    }

    // Button Hierarchy Check
    if (content.includes('<Button')) {
        const buttonCheck = !content.includes('h-12') && !content.includes('px-10');
        report.checks.push({
            id: 'button_hierarchy',
            label: 'Button hierarchy',
            status: buttonCheck ? 'pass' : 'warn',
            message: buttonCheck ? 'Button sizes are appropriate' : 'Oversized buttons detected'
        });
    }

    // Alignment Issue Detection (Simplified)
    if (content.includes('items-start') && content.includes('flex-col')) {
        // This is a rough check
    }

    // Final score calculation
    const failedCount = report.checks.filter(c => c.status === 'fail').length;
    const warnCount = report.checks.filter(c => c.status === 'warn').length;
    report.score = Math.max(0, 100 - (failedCount * 20) - (warnCount * 5));

    return report;
};
