const sectionTemplates = [
  { id: 'cover', label: 'หน้าปก', default: true },
  { id: 'preface', label: 'คำนำ', default: true },
  { id: 'abstract', label: 'บทคัดย่อ', default: true },
  { id: 'ack', label: 'กิตติกรรมประกาศ', default: true },
  { id: 'toc', label: 'สารบัญ', default: true },
  { id: 'ch1', label: 'บทที่ 1 บทนำ', default: true },
  { id: 'ch2', label: 'บทที่ 2 เอกสารที่เกี่ยวข้อง', default: true },
  { id: 'ch3', label: 'บทที่ 3 วิธีดำเนินงาน', default: true },
  { id: 'ch4', label: 'บทที่ 4 ผลการศึกษา', default: true },
  { id: 'ch5', label: 'บทที่ 5 สรุปและข้อเสนอแนะ', default: true },
  { id: 'proscons', label: 'สรุปข้อดีและข้อเสีย', default: true },
  { id: 'ref', label: 'บรรณานุกรม', default: true },
  { id: 'appendix', label: 'ภาคผนวก', default: false }
];

const sectionsContainer = document.getElementById('sectionsContainer');
const preview = document.getElementById('reportPreview');
const toggleEditBtn = document.getElementById('toggleEditBtn');
const downloadPrinceBtn = document.getElementById('downloadPrinceBtn');
let isEditMode = false;

function renderSectionSelector() {
  sectionsContainer.innerHTML = sectionTemplates
    .map(
      (section) => `
    <label class="checkbox-item">
      <input type="checkbox" value="${section.id}" ${section.default ? 'checked' : ''} /> ${section.label}
    </label>
  `
    )
    .join('');
}

function paragraph(topic) {
  return `รายงานฉบับนี้จัดทำขึ้นเพื่อศึกษาเรื่อง “${topic}” โดยสรุปสาระสำคัญที่เกี่ยวข้องอย่างเป็นระบบ
  เนื้อหาเรียบเรียงตามรูปแบบรายงานภาษาไทยมาตรฐาน เน้นการใช้ภาษาให้ชัดเจน ถูกต้อง และเป็นทางการ
  เพื่อสนับสนุนการเรียนรู้และการนำเสนอผลงานเชิงวิชาการในระดับสถานศึกษา.`;
}

function getInputValue(id, fallback) {
  const value = document.getElementById(id).value.trim();
  return value || fallback;
}

function createA4Page(contentHtml, pageNumber = null) {
  const headerNumber =
    pageNumber === null
      ? '<div class="page-header-number page-header-number-hidden">&nbsp;</div>'
      : `<div class="page-header-number">${pageNumber}</div>`;

  const page = document.createElement('section');
  page.className = 'a4-page';
  page.innerHTML = `<div class="a4-page-content">${headerNumber}${contentHtml}</div>`;
  return page;
}

function formatSemesterText(value) {
  const trimmed = (value || '').trim();
  if (!trimmed) return '...';
  return trimmed.startsWith('ภาคเรียนที่') ? trimmed : `ภาคเรียนที่ ${trimmed}`;
}

function buildCoverContent(data) {
  const {
    title,
    school,
    faculty,
    student,
    classroom,
    subject,
    teacher,
    semester
  } = data;

  return `
    <article class="cover-sheet">
      <div class="cover-emblem" aria-hidden="true">ตรา</div>
      <p class="cover-course">รายงานวิชา ${subject}</p>
      <h1 class="cover-topic">เรื่อง “${title}”</h1>

      <div class="cover-section">
        <p class="cover-label">เสนอ</p>
        <p class="cover-value">${teacher}</p>
      </div>

      <div class="cover-section">
        <p class="cover-label">จัดทำโดย</p>
        <p class="cover-value">${student}</p>
        <p class="cover-value">นักเรียนชั้น ${classroom}</p>
      </div>

      <div class="cover-footer-wrap">
        <p class="cover-footer">รายงานฉบับนี้เป็นส่วนหนึ่งของรายวิชา ${faculty}</p>
        <p class="cover-footer">${formatSemesterText(semester)}</p>
        <p class="cover-footer">${school || "โรงเรียนสมเด็จพระธีรญาณมุนี"}</p>
        <p class="cover-footer-sub">สังกัดสำนักงานเขตพื้นที่การศึกษามัธยมศึกษาจังหวัดนครราชสีมา</p>
      </div>
    </article>
  `;
}


function buildIllustration(sectionLabel, title) {
  const seed = encodeURIComponent(`${title}-${sectionLabel}`);
  const src = `https://picsum.photos/seed/${seed}/960/430`;

  return `
    <figure class="report-figure">
      <img src="${src}" alt="ภาพประกอบหัวข้อ ${sectionLabel}" crossorigin="anonymous" />
      <figcaption>ภาพประกอบโดย AI สำหรับหัวข้อ ${sectionLabel}</figcaption>
    </figure>
  `;
}


function buildProsCons(title) {
  return `
    <div class="proscons-grid">
      <section class="proscons-card">
        <h4>ข้อดี</h4>
        <ul>
          <li>ช่วยให้เข้าใจหัวข้อ “${title}” อย่างเป็นระบบ</li>
          <li>สามารถนำผลการศึกษาไปประยุกต์ใช้ในชีวิตประจำวัน</li>
          <li>ส่งเสริมทักษะการคิดวิเคราะห์และการทำงานเป็นขั้นตอน</li>
        </ul>
      </section>
      <section class="proscons-card">
        <h4>ข้อเสีย / ข้อจำกัด</h4>
        <ul>
          <li>ข้อมูลบางส่วนอาจขึ้นอยู่กับแหล่งอ้างอิงที่มีจำกัด</li>
          <li>ระยะเวลาในการศึกษาอาจไม่ครอบคลุมทุกสถานการณ์</li>
          <li>ต้องมีการศึกษาต่อเนื่องเพื่อให้ได้ผลลัพธ์ที่แม่นยำยิ่งขึ้น</li>
        </ul>
      </section>
    </div>
  `;
}

function buildTocRows(selectedSections, pageIndexMap) {
  return selectedSections
    .filter((item) => item.id !== 'toc' && item.id !== 'cover')
    .map(
      (item) => `
        <tr>
          <td class="toc-col-title">
            <div class="toc-row">
              <span class="toc-label">${item.label}</span>
              <span class="toc-leader" aria-hidden="true"></span>
            </div>
          </td>
          <td class="toc-col-page">${pageIndexMap.get(item.id)}</td>
        </tr>`
    )
    .join('');
}

function setEditableMode(enabled) {
  const editableNodes = preview.querySelectorAll(
    '.cover-topic, .cover-school, .cover-footer, .cover-meta p, .report-section-title, .report-paragraph, .toc-subtitle, .toc-label, .toc-page, .proscons-card h4, .proscons-card li, figcaption'
  );

  editableNodes.forEach((node) => {
    node.setAttribute('contenteditable', enabled ? 'true' : 'false');
  });

  preview.classList.toggle('editable', enabled);
  toggleEditBtn.textContent = enabled ? 'ปิดโหมดแก้ไข' : 'เปิดโหมดแก้ไข';
}

function buildReport() {
  const title = getInputValue('title', 'หัวข้อรายงานตัวอย่าง');
  const school = getInputValue('school', 'ชื่อโรงเรียน/สถาบัน');
  const faculty = getInputValue('faculty', 'ชื่อรายวิชาหลัก');
  const student = getInputValue('student', 'ชื่อผู้จัดทำ');
  const classroom = getInputValue('classroom', 'ชั้น/ห้อง');
  const subject = getInputValue('subject', 'ชื่อรายวิชา');
  const teacher = getInputValue('teacher', 'ชื่อครูผู้สอน');
  const semester = getInputValue('semester', 'ภาคเรียนที่ ... ปีการศึกษา ...');

  const indent = document.getElementById('paragraphIndent').value;
  const lineSpacing = document.getElementById('lineSpacing').value;
  const selectedIds = Array.from(sectionsContainer.querySelectorAll('input:checked')).map((node) => node.value);
  const selectedSections = sectionTemplates.filter((section) => selectedIds.includes(section.id));

  if (!selectedSections.length) {
    preview.innerHTML = '<p class="placeholder">กรุณาเลือกองค์ประกอบรายงานอย่างน้อย 1 ส่วน</p>';
    return;
  }

  const reportRoot = document.createElement('div');
  reportRoot.className = 'report-pages';

  const pageIndexMap = new Map();
  let currentPageNumber = 1;

  selectedSections.forEach((section) => {
    if (section.id === 'cover') {
      reportRoot.appendChild(
        createA4Page(
          buildCoverContent({ title, school, faculty, student, classroom, subject, teacher, semester }),
          null
        )
      );
      return;
    }
    pageIndexMap.set(section.id, currentPageNumber);
    currentPageNumber += 1;
  });

  selectedSections.forEach((section) => {
    if (section.id === 'cover') return;

    const pageNo = pageIndexMap.get(section.id);

    if (section.id === 'toc') {
      const rows = buildTocRows(selectedSections, pageIndexMap);

      reportRoot.appendChild(
        createA4Page(
          `<article class="report-block toc-block">
            <h3 class="report-section-title">สารบัญ</h3>
            <p class="toc-subtitle">รายงานเรื่อง ${title}</p>
            <table class="toc-table">
              <thead>
                <tr><th>เรื่อง</th><th>หน้า</th></tr>
              </thead>
              <tbody>
                ${rows}
              </tbody>
            </table>
          </article>`,
          pageNo
        )
      );
      return;
    }

    if (section.id === 'proscons') {
      reportRoot.appendChild(
        createA4Page(
          `<article class="report-block">
            <h3 class="report-section-title">สรุปข้อดีและข้อเสีย</h3>
            ${buildIllustration(section.label, title)}
            ${buildProsCons(title)}
          </article>`,
          pageNo
        )
      );
      return;
    }

    if (section.id === 'preface') {
      reportRoot.appendChild(
        createA4Page(
          `<article class="report-block">
            <h3 class="report-section-title">คำนำ</h3>
            <p class="report-paragraph" style="text-indent:${indent};line-height:${lineSpacing}">รายงานฉบับนี้จัดทำขึ้นเพื่อใช้ประกอบการเรียนรายวิชา ${subject} โดยมีวัตถุประสงค์เพื่อพัฒนาทักษะการค้นคว้า การเรียบเรียงข้อมูล และการนำเสนออย่างเป็นระบบในหัวข้อ “${title}”.</p>
            <p class="report-paragraph" style="text-indent:${indent};line-height:${lineSpacing}">ผู้จัดทำหวังเป็นอย่างยิ่งว่ารายงานฉบับนี้จะเป็นประโยชน์ต่อผู้อ่าน หากมีข้อผิดพลาดประการใด ผู้จัดทำขอน้อมรับข้อเสนอแนะเพื่อนำไปปรับปรุงในโอกาสถัดไป.</p>
            <div class="preface-signature">
              <p>${student}</p>
              <p>ผู้จัดทำ</p>
            </div>
          </article>`,
          pageNo
        )
      );
      return;
    }

    if (section.id === 'ref') {
      reportRoot.appendChild(
        createA4Page(
          `<article class="report-block">
            <h3 class="report-section-title">บรรณานุกรม</h3>
            <p class="report-paragraph" style="text-indent:${indent};line-height:${lineSpacing}">ผู้จัดทำ. (2569). ${title}. ${school}.</p>
          </article>`,
          pageNo
        )
      );
      return;
    }

    reportRoot.appendChild(
      createA4Page(
        `<article class="report-block">
          <h3 class="report-section-title">${section.label}</h3>
          ${buildIllustration(section.label, title)}
          <p class="report-paragraph" style="text-indent:${indent};line-height:${lineSpacing}">${paragraph(title)}</p>
          <p class="report-paragraph" style="text-indent:${indent};line-height:${lineSpacing}">${paragraph(section.label)}</p>
        </article>`,
        pageNo
      )
    );
  });

  preview.innerHTML = '';
  preview.appendChild(reportRoot);
  setEditableMode(isEditMode);
}

async function exportPdf() {
  if (preview.querySelector('.placeholder')) buildReport();

  const title = getInputValue('title', 'thai-report');
  const reportPages = preview.querySelector('.report-pages') || preview;
  const a4WidthPx = 794;
  const a4HeightPx = 1123;

  document.body.classList.add('exporting-pdf');
  const exportRoot = reportPages.cloneNode(true);
  exportRoot.classList.add('export-clone');
  exportRoot.style.width = `${a4WidthPx}px`;
  exportRoot.style.maxWidth = `${a4WidthPx}px`;
  document.body.appendChild(exportRoot);

  try {
    await document.fonts.ready;
    const images = Array.from(exportRoot.querySelectorAll('img'));
    await Promise.all(
      images.map((img) => (img.complete ? Promise.resolve() : img.decode().catch(() => null)))
    );
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const pages = exportRoot.querySelectorAll('.a4-page');
    pages.forEach((page) => {
      page.style.width = `${a4WidthPx}px`;
      page.style.minHeight = `${a4HeightPx}px`;
    });
    exportRoot.querySelectorAll('.a4-page-content').forEach((content) => {
      content.style.height = `${a4HeightPx}px`;
      content.style.minHeight = `${a4HeightPx}px`;
    });
    const pageCount = pages.length || 1;
    const canvasWidth = a4WidthPx;
    const canvasHeight = a4HeightPx * pageCount;
    const options = {
      margin: [0, 0, 0, 0],
      filename: `${title.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        width: canvasWidth,
        height: canvasHeight,
        windowWidth: canvasWidth,
        windowHeight: canvasHeight,
        scrollX: 0,
        scrollY: 0
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'] }
    };
    await html2pdf().set(options).from(exportRoot).save();
  } finally {
    exportRoot.remove();
    document.body.classList.remove('exporting-pdf');
  }
}

async function buildExportHtml() {
  const reportPages = preview.querySelector('.report-pages') || preview;
  const stylesResponse = await fetch('styles.css');
  const stylesText = await stylesResponse.text();
  const exportRoot = reportPages.cloneNode(true);

  return `
    <!doctype html>
    <html lang="th">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;600;700&display=swap" rel="stylesheet" />
        <style>${stylesText}</style>
      </head>
      <body class="exporting-pdf">
        ${exportRoot.outerHTML}
      </body>
    </html>
  `;
}

async function exportPdfPrince() {
  if (preview.querySelector('.placeholder')) buildReport();

  const title = getInputValue('title', 'thai-report');
  const html = await buildExportHtml();
  const response = await fetch('/api/export', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ html, filename: `${title.replace(/\s+/g, '_')}.pdf` })
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'ไม่สามารถสร้าง PDF ด้วย PrinceXML ได้');
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${title.replace(/\s+/g, '_')}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

document.getElementById('generateBtn').addEventListener('click', buildReport);
document.getElementById('downloadBtn').addEventListener('click', exportPdf);
downloadPrinceBtn.addEventListener('click', () => {
  exportPdfPrince().catch((error) => {
    alert(error.message);
  });
});
toggleEditBtn.addEventListener('click', () => {
  isEditMode = !isEditMode;
  setEditableMode(isEditMode);
});

renderSectionSelector();
