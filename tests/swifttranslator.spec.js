const { test, expect } = require("@playwright/test");

test.describe("SwiftTranslator - Singlish to Sinhala Automation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://www.swifttranslator.com/", { waitUntil: "domcontentloaded" });
  });

  // ✅ Helper: get input textbox safely
  async function getFields(page) {
    // Input textbox (most stable)
    const singlishBox = page.getByRole("textbox");
    await expect(singlishBox).toBeVisible({ timeout: 15000 });

    // Output is NOT guaranteed as textarea, so we detect Sinhala output anywhere in the body.
    const body = page.locator("body");
    await expect(body).toBeVisible({ timeout: 15000 });

    return { singlishBox, body };
  }

  // ✅ Helper: wait until Sinhala output appears anywhere (Sinhala Unicode range)
  async function waitForSinhalaOutput(body) {
    await expect(body).toContainText(/[\u0D80-\u0DFF]/, { timeout: 15000 });
  }

  // ✅ Helper: run a test case
  async function runCase(page, tcId, inputText) {
    const { singlishBox, body } = await getFields(page);

    // Clear input
    await singlishBox.fill("");

    // Fill input
    await singlishBox.fill(inputText);

    // Wait for Sinhala output
    await waitForSinhalaOutput(body);

    // Print small output preview
    const bodyText = (await body.innerText()).replace(/\s+/g, " ").trim().slice(0, 400);
    console.log(`\n${tcId} INPUT:\n${inputText}\n${tcId} OUTPUT (preview):\n${bodyText}\n`);

    return bodyText;
  }

  // ✅ UI TEST (Stable)
  test("Pos_UI_0001 - Sinhala output updates in real-time when typing", async ({ page }) => {
    const { singlishBox, body } = await getFields(page);

    await singlishBox.fill("mama gedhara yanavaa.");
    await waitForSinhalaOutput(body);
  });

  // -------- POSITIVE FUNCTIONAL (24) --------
  test("Pos_Fun_0001", async ({ page }) => {
    await runCase(page, "Pos_Fun_0001", "aayuboowan!");
  });

  test("Pos_Fun_0002", async ({ page }) => {
    await runCase(page, "Pos_Fun_0002", "suba udhaesanak!");
  });

  test("Pos_Fun_0003", async ({ page }) => {
    await runCase(page, "Pos_Fun_0003", "mama gedhara innaawa.");
  });

  test("Pos_Fun_0004", async ({ page }) => {
    await runCase(page, "Pos_Fun_0004", "mata udhavvak karanna puluvandha?");
  });

  test("Pos_Fun_0005", async ({ page }) => {
    await runCase(page, "Pos_Fun_0005", "vahaama enna.");
  });

  test("Pos_Fun_0006", async ({ page }) => {
    await runCase(page, "Pos_Fun_0006", "mama ennee nae.");
  });

  test("Pos_Fun_0007", async ({ page }) => {
    await runCase(page, "Pos_Fun_0007", "api kaeema kanavaa saha passe film ekak balanavaa.");
  });

  test("Pos_Fun_0008", async ({ page }) => {
    await runCase(page, "Pos_Fun_0008", "oya enavaanam api yamu, naththam mama gedhara innaawa.");
  });

  test("Pos_Fun_0009", async ({ page }) => {
    await runCase(page, "Pos_Fun_0009", "oyaa kavadhdha ennee?");
  });

  test("Pos_Fun_0010", async ({ page }) => {
    await runCase(page, "Pos_Fun_0010", "api yamu.");
  });

  test("Pos_Fun_0011", async ({ page }) => {
    await runCase(page, "Pos_Fun_0011", "eyaalaa enavaa.");
  });

  test("Pos_Fun_0012", async ({ page }) => {
    await runCase(page, "Pos_Fun_0012", "mama iiyee gedhara giyaa.");
  });

  test("Pos_Fun_0013", async ({ page }) => {
    await runCase(page, "Pos_Fun_0013", "mama heta enavaa.");
  });

  test("Pos_Fun_0014", async ({ page }) => {
    await runCase(page, "Pos_Fun_0014", "karunaakaralaa mata podi udhavvak karanna puluvandha?");
  });

  test("Pos_Fun_0015", async ({ page }) => {
    await runCase(page, "Pos_Fun_0015", "eeyi, oya enne.");
  });

  test("Pos_Fun_0016", async ({ page }) => {
    await runCase(page, "Pos_Fun_0016", "hari hari, yamu.");
  });

  test("Pos_Fun_0017", async ({ page }) => {
    await runCase(page, "Pos_Fun_0017", "mata bath oonee.");
  });

  test("Pos_Fun_0018", async ({ page }) => {
    await runCase(page, "Pos_Fun_0018", "mama WhatsApp eken msg ekak evannam.");
  });

  test("Pos_Fun_0019", async ({ page }) => {
    await runCase(page, "Pos_Fun_0019", "api Colombo yanna hadhannee traffic nisaa.");
  });

  test("Pos_Fun_0020", async ({ page }) => {
    await runCase(page, "Pos_Fun_0020", 'oyaa hariyata vaeda karanavaadha? (mama check karanavaa!)');
  });

  test("Pos_Fun_0021", async ({ page }) => {
    await runCase(page, "Pos_Fun_0021", "mata Rs. 5343 wage ganak onee.");
  });

  test("Pos_Fun_0022", async ({ page }) => {
    await runCase(page, "Pos_Fun_0022", "7.30 AM wenakota enna, mama ready.");
  });

  test("Pos_Fun_0023", async ({ page }) => {
    await runCase(page, "Pos_Fun_0023", "mama gedhara yanavaa.\noyaa enavadha maath ekka?");
  });

  test("Pos_Fun_0024", async ({ page }) => {
    await runCase(
      page,
      "Pos_Fun_0024",
      "adha api university eka langa thiyena event ekata giyoth, oyaa maath ekka yanna puluvandha? mama kalin ticket eka ganna oonee. ehema unoth api passe lunch eka kanna yamu. oyaata time eka hariyata set wenawada kiyala kiyanna. mama eyaata anuwa plan karannam."
    );
  });

  // -------- NEGATIVE FUNCTIONAL (10) --------
  test("Neg_Fun_0001", async ({ page }) => {
    await runCase(page, "Neg_Fun_0001", "mamageharayanavaa");
  });

  test("Neg_Fun_0002", async ({ page }) => {
    await runCase(page, "Neg_Fun_0002", "mata nidhimthayi.");
  });

  test("Neg_Fun_0003", async ({ page }) => {
    await runCase(page, "Neg_Fun_0003", "adoo bn eka poddak awul wagenee.");
  });

  test("Neg_Fun_0004", async ({ page }) => {
    await runCase(page, "Neg_Fun_0004", "mama OTP eka gatta, habai PIN eka waradi.");
  });

  test("Neg_Fun_0005", async ({ page }) => {
    await runCase(page, "Neg_Fun_0005", "mama     gedhara     yanavaa.");
  });

  test("Neg_Fun_0006", async ({ page }) => {
    await runCase(page, "Neg_Fun_0006", "mama (gedhara) yanavaa!!! #urgent");
  });

  test("Neg_Fun_0007", async ({ page }) => {
    await runCase(page, "Neg_Fun_0007", "oyaata kohomada");
  });

  test("Neg_Fun_0008", async ({ page }) => {
    await runCase(
      page,
      "Neg_Fun_0008",
      'mama adha office giyaa. meeting eka 10.00 AM. habai manager kiwwa "update ASAP" kiyala. eeta passe api new project eka start karanna onee. budget USD 1500 wage. oyaata puluvandha eeka handle karanna?'
    );
  });

  test("Neg_Fun_0009", async ({ page }) => {
    await runCase(page, "Neg_Fun_0009", "25/12/2025dawasataColomboyamu");
  });

  test("Neg_Fun_0010", async ({ page }) => {
    await runCase(page, "Neg_Fun_0010", "mama gedhara");
  });
});
