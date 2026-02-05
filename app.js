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
      <p class="cover-school">${school}</p>
      <h2 class="cover-title">รายงาน</h2>
      <h1 class="cover-topic">เรื่อง ${title}</h1>

      <div class="cover-meta">
        <p>จัดทำโดย ${student}</p>
        <p>ชั้น ${classroom}</p>
        <p>เสนอ</p>
        <p>${teacher}</p>
        <p>รายวิชา ${subject}</p>
        <p>${faculty}</p>
        <p>${semester}</p>
      </div>

      <p class="cover-footer">${school}</p>
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

function buildTocRows(selectedSections, pageIndexMap) {
  return selectedSections
    .filter((item) => item.id !== 'toc' && item.id !== 'cover')
    .map(
      (item) => `
        <li class="toc-row">
          <span class="toc-label">${item.label}</span>
          <span class="toc-leader" aria-hidden="true"></span>
          <span class="toc-page">${pageIndexMap.get(item.id)}</span>
        </li>`
    )
    .join('');
}

function buildReport() {
  const title = getInputValue('title', 'หัวข้อรายงานตัวอย่าง');
  const school = getInputValue('school', 'ชื่อโรงเรียน/สถาบัน');
  const faculty = getInputValue('faculty', 'แผนการเรียน');
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
            <div class="toc-card">
              <p class="toc-subtitle">รายงานเรื่อง ${title}</p>
              <ol class="toc-list">${rows}</ol>
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
