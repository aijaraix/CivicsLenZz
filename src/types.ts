/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Official {
  id: string;
  name: string;
  photoUrl: string;
  currentTitle: string;
  level: "Federal" | "State" | "County" | "Municipal" | "Special District";
  jurisdiction: string;
  district?: string;
  party: "Republican" | "Democrat" | "Independent" | "Nonpartisan";
  contact: {
    email?: string;
    phone?: string;
    website?: string;
    office?: string;
    socials?: {
      twitter?: string;
      facebook?: string;
    };
  };
  bio: string;
  education: string[];
  background: string[];
  termStart: string;
  termEnd: string;
  nextElection: string;
  attendanceRate: number; // e.g. 96
  votingParticipation: number; // e.g. 98
  promiseFulfillment: {
    total: number;
    completed: number;
    inProgress: number;
    notStarted: number;
    broken: number;
  };
  seatOfPower?: {
    name: string;
    establishmentDate: string;
    constituentsCount: number;
    authorityScope: string;
    termLimitRestrictions: string;
    yearlySalary: number;
    activePredecessors: { name: string; party: string; tenure: string }[];
    successionLine: string[];
    seatStabilityStatus: "Stable" | "Contested" | "Upcoming Vacancy";
  };
  campaignMonitoring?: {
    websiteUrl: string;
    crawlerStatus: "Active Tracking" | "Suspended" | "Failed Check";
    lastChecked: string;
    historyScrapeLog: { date: string; changeType: string; description: string }[];
    fundingGoal?: number;
    socialHandlesCount: number;
    monitoredEmailsSentCount?: number;
    policyShiftsDetected: { date: string; category: string; originalText: string; revisedText: string }[];
  };
  committees?: string[];
  billsSponsoredCount?: number;
  billsCoSponsoredCount?: number;
  partyLineVotingRate?: number;
  lobbyistMeetingsCount?: number;
  financialAssetsValueRange?: string;
  financialLiabilitiesValueRange?: string;
  registeredLobbyistsTiesCount?: number;
  trustScore?: number;
  extendedProfile?: {
    family?: {
      maritalStatus?: string;
      numberOfMarriages?: number;
      children?: string;
      divorces?: string;
      spouse?: string;
    };
    education?: {
      highSchool?: string;
      university?: string[];
    };
    legalHistory?: {
      foreclosures?: string[];
      bankruptcies?: string[];
      criminalRecords?: string[];
      civilLawsuits?: string[];
    };
    votingTendencies?: string;
    knownAssociates?: string[];
    expandedSocials?: { platform: string; url: string; handle: string; discoveryDate: string }[];
    ethicsInvestigations?: { date: string; allegation: string; status: string; source: string }[];
    stockTrading?: { volumeRange: string; flags: string[]; recentTrades: string[] };
    keyVotes?: { bill: string; vote: "Yea" | "Nay" | "Abstain"; significance: string; source: string }[];
    staffTies?: { name: string; role: string; revolvingDoorFlag: boolean }[];
    mediaSentiment?: { unofficialSentiment: string; topTopics: string[] };
  };
  sources?: {
    biographyUrl?: string;
    seatOfPowerUrl?: string;
    campaignFinancesUrl?: string;
    votingRecordUrl?: string;
    extendedProfileUrl?: string;
  };
}

export interface Bill {
  id: string;
  number: string;
  title: string;
  summary: string;
  fullTextSimulated: string;
  status: "Introduced" | "In Committee" | "Passed Chamber" | "Passed Both Chambers" | "Signed Into Law" | "Vetoed";
  sponsors: string[];
  coSponsors: string[];
  votes: {
    officialName: string;
    position: "Yes" | "No" | "Abstain" | "Absent";
    date: string;
  }[];
  fiscalImpact?: string;
  affectedParties?: string;
  lastUpdated: string;
}

export interface PromiseItem {
  id: string;
  officialId: string;
  officialName: string;
  title: string;
  statement: string;
  context: string;
  dateMade: string;
  category: string;
  status: "Completed" | "In Progress" | "Not Started" | "Broken" | "Partially Fulfilled" | "Unclear";
  evidence: string;
  confidenceScore: number;
}

export interface CampaignFinance {
  officialId: string;
  cycle: string;
  totalRaised: number;
  totalSpent: number;
  cashOnHand: number;
  topDonors: { name: string; type: "PAC" | "Individual" | "Corporate"; amount: number }[];
  industries: { name: string; amount: number }[];
}

export interface GrantContract {
  id: string;
  title: string;
  jurisdiction: string;
  amountAwarded: number;
  amountObligated: number;
  amountSpent: number;
  receivingAgency: string;
  awardingAgency: string;
  contractor: string;
  status: "On Track" | "Delayed" | "Completed" | "Under Audit";
  purpose: string;
  timeline: string;
  county: string;
}

export interface ScraperJob {
  id: string;
  name: string;
  source: string;
  status: "Success" | "Failed" | "Running" | "Scheduled";
  lastRun: string;
  recordsExtracted: number;
  health: number; // percent
}
