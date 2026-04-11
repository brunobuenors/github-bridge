import { chromium } from "playwright";
import { execSync } from "child_process";

let instalado = false;

export async function enviarParaLovable(prompt) {
  console.log("🤖 Iniciando bot Lovable...");

  if (!instalado) {
    try {
      console.log("📦 Instalando Chromium...");
      execSync("npx playwright install chromium", { stdio: "inherit" });
      console.log("✅ Chromium instalado!");
      instalado = true;
    } catch (err) {
      console.log("❌ Erro ao instalar Chromium:");
      console.error(err);
      return;
    }
  }

  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();

  try {
    console.log("🌐 Abrindo Lovable...");

    await page.setExtraHTTPHeaders({
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    });

    await page.goto("https://lovable.dev", {
      waitUntil: "domcontentloaded",
      timeout: 60000
    });

    console.log("✅ Página carregada!");

    await page.waitForTimeout(6000);

    const editor = page.locator(".tiptap.ProseMirror").first();

    await editor.click();
    await page.keyboard.type(prompt, { delay: 10 });

    await page.locator("button").first().click();

    console.log("🚀 Prompt enviado!");

  } catch (err) {
    console.log("❌ Erro no bot:");
    console.error(err);
  }

  await browser.close();
}
