import { chromium } from "playwright";
import { execSync } from "child_process";

let instalado = false;

export async function enviarParaLovable(prompt) {
  console.log("🤖 Iniciando bot Lovable...");

  if (!instalado) {
    try {
      console.log("📦 Instalando Chromium...");
      execSync("npx playwright install chromium", { stdio: "inherit" });
      console.log("✅ Chromium pronto!");
      instalado = true;
    } catch (err) {
      console.log("❌ Erro ao instalar Chromium:");
      console.error(err);
      return;
    }
  }

  let browser;

  try {
    browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();

    console.log("🌐 Abrindo Lovable...");

    await page.goto("https://lovable.dev", {
      waitUntil: "domcontentloaded",
      timeout: 45000
    });

    console.log("✅ Página carregada!");

    // 🔥 espera curta (não longa!)
    await page.waitForTimeout(3000);

    console.log("🎯 Procurando editor...");

    const editor = page.locator(".tiptap.ProseMirror").first();

    // 🔥 valida antes de clicar
    if (await editor.count() === 0) {
      console.log("❌ Editor não encontrado!");
      return;
    }

    await editor.click();

    console.log("⌨️ Digitando prompt...");
    await page.keyboard.type(prompt, { delay: 3 });

    console.log("🚀 Enviando com ENTER...");

    // 🔥 MAIS ESTÁVEL QUE BOTÃO
    await page.keyboard.press("Enter");

    console.log("✅ Prompt enviado!");

    // 🔥 não esperar muito (evita kill do Render)
    await page.waitForTimeout(3000);

  } catch (err) {
    console.log("❌ Erro no bot:");
    console.error(err.message || err);
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch {}
    }
  }
}
