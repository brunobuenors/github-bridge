import { chromium } from "playwright";

export async function enviarParaLovable(prompt) {
  console.log("🤖 Iniciando bot Lovable...");

  const browser = await chromium.launch({
    headless: true
  });

  const page = await browser.newPage();

  try {
    console.log("🌐 Abrindo Lovable...");
    await page.goto("https://lovable.dev");

    // espera carregar
    await page.waitForTimeout(5000);

    console.log("⌨️ Tentando preencher prompt...");

    // ⚠️ seletor genérico (vamos ajustar depois)
    await page.fill("textarea", prompt);

    console.log("🚀 Tentando clicar em gerar...");

    await page.click("button");

    console.log("✅ Prompt enviado!");

    await page.waitForTimeout(10000);

  } catch (err) {
    console.log("❌ Erro no bot:");
    console.error(err);
  }

  await browser.close();
}
