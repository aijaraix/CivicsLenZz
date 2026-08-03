import { Official, Bill, PromiseItem, CampaignFinance, GrantContract, ScraperJob } from "./types";

// Dynamic imports of all the individual data files so they are explicitly tracked and organized
const officialsContext = import.meta.glob("./data/officials/*.json", { eager: true });
const billsContext = import.meta.glob("./data/bills/*.json", { eager: true });
const promisesContext = import.meta.glob("./data/promises/*.json", { eager: true });
const financeContext = import.meta.glob("./data/finances/*.json", { eager: true });
const spendingContext = import.meta.glob("./data/spending/*.json", { eager: true });
const scrapersContext = import.meta.glob("./data/scrapers/*.json", { eager: true });

function getValues(context: Record<string, any>): any[] {
  return Object.values(context).map(module => module.default || module);
}

export const mockOfficials: Official[] = getValues(officialsContext) as Official[];
export const mockBills: Bill[] = getValues(billsContext) as Bill[];
export const mockPromises: PromiseItem[] = getValues(promisesContext) as PromiseItem[];
export const mockCampaignFinance: CampaignFinance[] = getValues(financeContext) as CampaignFinance[];
export const mockSpending: GrantContract[] = getValues(spendingContext) as GrantContract[];
export const mockScrapers: ScraperJob[] = getValues(scrapersContext) as ScraperJob[];

// Kept this for backwards compatibility if anyone relies on it
export const mockFinance = mockCampaignFinance;
