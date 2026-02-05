const sectionTemplates = [
  { id: 'cover', label: 'หน้าปก', default: true },
  { id: 'abstract', label: 'บทคัดย่อ', default: true },
  { id: 'ack', label: 'กิตติกรรมประกาศ', default: true },
  { id: 'toc', label: 'สารบัญ', default: true },
  { id: 'ch1', label: 'บทที่ 1 บทนำ', default: true },
  { id: 'ch2', label: 'บทที่ 2 เอกสารที่เกี่ยวข้อง', default: true },
  { id: 'ch3', label: 'บทที่ 3 วิธีดำเนินงาน', default: true },
  { id: 'ch4', label: 'บทที่ 4 ผลการศึกษา', default: true },
  { id: 'ch5', label: 'บทที่ 5 สรุปและข้อเสนอแนะ', default: true },
  { id: 'ref', label: 'บรรณานุกรม', default: true },
  { id: 'appendix', label: 'ภาคผนวก', default: false }
];

const sectionsContainer = document.getElementById('sectionsContainer');
const preview = document.getElementById('reportPreview');

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

function createA4Page(contentHtml) {
  const page = document.createElement('section');
  page.className = 'a4-page';
  page.innerHTML = `<div class="a4-page-content">${contentHtml}</div>`;
  return page;
}

function buildReport() {
  const title = getInputValue('title', 'หัวข้อรายงานตัวอย่าง');
  const school = getInputValue('school', 'ชื่อโรงเรียน/สถาบัน');
  const faculty = getInputValue('faculty', 'ชื่อคณะ/แผนการเรียน');
  const student = getInputValue('student', 'ชื่อผู้จัดทำ');
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

  const pageIndexMap = new Map(selectedSections.map((section, index) => [section.id, index + 1]));

  selectedSections.forEach((section) => {
    if (section.id === 'cover') {
      reportRoot.appendChild(
        createA4Page(`
          <h2 class="report-title">${title}</h2>
          <p class="report-subtitle">จัดทำโดย ${student}</p>
          <p class="report-meta">${school} · ${faculty}</p>
        `)
      );
      return;
    }

    if (section.id === 'toc') {
      const items = selectedSections
        .filter((item) => item.id !== 'toc')
        .map(
          (item) =>
            `<li>${item.label} ........................................ ${pageIndexMap.get(item.id)}</li>`
        )
        .join('');

      reportRoot.appendChild(
        createA4Page(`
          <article class="report-block">
            <h3 class="report-section-title">สารบัญ</h3>
            <ol class="toc">${items}</ol>
          </article>
        `)
      );
      return;
    }

    if (section.id === 'ref') {
      reportRoot.appendChild(
        createA4Page(`
          <article class="report-block">
            <h3 class="report-section-title">บรรณานุกรม</h3>
            <p class="report-paragraph" style="text-indent:${indent};line-height:${lineSpacing}">ผู้จัดทำ. (2569). ${title}. ${school}.</p>
          </article>
        `)
      );
      return;
    }

    reportRoot.appendChild(
      createA4Page(`
        <article class="report-block">
          <h3 class="report-section-title">${section.label}</h3>
          <p class="report-paragraph" style="text-indent:${indent};line-height:${lineSpacing}">${paragraph(title)}</p>
          <p class="report-paragraph" style="text-indent:${indent};line-height:${lineSpacing}">${paragraph(section.label)}</p>
        </article>
      `)
    );
  });

  preview.innerHTML = '';
  preview.appendChild(reportRoot);
}

async function exportPdf() {
  if (preview.querySelector('.placeholder')) buildReport();

  const title = getInputValue('title', 'thai-report');
  const options = {
    margin: [0, 0, 0, 0],
    filename: `${title.replace(/\s+/g, '_')}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['css', 'legacy'] }
  };

  await html2pdf().set(options).from(preview).save();
}

document.getElementById('generateBtn').addEventListener('click', buildReport);
document.getElementById('downloadBtn').addEventListener('click', exportPdf);

renderSectionSelector();
