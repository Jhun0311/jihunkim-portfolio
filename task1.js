// =========================
//  요소 참조
// =========================
const vinyl = document.getElementById('vinyl');
const tonearm = document.getElementById('tonearm');
const yearDetail = document.getElementById('yearDetail');
const years = document.querySelectorAll('.turntable .year');
const infoPanel = document.getElementById('infoPanel');
const navLinks = document.querySelectorAll('.nav-links li');
const stage = document.querySelector('.stage');
const stageTitle = document.getElementById('stageTitle');
const siteHeader = document.querySelector('.site-header');
const siteTitle = document.querySelector('.site-header h1');
const siteSubtitle = document.querySelector('.site-header p');
const ORIGINAL_TITLE = siteTitle.textContent;
const ORIGINAL_SUBTITLE = siteSubtitle.innerHTML;

// 메뉴별 헤더 서브타이틀
const viewSubtitles = {
    about: '제가 걸어온 길과 potential 및 loadmap을 소개합니다.',
    contact: '비지니스 협업 및 기타 문의',
    resume: '이력서'
};

// =========================
//  연도별 프로젝트 / 업적 데이터
//  (이 부분만 본인 내용으로 수정하면 됩니다)
// =========================
const achievements = {
    '2023': [
        {
            src: '2023-1.png',
            title: 'Learning Up Together',
            status: '진행완료',
            desc: '학습 멘토링 프로그램 수료',
            role: '하드웨어 설계',
            stack: ['교육', '멘토링']
        },
        {
            src: '2023-2.png',
            title: '군 입대',
            status: '진행완료',
            desc: '제 9보병사단 신병교육대대 (2023.08.14)',
            stack: []
        }
    ],
    '2024': [],
    '2025': [
        {
            src: '2025-1.png',
            title: '군 제대',
            status: '진행완료',
            desc: '제 6보병사단 포병여단 27FA (2025.02)',
            stack: []
        },
        {
            src: '2025-2.png',
            title: '데이터마이닝 / 빅데이터분석',
            status: '진행완료',
            desc: '데이터 분석 기초 학습 및 실습',
            role: '데이터 전처리, EDA, 모델 설계',
            stack: ['Python', 'MySQL']
        }
    ],
    '2026': [
        {
            src: '2026-1.png',
            title: '데이터마이닝 / 빅데이터분석',
            status: '진행완료',
            desc: '데이터마이닝 및 빅데이터 분석 과정 이수',
            role: '데이터 전처리, EDA',
            stack: ['Python', 'MySQL']
        },
        {
            src: '2026-2.png',
            title: 'JBMATE',
            status: '진행완료',
            desc: '중부대학교 교수학습지원센터 비마학습동아리<br>"대학생 개인 관리 웹사이트"',
            role: '프론트엔드: 메인 페이지 제작, 네비게이션 연결',
            stack: ['HTML', 'CSS', 'JavaScript', 'React']
        },
        {
            src: '2026-3.png',
            title: 'DermaLens',
            status: '진행완료',
            desc: '중부대학교 교수학습지원센터 창업동아리<br>"피부 타입 맞춤형 화장품 추천 플랫폼"',
            role: '프론트엔드: 웹페이지 제작',
            stack: ['HTML', 'CSS', 'JavaScript']
        }
    ]
};

// =========================
//  LP 회전 시작 (톤암 내려오고 → 판 회전)
// =========================
let spinTimer = null;
let armTimer = null;

function startSpin() {
    clearTimeout(spinTimer);
    clearTimeout(armTimer);

    // 이미 내려와 있으면 → 위로 올렸다가 다시 내려오는 애니메이션 재생
    // (헤드 위치는 결국 같지만, 매번 자연스러운 각도 변화가 보이도록)
    if (tonearm.classList.contains('down')) {
        tonearm.classList.remove('down');
        armTimer = setTimeout(() => {
            tonearm.classList.add('down');
        }, 800);
    } else {
        tonearm.classList.add('down');
    }

    spinTimer = setTimeout(() => {
        vinyl.classList.add('spinning');
    }, 500);
}

// =========================
//  연도 클릭 → 상세 표시 + LP 회전
// =========================
function showYear(year) {
    const items = achievements[year] || [];
    if (!items.length) {
        yearDetail.innerHTML = '<p>2023.08.14~2025.02.13 군복무</p>';
        yearDetail.hidden = false;
        return;
    }

    const cards = items.map((p) => {
        const statusCls = p.status === '진행중' ? 'ongoing' : 'done';
        const stackTags = (p.stack || []).map(s => `<span class="card-tag">${s}</span>`).join('');
        return `
            <article class="project-card">
                <div class="card-image"><img src="${p.src}" alt="${p.title}"></div>
                <div class="card-body">
                    <div class="card-title-row">
                        <h3 class="card-title">${p.title}</h3>
                        <span class="card-status ${statusCls}">${p.status}</span>
                    </div>
                    ${p.desc ? `<p class="card-desc">${p.desc}</p>` : ''}
                    ${p.role ? `<p class="card-role"><span class="label">role</span> ${p.role}</p>` : ''}
                    ${stackTags ? `<div class="card-stack">${stackTags}</div>` : ''}
                </div>
            </article>
        `;
    }).join('');

    yearDetail.innerHTML = `<div class="project-grid" data-year="${year}">${cards}</div>`;
    yearDetail.hidden = false;
}

// 연도 상세 → 초기 화면으로 복귀
function resetYear() {
    years.forEach((y) => y.classList.remove('active'));
    yearDetail.hidden = true;
    yearDetail.innerHTML = '';
    tonearm.classList.remove('down');
    vinyl.classList.remove('spinning');
}

years.forEach((label) => {
    label.addEventListener('click', () => {
        // 활성 표시
        years.forEach((y) => y.classList.remove('active'));
        label.classList.add('active');

        // 해당 연도 상세 표시
        showYear(label.dataset.year);

        // LP 회전 시작
        startSpin();
    });
});

// =========================
//  상단 메뉴 (Work / About / Contact)
// =========================
// 숙련도 가로 progress bar + 백분율 렌더링 헬퍼 (0~100 직접 입력)
const lvl = (pct) => `<span class="tool-level">
    <span class="bar-track"><span class="bar-fill" style="width:${pct}%"></span></span>
    <span class="bar-pct">${pct}%</span>
</span>`;

const views = {
    about: `
        <div class="about-view">
            <header class="about-whoami">
                <div class="about-photo"><img src="Me.png" alt="김지훈"></div>
                <div class="about-intro">
                    <h2 class="about-name">김지훈 <span class="about-name-en">JihunKim</span></h2>
                    <p class="about-tagline">프론트엔드 및 백엔드와 피지컬 AI까지, 보이는 것과 보이지 않는 것들을 구현하는 개발자입니다.</p>
                    <div class="about-tags">
                        <span class="about-tag">AI</span>
                        <span class="about-tag">Frontend</span>
                        <span class="about-tag">Backend</span>
                        <span class="about-tag">중부대 인공지능전공</span>
                    </div>
                </div>
            </header>

            <div class="about-grid">
                <section class="about-col">
                    <h3 class="about-section-title">Activities</h3>
                    <ul class="about-list">
                        <li>중부대학교(고양캠퍼스) 인공지능전공 재학</li>
                        <li>Learning Up Together 수료</li>
                        <li>제 9보병사단 신병교육대대 입대 (2023.08)</li>
                        <li>제 6보병사단 포병여단 27FA 제대 (2025.02)</li>
                        <li>중부대 교수학습지원센터 비마학습동아리 프론트 JBMATE 개발</li>
                        <li>중부대 교수학습지원센터 창업동아리 DermaLens 웹 개발</li>
                    </ul>
                </section>

                <section class="about-col">
                    <h3 class="about-section-title">Awards</h3>
                    <ul class="about-list">
                        <li>2026 창업아이디어 우체통 공모전 <span class="about-badge about-badge-bronze">장려상</span></li>
                        <li>2026 유튜브 콘텐츠 경진대회 <span class="about-badge">우수상</span></li>
                    </ul>

                    <h3 class="about-section-title">Certificates</h3>
                    <ul class="about-list">
                        <li>컴퓨터활용능력 2급</li>
                        <li>데이터 분석 준전문가 (ADsP)</li>
                        <li>지능형홈관리사</li>
                    </ul>
                </section>
            </div>

            <!-- Tools & Stacks -->
            <section class="about-tools">
                <h3 class="about-section-title tools-title">Tools &amp; Stacks</h3>
                <div class="tools-grid">
                    <section class="tools-col">
                        <h4 class="tools-category">Frontend</h4>
                        <ul class="tools-list">
                            <li><span class="tool-name">HTML</span>${lvl(60)}</li>
                            <li><span class="tool-name">CSS</span>${lvl(60)}</li>
                            <li><span class="tool-name">JavaScript</span>${lvl(50)}</li>
                            <li><span class="tool-name">React.js</span>${lvl(50)}</li>
                            <li><span class="tool-name">React Native</span>${lvl(50)}</li>
                            <li><span class="tool-name">TypeScript</span>${lvl(30)}</li>
                            <li><span class="tool-name">TailwindCSS</span>${lvl(50)}</li>
                            <li><span class="tool-name">Flutter</span>${lvl(10)}</li>
                        </ul>
                    </section>
                    <section class="tools-col">
                        <h4 class="tools-category">Backend &amp; AI</h4>
                        <ul class="tools-list">
                            <li><span class="tool-name">Java</span>${lvl(55)}</li>
                            <li><span class="tool-name">Python</span>${lvl(75)}</li>
                            <li><span class="tool-name">C</span>${lvl(55)}</li>
                            <li><span class="tool-name">Google Colab</span>${lvl(60)}</li>
                            <li><span class="tool-name">MySQL</span>${lvl(30)}</li>
                            <li><span class="tool-name">Django</span>${lvl(30)}</li>
                            <li><span class="tool-name">ChatGPT</span>${lvl(90)}</li>
                            <li><span class="tool-name">Claude</span>${lvl(75)}</li>
                            <li><span class="tool-name">Gemini</span>${lvl(80)}</li>
                        </ul>
                    </section>
                    <section class="tools-col">
                        <h4 class="tools-category">Design</h4>
                        <ul class="tools-list">
                            <li><span class="tool-name">Photoshop</span>${lvl(20)}</li>
                        </ul>
                    </section>
                    <section class="tools-col">
                        <h4 class="tools-category">Collaboration</h4>
                        <ul class="tools-list">
                            <li><span class="tool-name">Figma</span>${lvl(20)}</li>
                            <li><span class="tool-name">GitHub</span>${lvl(30)}</li>
                        </ul>
                    </section>
                </div>
            </section>
        </div>
    `,
    resume: `
        <div class="resume-viewer">
            <div class="resume-viewer-header">
                <div class="resume-viewer-title">
                    <span class="chevron">&rsaquo;</span>
                    <span>JihunKim_Resume.pdf</span>
                </div>
                <a class="resume-download" href="JihunKim_Resume.pdf" download>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                </a>
            </div>
            <object class="resume-preview" data="JihunKim_Resume.pdf" type="application/pdf">
                <iframe class="resume-preview" src="JihunKim_Resume.pdf" title="Resume PDF">
                    <p class="resume-fallback">
                        브라우저가 PDF 미리보기를 지원하지 않습니다.
                        <a href="JihunKim_Resume.pdf" target="_blank" rel="noopener">resume 다운로드</a>
                    </p>
                </iframe>
            </object>
        </div>
    `,
    contact: `
        <div class="contact-view">
            <ul class="contact-list">
                <li class="contact-item">
                    <div class="contact-label">
                        <svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7L12 13 2 7"/></svg>
                        <span>Email</span>
                    </div>
                    <a class="contact-value" href="mailto:kjh031103@naver.com">kjh031103@naver.com</a>
                </li>
                <li class="contact-item">
                    <div class="contact-label">
                        <svg class="contact-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.04c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.23 1.84 1.23 1.07 1.83 2.81 1.3 3.5 1 .11-.78.42-1.3.76-1.6-2.66-.31-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.23-3.22-.12-.3-.54-1.52.12-3.17 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.62-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 0z"/></svg>
                        <span>GitHub</span>
                    </div>
                    <a class="contact-value" href="https://github.com/Jhun0311" target="_blank" rel="noopener">github.com/Jhun0311</a>
                </li>
            </ul>
        </div>
    `
};

// 초기 화면으로 복귀
function resetView() {
    navLinks.forEach((l) => l.classList.remove('active'));
    infoPanel.hidden = true;
    infoPanel.innerHTML = '';
    siteTitle.textContent = ORIGINAL_TITLE;
    siteSubtitle.innerHTML = ORIGINAL_SUBTITLE;
    siteSubtitle.hidden = false;
    siteHeader.classList.remove('view-active');
    stage.hidden = false;
    stageTitle.hidden = false;
    yearDetail.hidden = true;
}

navLinks.forEach((link) => {
    link.addEventListener('click', () => {
        const view = link.dataset.view;

        // 같은 메뉴를 다시 누르면 아무 동작 안 함 (현재 페이지 유지)
        if (link.classList.contains('active')) return;

        // 활성 표시
        navLinks.forEach((l) => l.classList.remove('active'));
        link.classList.add('active');

        // 상단 밴드 좌측 정렬 + 제목/서브타이틀 변경
        siteHeader.classList.add('view-active');
        siteTitle.textContent = link.textContent;
        if (viewSubtitles[view]) {
            siteSubtitle.innerHTML = viewSubtitles[view];
            siteSubtitle.hidden = false;
        } else {
            siteSubtitle.hidden = true;
        }

        // LP판 영역 숨김
        stage.hidden = true;
        stageTitle.hidden = true;
        yearDetail.hidden = true;

        // 내용 표시
        infoPanel.innerHTML = views[view] || '';
        infoPanel.hidden = false;
    });
});

// LOGO 클릭 시 초기 화면으로 복귀 (메뉴/연도 둘 다 초기화)
const logoBtn = document.getElementById('logoBtn');
if (logoBtn) {
    logoBtn.addEventListener('click', () => {
        resetView();
        resetYear();
    });
}

// Works 클릭 시 메인 LP/Works 화면으로 복귀
const navWorks = document.getElementById('navWorks');
if (navWorks) {
    navWorks.addEventListener('click', () => {
        resetView();
        resetYear();
    });
}
