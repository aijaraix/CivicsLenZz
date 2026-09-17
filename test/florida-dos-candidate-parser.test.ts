import assert from 'node:assert/strict';
import { parseFloridaDOSCandidateListing, resolveFloridaDOSSelectedElectionId } from '../src/lib/source-adapters';

const landing = `
<select name="elecid">
  <option value="20301105-GEN">2030 Election</option>
  <option selected value="20261103-GEN">2026 Election</option>
  <option value="20260324-S01">2026 Special</option>
</select>`;
assert.equal(resolveFloridaDOSSelectedElectionId(landing), '20261103-GEN');

const listingUrl = 'https://dos.elections.myflorida.com/candidates/CanList.asp?elecid=20261103-GEN';
const listing = `
<table><tr><td>General Election:</td><td>2026 Election</td><td>View List</td></tr></table>
<center><font><b>United States Senator</b></font></center>
<table class="results">
<tr><th>Candidate</th><th>Status</th><th>Primary</th><th>General</th></tr>
<tr><td><a href="CanDetail.asp?account=89955"></a><a href="CanDetail.asp?account=89955">Gillespie</a><a href="CanDetail.asp?account=89955">,</a> <a href="CanDetail.asp?account=89955">Neil</a> <a href="CanDetail.asp?account=89955">J.</a> (NPA)</td><td>Qualified</td><td></td><td></td></tr>
</table>
<center><font><b>United States Representative</b></font></center>
<table class="results">
<tr><th>District</th><th>Candidate</th><th>Status</th><th>Primary</th><th>General</th></tr>
<tr><td>1</td><td><a href="CanDetail.asp?account=89842"></a><a href="CanDetail.asp?account=89842">Chico</a><a href="CanDetail.asp?account=89842">,</a> <a href="CanDetail.asp?account=89842">Douglas</a> (REP)</td><td>Defeated</td><td>Eliminated</td><td></td></tr>
</table>
<table class="results"><tr><th>Candidate</th><th>Status</th></tr><tr><td>Special Election:</td><td>2026 Special</td></tr></table>`;

const parsed = parseFloridaDOSCandidateListing(listing, listingUrl);
assert.equal(parsed.length, 2);
const first = JSON.parse(parsed[0].extracted_value);
const second = JSON.parse(parsed[1].extracted_value);
assert.deepEqual(first, {candidate_name:'Gillespie, Neil J.',party_affiliation:'NPA',filing_status:'Qualified',office_sought:'United States Senator'});
assert.deepEqual(second, {candidate_name:'Chico, Douglas',party_affiliation:'REP',filing_status:'Defeated',office_sought:'United States Representative District 1'});
assert.ok(parsed.every((item) => item.field_key === 'CANDIDATE_FILING_RECORD'));
assert.ok(parsed.every((item) => item.evidence_locator?.includes('candidate-account-')));
assert.ok(parsed.every((item) => !/^(General Election|Special Election):?$/i.test(JSON.parse(item.extracted_value).candidate_name)));
console.log('FLORIDA_DOS_CANDIDATE_PARSER_TEST=PASS');
