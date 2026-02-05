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
      <h2 class="cover-title">รายงาน</h2>
      <h1 class="cover-topic">เรื่อง ${title}</h1>

      <div class="cover-meta">
        <p><strong>ผู้จัดทำ</strong> ${student}</p>
        <p><strong>นักเรียนชั้น</strong> ${classroom}</p>
        <p><strong>รายงานฉบับนี้เป็นส่วนหนึ่งของรายวิชา</strong> ${faculty}</p>
        <p><strong>ภาคเรียนที่</strong> ${semester}</p>
      </div>

      <div class="cover-footer-wrap">
        <p class="cover-footer">โรงเรียนสมเด็จพระธีรญาณมุนี</p>
        <p class="cover-footer-sub">สังกัดสำนักงานเขตพื้นที่การศึกษามัธยมศึกษาจังหวัดนครราชสีมา</p>
      </div>
        <p>จัดทำโดย ${student}</p>
        <p>ชั้น ${classroom}</p>
        <p>เสนอ</p>
        <p>${teacher}</p>
        <p>รายวิชา ${subject}</p>
        <p>รายงานฉบับนี้เป็นส่วนหนึ่งของรายวิชา ${faculty}</p>
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
        <li class="toc-row">
          <span class="toc-label">${item.label}</span>
          <span class="toc-leader" aria-hidden="true"></span>
          <span class="toc-page">${pageIndexMap.get(item.id)}</span>
        </li>`
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
  const options = {
    margin: [0, 0, 0, 0],
    filename: `${title.replace(/\s+/g, '_')}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['css', 'legacy'] }
  };

  document.body.classList.add('exporting-pdf');
  try {
    await html2pdf().set(options).from(reportPages).save();
}

document.getElementById('generateBtn').addEventListener('click', buildReport);
document.getElementById('downloadBtn').addEventListener('click', exportPdf);
toggleEditBtn.addEventListener('click', () => {
  isEditMode = !isEditMode;
  setEditableMode(isEditMode);
});

renderSectionSelector();
