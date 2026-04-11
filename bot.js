import { chromium } from "playwright";

export async function enviarParaLovable(prompt) {
  console.log("🤖 Iniciando bot Lovable...");

  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();

  try {
    console.log("🌐 Abrindo Lovable...");
    await page.goto("https://lovable.dev");

    await page.waitForTimeout(5000);

    console.log("⌨️ Tentando preencher prompt...");

    await page.fill("textarea", prompt);

    console.log("🚀 Tentando clicar...");

    await page.click("button");

    console.log("✅ Prompt enviado!");

    await page.waitForTimeout(5000);

  } catch (err) {
    console.log("❌ Erro no bot:");
    console.error(err);
  }

  await browser.close();
}
