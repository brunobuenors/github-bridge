import { chromium } from "playwright";
import { execSync } from "child_process";

let instalado = false;

export async function enviarParaLovable(prompt) {
  console.log("🤖 Iniciando bot Lovable...");

  // 🔥 instala chromium se precisar
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
    await page.goto("https://lovable.dev");

    await page.waitForTimeout(6000);

    console.log("🎯 Procurando campo de texto...");

    // 🔥 seletor do editor (o que você mandou)
    const editor = page.locator(".tiptap.ProseMirror").first();

    await editor.click();

    console.log("⌨️ Digitando prompt...");

    await page.keyboard.type(prompt, { delay: 10 });

    console.log("🚀 Procurando botão...");

    // 🔥 tenta clicar no botão de gerar
    await page.locator("button").filter({ hasText: "Generate" }).click();

    console.log("✅ Prompt enviado!");

    await page.waitForTimeout(8000);

  } catch (err) {
    console.log("❌ Erro no bot:");
    console.error(err);
  }

  await browser.close();
}
