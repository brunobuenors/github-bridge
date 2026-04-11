import { chromium } from "playwright";

export async function enviarParaLovable(prompt) {
  console.log("🤖 Iniciando bot...");

  let browser;

  try {
    browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();

    await page.goto("https://lovable.dev", {
      waitUntil: "domcontentloaded",
      timeout: 30000
    });

    console.log("✅ Página carregada!");

    const editor = page.locator(".tiptap.ProseMirror").first();

    if (await editor.count() === 0) {
      console.log("❌ Editor não encontrado");
      return;
    }

    await editor.click();
    await page.keyboard.type(prompt);

    await page.keyboard.press("Enter");

    console.log("✅ Prompt enviado!");

  } catch (err) {
    console.log("❌ Erro:", err.message);
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch {}
    }
  }
}
