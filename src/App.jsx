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
    ],
    cvLink: '#',
    heroImage: '/images/profile-photo.jpg',
  },
  profile: {
    bannerImage: '/images/profile-baner.jpg',
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
      id: 'J01',
      year: 2026,
      type: 'Journal',
      authors: 'Author A, Chau Van Van, Author C',
      title: 'Sample journal article title for website structure',
      venue: 'Journal Name, Vol. x, No. y, pages, year.',
      link: '#',
    },
    {
      id: 'C01',
      year: 2026,
      type: 'Conference',
      authors: 'Author A, Chau Van Van, Author C',
      title: 'Sample conference paper title for website structure',
      venue: 'Conference Name, country, year.',
      link: '#',
    },
    {
      id: 'J02',
      year: 2025,
      type: 'Journal',
      authors: 'Chau Van Van, Author B',
      title: 'Another publication item that can be updated later',
      venue: 'Journal Name, year.',
      link: '#',
    },
    {
      id: 'C02',
      year: 2025,
      type: 'Conference',
      authors: 'Chau Van Van, Author B, Author C',
      title: 'A conference publication with expandable metadata',
      venue: 'Conference Name, year.',
      link: '#',
    },
  ],
  supervision: {
    bannerImage: '/images/profile-baner.jpg',
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
            <Banner src="/images/publication-banner.png" />

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
            <Banner src="/images/projects-banner.png" />

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
                            <span className="highlight">“{item.title}”</span>, {item.funding}, {item.period}, ({item.role})
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