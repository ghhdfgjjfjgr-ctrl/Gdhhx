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

app.get('/api/prince-status', async (_req, res) => {
  try {
    await execFileAsync('prince', ['--version']);
    res.json({ available: true });
  } catch (error) {
    res.status(200).json({ available: false });
  }
});

app.post('/api/export', async (req, res) => {
  const { html, filename } = req.body || {};

  if (!html) {
    res.status(400).send('กรุณาส่ง HTML สำหรับการแปลง PDF');
    return;
  }

  try {
    await execFileAsync('prince', ['--version']);
  } catch (error) {
    res.status(501).send('ยังไม่พบ PrinceXML บนเซิร์ฟเวอร์นี้');
    return;
  }

  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'thai-report-'));
  const htmlPath = path.join(tempDir, 'report.html');
  const pdfPath = path.join(tempDir, 'report.pdf');

  try {
    await fs.writeFile(htmlPath, html, 'utf8');
    await execFileAsync('prince', [htmlPath, '-o', pdfPath]);
    const pdfBuffer = await fs.readFile(pdfPath);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename || 'report.pdf'}"`);
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).send('ไม่สามารถสร้าง PDF ด้วย PrinceXML ได้');
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
