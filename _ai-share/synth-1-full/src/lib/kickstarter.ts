import type { KickstarterProject, KickstarterUpdate, KickstarterFaq } from './types';
import projectData from './data/kickstarter-projects.json';
import updatesData from './data/kickstarter-updates.json';
import { products } from './products';

// We assert the type here because the imported JSON is not typed.
const projects: KickstarterProject[] = projectData as any[];
const updates: KickstarterUpdate[] = updatesData as any[];


export const kickstarterProjects: KickstarterProject[] = projects.map(p => {
    const product = products.find(prod => prod.id === p.productId);
    const goal = p.fundingModel === 'monetary' ? p.goal : p.targetQuantity;
    const pledged = p.fundingModel === 'monetary' ? p.currentRevenue : p.currentQuantity;
    const progress = (pledged / goal) * 100;
    
    return {
        ...p,
        pledged: pledged,
        goal: goal,
        backers: p.currentQuantity, // Assuming 1 backer = 1 quantity for now
        daysLeft: Math.max(0, Math.ceil((new Date(p.endAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))),
        isFunded: progress >= 100,
        imageUrl: product?.images[0].url || p.media.find(m => m.type === 'image')?.url || '',
        imageHint: product?.images[0].hint || p.tags?.join(' ') || 'fashion campaign',
        updates: updates.filter(u => u.campaignId === p.id),
        faqs: p.faqs || [],
        product: product, // Embed the full product object
    }
});
