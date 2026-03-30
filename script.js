const offices = [
  { name: "Main Office", address: "15600 Morales Road, Houston, TX 77032", zip: "77032", area: "North Houston / Aldine / airport side" },
  { name: "Bellaire Branch", address: "6000 Chimney Rock Rd., Houston, TX 77081", zip: "77081", area: "Bellaire / Gulfton / Southwest Houston" },
  { name: "Clay Road Branch", address: "16715 Clay Rd., Houston, TX 77084", zip: "77084", area: "West Houston / Bear Creek" },
  { name: "Jim Fonteno Branch", address: "14350 Wallisville Rd., Houston, TX 77049", zip: "77049", area: "East Houston / Channelview side" },
  { name: "John Phelps Branch", address: "101 S. Richey, Suite E, Pasadena, TX 77506", zip: "77506", area: "Pasadena / southeast side" },
  { name: "Mickey Leland Branch", address: "7300 N. Shepherd Dr., Houston, TX 77091", zip: "77091", area: "Northside / Independence Heights" },
  { name: "Palm Center Branch", address: "5300 Griggs Rd., Houston, TX 77021", zip: "77021", area: "Third Ward / South Union" },
  { name: "Raul C. Martinez Branch", address: "1001 SGT Macario Garcia, Houston, TX 77011", zip: "77011", area: "East End" },
  { name: "Spring Branch Branch", address: "1721 Pech Rd., Houston, TX 77055", zip: "77055", area: "Spring Branch / Memorial-adjacent" }
];

const zipGuides = [
  {
    min: 77002,
    max: 77030,
    title: "Central Houston guide",
    neighborhoods: "Downtown, Midtown, Montrose, Third Ward, East End, Museum District",
    districtNote: "You may be in Houston ISD, but exact attendance and trustee lines depend on your address.",
    officeName: "Palm Center Branch"
  },
  {
    min: 77031,
    max: 77059,
    title: "West and southwest Houston guide",
    neighborhoods: "Sharpstown, Meyerland, Bellaire-adjacent, Spring Branch, Memorial-adjacent",
    districtNote: "Depending on address, you may be in Houston ISD, Alief ISD, Spring Branch ISD, or other nearby districts.",
    officeName: "Spring Branch Branch"
  },
  {
    min: 77060,
    max: 77099,
    title: "North, northwest, and west Houston guide",
    neighborhoods: "Aldine area, Northside, Jersey Village area, Bear Creek, Cypress-adjacent",
    districtNote: "Depending on address, this can intersect Houston ISD, Aldine ISD, Cypress-Fairbanks ISD, or Spring Branch ISD.",
    officeName: "Mickey Leland Branch"
  },
  {
    min: 77401,
    max: 77401,
    title: "Bellaire guide",
    neighborhoods: "Bellaire, Meyerland-adjacent neighborhoods, and nearby southwest Houston areas",
    districtNote: "This area often overlaps with Houston ISD and other nearby district boundaries, so address-level verification matters.",
    officeName: "Bellaire Branch"
  },
  {
    min: 77500,
    max: 77599,
    title: "Pasadena and southeast Harris County guide",
    neighborhoods: "Pasadena, South Houston, Deer Park-adjacent, southeast county communities",
    districtNote: "This area often connects to Pasadena ISD and other southeast county districts, but exact boundaries vary by address.",
    officeName: "John Phelps Branch"
  }
];

const form = document.querySelector("#zip-form");
const input = document.querySelector("#zip-input");
const result = document.querySelector("#lookup-result");

function findGuide(zipValue) {
  return zipGuides.find((guide) => zipValue >= guide.min && zipValue <= guide.max);
}

function officeForGuide(guide) {
  return offices.find((office) => office.name === guide.officeName) || offices[0];
}

function renderResult(zip) {
  const zipValue = Number(zip);
  const guide = findGuide(zipValue);

  if (!guide) {
    result.innerHTML = `
      <div class="result-panel">
        <h3>That ZIP is outside the current Houston-area map for this version.</h3>
        <p>This site currently focuses on Houston and nearby Harris County ZIP codes. You can still use the official tools below.</p>
        <div class="result-meta">
          <span class="pill">Use the Texas voter portal for exact districts</span>
          <span class="pill">Use Harris County ballot lookup when an election is active</span>
        </div>
        <p><a href="https://teamrv-mvp.sos.texas.gov/MVP/mvp.do" target="_blank" rel="noreferrer">Open My Voter Portal</a></p>
      </div>
    `;
    return;
  }

  const nearest = officeForGuide(guide);

  result.innerHTML = `
    <div class="result-panel">
      <h3>${guide.title}</h3>
      <p>ZIP <strong>${zip}</strong> appears to fit this Houston-area guide.</p>
      <div class="result-meta">
        <span class="pill">Nearby office: ${nearest.name}</span>
        <span class="pill">Office ZIP: ${nearest.zip}</span>
        <span class="pill">Area: ${nearest.area}</span>
      </div>
      <div class="result-columns">
        <div>
          <h3>Nearest Harris County elections office</h3>
          <p><strong>${nearest.name}</strong><br>${nearest.address}</p>
          <p>Best for registration forms, vote-by-mail help, and county election questions.</p>
        </div>
        <div>
          <h3>What this ZIP can tell you</h3>
          <ul>
            <li><strong>Neighborhoods:</strong> ${guide.neighborhoods}</li>
            <li><strong>District note:</strong> ${guide.districtNote}</li>
            <li><strong>Important:</strong> exact congressional, legislative, judicial, and local district lines still require a full-address lookup.</li>
          </ul>
        </div>
      </div>
      <div class="result-columns">
        <div>
          <h3>Next official steps</h3>
          <ul>
            <li><a href="https://teamrv-mvp.sos.texas.gov/MVP/mvp.do" target="_blank" rel="noreferrer">Check exact registration and districts</a></li>
            <li><a href="https://app.harrisvotes.com/PollLocations/VoterSearch?lang=en-US" target="_blank" rel="noreferrer">Open Harris County sample ballot lookup</a></li>
            <li><a href="https://www.votetexas.gov/register-to-vote/index" target="_blank" rel="noreferrer">Start a Texas registration form</a></li>
          </ul>
        </div>
        <div>
          <h3>Editorial angle for this area</h3>
          <ul>
            <li>Explain which city, county, school, and congressional layers may overlap in the area.</li>
            <li>Add district-specific candidate pages only after you verify them with an official ballot or district map.</li>
            <li>Use this ZIP tool as a guide, not as a ballot predictor.</li>
          </ul>
        </div>
      </div>
    </div>
  `;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const zip = input.value.trim();

  if (!/^\d{5}$/.test(zip)) {
    result.innerHTML = `
      <div class="result-panel">
        <h3>Enter a 5-digit ZIP code.</h3>
        <p>Examples: 77002, 77019, 77025, 77055, 77084, 77091, 77401, or 77506.</p>
      </div>
    `;
    return;
  }

  renderResult(zip);
});
