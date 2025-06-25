import { useState } from 'react';

function App() {
  const [loanLimit, setLoanLimit] = useState(0.3);
  const [ulaRevenue, setUlaRevenue] = useState(400000000);

  const [showStateFundingInfo, setShowStateFundingInfo] = useState(false);
  const [showUnitCostInfo, setShowUnitCostInfo] = useState(false);
  const [showSavingsInfo, setShowSavingsInfo] = useState(false);
  const [showBuildTimeInfo, setShowBuildTimeInfo] = useState(false);
  const [showAltMFInfo, setShowAltMFInfo] = useState(false);

  const perUnitCostMap = {
    0.3: 763485,
    0.4: 763485,
    0.5: 763485,
    0.6: 743025,
    0.7: 743025,
    0.8: 706165,
    0.9: 685705,
    1.0: 665245,
  };

  const stateFundingMap = {
    0.3: 100,
    0.4: 110,
    0.5: 120,
    0.6: 130,
    0.7: 140,
    0.8: 150,
    0.9: 160,
    1.0: 170,
  };

  const monthlySavingsMap = {
    0.3: 0,
    0.4: 0,
    0.5: 0,
    0.6: 0,
    0.7: 1306000,
    0.8: 1306000,
    0.9: 1306000,
    1.0: 1306000,
  };

  const monthsToBuildMap = {
    0.3: 45,
    0.4: 45,
    0.5: 41,
    0.6: 37,
    0.7: 33,
    0.8: 29,
    0.9: 25,
    1.0: 21,
  };

  const totalCost = perUnitCostMap[loanLimit] || 0;
  const stateFunding = stateFundingMap[loanLimit] || 0;
  const monthlySavings = monthlySavingsMap[loanLimit] || 0;
  const monthsToBuild = monthsToBuildMap[loanLimit] || 0;
  const altAndMFProduction = (ulaRevenue * 0.92) * 0.225 * 2;

  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl space-y-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">ULA Optimization Tool</h1>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            The United to House LA (ULA) Measure provides a new local funding source to support affordable housing development in the City of Los Angeles. One critical policy decision is how deeply ULA funds should be loaned into projects — that is, what percentage of a project's total development cost ULA should cover.
            <br /><br />
            This tool allows users to model how different ULA loan limits affect the feasibility of affordable housing developments. Adjust the assumptions to see how loan depth impacts total cost per unit, the likelihood of unlocking additional state funding, time to construction, and overall systemwide production potential.
          </p>
        </div>

        <div className="space-y-6 bg-gray-100 p-6 rounded-xl shadow-md">
          <div>
            <label className="block font-semibold mb-2">
              ULA Loan Limit (% of Total Development Cost)
            </label>
            <select
              value={loanLimit}
              onChange={(e) => setLoanLimit(parseFloat(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              {[...Array(8)].map((_, i) => {
                const value = 0.3 + i * 0.1;
                return (
                  <option key={value} value={value.toFixed(1)}>
                    {(value * 100).toFixed(0)}%
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Total ULA Revenue to Model
            </label>
            <div className="text-xl font-bold mb-1">
              ${ulaRevenue.toLocaleString()}
            </div>
            <input
              type="range"
              min={400000000}
              max={1000000000}
              step={10000000}
              value={ulaRevenue}
              onChange={(e) => setUlaRevenue(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-6 bg-gray-50 p-6 rounded-xl shadow">

          {/* Total Per-Unit Development Cost */}
          <OutputRow
            label="Total Per-Unit Development Cost"
            value={`$${totalCost.toLocaleString()}`}
            expanded={showUnitCostInfo}
            setExpanded={setShowUnitCostInfo}
            explanation={`Up to a 60% ULA loan limit, total development costs remain constant at $763,000 per unit, based on SCANPH’s analysis of affordable housing projects financed in 2024. Beyond this threshold, per-unit costs begin to decline. At higher loan limits, projects are likely able to eliminate public funding sources from their capital stack. According to the Terner Center, each additional source adds approximately $20,460 to the total development cost per unit. At a 70% loan limit, we assume the elimination of two sources, resulting in $40,920 in per-unit savings. This pattern continues incrementally, with deeper ULA subsidies simplifying the capital stack and reducing costs—potentially up to full coverage at 100% of TDC.`}
          />

          {/* Additional State Funding Unlocked */}
          <OutputRow
            label="Additional State Funding Unlocked"
            value={`$${stateFunding.toLocaleString()} per unit`}
            expanded={showStateFundingInfo}
            setExpanded={setShowStateFundingInfo}
            explanation={`Los Angeles City is eligible to compete for a significant share of state funding through programs like AHSC and the Multifamily Super NOFA. In total, LA can compete for up to $535 million in AHSC funds and $137 million in Multifamily Super NOFA dollars annually. However, in 2024, LA City projects secured only:

$109.8 million from AHSC and $?? from the Multifamily SuperNOFA  
$37.6 million from MHP  
$XXX million from VHHP (unclear)  
$0 from Infill Infrastructure Grant (IIG)  
$XXX million from the Joe Serna program (unclear)

This demonstrates that while LA is eligible for a large portion of available funds, there is clear room for improvement—and potential to secure more by adopting a more competitive funding approach.

Most state NOFA programs award higher scores to projects with stronger local leveraging, meaning deeper city-level subsidies improve a project's chances of winning. To model this, we apply an escalating likelihood of winning based on ULA loan limit depth.`}
          />

          {/* Monthly Interest Savings */}
          <OutputRow
            label="Monthly Interest Savings"
            value={`$${monthlySavings.toLocaleString()}`}
            expanded={showSavingsInfo}
            setExpanded={setShowSavingsInfo}
            explanation={`Many affordable housing projects in Los Angeles rely on conventional loans to fill financing gaps, often at interest rates of 6–7%. Based on SCANPH’s analysis of local 4% LIHTC deals, the average conventional loan size is approximately $32.65 million for a 159-unit project. At a 7% interest rate amortized over 30 years, this results in a monthly debt service of roughly $217,556.

When ULA loan limits are high enough to eliminate the need for this private debt, the project avoids these monthly interest payments entirely. This translates to a monthly savings of over $217,000, or approximately $1,368 per unit per month. Over the life of a 30-year loan, this results in more than $45 million in total interest avoided—dramatically improving project feasibility and long-term affordability.

By removing the need for high-interest financing, deeper ULA investments reduce financial strain, increase long-term stability, and ensure that limited public resources are not diverted to private lenders.`}
          />

          {/* Months to Build */}
          <OutputRow
            label="Estimated Months to Build"
            value={monthsToBuild}
            expanded={showBuildTimeInfo}
            setExpanded={setShowBuildTimeInfo}
            explanation={`On average, it takes 31–60 months (2.5–5 years) to complete an affordable housing project in California. This extended timeline is largely a result of the state’s fragmented funding system, where capital stacks typically involve five to six separate public sources—each with its own application, award, and disbursement schedule. These staggered timelines create bottlenecks, long gaps between funding rounds, and higher overhead costs as projects sit idle waiting to secure full financing.

At lower ULA loan limits, we assume development timelines remain consistent with historical averages—approximately 45 months—since projects still require the same number of additional funding sources. However, at higher loan limits, particularly those sufficient to eliminate one or more public sources, we model faster timelines. For every public source removed from the capital stack, we estimate a reduction of 4 months (based on existing research) in total development time.`}
          />

          {/* Alt Models + MF Production */}
          <OutputRow
            label="Funds for Alt Models + MF Production"
            value={`$${altAndMFProduction.toLocaleString()}`}
            expanded={showAltMFInfo}
            setExpanded={setShowAltMFInfo}
            explanation={`This value is calculated based on official ULA guidelines which allocate ~22.5% of production program funding to the Alternative Models and Multifamily affordable Housing Program respectively.`}
          />
        </div>
      </div>
    </div>
  );
}

function OutputRow({ label, value, expanded, setExpanded, explanation }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span>
          {label}
          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-2 text-sm underline text-blue-600 hover:text-blue-800"
          >
            {expanded ? "Hide" : "Break it down"}
          </button>
        </span>
        <strong>{value}</strong>
      </div>
      {expanded && (
        <div className="bg-white border border-gray-300 text-sm p-3 rounded-md text-gray-700 whitespace-pre-line">
          {explanation}
        </div>
      )}
    </div>
  );
}

export default App;
