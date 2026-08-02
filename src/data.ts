/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Official, Bill, PromiseItem, CampaignFinance, GrantContract, ScraperJob } from "./types";

export const mockOfficials: Official[] = [
  {
    id: "ga-gov-kemp",
    name: "Brian Kemp",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Gov._Brian_Kemp_%28cropped%29.jpg/800px-Gov._Brian_Kemp_%28cropped%29.jpg",
    currentTitle: "Governor of Georgia",
    level: "State",
    jurisdiction: "State of Georgia",
    party: "Republican",
    contact: {
      email: "governor@georgia.gov",
      phone: "(404) 656-1776",
      website: "https://gov.georgia.gov",
      office: "206 Washington Street, Suite 203, State Capitol, Atlanta, GA 30334",
      socials: {
        twitter: "https://twitter.com/GovKemp",
        facebook: "https://facebook.com/GovKemp"
      }
    },
    bio: "Brian Kemp has served as the 83rd Governor of Georgia since 2019. He previously served as the 27th Secretary of State of Georgia from 2010 to 2018.",
    education: ["B.S. University of Georgia"],
    background: ["Business Owner", "Georgia State Senator", "Secretary of State"],
    termStart: "2023-01-09",
    termEnd: "2027-01-11",
    nextElection: "2026-11-03 (Term Limited)",
    attendanceRate: 99.1,
    votingParticipation: 100, 
    promiseFulfillment: {
      total: 15,
      completed: 10,
      inProgress: 4,
      notStarted: 1,
      broken: 0
    },
    seatOfPower: {
      name: "Georgia Gubernatorial Executive Seat",
      establishmentDate: "1776-04-15",
      constituentsCount: 11029227,
      authorityScope: "Veto authority, state agency appointments, line-item budget controls, National Guard commander-in-chief, clemency board appointments.",
      termLimitRestrictions: "Two consecutive four-year terms",
      yearlySalary: 175000,
      activePredecessors: [
        { name: "Nathan Deal", party: "Republican", tenure: "2011 - 2019" },
        { name: "Sonny Perdue", party: "Republican", tenure: "2003 - 2011" },
        { name: "Roy Barnes", party: "Democrat", tenure: "1999 - 2003" }
      ],
      successionLine: [
        "Lieutenant Governor Burt Jones",
        "Speaker of the House Jon Burns"
      ],
      seatStabilityStatus: "Upcoming Vacancy"
    },
    campaignMonitoring: {
      websiteUrl: "https://briankemp.com",
      crawlerStatus: "Active Tracking",
      lastChecked: "2026-05-20 02:45 UTC",
      historyScrapeLog: [
        { date: "2026-05-18", changeType: "Homepage Layout", description: "Updated hero section messaging to focus on economic development." }
      ],
      fundingGoal: 100000000,
      socialHandlesCount: 3,
      monitoredEmailsSentCount: 38,
      policyShiftsDetected: []
    },
    committees: ["State Properties Commission (Chair)", "Georgia Technology Authority"],
    billsSponsoredCount: 22,
    billsCoSponsoredCount: 45,
    partyLineVotingRate: 98.1,
    lobbyistMeetingsCount: 215,
    financialAssetsValueRange: "$5M - $10M (Liquid, land trust, savings)",
    financialLiabilitiesValueRange: "None",
    registeredLobbyistsTiesCount: 38,
    trustScore: 92.4,
    extendedProfile: {
      family: {
        maritalStatus: "Married",
        numberOfMarriages: 1,
        divorces: "0",
        children: "3 daughters (Jarrett, Lucy, Amy Porter)",
        spouse: "Marty Kemp"
      },
      education: {
        highSchool: "Clarke Central High School (Athens, GA)",
        university: ["University of Georgia (B.S. Agriculture)"]
      },
      legalHistory: {
        foreclosures: ["None found in public records"],
        bankruptcies: ["None found in public records"],
        criminalRecords: ["None found in public records"],
        civilLawsuits: ["Multiple official capacity lawsuits (e.g., related to election administration and executive orders)"]
      },
      votingTendencies: "Consistently votes and signs legislation aligning with conservative priorities: tax reduction, business deregulation, and stringent election administration protocols. Focuses heavily on state-level economic development and workforce training.",
      knownAssociates: ["Chris Carr", "Brad Raffensperger"],
      expandedSocials: [
        { platform: "Twitter (Personal)", url: "https://twitter.com/BrianKempGA", handle: "@BrianKempGA", discoveryDate: "2026-06-01" },
        { platform: "Instagram", url: "https://instagram.com/govkemp", handle: "@govkemp", discoveryDate: "2026-06-01" }
      ],
      ethicsInvestigations: [
        { date: "2018-08-01", allegation: "Campaign finance reporting anomalies during primary.", status: "Dismissed/No Action", source: "State Ethics Commission (Official)" }
      ],
      stockTrading: {
        volumeRange: "$100k - $500k",
        flags: ["No major red flags detected via automated cross-referencing."],
        recentTrades: ["Index Funds (Vanguard) - 2026-01-15"]
      },
      keyVotes: [
        { bill: "SB-202 (Election Integrity Act)", vote: "Yea", significance: "Major state voting regulation overhaul.", source: "Georgia General Assembly (Official)" }
      ],
      staffTies: [
        { name: "Trey Kilpatrick", role: "Chief of Staff", revolvingDoorFlag: false }
      ],
      mediaSentiment: {
        unofficialSentiment: "Generally viewed positively by local conservative media for economic leadership, though occasionally critiqued by national media regarding election policies.",
        topTopics: ["Electric Vehicle Manufacturing Jobs", "Tax Refunds", "Election Integrity"]
      }
    }
  },
  {
    id: "fl-gov-desantis",
    name: "Ron DeSantis",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Gov._Ron_DeSantis_Official_Portrait_%28cropped%29.jpg/800px-Gov._Ron_DeSantis_Official_Portrait_%28cropped%29.jpg", // Official Portrait
    currentTitle: "Governor of Florida",
    level: "State",
    jurisdiction: "State of Florida",
    party: "Republican",
    contact: {
      email: "governorron.desantis@eog.myflorida.com",
      phone: "(850) 717-9337",
      website: "https://www.myflorida.com",
      office: "The Capitol, 400 S. Monroe St., Tallahassee, FL 32399",
      socials: {
        twitter: "https://twitter.com/GovRonDeSantis",
        facebook: "https://facebook.com/GovRonDeSantis"
      }
    },
    bio: "Ron DeSantis has served as the 46th Governor of Florida since 2019. Previously, he served as a U.S. Representative representing Florida's 6th Congressional District from 2013 to 2018.",
    education: ["B.A. Yale University", "J.D. Harvard Law School"],
    background: ["U.S. Navy JAG Officer", "Federal Prosecutor", "U.S. Representative"],
    termStart: "2023-01-03",
    termEnd: "2027-01-05",
    nextElection: "2026-11-03 (Term Limited)",
    attendanceRate: 98.4,
    votingParticipation: 100, // Executive signings
    promiseFulfillment: {
      total: 12,
      completed: 7,
      inProgress: 3,
      notStarted: 1,
      broken: 1
    },
    seatOfPower: {
      name: "Florida Gubernatorial Executive Seat",
      establishmentDate: "1845-06-25",
      constituentsCount: 22244823,
      authorityScope: "Veto authority, state agency appointments, line-item budget controls, National Guard commander-in-chief, clemency operations.",
      termLimitRestrictions: "Two consecutive four-year terms",
      yearlySalary: 134181,
      activePredecessors: [
        { name: "Rick Scott", party: "Republican", tenure: "2011 - 2019" },
        { name: "Charlie Crist", party: "Republican/Independent", tenure: "2007 - 2011" },
        { name: "Jeb Bush", party: "Republican", tenure: "1999 - 2007" }
      ],
      successionLine: [
        "Lieutenant Governor Jeanette Nuñez",
        "Attorney General Ashley Moody",
        "Chief Financial Officer Jimmy Patronis",
        "Commissioner of Agriculture Wilton Simpson"
      ],
      seatStabilityStatus: "Upcoming Vacancy"
    },
    campaignMonitoring: {
      websiteUrl: "https://rondesantis.com",
      crawlerStatus: "Active Tracking",
      lastChecked: "2026-05-20 02:45 UTC",
      historyScrapeLog: [
        { date: "2026-05-18", changeType: "Homepage Layout", description: "Updated hero section messaging to focus on tax-relief and education legacy." },
        { date: "2026-05-12", changeType: "Policy Stance Update", description: "Refined tax policy text supporting expansion of standard deduction." },
        { date: "2026-04-20", changeType: "Ad Campaign Launched", description: "Added custom embedded YouTube media files tracking statewide accomplishments." }
      ],
      fundingGoal: 150000000,
      socialHandlesCount: 3,
      monitoredEmailsSentCount: 42,
      policyShiftsDetected: [
        { date: "2026-05-12", category: "Taxation", originalText: "Ensure property tax surges remain strictly capped by state law.", revisedText: "Implement direct relief and zero assessment surges for homeowners across the state." }
      ]
    },
    committees: ["Florida Cabinet (Chair)", "State Board of Education (Chair)", "Armory Board"],
    billsSponsoredCount: 15,
    billsCoSponsoredCount: 38,
    partyLineVotingRate: 97.4,
    lobbyistMeetingsCount: 322,
    financialAssetsValueRange: "$10M - $25M (Liquid, land trust, savings, pensions)",
    financialLiabilitiesValueRange: "None",
    registeredLobbyistsTiesCount: 48,
    trustScore: 94.2,
    extendedProfile: {
      family: {
        maritalStatus: "Married",
        numberOfMarriages: 1,
        divorces: "0",
        children: "3 children (Madison, Mason, Mamie)",
        spouse: "Casey DeSantis"
      },
      education: {
        highSchool: "Dunedin High School (Dunedin, FL)",
        university: ["Yale University (B.A. History)", "Harvard Law School (J.D.)"]
      },
      legalHistory: {
        foreclosures: ["None found in public records"],
        bankruptcies: ["None found in public records"],
        criminalRecords: ["None found in public records"],
        civilLawsuits: ["Multiple official capacity lawsuits typical for a sitting governor (e.g., redistricting, education policies, executive suspensions)"]
      },
      votingTendencies: "Strong focus on conservative social policies, education reform, environmental conservation (Everglades restoration), and fiscal conservatism. Exhibits high willingness to utilize executive authority.",
      knownAssociates: ["Jeanette Nuñez", "Ashley Moody", "Jimmy Patronis"],
      expandedSocials: [
        { platform: "Twitter (Personal/Campaign)", url: "https://twitter.com/RonDeSantis", handle: "@RonDeSantis", discoveryDate: "2026-06-01" },
        { platform: "Instagram", url: "https://instagram.com/flgovrondesantis", handle: "@flgovrondesantis", discoveryDate: "2026-06-01" }
      ]
    }
  },
  {
    id: "fl-fed-rubio",
    name: "Marco Rubio",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Senator_Rubio_official_portrait.jpg/800px-Senator_Rubio_official_portrait.jpg",
    currentTitle: "U.S. Senator for Florida",
    level: "Federal",
    jurisdiction: "United States (Florida)",
    party: "Republican",
    contact: {
      email: "senator@rubio.senate.gov",
      phone: "(202) 224-3041",
      website: "https://www.rubio.senate.gov",
      office: "284 Russell Senate Office Building, Washington, DC 20510",
      socials: {
        twitter: "https://twitter.com/marcorubio"
      }
    },
    bio: "Marco Rubio is the senior United States Senator from Florida, in office since 2011. He previously served as Speaker of the Florida House of Representatives from 2006 to 2008.",
    education: ["B.S. University of Florida", "J.D. University of Miami Law School"],
    background: ["City Commissioner (West Miami)", "Florida House Representative", "Attorney"],
    termStart: "2023-01-03",
    termEnd: "2029-01-03",
    nextElection: "2028-11-07",
    attendanceRate: 93.7,
    votingParticipation: 94.2,
    promiseFulfillment: {
      total: 8,
      completed: 4,
      inProgress: 2,
      notStarted: 1,
      broken: 1
    },
    seatOfPower: {
      name: "United States Senate - Class III Seat for Florida",
      establishmentDate: "1845-07-01",
      constituentsCount: 22244823,
      authorityScope: "Federal high chamber power, judicial/treaty confirmations, legislative bills sponsorship, appropriations oversight.",
      termLimitRestrictions: "None",
      yearlySalary: 174000,
      activePredecessors: [
        { name: "George LeMieux", party: "Republican", tenure: "2009 - 2011" },
        { name: "Mel Martinez", party: "Republican", tenure: "2005 - 2009" },
        { name: "Bob Graham", party: "Democrat", tenure: "1987 - 2005" }
      ],
      successionLine: [
        "Vacated seats require Governor-appointed interim replacement until next general election."
      ],
      seatStabilityStatus: "Stable"
    },
    campaignMonitoring: {
      websiteUrl: "https://marcorubio.com",
      crawlerStatus: "Active Tracking",
      lastChecked: "2026-05-20 03:00 UTC",
      historyScrapeLog: [
        { date: "2026-05-17", changeType: "Inbound Contribution", description: "Reported new national PAC fundraising event." },
        { date: "2026-05-09", changeType: "Campaign Platform", description: "Expanded policy remarks emphasizing family support credits." }
      ],
      fundingGoal: 45000000,
      socialHandlesCount: 4,
      monitoredEmailsSentCount: 88,
      policyShiftsDetected: [
        { date: "2026-05-09", category: "Family Policy", originalText: "Expand credit deductions for modern multi-child households.", revisedText: "Enforce direct $4,000 credit adjustments with complete step-phase safeguards." }
      ]
    },
    committees: ["Senate Select Committee on Intelligence (Vice Chair)", "Senate Committee on Foreign Relations", "Special Committee on Aging"],
    billsSponsoredCount: 247,
    billsCoSponsoredCount: 1104,
    partyLineVotingRate: 91.8,
    lobbyistMeetingsCount: 451,
    financialAssetsValueRange: "$1.5M - $4.0M (Mutual funds, real estate holdings)",
    financialLiabilitiesValueRange: "$500k - $1M (Home mortgages)",
    registeredLobbyistsTiesCount: 62,
    trustScore: 92.5,
    extendedProfile: {
      family: {
        maritalStatus: "Married",
        numberOfMarriages: 1,
        divorces: "0",
        children: "4 children (Amanda, Daniella, Anthony, Dominick)",
        spouse: "Jeanette Dousdebes Rubio"
      },
      education: {
        highSchool: "South Miami High School (Miami, FL)",
        university: ["Tarkio College", "Santa Fe Community College", "University of Florida (B.A. Political Science)", "University of Miami (J.D.)"]
      },
      legalHistory: {
        foreclosures: ["None found in public records"],
        bankruptcies: ["None found in public records"],
        criminalRecords: ["None found in public records"],
        civilLawsuits: ["None found in public records"]
      }
    }
  },
  {
    id: "fl-county-cava",
    name: "Daniella Levine Cava",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Daniella_Levine_Cava_headshot.jpg/800px-Daniella_Levine_Cava_headshot.jpg",
    currentTitle: "Mayor of Miami-Dade County",
    level: "County",
    jurisdiction: "Miami-Dade County",
    party: "Nonpartisan",
    contact: {
      email: "mayor@miamidade.gov",
      phone: "(305) 375-5071",
      website: "https://www.miamidade.gov/global/government/mayor",
      office: "111 NW 1st Street, Suite 2910, Miami, FL 33128"
    },
    bio: "Daniella Levine Cava has served as Mayor of Miami-Dade County since 2020. She has been an advocate for environmental resiliency, small business relief, and transit modernization.",
    education: ["B.A. Yale University", "M.S.W. Columbia University School of Social Work", "J.D. Columbia Law School"],
    background: ["Public Interest Attorney", "Guardian Ad Litem Director", "County Commissioner"],
    termStart: "2024-11-20",
    termEnd: "2028-11-21",
    nextElection: "2028-08-15 (Primary/General)",
    attendanceRate: 99.1,
    votingParticipation: 98.7,
    promiseFulfillment: {
      total: 10,
      completed: 5,
      inProgress: 4,
      notStarted: 1,
      broken: 0
    },
    seatOfPower: {
      name: "Miami-Dade County Strong Mayor Executive Seat",
      establishmentDate: "1957-07-21",
      constituentsCount: 2701767,
      authorityScope: "Direct administrative control of 28,000 county employees, management of $10B+ budget, appointments of key directors (Port, Aviation, Transit, Police).",
      termLimitRestrictions: "Two consecutive four-year terms",
      yearlySalary: 250000,
      activePredecessors: [
        { name: "Carlos A. Giménez", party: "Republican (Nonpartisan seat)", tenure: "2011 - 2020" },
        { name: "Carlos Alvarez", party: "Nonpartisan", tenure: "2004 - 2011" },
        { name: "Alex Penelas", party: "Democrat (Nonpartisan seat)", tenure: "1996 - 2004" }
      ],
      successionLine: [
        "Chief Operations Officer Jimmy Morales",
        "Board of County Commissioners Chairman"
      ],
      seatStabilityStatus: "Stable"
    },
    campaignMonitoring: {
      websiteUrl: "https://daniella.vote",
      crawlerStatus: "Active Tracking",
      lastChecked: "2026-05-20 01:30 UTC",
      historyScrapeLog: [
        { date: "2026-05-15", changeType: "Environmental Platform", description: "Added updated metrics on electric-bus procurements and water restoration milestones." },
        { date: "2026-04-22", changeType: "Fundraising Statement", description: "Published quarterly grassroots small-donor thank-you message." }
      ],
      fundingGoal: 8000000,
      socialHandlesCount: 3,
      monitoredEmailsSentCount: 35,
      policyShiftsDetected: [
        { date: "2026-05-15", category: "Transit", originalText: "Purchase clean fuel alternatives over the upcoming decade.", revisedText: "Enforce a complete 100% Zero-Emission transit mandate by the year 2030." }
      ]
    },
    committees: ["Miami-Dade Transportation Planning Organization (Board)", "South Florida Regional Planning Council"],
    billsSponsoredCount: 42,
    billsCoSponsoredCount: 95,
    partyLineVotingRate: 100, // Nonpartisan
    lobbyistMeetingsCount: 184,
    financialAssetsValueRange: "$2.0M - $6.5M (Private trusts, family enterprises, mutual funds)",
    financialLiabilitiesValueRange: "None",
    registeredLobbyistsTiesCount: 33,
    trustScore: 97.8,
    extendedProfile: {
      family: {
        maritalStatus: "Married",
        numberOfMarriages: 1,
        divorces: "0",
        children: "2 children (Eliza, Edward)",
        spouse: "Dr. Robert Cava"
      },
      education: {
        highSchool: "Private High School (New York, NY)",
        university: ["Yale University (B.A. Psychology)", "Columbia University (J.D. and M.S.W.)"]
      },
      legalHistory: {
        foreclosures: ["None found in public records"],
        bankruptcies: ["None found in public records"],
        criminalRecords: ["None found in public records"],
        civilLawsuits: ["None found in public records"]
      }
    }
  },
  {
    id: "fl-sd-oc-thompson",
    name: "Dr. Maria Thompson",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Profile_avatar_placeholder_large.png/800px-Profile_avatar_placeholder_large.png",
    currentTitle: "Orange County School Board Member (District 4)",
    level: "Special District",
    jurisdiction: "Orange County School District",
    party: "Nonpartisan",
    contact: {
      email: "maria.thompson@ocps.net",
      phone: "(407) 317-3236",
      website: "https://www.ocps.net"
    },
    bio: "Dr. Maria Thompson is an educator and school administrator who focuses on local curriculum standards, early childhood development, and high-contrast educational spending audits.",
    education: ["B.S. Florida State University", "Ed.D. University of Central Florida"],
    background: ["High School Principal", "PTA Director", "Academic Researcher"],
    termStart: "2022-11-22",
    termEnd: "2026-11-17",
    nextElection: "2026-08-18 (Primary/General)",
    attendanceRate: 97.5,
    votingParticipation: 96.8,
    promiseFulfillment: {
      total: 5,
      completed: 3,
      inProgress: 1,
      notStarted: 1,
      broken: 0
    },
    seatOfPower: {
      name: "Orange County School Board Seat - District 4",
      establishmentDate: "1969-12-01",
      constituentsCount: 206000,
      authorityScope: "Monitors local public school curriculum standards, acts on local educational audits, controls a portion of the $2.7B district budget, oversees principal staff.",
      termLimitRestrictions: "None",
      yearlySalary: 45722,
      activePredecessors: [
        { name: "John Doe", party: "Nonpartisan", tenure: "2014 - 2022" },
        { name: "Jane Smith", party: "Nonpartisan", tenure: "2008 - 2014" }
      ],
      successionLine: [
        "Vacant board seats are filled by Special Election inside Orange County District 4."
      ],
      seatStabilityStatus: "Contested"
    },
    campaignMonitoring: {
      websiteUrl: "https://mariathompsonforschoolboard.com",
      crawlerStatus: "Active Tracking",
      lastChecked: "2026-05-19 22:15 UTC",
      historyScrapeLog: [
        { date: "2026-05-10", changeType: "Parent Advisory Announcement", description: "Created school reading circle dockets and posted town-hall photos." }
      ],
      fundingGoal: 95000,
      socialHandlesCount: 2,
      monitoredEmailsSentCount: 12,
      policyShiftsDetected: []
    },
    committees: ["Orange County School Board Policy Committee", "OCPS Audit Advisory Committee"],
    billsSponsoredCount: 18,
    billsCoSponsoredCount: 34,
    partyLineVotingRate: 100, // Nonpartisan
    lobbyistMeetingsCount: 24,
    financialAssetsValueRange: "$200k - $500k (Teacher retirement pension, local bonds)",
    financialLiabilitiesValueRange: "$100k - $250k (Residential mortgage)",
    registeredLobbyistsTiesCount: 4,
    trustScore: 96.1,
    extendedProfile: {
      family: {
        maritalStatus: "Divorced",
        numberOfMarriages: 2,
        divorces: "1",
        children: "1 son",
        spouse: "None"
      },
      education: {
        highSchool: "Winter Park High School (Winter Park, FL)",
        university: ["Florida State University (B.S.)", "University of Central Florida (Ed.D.)"]
      },
      legalHistory: {
        foreclosures: ["None found in public records"],
        bankruptcies: ["None found in public records"],
        criminalRecords: ["None found in public records"],
        civilLawsuits: ["Divorce proceeding (2018)"]
      }
    }
  }
];

export const mockBills: Bill[] = [
  {
    id: "fl-sb-256",
    number: "CS/SB 256",
    title: "Employee Organizations (Public Sector Unions)",
    summary: "Renews requirements for public employee organizations representing teachers, municipal staff, and utility workers. Demands that representational groups maintain a 60% active dues-paying membership ratio to maintain certification, prohibits automatic paycheck deductions, and requires audits.",
    fullTextSimulated: "A bill to be entitled An act relating to employee organizations; amending s. 447.301, F.S.; prohibiting employee organizations from using paycheck payroll deductions ... requiring annual financial audits and establishing a 60 percent active registry threshold as a condition of continue representational certification ...",
    status: "Signed Into Law",
    sponsors: ["Senator Blaise Ingoglia"],
    coSponsors: ["Senator Debbie Mayfield"],
    votes: [
      { officialName: "Ron DeSantis", position: "Yes", date: "2023-05-09" },
      { officialName: "Marco Rubio", position: "Yes", date: "2023-05-09" } // Representative federal support
    ],
    fiscalImpact: "Directs Florida PERC (Public Employees Relations Commission) to spend an estimated $1.2M in annual oversight operations; adds administrative compliance costs to school districts.",
    affectedParties: "Public school teachers, police (exempted), municipal waste workers, firefighters (exempted), local utility workers.",
    lastUpdated: "2023-05-10"
  },
  {
    id: "fl-hb-3",
    number: "CS/CS/HB 3",
    title: "Online Safety for Minors",
    summary: "Prohibits minors under 14 from establishing social media accounts on highly addictive platforms; requires platforms to deploy age verification protocols and delete accounts of unverified minors.",
    fullTextSimulated: "An act relating to online safety for minors; creating s. 501.1735, F.S.; prohibiting social platforms with interactive features from onboarding minors ... enforcing secure independent age verification databases ... outlining penalties of up to $50k per violation.",
    status: "Signed Into Law",
    sponsors: ["Representative Tyler Sirois"],
    coSponsors: ["Representative Fiona McFarland"],
    votes: [
      { officialName: "Ron DeSantis", position: "Yes", date: "2024-03-25" }
    ],
    fiscalImpact: "Requires Florida Department of Legal Affairs to enforce legal compliance frameworks; litigation offset reserve is set at $5.0M.",
    affectedParties: "Florida families, teenagers under 16, social network platforms, age verification providers.",
    lastUpdated: "2024-03-26"
  }
];

export const mockPromises: PromiseItem[] = [
  {
    id: "p1",
    officialId: "fl-gov-desantis",
    officialName: "Ron DeSantis",
    title: "Establish $1.2 Billion Teacher Pay Boost",
    statement: "We will allocate an additional $1.2 billion in funding directly toward raising salaries for Florida classroom teachers.",
    context: "State of the State Address, Florida Capitol",
    dateMade: "2023-03-07",
    category: "Education Spending",
    status: "Completed",
    evidence: "Passed in Senate General Appropriations Bill H-1004; state educational allocations exceeded the specified threshold by allocating $1.25 billion in the 2023-2024 state budget. Verified on official transparency docket FL-TRANSP-25.",
    confidenceScore: 98.4
  },
  {
    id: "p2",
    officialId: "fl-gov-desantis",
    officialName: "Ron DeSantis",
    title: "0.5% Cap Adjustment on Property Assessment",
    statement: "I promise to freeze local municipal assessment rate surges to a standard maximum of half a percent next cycle.",
    context: "Orlando Regional Infrastructure Rally",
    dateMade: "2024-09-12",
    category: "Tax Reform",
    status: "In Progress",
    evidence: "Draft bill HB-1481 referred to Ways & Means on Jan 14, 2026. Pending final budget committee debate.",
    confidenceScore: 92.1
  },
  {
    id: "p3",
    officialId: "fl-county-cava",
    name: "Daniella Levine Cava",
    officialName: "Daniella Levine Cava",
    title: "100% Zero-Emission County Transit Fleet by 2030",
    statement: "Miami-Dade will completely replace our diesel transit services with zero-emission electric buses and heavy-rail expansions by 2030.",
    context: "Earth Day Resiliency Briefing",
    dateMade: "2021-04-22",
    category: "Environmental Transit",
    status: "In Progress",
    evidence: "Miami-Dade Transit ordered 75 Proterra electric lines, with 45 currently operational on South Dade corridors. Federal DOT Grant FL-INFRA-905 provided $14.5M in co-obligation.",
    confidenceScore: 95.0
  } as PromiseItem,
  {
    id: "p4",
    officialId: "fl-fed-rubio",
    officialName: "Marco Rubio",
    title: "Double the Child Tax Credit (Federal Expansion)",
    statement: "We must ensure families can deduct up to $4,000 per youth, matching cost-of-living adjustments directly in our tax code.",
    context: "Senate Committee Hearing on Children & Families",
    dateMade: "2024-02-14",
    category: "Federal Tax",
    status: "Partially Fulfilled",
    evidence: "The tax credit adjustment was expanded under the S.x bill package, but capped at $2,000 baseline with phase-outs. Active companion amendments pending committee reconciliation.",
    confidenceScore: 89.4
  }
];

export const mockCampaignFinance: CampaignFinance[] = [
  {
    officialId: "fl-gov-desantis",
    cycle: "2022-2026",
    totalRaised: 142500000,
    totalSpent: 124000000,
    cashOnHand: 18500000,
    topDonors: [
      { name: "Empower Florida PAC", type: "PAC", amount: 12400000 },
      { name: "Associated Industries of Florida PAC", type: "PAC", amount: 4800000 },
      { name: "Citadel LLC Associates", type: "Corporate", amount: 2500000 },
      { name: "Individual Small-Donor Base (<$100)", type: "Individual", amount: 18400000 }
    ],
    industries: [
      { name: "Real Estate & Land Development", amount: 28400000 },
      { name: "Energy, Utilities & Infrastructure", amount: 15600000 },
      { name: "Healthcare & Pharmaceuticals", amount: 11200000 },
      { name: "Defense Policy & Law Enforcement PACs", amount: 8900000 }
    ]
  },
  {
    officialId: "fl-county-cava",
    cycle: "2024-2028",
    totalRaised: 6200000,
    totalSpent: 4800000,
    cashOnHand: 1400000,
    topDonors: [
      { name: "South Florida Clean Water PAC", type: "PAC", amount: 850000 },
      { name: "Miami-Dade Affordable Housing Trust", type: "PAC", amount: 420000 },
      { name: "Individual Small-Donor Base (<$250", type: "Individual", amount: 2400000 }
    ],
    industries: [
      { name: "Tourism, Hotels & Hospitality Complexes", amount: 1200000 },
      { name: "Municipal Land Development & Housing", amount: 950000 },
      { name: "Coastal Engineering & Port Associations", amount: 620000 }
    ]
  }
];

export const mockSpending: GrantContract[] = [
  {
    id: "g1",
    title: "Everglades Coastal Wetlands Restoration (W-9405)",
    jurisdiction: "South Florida Water Management",
    amountAwarded: 45000000,
    amountObligated: 38000000,
    amountSpent: 24500000,
    receivingAgency: "South Florida Water Management Board",
    awardingAgency: "US Environmental Protection Agency (EPA)",
    contractor: "Coastal Engineering & Hydrology Inc.",
    status: "On Track",
    purpose: "Hydrologic mapping, canal redirections, and invasive species barrier installations across Dade and Broward counties.",
    timeline: "2024-06-01 to 2028-06-01",
    county: "Miami-Dade"
  },
  {
    id: "g2",
    title: "South Florida Rural High-Speed Broadband Grant (R-50)",
    jurisdiction: "DeSoto / Hardee Counties",
    amountAwarded: 12500000,
    amountObligated: 12500000,
    amountSpent: 5200000,
    receivingAgency: "Florida Department of Economic Opportunity",
    awardingAgency: "Federal Communications Commission (FCC)",
    contractor: "Broadband Systems South LLC",
    status: "Delayed",
    purpose: "Deploying high-frequency fiber cables to 4,500 rural addresses which previously registered as unserved.",
    timeline: "2025-01-15 to 2027-01-15",
    county: "Hardee"
  }
];

export const mockScrapers: ScraperJob[] = [
  {
    id: "s1",
    name: "Congress.gov Ingestion Pipeline (Senators & Representatives)",
    source: "Congress.gov Congressional API",
    status: "Success",
    lastRun: "2026-08-02 12:00 UTC",
    recordsExtracted: 535,
    health: 99.9
  },
  {
    id: "s2",
    name: "State-Level Legislative APIs (Nationwide Scaling: 15 States Active)",
    source: "OpenStates / State Senate APIs",
    status: "Success",
    lastRun: "2026-08-02 13:15 UTC",
    recordsExtracted: 32450,
    health: 98.7
  },
  {
    id: "s3",
    name: "State Campaign Finance & Ethics Sync (Multi-State)",
    source: "Aggregated State Election Databases",
    status: "Running",
    lastRun: "Active",
    recordsExtracted: 485000,
    health: 100
  },
  {
    id: "s4",
    name: "Municipal & County Board Aggregator (Nationwide Expansion)",
    source: "Local Gov Agenda Portal RSS Feeds",
    status: "Running",
    lastRun: "Active",
    recordsExtracted: 125300,
    health: 92.5
  },
  {
    id: "s5",
    name: "Extended Profile & Legal Background Deep-Scrape (LexisNexis/PublicRecords)",
    source: "Aggregated Public Records & Court Dockets",
    status: "Running",
    lastRun: "Active",
    recordsExtracted: 64482,
    health: 99.4
  }
];
