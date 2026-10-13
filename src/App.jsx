import { useMemo, useState } from 'react';
import { MapPin, PencilLine, Copy, ChevronDown } from 'lucide-react';

const siteData = {
  brand: {
    title: "citivan's homepage",
    shortTitle: 'CitiVan',
    logoText: 'CV',
  },
  home: {
    name: 'Chau Van Van, Ph.D. Candidate',
    roles: [
      'Lecturer, Posts and Telecommunications Institute of Technology (PTIT), Vietnam',
      'PhD Researcher, King Mongkut’s University of Technology North Bangkok (KMUTNB), Thailand',
    ],
    emailDisplay: 'chauvanvan [at] example [dot] edu',
    intro:
      'My name is Chau Van Van. I work in the areas of artificial intelligence, data science, computer vision, software engineering, and applied research. This website is designed as a long-term academic portfolio that can be updated continuously with new publications, supervised students, projects, and professional activities.',
    links: [
      { label: 'Scholar', href: 'https://scholar.google.com/citations?user=hu0CIzAAAAAJ&hl=en' },
      { label: 'Scopus', href: 'https://scholar.google.com/citations?user=hu0CIzAAAAAJ&hl=en' },
      { label: 'ORCID', href: 'https://orcid.org/0009-0008-0325-6809' },
      { label: 'GitHub', href: 'https://github.com/vancv43' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/citi-van-2a7251353/' },
      { label: 'Swarm Intelligence Textbook', href: '/citivan/swarm-intelligence/' },
      { label: 'Reviewer Strategy', href: '/citivan/reviewer-strategy/' },
    ],
    cvLink: '#',
    heroImage: `${import.meta.env.BASE_URL}images/profile-photo-20261013.jpg`,
  },
  profile: {
    bannerImage: `${import.meta.env.BASE_URL}images/profile-baner.jpg`,
    summary:
      'Chau Van Van is a lecturer and researcher in information technology, with academic interests spanning artificial intelligence, machine learning, computer vision, image retrieval, software engineering, software testing, and data science education. This page is structured so that education, academic positions, honors, and future milestones can be expanded easily over time without changing the overall layout of the website.',
    education: [
      {
        year: 'Present',
        degree: 'Ph.D. in Information Technology and Data Science',
        school: 'King Mongkut’s University of Technology North Bangkok (KMUTNB), Thailand',
        field: 'Artificial Intelligence, Data Science',
        thesis: 'Ongoing doctoral research in AI and data-driven intelligent systems',
      },
      {
        year: 'Previous',
        degree: 'M.Sc. / Prior Graduate Degree',
        school: 'Update with institution name',
        field: 'Update field of study',
        thesis: 'Update thesis title',
      },
      {
        year: 'Previous',
        degree: 'B.Sc. / Undergraduate Degree',
        school: 'Update with institution name',
        field: 'Update field of study',
        thesis: '',
      },
    ],
    positions: [
      {
        year: 'Present',
        title: 'Lecturer, Software Technology / Information Technology',
        org: 'Posts and Telecommunications Institute of Technology (PTIT), Vietnam',
      },
      {
        year: 'Present',
        title: 'PhD Researcher',
        org: 'KMUTNB, Thailand',
      },
      {
        year: 'Add year',
        title: 'Previous academic or industry position',
        org: 'Update organization',
      },
    ],
    awards: [
      { year: '2025', title: 'Best Paper Award', detail: 'Update conference or journal detail' },
      { year: '2024', title: 'Best Paper Award', detail: 'Update conference or journal detail' },
    ],
  },
  publications: [
    {
      id: "C23",
      year: 2026,
      type: "Conference",
      authors: "Chau Van Van, Nguyen Minh Tuan",
      title: "A Hybrid AI Framework for Automated Test Generation and Fault Prediction in Software Engineering",
      venue: "2025 Real-Time Intelligent Systems, Lecture Notes in Networks and Systems, pp. 239-247, 2026.",
      link: "https://doi.org/10.1007/978-3-032-23396-7_21",
    },
    {
      id: "C22",
      year: 2026,
      type: "Conference",
      authors: "Chau Van Van, Nguyen Minh Tuan, Anderes Gui, Hailong Sun, Nicholaus Hendrik Jeremy, Kenny Jingga",
      title: "A Hybrid Deep Learning and PSO-Based Framework for Occupancy-Based Energy Management in Smart Buildings",
      venue: "2026 11th International Conference on Applying New Technology in Green Buildings (ATiGB), pp. 1677-1682, 2026.",
      link: "https://doi.org/10.1109/atigb70203.2026.11628460",
    },
    {
      id: "C21",
      year: 2026,
      type: "Conference",
      authors: "Van Van Chau, Tuan Minh Nguyen, Phayung Meesad",
      title: "A Lightweight Transformer–Enhanced Image Processing Framework for Efficient Visual Feature Representation",
      venue: "Proceedings of the 22nd International Conference on Computing and Information Technology (IC2IT2026), Lecture Notes in Networks and Systems, pp. 46-55, 2026.",
      link: "https://doi.org/10.1007/978-3-032-28048-0_5",
    },
    {
      id: "C20",
      year: 2026,
      type: "Conference",
      authors: "Nguyen Minh Tuan, Nguyen Hong Son, Chau Van Van",
      title: "An Offline Semantic Plagiarism Detection System Using Sentence-Bert and Duckduckgo-Based Web Search: *Note: Sub-Titles Are Not Captured in Xplore and Should Not Be Used",
      venue: "2026 40th International Conference on Information Networking (ICOIN), pp. 706-710, 2026.",
      link: "https://doi.org/10.1109/icoin68469.2026.11480560",
    },
    {
      id: "C19",
      year: 2026,
      type: "Conference",
      authors: "Chau Van Van, Nguyen Minh Tuan, Anderes Gui, Hailong Sun, Nicholaus Hendrik Jeremy, Kenny Jingga",
      title: "An iHHO-Driven Hyperparameter Optimization Framework for Hybrid CNN–RNN Architectures in Fine-Grained Image Classification",
      venue: "2026 11th International Conference on Applying New Technology in Green Buildings (ATiGB), pp. 1643-1648, 2026.",
      link: "https://doi.org/10.1109/atigb70203.2026.11628286",
    },
    {
      id: "C18",
      year: 2026,
      type: "Conference",
      authors: "Chau Van Van, Nguyen Minh Tuan",
      title: "BERT-Driven Deep Learning for Enhanced Spam Email Classification with Browser Extension Integration",
      venue: "2025 Real-Time Intelligent Systems, Lecture Notes in Networks and Systems, pp. 167-177, 2026.",
      link: "https://doi.org/10.1007/978-3-032-23396-7_15",
    },
    {
      id: "C17",
      year: 2026,
      type: "Conference",
      authors: "Van Van Chau, Tuan Minh Nguyen, Phayung Meesad",
      title: "Hybrid Transformer-Based Multimodal Fusion for Chest X-ray Report Generation",
      venue: "Proceedings of the 22nd International Conference on Computing and Information Technology (IC2IT2026), Lecture Notes in Networks and Systems, pp. 144-153, 2026.",
      link: "https://doi.org/10.1007/978-3-032-28048-0_14",
    },
    {
      id: "C16",
      year: 2026,
      type: "Conference",
      authors: "Chau Van Van, Anderes Gui, Roggers Gang, Nesti Sianipar, Riki, Idris Gautama So",
      title: "KGEDO: A Knowledge-Guided Explainable Decision Optimisation Framework for Intelligent Accounting Information Systems",
      venue: "2026 IEEE 1st International Conference on Artificial Intelligence Implementation & Applications (ICAIIA), pp. 37-42, 2026.",
      link: "https://doi.org/10.1109/icaiia70172.2026.11691716",
    },
    {
      id: "C15",
      year: 2026,
      type: "Conference",
      authors: "Van Van Chau, Nguyen Minh Tuan, Nguyen Hong Son",
      title: "Mô Hình Học Sâu Cho Phát Hiện Tấn Công Và Ngăn Chặn Hệ Thống Mạng",
      venue: "REV-ECIT 2026 (National Conference on Electronics, Communications and Information Technology), 2026.",
      link: "https://orcid.org/0009-0008-0325-6809",
    },
    {
      id: "C14",
      year: 2026,
      type: "Conference",
      authors: "Van Van Chau, Nguyen Minh Tuan, Nguyen Trong Hien, Nguyen Hong Son",
      title: "New Data for Educational Consulting and Advanced Classification Models",
      venue: "RTIS 2026, 2026.",
      link: "https://orcid.org/0009-0008-0325-6809",
    },
    {
      id: "C13",
      year: 2026,
      type: "Conference",
      authors: "Chau Van Van, Nguyen Minh Tuan, Phayung Meesad, Anderes Gui, Erwin Halim, Hailong Sun",
      title: "Real-Time Detection of Violence in Video Content using YOLO and HHO Algorithm",
      venue: "2026 International Conference on Intelligent and Sustainable AI Systems (ICOSAAS), pp. 128-134, 2026.",
      link: "https://doi.org/10.1109/icosaas68663.2026.11649360",
    },
    {
      id: "C12",
      year: 2026,
      type: "Conference",
      authors: "Erwin Halim, Chau Van Van, Shara Toibayeva, Jefferson Cristoval, Laura Dorothy Thomason, Ai Ping Teoh",
      title: "Trust and Perceived Risk in Artificial Intelligence Use for Forex and Cryptocurrency Trading",
      venue: "2026 International Seminar on Intelligent Business and Edge-Computing Research (ISIBER), pp. 308-313, 2026.",
      link: "https://doi.org/10.1109/isiber68248.2026.11469785",
    },
    {
      id: "C11",
      year: 2026,
      type: "Conference",
      authors: "Ricky Kosasih, Anderes Gui, Evaristus Didik Madyatmadja, Yuvaraj Ganesan, Chau Van Van, I Gusti Made Karmawan",
      title: "Unveiling the Intention to Embrace Smart Wearables in Healthcare",
      venue: "2026 IEEE Region 10 Symposium (TENSYMP), pp. 1-5, 2026.",
      link: "https://doi.org/10.1109/tensymp68909.2026.11704032",
    },
    {
      id: "C10",
      year: 2026,
      type: "Conference",
      authors: "Chau Van Van, Nguyen Minh Tuan",
      title: "ViT–RBTFIR: A Deployed Vision Transformer on Fast Image Retrieval",
      venue: "2025 Real-Time Intelligent Systems, Lecture Notes in Networks and Systems, pp. 202-214, 2026.",
      link: "https://doi.org/10.1007/978-3-032-23396-7_18",
    },
    {
      id: "C09",
      year: 2026,
      type: "Conference",
      authors: "Van Van Chau, Nguyen Minh Tuan, Nguyen Hong Son",
      title: "Ứng Dụng Trí Tuệ Nhân Tạo Trong Chẩn Đoán Y Tế Sử Dụng Dữ liệu Lớn",
      venue: "REV-ECIT 2026 (National Conference on Electronics, Communications and Information Technology), 2026.",
      link: "https://orcid.org/0009-0008-0325-6809",
    },
    {
      id: "J02",
      year: 2026,
      type: "Journal",
      authors: "Nguyen Minh Tuan, Chau Van Van, Nguyen Hong Son, Huynh Trong Thua, Le Ha Thanh",
      title: "On Deploying Bilinear Neural Network Method to Various Solutions of (3+1)-dimensional Potential Yu-Toda-Sasa-Fukuyama Equation",
      venue: "WSEAS TRANSACTIONS ON SYSTEMS AND CONTROL, vol. 21, p. 95, 2026.",
      link: "https://doi.org/10.37394/23203.2026.21.10",
    },
    {
      id: "J01",
      year: 2026,
      type: "Journal",
      authors: "Nguyen Minh Tuan, Tran Trung Duy, Phayung Meesad, Nguyen Hong Son, Nguyen Trong Hien, Huynh Trong Thua, Vo Van Tinh, Chau Van Van, Nguyen Le Nha Trang",
      title: "Optimizing predictive accuracy in general medical exams using hybrid machine learning and metaheuristic optimization methods",
      venue: "An International Journal of Optimization and Control: Theories & Applications (IJOCTA), vol. 16, no. 3, p. 888, 2026.",
      link: "https://doi.org/10.36922/ijocta026020008",
    },
    {
      id: "C08",
      year: 2025,
      type: "Conference",
      authors: "Nguyen Minh Tuan, Chau Van Van, Nguyen Hong Son",
      title: "A Practical Evaluation of Paging Algorithm Smoothness: Trade-offs Between Competitiveness and Stability",
      venue: "Proceedings of the 2025 10th International Conference on Cloud Computing and Internet of Things, pp. 53-60, 2025.",
      link: "https://doi.org/10.1145/3785520.3785528",
    },
    {
      id: "C07",
      year: 2025,
      type: "Conference",
      authors: "Chau Van Van, Nguyen Minh Tuan, Nguyen Hong Son, Nguyen Trung Hieu",
      title: "D-ViT: Bộ biến đổi thị giác hiệu quả dữ liệu cho tác vụ tóm tắt ảnh X-quang ngực sang văn bản",
      venue: "REV-ECIT 2025 (National Conference on Electronics, Communications and Information Technology), pp. 426-430, 2025.",
      link: "https://rev-ecit.vn/vi/content/ky-yeu-hoi-nghi-0",
    },
    {
      id: "C06",
      year: 2025,
      type: "Conference",
      authors: "Nguyen Minh Tuan, Chau Van Van",
      title: "Data-Intensive Finance: Leveraging AI for Market Insights and Risk Forecasting",
      venue: "2025 International Conference on Intelligent Computing and Next Generation Networks (ICNGN), pp. 1-6, 2025.",
      link: "https://doi.org/10.1109/icngn67480.2025.11413748",
    },
    {
      id: "C05",
      year: 2025,
      type: "Conference",
      authors: "Chau Van Van, Nguyen Minh Tuan, Luong Trong Khoa, Nguyen Trong Hien, Erwin Halim, Anderes Gui",
      title: "Deep Herbal Vision: A Computer Vision Approach for Genuine versus Counterfeit Identification of Ngoc Linh Ginseng (Panax vietnamensis Ha et Grushv.)",
      venue: "2025 International Conference on Intelligent Computing and Next Generation Networks (ICNGN), pp. 1-5, 2025.",
      link: "https://doi.org/10.1109/icngn67480.2025.11413697",
    },
    {
      id: "C04",
      year: 2025,
      type: "Conference",
      authors: "Chau Van Van, Nguyen Minh Tuan, Huynh Trung Tru, Nguyen Trong Hien, Erwin Halim, Anderes Gui",
      title: "Hybrid Neural Network Models for Time-Series Biomedical Signal Forecasting",
      venue: "2025 International Conference on Intelligent Computing and Next Generation Networks (ICNGN), pp. 1-5, 2025.",
      link: "https://doi.org/10.1109/icngn67480.2025.11413781",
    },
    {
      id: "C03",
      year: 2025,
      type: "Conference",
      authors: "Chau Van Van, Nguyen Minh Tuan",
      title: "Optimizing Detection Tasks with PySwarms: Applications of Paging Algorithms",
      venue: "Proceedings of the 2025 10th International Conference on Cloud Computing and Internet of Things, pp. 70-74, 2025.",
      link: "https://doi.org/10.1145/3785520.3785530",
    },
    {
      id: "C02",
      year: 2024,
      type: "Conference",
      authors: "Van Van Chau",
      title: "Thuật toán Piecemeal-DFS Cho Việc Tìm Kiếm Duyệt Sâu Với Mức Năng Lượng Ràng Buộc Trên Bài Toán Hợp Hai Cây Cho Trước",
      venue: "National conference paper (Vietnamese), 2024.",
      link: "https://www.researchgate.net/publication/392512584_Thuat_toan_Piecemeal-DFS_Cho_Viec_Tim_Kiem_Duyet_Sau_Voi_Muc_Nang_Luong_Rang_Buoc_Tren_Bai_Toan_Hop_Hai_Cay_Cho_Truoc",
    },
    {
      id: "C01",
      year: 2022,
      type: "Conference",
      authors: "Lam Duc Vu Nguyen, Van Van Chau, Sinh Van Nguyen",
      title: "Face Recognition Based on Deep Learning and Data Augmentation",
      venue: "Future Data and Security Engineering. Big Data, Security and Privacy, Smart City and Industry 4.0 Applications, Communications in Computer and Information Science, pp. 560-573, 2022.",
      link: "https://doi.org/10.1007/978-981-19-8069-5_38",
    },
  ],
  supervision: {
    bannerImage: `${import.meta.env.BASE_URL}images/profile-baner.jpg`,
    doctoral: [
      {
        id: 'P01',
        student: 'Student name',
        title: 'Research topic title',
        school: 'University name',
        year: '2026–Ongoing',
        note: 'with co-supervisor if needed',
      },
    ],
    master: [
      {
        id: 'M01',
        student: 'Student name',
        title: 'Master thesis title',
        school: 'University name',
        year: '2025–2026',
        note: 'optional note',
      },
    ],
    intern: [
      {
        id: 'I01',
        student: 'Intern name',
        title: 'Internship or project topic',
        school: 'Institution',
        year: '2025',
        note: 'optional note',
      },
    ],
  },
  projects: [
    {
      id: 'P08',
      year: 2026,
      title: 'Reviewer Strategy: bilingual slides on peer-review methods, criteria, decision rules and a worked journal review',
      funding: 'Teaching material, PTITHCM',
      role: 'Author',
      period: '2026',
      link: '/citivan/reviewer-strategy/',
    },
    {
      id: 'P07',
      year: 2026,
      title: 'Swarm Intelligence Textbook: bilingual interactive slides, Python code and experiments for 18 algorithms',
      funding: 'Teaching material, PTITHCM',
      role: 'Author',
      period: '2026',
      link: '/citivan/swarm-intelligence/',
    },
    {
      id: 'P06',
      year: 2025,
      title: 'ViT-RBTFIR: Fast image retrieval using transformer features',
      funding: 'Internal or external funding information',
      role: 'Principal Investigator / Member',
      period: '2025–2026',
    },
    {
      id: 'P05',
      year: 2025,
      title: 'AI-driven healthcare and intelligent decision support',
      funding: 'Grant or institutional program',
      role: 'Member',
      period: '2025–2027',
    },
    {
      id: 'P04',
      year: 2024,
      title: 'Metaheuristic optimization in modern deep learning architectures',
      funding: 'Research foundation or university project',
      role: 'Member',
      period: '2024–2028',
    },
  ],
  contact: {
    organization: 'Posts and Telecommunications Institute of Technology (PTIT)',
    office: 'Faculty / Department information here',
    address: 'Update office address, city, country',
    personalEmail: 'yourname@gmail.com',
    institutionalEmail: 'yourname@ptit.edu.vn',
    mapEmbed:
      'https://www.google.com/maps?q=Posts%20and%20Telecommunications%20Institute%20of%20Technology&output=embed',
  },
};

const navItems = [
  { key: 'home', label: 'Home' },
  { key: 'profile', label: 'Profile' },
  { key: 'publications', label: 'Publications' },
  { key: 'supervision', label: 'Supervision' },
  { key: 'projects', label: 'Projects' },
  { key: 'contact', label: 'Contact' },
];

function SectionTitle({ title, right }) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      {right}
    </div>
  );
}

function Banner({ src }) {
  return (
    <div className="banner">
      <img
        src={src}
        alt="banner"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
          e.currentTarget.parentElement.innerHTML =
            '<div class="banner-fallback">Banner image area<br/>Please check image file path</div>';
        }}
      />
    </div>
  );
}

function YearFilter({ value, onChange, years }) {
  return (
    <div className="year-filter">
      <span>Year:</span>
      <div className="select-wrap">
        <select value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="All">All</option>
          {years.map((year) => (
            <option key={year} value={String(year)}>
              {year}
            </option>
          ))}
        </select>
        <ChevronDown size={18} className="select-icon" />
      </div>
    </div>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [pubType, setPubType] = useState('All');
  const [pubYear, setPubYear] = useState('All');
  const [supervisionType, setSupervisionType] = useState('All');
  const [projectYear, setProjectYear] = useState('All');

  const publicationYears = [...new Set(siteData.publications.map((p) => p.year))].sort((a, b) => b - a);
  const projectYears = [...new Set(siteData.projects.map((p) => p.year))].sort((a, b) => b - a);

  const filteredPublications = useMemo(() => {
    return siteData.publications.filter((item) => {
      const typeOk = pubType === 'All' || item.type === pubType;
      const yearOk = pubYear === 'All' || String(item.year) === pubYear;
      return typeOk && yearOk;
    });
  }, [pubType, pubYear]);

  const filteredProjects = useMemo(() => {
    return siteData.projects.filter((item) => projectYear === 'All' || String(item.year) === projectYear);
  }, [projectYear]);

  const supervisionData = {
    PhD: siteData.supervision.doctoral,
    Master: siteData.supervision.master,
    Intern: siteData.supervision.intern,
  };

  const visibleSupervision =
    supervisionType === 'All' ? supervisionData : { [supervisionType]: supervisionData[supervisionType] };

  return (
    <div className="site">
      <header className="site-header">
        <div className="brand">
          <div className="logo">{siteData.brand.logoText}</div>
          <div className="brand-title">{siteData.brand.title}</div>
        </div>

        <nav className="top-nav">
          {navItems.map((item) => {
            const active = activePage === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActivePage(item.key)}
                className={active ? 'nav-btn active' : 'nav-btn'}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </header>

      <main className="main-content">
        {activePage === 'home' && (
          <section className="home-page">
            <div className="home-left">
              <h1>{siteData.home.name}</h1>

              <div className="home-links">
                {siteData.home.links.map((link) => (
                  <a key={link.label} href={link.href} className="pill-link">
                    {link.label}
                  </a>
                ))}
              </div>

              <p className="email-line">{siteData.home.emailDisplay}</p>

              <div className="home-text">
                {siteData.home.roles.map((role) => (
                  <p key={role}>{role}</p>
                ))}
                <p>{siteData.home.intro}</p>
              </div>

              <a href={siteData.home.cvLink} className="cv-btn">
                Curriculum Vitae
              </a>
            </div>

            <div className="home-right">
              <div className="profile-circle">
                <img
                  src={siteData.home.heroImage}
                  alt="profile"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement.innerHTML =
                      '<div class="image-fallback">Profile image<br/>Please check file path</div>';
                  }}
                />
              </div>
            </div>
          </section>
        )}

        {activePage === 'profile' && (
          <section className="page-card">
            <Banner src={siteData.profile.bannerImage} />

            <div className="content-box">
              <p className="summary-text">{siteData.profile.summary}</p>

              <div className="block-section">
                <SectionTitle title="Education" />
                {siteData.profile.education.map((item, index) => (
                  <div key={index} className="timeline-row">
                    <div className="timeline-year">{item.year}</div>
                    <div className="timeline-content">
                      <h3>{item.degree}</h3>
                      <p>{item.school}</p>
                      <p>Field of study: {item.field}</p>
                      {item.thesis ? <p><i>Thesis: {item.thesis}</i></p> : null}
                    </div>
                  </div>
                ))}
              </div>

              <div className="block-section">
                <SectionTitle title="Positions" />
                {siteData.profile.positions.map((item, index) => (
                  <div key={index} className="timeline-row small">
                    <div className="timeline-year">{item.year}</div>
                    <div className="timeline-content">
                      <p><b>{item.title}</b>, {item.org}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="block-section">
                <SectionTitle title="Honors and Awards" />
                {siteData.profile.awards.map((item, index) => (
                  <div key={index} className="timeline-row small">
                    <div className="timeline-year">{item.year}</div>
                    <div className="timeline-content">
                      <p><b>{item.title}</b>, {item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {activePage === 'publications' && (
          <section className="page-card">
            <Banner src={`${import.meta.env.BASE_URL}images/publication-banner.jpg`} />

            <div className="content-box">
              <SectionTitle
                title="Publications"
                right={<YearFilter value={pubYear} onChange={setPubYear} years={publicationYears} />}
              />

              <div className="tab-row">
                {['All', 'Conference', 'Journal'].map((item) => (
                  <button
                    key={item}
                    onClick={() => setPubType(item)}
                    className={pubType === item ? 'tab-btn active' : 'tab-btn'}
                  >
                    {item}
                  </button>
                ))}
              </div>

              {[...new Set(filteredPublications.map((p) => p.year))]
                .sort((a, b) => b - a)
                .map((year) => (
                  <div key={year} className="year-group">
                    <h3 className="year-title">{year}</h3>
                    {filteredPublications
                      .filter((item) => item.year === year)
                      .map((item) => (
                        <div key={item.id} className="list-row">
                          <div className="list-id">[{item.id}]</div>
                          <div className="list-text">
                            {item.authors}. <a href={item.link}>“{item.title}”</a>. <i>{item.venue}</i>
                          </div>
                        </div>
                      ))}
                  </div>
                ))}
            </div>
          </section>
        )}

        {activePage === 'supervision' && (
          <section className="page-card">
            <Banner src={siteData.supervision.bannerImage} />

            <div className="content-box">
              <div className="tab-row">
                {['All', 'PhD', 'Master', 'Intern'].map((item) => (
                  <button
                    key={item}
                    onClick={() => setSupervisionType(item)}
                    className={supervisionType === item ? 'tab-btn active' : 'tab-btn'}
                  >
                    {item}
                  </button>
                ))}
              </div>

              {Object.entries(visibleSupervision).map(([group, items]) => (
                <div key={group} className="year-group">
                  <h3 className="year-title">
                    {group === 'PhD' ? 'Doctoral Students' : group === 'Master' ? 'Master’s Students' : 'Research Interns'}
                  </h3>

                  {items.map((item) => (
                    <div key={item.id} className="list-row">
                      <div className="list-id">[{item.id}]</div>
                      <div className="list-text">
                        <b>{item.student}</b>, <span className="highlight">“{item.title}”</span>, {item.school}, {item.year}
                        {item.note ? ` (${item.note})` : ''}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>
        )}

        {activePage === 'projects' && (
          <section className="page-card">
            <Banner src={`${import.meta.env.BASE_URL}images/projects-banner.jpg`} />

            <div className="content-box">
              <SectionTitle
                title="Projects"
                right={<YearFilter value={projectYear} onChange={setProjectYear} years={projectYears} />}
              />

              {[...new Set(filteredProjects.map((p) => p.year))]
                .sort((a, b) => b - a)
                .map((year) => (
                  <div key={year} className="year-group">
                    <h3 className="year-title">{year}</h3>
                    {filteredProjects
                      .filter((item) => item.year === year)
                      .map((item) => (
                        <div key={item.id} className="list-row">
                          <div className="list-id">[{item.id}]</div>
                          <div className="list-text">
                            <span className="highlight">{item.link ? <a href={item.link}>“{item.title}”</a> : <>“{item.title}”</>}</span>, {item.funding}, {item.period}, ({item.role})
                          </div>
                        </div>
                      ))}
                  </div>
                ))}
            </div>
          </section>
        )}

        {activePage === 'contact' && (
          <section className="contact-grid">
            <div className="left-col">
              <div className="card-box">
                <h3>{siteData.contact.organization}</h3>
                <p>{siteData.contact.office}</p>
                <p>{siteData.contact.address}</p>

                <div className="email-box">
                  <h4>Email:</h4>
                  <div className="email-item">
                    <span>- Personal:</span>
                    <a href={`mailto:${siteData.contact.personalEmail}`}>{siteData.contact.personalEmail}</a>
                    <Copy size={18} />
                  </div>
                  <div className="email-item">
                    <span>- Institutional:</span>
                    <a href={`mailto:${siteData.contact.institutionalEmail}`}>{siteData.contact.institutionalEmail}</a>
                    <Copy size={18} />
                  </div>
                </div>
              </div>

              <div className="card-box">
                <div className="card-title">
                  <MapPin size={22} />
                  <h3>Address</h3>
                </div>
                <iframe
                  title="map"
                  src={siteData.contact.mapEmbed}
                  className="map-frame"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            <div className="card-box">
              <div className="card-title">
                <PencilLine size={22} />
                <h3>Send a message</h3>
              </div>

              <form className="contact-form">
                <label>Your name</label>
                <input placeholder="Your name" />

                <label>Your email</label>
                <input placeholder="your@email.com" />

                <label>Subject</label>
                <input placeholder="Collaboration / talk / supervision..." />

                <label>Message</label>
                <textarea placeholder="Write your message..." />

                <div className="form-actions">
                  <button type="button" className="send-btn">Send</button>
                  <button type="reset" className="clear-btn">Clear</button>
                </div>
              </form>
            </div>
          </section>
        )}
      </main>

      <footer className="site-footer">
        <div>© 2026 {siteData.brand.shortTitle}. All rights reserved.</div>
        <div className="visitor-box">
          Total visits: <b>878</b> &nbsp; Online now: <b>1</b>
        </div>
      </footer>
    </div>
  );
}