const express = require('express');
const { execFile } = require('node:child_process');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const util = require('node:util');

const execFileAsync = util.promisify(execFile);
const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname));

async function isPrinceAvailable() {
  try {
    await execFileAsync('prince', ['--version']);
    return true;
  } catch (error) {
    return false;
  }
}

async function isPlaywrightAvailable() {
  let playwright;
  try {
    playwright = require('playwright');
  } catch (error) {
    return false;
  }

  const executablePath = playwright.chromium.executablePath();
  try {
    await fs.access(executablePath);
    return true;
  } catch (error) {
    return false;
  }
}

async function getPdfEngine() {
  if (await isPrinceAvailable()) {
    return 'PrinceXML';
  }
  if (await isPlaywrightAvailable()) {
    return 'Playwright';
  }
  return null;
}

app.get('/api/pdf-status', async (_req, res) => {
  const engine = await getPdfEngine();
  res.json({ available: Boolean(engine), engine: engine || 'none' });
});

app.post('/api/export', async (req, res) => {
  const { html, filename } = req.body || {};

  if (!html) {
    res.status(400).send('กรุณาส่ง HTML สำหรับการแปลง PDF');
    return;
  }

  const engine = await getPdfEngine();
  if (!engine) {
    res.status(501).send('ยังไม่พบเครื่องมือสร้าง PDF บนเซิร์ฟเวอร์นี้');
    return;
  }

  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'thai-report-'));
  const htmlPath = path.join(tempDir, 'report.html');
  const pdfPath = path.join(tempDir, 'report.pdf');

  try {
    await fs.writeFile(htmlPath, html, 'utf8');
    let pdfBuffer;
    if (engine === 'PrinceXML') {
      await execFileAsync('prince', [htmlPath, '-o', pdfPath]);
      pdfBuffer = await fs.readFile(pdfPath);
    } else {
      const { chromium } = require('playwright');
      const browser = await chromium.launch();
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle' });
      await page.emulateMediaType('print');
      pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '0', right: '0', bottom: '0', left: '0' },
        preferCSSPageSize: true
      });
      await browser.close();
    }
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename || 'report.pdf'}"`);
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).send('ไม่สามารถสร้าง PDF ผ่านเซิร์ฟเวอร์ได้');
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
