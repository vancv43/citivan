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
      authors: "Chau Van Van; Nguyen Minh Tuan",
      authorLinks: [{"name": "Chau Van Van", "url": "https://link.springer.com/search?dc.creator=Chau%20Van%20Van"}, {"name": "Nguyen Minh Tuan", "url": "https://link.springer.com/search?dc.creator=Nguyen%20Minh%20Tuan"}],
      title: "A Hybrid AI Framework for Automated Test Generation and Fault Prediction in Software Engineering",
      venue: "2025 Real-Time Intelligent Systems, Lecture Notes in Networks and Systems, pp. 239-247, 2026.",
      index: "Scopus (Springer)",
      publisher: "Springer",
      doi: "10.1007/978-3-032-23396-7_21",
      landing: "https://link.springer.com/10.1007/978-3-032-23396-7_21",
      pdf: "https://link.springer.com/content/pdf/10.1007/978-3-032-23396-7_21.pdf",
      bibtex: "@inbook{Van_2026, title={A Hybrid AI Framework for Automated Test Generation and Fault Prediction in Software Engineering}, ISBN={9783032233967}, ISSN={2367-3389}, url={http://dx.doi.org/10.1007/978-3-032-23396-7_21}, DOI={10.1007/978-3-032-23396-7_21}, booktitle={2025 Real-Time Intelligent Systems}, publisher={Springer Nature Switzerland}, author={Van, Chau Van and Tuan, Nguyen Minh}, year={2026}, month=Aug, pages={239–247} }",
      link: "https://doi.org/10.1007/978-3-032-23396-7_21",
    },
    {
      id: "C22",
      year: 2026,
      type: "Conference",
      authors: "Chau Van Van; Nguyen Minh Tuan; Anderes Gui; Hailong Sun; Nicholaus Hendrik Jeremy; Kenny Jingga",
      authorLinks: [{"name": "Chau Van Van", "url": "https://ieeexplore.ieee.org/author/935688334431775"}, {"name": "Nguyen Minh Tuan", "url": "https://ieeexplore.ieee.org/author/37089033460"}, {"name": "Anderes Gui", "url": "https://ieeexplore.ieee.org/author/37995856600"}, {"name": "Hailong Sun", "url": "https://ieeexplore.ieee.org/author/564693763012608"}, {"name": "Nicholaus Hendrik Jeremy", "url": "https://ieeexplore.ieee.org/author/37089294553"}, {"name": "Kenny Jingga", "url": "https://ieeexplore.ieee.org/author/37088566449"}],
      title: "A Hybrid Deep Learning and PSO-Based Framework for Occupancy-Based Energy Management in Smart Buildings",
      venue: "2026 11th International Conference on Applying New Technology in Green Buildings (ATiGB), pp. 1677-1682, 2026.",
      index: "Scopus (IEEE Xplore)",
      publisher: "IEEE",
      doi: "10.1109/atigb70203.2026.11628460",
      landing: "https://ieeexplore.ieee.org/document/11628460/",
      pdf: "https://ieeexplore.ieee.org/stamp/stamp.jsp?arnumber=11628460",
      bibtex: "@inproceedings{Van_Van_2026, title={A Hybrid Deep Learning and PSO-Based Framework for Occupancy-Based Energy Management in Smart Buildings}, url={http://dx.doi.org/10.1109/atigb70203.2026.11628460}, DOI={10.1109/atigb70203.2026.11628460}, booktitle={2026 11th International Conference on Applying New Technology in Green Buildings (ATiGB)}, publisher={IEEE}, author={Van Van, Chau and Tuan, Nguyen Minh and Gui, Anderes and Sun, Hailong and Jeremy, Nicholaus Hendrik and Jingga, Kenny}, year={2026}, month=July, pages={1677–1682} }",
      link: "https://doi.org/10.1109/atigb70203.2026.11628460",
    },
    {
      id: "C21",
      year: 2026,
      type: "Conference",
      authors: "Chau Van Van; Tuan Minh Nguyen; Phayung Meesad",
      authorLinks: [{"name": "Chau Van Van", "url": "https://link.springer.com/search?dc.creator=Van%20Van%20Chau"}, {"name": "Tuan Minh Nguyen", "url": "https://link.springer.com/search?dc.creator=Tuan%20Minh%20Nguyen"}, {"name": "Phayung Meesad", "url": "https://link.springer.com/search?dc.creator=Phayung%20Meesad"}],
      title: "A Lightweight Transformer–Enhanced Image Processing Framework for Efficient Visual Feature Representation",
      venue: "Proceedings of the 22nd International Conference on Computing and Information Technology (IC2IT2026), Lecture Notes in Networks and Systems, pp. 46-55, 2026.",
      index: "Scopus (Springer)",
      publisher: "Springer",
      doi: "10.1007/978-3-032-28048-0_5",
      landing: "https://link.springer.com/10.1007/978-3-032-28048-0_5",
      pdf: "https://link.springer.com/content/pdf/10.1007/978-3-032-28048-0_5.pdf",
      bibtex: "@inbook{Chau_2026, title={A Lightweight Transformer–Enhanced Image Processing Framework for Efficient Visual Feature Representation}, ISBN={9783032280480}, ISSN={2367-3389}, url={http://dx.doi.org/10.1007/978-3-032-28048-0_5}, DOI={10.1007/978-3-032-28048-0_5}, booktitle={Proceedings of the 22nd International Conference on Computing and Information Technology (IC2IT2026)}, publisher={Springer Nature Switzerland}, author={Chau, Van Van and Nguyen, Tuan Minh and Meesad, Phayung}, year={2026}, pages={46–55} }",
      link: "https://doi.org/10.1007/978-3-032-28048-0_5",
    },
    {
      id: "C20",
      year: 2026,
      type: "Conference",
      authors: "Nguyen Minh Tuan; Nguyen Hong Son; Chau Van Van",
      authorLinks: [{"name": "Nguyen Minh Tuan", "url": "https://ieeexplore.ieee.org/author/37089033460"}, {"name": "Nguyen Hong Son", "url": "https://ieeexplore.ieee.org/author/37088348751"}, {"name": "Chau Van Van", "url": "https://ieeexplore.ieee.org/author/935688334431775"}],
      title: "An Offline Semantic Plagiarism Detection System Using Sentence-Bert and Duckduckgo-Based Web Search: *Note: Sub-Titles Are Not Captured in Xplore and Should Not Be Used",
      venue: "2026 40th International Conference on Information Networking (ICOIN), pp. 706-710, 2026.",
      index: "Scopus (IEEE Xplore)",
      publisher: "IEEE",
      doi: "10.1109/icoin68469.2026.11480560",
      landing: "https://ieeexplore.ieee.org/document/11480560/",
      pdf: "https://ieeexplore.ieee.org/stamp/stamp.jsp?arnumber=11480560",
      bibtex: "@inproceedings{Tuan_2026, title={An Offline Semantic Plagiarism Detection System Using Sentence-Bert and Duckduckgo-Based Web Search: *Note: Sub-Titles Are Not Captured in Xplore and Should Not Be Used}, url={http://dx.doi.org/10.1109/icoin68469.2026.11480560}, DOI={10.1109/icoin68469.2026.11480560}, booktitle={2026 40th International Conference on Information Networking (ICOIN)}, publisher={IEEE}, author={Tuan, Nguyen Minh and Son, Nguyen Hong and Van Van, Chau}, year={2026}, month=Jan, pages={706–710} }",
      link: "https://doi.org/10.1109/icoin68469.2026.11480560",
    },
    {
      id: "C19",
      year: 2026,
      type: "Conference",
      authors: "Chau Van Van; Nguyen Minh Tuan; Anderes Gui; Hailong Sun; Nicholaus Hendrik Jeremy; Kenny Jingga",
      authorLinks: [{"name": "Chau Van Van", "url": "https://ieeexplore.ieee.org/author/935688334431775"}, {"name": "Nguyen Minh Tuan", "url": "https://ieeexplore.ieee.org/author/37089033460"}, {"name": "Anderes Gui", "url": "https://ieeexplore.ieee.org/author/37995856600"}, {"name": "Hailong Sun", "url": "https://ieeexplore.ieee.org/author/564693763012608"}, {"name": "Nicholaus Hendrik Jeremy", "url": "https://ieeexplore.ieee.org/author/37089294553"}, {"name": "Kenny Jingga", "url": "https://ieeexplore.ieee.org/author/37088566449"}],
      title: "An iHHO-Driven Hyperparameter Optimization Framework for Hybrid CNN–RNN Architectures in Fine-Grained Image Classification",
      venue: "2026 11th International Conference on Applying New Technology in Green Buildings (ATiGB), pp. 1643-1648, 2026.",
      index: "Scopus (IEEE Xplore)",
      publisher: "IEEE",
      doi: "10.1109/atigb70203.2026.11628286",
      landing: "https://ieeexplore.ieee.org/document/11628286/",
      pdf: "https://ieeexplore.ieee.org/stamp/stamp.jsp?arnumber=11628286",
      bibtex: "@inproceedings{Van_Van_2026, title={An iHHO-Driven Hyperparameter Optimization Framework for Hybrid CNN–RNN Architectures in Fine-Grained Image Classification}, url={http://dx.doi.org/10.1109/atigb70203.2026.11628286}, DOI={10.1109/atigb70203.2026.11628286}, booktitle={2026 11th International Conference on Applying New Technology in Green Buildings (ATiGB)}, publisher={IEEE}, author={Van Van, Chau and Tuan, Nguyen Minh and Gui, Anderes and Sun, Hailong and Jeremy, Nicholaus Hendrik and Jingga, Kenny}, year={2026}, month=July, pages={1643–1648} }",
      link: "https://doi.org/10.1109/atigb70203.2026.11628286",
    },
    {
      id: "C18",
      year: 2026,
      type: "Conference",
      authors: "Chau Van Van; Nguyen Minh Tuan",
      authorLinks: [{"name": "Chau Van Van", "url": "https://link.springer.com/search?dc.creator=Chau%20Van%20Van"}, {"name": "Nguyen Minh Tuan", "url": "https://link.springer.com/search?dc.creator=Nguyen%20Minh%20Tuan"}],
      title: "BERT-Driven Deep Learning for Enhanced Spam Email Classification with Browser Extension Integration",
      venue: "2025 Real-Time Intelligent Systems, Lecture Notes in Networks and Systems, pp. 167-177, 2026.",
      index: "Scopus (Springer)",
      publisher: "Springer",
      doi: "10.1007/978-3-032-23396-7_15",
      landing: "https://link.springer.com/10.1007/978-3-032-23396-7_15",
      pdf: "https://link.springer.com/content/pdf/10.1007/978-3-032-23396-7_15.pdf",
      bibtex: "@inbook{Van_2026, title={BERT-Driven Deep Learning for Enhanced Spam Email Classification with Browser Extension Integration}, ISBN={9783032233967}, ISSN={2367-3389}, url={http://dx.doi.org/10.1007/978-3-032-23396-7_15}, DOI={10.1007/978-3-032-23396-7_15}, booktitle={2025 Real-Time Intelligent Systems}, publisher={Springer Nature Switzerland}, author={Van, Chau Van and Tuan, Nguyen Minh}, year={2026}, month=Aug, pages={167–177} }",
      link: "https://doi.org/10.1007/978-3-032-23396-7_15",
    },
    {
      id: "C17",
      year: 2026,
      type: "Conference",
      authors: "Chau Van Van; Tuan Minh Nguyen; Phayung Meesad",
      authorLinks: [{"name": "Chau Van Van", "url": "https://link.springer.com/search?dc.creator=Van%20Van%20Chau"}, {"name": "Tuan Minh Nguyen", "url": "https://link.springer.com/search?dc.creator=Tuan%20Minh%20Nguyen"}, {"name": "Phayung Meesad", "url": "https://link.springer.com/search?dc.creator=Phayung%20Meesad"}],
      title: "Hybrid Transformer-Based Multimodal Fusion for Chest X-ray Report Generation",
      venue: "Proceedings of the 22nd International Conference on Computing and Information Technology (IC2IT2026), Lecture Notes in Networks and Systems, pp. 144-153, 2026.",
      index: "Scopus (Springer)",
      publisher: "Springer",
      doi: "10.1007/978-3-032-28048-0_14",
      landing: "https://link.springer.com/10.1007/978-3-032-28048-0_14",
      pdf: "https://link.springer.com/content/pdf/10.1007/978-3-032-28048-0_14.pdf",
      bibtex: "@inbook{Chau_2026, title={Hybrid Transformer-Based Multimodal Fusion for Chest X-ray Report Generation}, ISBN={9783032280480}, ISSN={2367-3389}, url={http://dx.doi.org/10.1007/978-3-032-28048-0_14}, DOI={10.1007/978-3-032-28048-0_14}, booktitle={Proceedings of the 22nd International Conference on Computing and Information Technology (IC2IT2026)}, publisher={Springer Nature Switzerland}, author={Chau, Van Van and Nguyen, Tuan Minh and Meesad, Phayung}, year={2026}, pages={144–153} }",
      link: "https://doi.org/10.1007/978-3-032-28048-0_14",
    },
    {
      id: "C16",
      year: 2026,
      type: "Conference",
      authors: "Chau Van Van; Anderes Gui; Roggers Gang; Nesti Sianipar; Riki; Idris Gautama So",
      authorLinks: [{"name": "Chau Van Van", "url": "https://ieeexplore.ieee.org/author/935688334431775"}, {"name": "Anderes Gui", "url": "https://ieeexplore.ieee.org/author/37995856600"}, {"name": "Roggers Gang", "url": "https://ieeexplore.ieee.org/author/796331000800928"}, {"name": "Nesti Sianipar", "url": "https://ieeexplore.ieee.org/author/37085649240"}, {"name": "Riki", "url": "https://ieeexplore.ieee.org/author/317931959390419"}, {"name": "Idris Gautama So", "url": "https://ieeexplore.ieee.org/author/37085535935"}],
      title: "KGEDO: A Knowledge-Guided Explainable Decision Optimisation Framework for Intelligent Accounting Information Systems",
      venue: "2026 IEEE 1st International Conference on Artificial Intelligence Implementation & Applications (ICAIIA), pp. 37-42, 2026.",
      index: "Scopus (IEEE Xplore)",
      publisher: "IEEE",
      doi: "10.1109/icaiia70172.2026.11691716",
      landing: "https://ieeexplore.ieee.org/document/11691716/",
      pdf: "https://ieeexplore.ieee.org/stamp/stamp.jsp?arnumber=11691716",
      bibtex: "@inproceedings{Van_2026, title={KGEDO: A Knowledge-Guided Explainable Decision Optimisation Framework for Intelligent Accounting Information Systems}, url={http://dx.doi.org/10.1109/icaiia70172.2026.11691716}, DOI={10.1109/icaiia70172.2026.11691716}, booktitle={2026 IEEE 1st International Conference on Artificial Intelligence Implementation &amp; Applications (ICAIIA)}, publisher={IEEE}, author={Van, Chau Van and Gui, Anderes and Gang, Roggers and Sianipar, Nesti and Riki and So, Idris Gautama}, year={2026}, month=Sept, pages={37–42} }",
      link: "https://doi.org/10.1109/icaiia70172.2026.11691716",
    },
    {
      id: "C15",
      year: 2026,
      type: "Conference",
      authors: "Chau Van Van; Nguyen Minh Tuan; Nguyen Hong Son",
      authorLinks: [{"name": "Chau Van Van", "url": "https://orcid.org/0009-0008-0325-6809"}, {"name": "Nguyen Minh Tuan", "url": "https://scholar.google.com/scholar?q=author%3A%22Nguyen%20Minh%20Tuan%22"}, {"name": "Nguyen Hong Son", "url": "https://scholar.google.com/scholar?q=author%3A%22Nguyen%20Hong%20Son%22"}],
      title: "Mô Hình Học Sâu Cho Phát Hiện Tấn Công Và Ngăn Chặn Hệ Thống Mạng",
      venue: "REV-ECIT 2026 (National Conference on Electronics, Communications and Information Technology), 2026.",
      index: "National",
      publisher: null,
      doi: null,
      landing: null,
      pdf: null,
      bibtex: "@inproceedings{Van2026M,\n  author = {Van Van Chau and Nguyen Minh Tuan and Nguyen Hong Son},\n  title = {Mô Hình Học Sâu Cho Phát Hiện Tấn Công Và Ngăn Chặn Hệ Thống Mạng},\n  booktitle = {REV-ECIT 2026 (National Conference on Electronics, Communications and Information Technology)},\n  year = {2026}\n}",
      link: "https://orcid.org/0009-0008-0325-6809",
    },
    {
      id: "C14",
      year: 2026,
      type: "Conference",
      authors: "Chau Van Van; Nguyen Minh Tuan; Nguyen Trong Hien; Nguyen Hong Son",
      authorLinks: [{"name": "Chau Van Van", "url": "https://orcid.org/0009-0008-0325-6809"}, {"name": "Nguyen Minh Tuan", "url": "https://scholar.google.com/scholar?q=author%3A%22Nguyen%20Minh%20Tuan%22"}, {"name": "Nguyen Trong Hien", "url": "https://scholar.google.com/scholar?q=author%3A%22Nguyen%20Trong%20Hien%22"}, {"name": "Nguyen Hong Son", "url": "https://scholar.google.com/scholar?q=author%3A%22Nguyen%20Hong%20Son%22"}],
      title: "New Data for Educational Consulting and Advanced Classification Models",
      venue: "RTIS 2026, 2026.",
      index: "In press",
      publisher: null,
      doi: null,
      landing: null,
      pdf: null,
      bibtex: "@inproceedings{Van2026New,\n  author = {Van Van Chau and Nguyen Minh Tuan and Nguyen Trong Hien and Nguyen Hong Son},\n  title = {New Data for Educational Consulting and Advanced Classification Models},\n  booktitle = {RTIS 2026},\n  year = {2026}\n}",
      link: "https://orcid.org/0009-0008-0325-6809",
    },
    {
      id: "C13",
      year: 2026,
      type: "Conference",
      authors: "Chau Van Van; Nguyen Minh Tuan; Phayung Meesad; Anderes Gui; Erwin Halim; Hailong Sun",
      authorLinks: [{"name": "Chau Van Van", "url": "https://ieeexplore.ieee.org/author/935688334431775"}, {"name": "Nguyen Minh Tuan", "url": "https://ieeexplore.ieee.org/author/37089033460"}, {"name": "Phayung Meesad", "url": "https://ieeexplore.ieee.org/author/37325222300"}, {"name": "Anderes Gui", "url": "https://ieeexplore.ieee.org/author/37995856600"}, {"name": "Erwin Halim", "url": "https://ieeexplore.ieee.org/author/37086101606"}, {"name": "Hailong Sun", "url": "https://ieeexplore.ieee.org/author/564693763012608"}],
      title: "Real-Time Detection of Violence in Video Content using YOLO and HHO Algorithm",
      venue: "2026 International Conference on Intelligent and Sustainable AI Systems (ICOSAAS), pp. 128-134, 2026.",
      index: "Scopus (IEEE Xplore)",
      publisher: "IEEE",
      doi: "10.1109/icosaas68663.2026.11649360",
      landing: "https://ieeexplore.ieee.org/document/11649360/",
      pdf: "https://ieeexplore.ieee.org/stamp/stamp.jsp?arnumber=11649360",
      bibtex: "@inproceedings{Van_Van_2026, title={Real-Time Detection of Violence in Video Content using YOLO and HHO Algorithm}, url={http://dx.doi.org/10.1109/icosaas68663.2026.11649360}, DOI={10.1109/icosaas68663.2026.11649360}, booktitle={2026 International Conference on Intelligent and Sustainable AI Systems (ICOSAAS)}, publisher={IEEE}, author={Van Van, Chau and Minh Tuan, Nguyen and Meesad, Phayung and Gui, Anderes and Halim, Erwin and Sun, Hailong}, year={2026}, month=July, pages={128–134} }",
      link: "https://doi.org/10.1109/icosaas68663.2026.11649360",
    },
    {
      id: "C12",
      year: 2026,
      type: "Conference",
      authors: "Erwin Halim; Chau Van Van; Shara Toibayeva; Jefferson Cristoval; Laura Dorothy Thomason; Ai Ping Teoh",
      authorLinks: [{"name": "Erwin Halim", "url": "https://ieeexplore.ieee.org/author/37086101606"}, {"name": "Chau Van Van", "url": "https://ieeexplore.ieee.org/author/935688334431775"}, {"name": "Shara Toibayeva", "url": "https://ieeexplore.ieee.org/author/37085535841"}, {"name": "Jefferson Cristoval", "url": "https://ieeexplore.ieee.org/author/171687628844749"}, {"name": "Laura Dorothy Thomason", "url": "https://ieeexplore.ieee.org/author/358353141214018"}, {"name": "Ai Ping Teoh", "url": "https://ieeexplore.ieee.org/author/37088582993"}],
      title: "Trust and Perceived Risk in Artificial Intelligence Use for Forex and Cryptocurrency Trading",
      venue: "2026 International Seminar on Intelligent Business and Edge-Computing Research (ISIBER), pp. 308-313, 2026.",
      index: "Scopus (IEEE Xplore)",
      publisher: "IEEE",
      doi: "10.1109/isiber68248.2026.11469785",
      landing: "https://ieeexplore.ieee.org/document/11469785/",
      pdf: "https://ieeexplore.ieee.org/stamp/stamp.jsp?arnumber=11469785",
      bibtex: "@inproceedings{Halim_2026, title={Trust and Perceived Risk in Artificial Intelligence Use for Forex and Cryptocurrency Trading}, url={http://dx.doi.org/10.1109/isiber68248.2026.11469785}, DOI={10.1109/isiber68248.2026.11469785}, booktitle={2026 International Seminar on Intelligent Business and Edge-Computing Research (ISIBER)}, publisher={IEEE}, author={Halim, Erwin and Van Van, Chau and Toibayeva, Shara and Cristoval, Jefferson and Thomason, Laura Dorothy and Teoh, Ai Ping}, year={2026}, month=Feb, pages={308–313} }",
      link: "https://doi.org/10.1109/isiber68248.2026.11469785",
    },
    {
      id: "C11",
      year: 2026,
      type: "Conference",
      authors: "Ricky Kosasih; Anderes Gui; Evaristus Didik Madyatmadja; Yuvaraj Ganesan; Chau Van Van; I Gusti Made Karmawan",
      authorLinks: [{"name": "Ricky Kosasih", "url": "https://ieeexplore.ieee.org/author/462647714125490"}, {"name": "Anderes Gui", "url": "https://ieeexplore.ieee.org/author/37995856600"}, {"name": "Evaristus Didik Madyatmadja", "url": "https://ieeexplore.ieee.org/author/37085879061"}, {"name": "Yuvaraj Ganesan", "url": "https://ieeexplore.ieee.org/author/37088466009"}, {"name": "Chau Van Van", "url": "https://ieeexplore.ieee.org/author/935688334431775"}, {"name": "I Gusti Made Karmawan", "url": "https://ieeexplore.ieee.org/author/37089346982"}],
      title: "Unveiling the Intention to Embrace Smart Wearables in Healthcare",
      venue: "2026 IEEE Region 10 Symposium (TENSYMP), pp. 1-5, 2026.",
      index: "Scopus (IEEE Xplore)",
      publisher: "IEEE",
      doi: "10.1109/tensymp68909.2026.11704032",
      landing: "https://ieeexplore.ieee.org/document/11704032/",
      pdf: "https://ieeexplore.ieee.org/stamp/stamp.jsp?arnumber=11704032",
      bibtex: "@inproceedings{Kosasih_2026, title={Unveiling the Intention to Embrace Smart Wearables in Healthcare}, url={http://dx.doi.org/10.1109/tensymp68909.2026.11704032}, DOI={10.1109/tensymp68909.2026.11704032}, booktitle={2026 IEEE Region 10 Symposium (TENSYMP)}, publisher={IEEE}, author={Kosasih, Ricky and Gui, Anderes and Madyatmadja, Evaristus Didik and Ganesan, Yuvaraj and Van Van, Chau and Gusti Made Karmawan, I}, year={2026}, month=June, pages={1–5} }",
      link: "https://doi.org/10.1109/tensymp68909.2026.11704032",
    },
    {
      id: "C10",
      year: 2026,
      type: "Conference",
      authors: "Chau Van Van; Nguyen Minh Tuan",
      authorLinks: [{"name": "Chau Van Van", "url": "https://link.springer.com/search?dc.creator=Chau%20Van%20Van"}, {"name": "Nguyen Minh Tuan", "url": "https://link.springer.com/search?dc.creator=Nguyen%20Minh%20Tuan"}],
      title: "ViT–RBTFIR: A Deployed Vision Transformer on Fast Image Retrieval",
      venue: "2025 Real-Time Intelligent Systems, Lecture Notes in Networks and Systems, pp. 202-214, 2026.",
      index: "Scopus (Springer)",
      publisher: "Springer",
      doi: "10.1007/978-3-032-23396-7_18",
      landing: "https://link.springer.com/10.1007/978-3-032-23396-7_18",
      pdf: "https://link.springer.com/content/pdf/10.1007/978-3-032-23396-7_18.pdf",
      bibtex: "@inbook{Van_2026, title={ViT–RBTFIR: A Deployed Vision Transformer on Fast Image Retrieval}, ISBN={9783032233967}, ISSN={2367-3389}, url={http://dx.doi.org/10.1007/978-3-032-23396-7_18}, DOI={10.1007/978-3-032-23396-7_18}, booktitle={2025 Real-Time Intelligent Systems}, publisher={Springer Nature Switzerland}, author={Van, Chau Van and Tuan, Nguyen Minh}, year={2026}, month=Aug, pages={202–214} }",
      link: "https://doi.org/10.1007/978-3-032-23396-7_18",
    },
    {
      id: "C09",
      year: 2026,
      type: "Conference",
      authors: "Chau Van Van; Nguyen Minh Tuan; Nguyen Hong Son",
      authorLinks: [{"name": "Chau Van Van", "url": "https://orcid.org/0009-0008-0325-6809"}, {"name": "Nguyen Minh Tuan", "url": "https://scholar.google.com/scholar?q=author%3A%22Nguyen%20Minh%20Tuan%22"}, {"name": "Nguyen Hong Son", "url": "https://scholar.google.com/scholar?q=author%3A%22Nguyen%20Hong%20Son%22"}],
      title: "Ứng Dụng Trí Tuệ Nhân Tạo Trong Chẩn Đoán Y Tế Sử Dụng Dữ liệu Lớn",
      venue: "REV-ECIT 2026 (National Conference on Electronics, Communications and Information Technology), 2026.",
      index: "National",
      publisher: null,
      doi: null,
      landing: null,
      pdf: null,
      bibtex: "@inproceedings{Van2026ng,\n  author = {Van Van Chau and Nguyen Minh Tuan and Nguyen Hong Son},\n  title = {Ứng Dụng Trí Tuệ Nhân Tạo Trong Chẩn Đoán Y Tế Sử Dụng Dữ liệu Lớn},\n  booktitle = {REV-ECIT 2026 (National Conference on Electronics, Communications and Information Technology)},\n  year = {2026}\n}",
      link: "https://orcid.org/0009-0008-0325-6809",
    },
    {
      id: "J02",
      year: 2026,
      type: "Journal",
      authors: "Nguyen Minh Tuan; Chau Van Van; Nguyen Hong Son; Huynh Trong Thua; Le Ha Thanh",
      authorLinks: [{"name": "Nguyen Minh Tuan", "url": "https://scholar.google.com/scholar?q=author%3A%22Nguyen%20Minh%20Tuan%22"}, {"name": "Chau Van Van", "url": "https://orcid.org/0009-0008-0325-6809"}, {"name": "Nguyen Hong Son", "url": "https://scholar.google.com/scholar?q=author%3A%22Nguyen%20Hong%20Son%22"}, {"name": "Huynh Trong Thua", "url": "https://scholar.google.com/scholar?q=author%3A%22Huynh%20Trong%20Thua%22"}, {"name": "Le Ha Thanh", "url": "https://scholar.google.com/scholar?q=author%3A%22Le%20Ha%20Thanh%22"}],
      title: "On Deploying Bilinear Neural Network Method to Various Solutions of (3+1)-dimensional Potential Yu-Toda-Sasa-Fukuyama Equation",
      venue: "WSEAS TRANSACTIONS ON SYSTEMS AND CONTROL, vol. 21, p. 95, 2026.",
      index: "Scopus",
      publisher: "WSEAS",
      doi: "10.37394/23203.2026.21.10",
      landing: "https://wseas.com/journals/articles.php?id=11630",
      pdf: "https://wseas.com/journals/articles.php?id=11630",
      bibtex: "@article{Tuan_2026, title={On Deploying Bilinear Neural Network Method to Various Solutions of\n(3+1)-dimensional Potential Yu-Toda-Sasa-Fukuyama Equation}, volume={21}, ISSN={2224-2856}, url={http://dx.doi.org/10.37394/23203.2026.21.10}, DOI={10.37394/23203.2026.21.10}, journal={WSEAS TRANSACTIONS ON SYSTEMS AND CONTROL}, publisher={World Scientific and Engineering Academy and Society (WSEAS)}, author={Tuan, Nguyen Minh and Van Van, Chau and Son, Nguyen Hong and Thua, Huynh Trong and Thanh, Le Ha}, year={2026}, month=May, pages={95} }",
      link: "https://doi.org/10.37394/23203.2026.21.10",
    },
    {
      id: "J01",
      year: 2026,
      type: "Journal",
      authors: "Nguyen Minh Tuan; Tran Trung Duy; Phayung Meesad; Nguyen Hong Son; Nguyen Trong Hien; Huynh Trong Thua; Vo Van Tinh; Chau Van Van; Nguyen Le Nha Trang",
      authorLinks: [{"name": "Nguyen Minh Tuan", "url": "https://scholar.google.com/scholar?q=author%3A%22Nguyen%20Minh%20Tuan%22"}, {"name": "Tran Trung Duy", "url": "https://scholar.google.com/scholar?q=author%3A%22Tran%20Trung%20Duy%22"}, {"name": "Phayung Meesad", "url": "https://scholar.google.com/scholar?q=author%3A%22Phayung%20Meesad%22"}, {"name": "Nguyen Hong Son", "url": "https://scholar.google.com/scholar?q=author%3A%22Nguyen%20Hong%20Son%22"}, {"name": "Nguyen Trong Hien", "url": "https://scholar.google.com/scholar?q=author%3A%22Nguyen%20Trong%20Hien%22"}, {"name": "Huynh Trong Thua", "url": "https://scholar.google.com/scholar?q=author%3A%22Huynh%20Trong%20Thua%22"}, {"name": "Vo Van Tinh", "url": "https://scholar.google.com/scholar?q=author%3A%22Vo%20Van%20Tinh%22"}, {"name": "Chau Van Van", "url": "https://orcid.org/0009-0008-0325-6809"}, {"name": "Nguyen Le Nha Trang", "url": "https://scholar.google.com/scholar?q=author%3A%22Nguyen%20Le%20Nha%20Trang%22"}],
      title: "Optimizing predictive accuracy in general medical exams using hybrid machine learning and metaheuristic optimization methods",
      venue: "An International Journal of Optimization and Control: Theories & Applications (IJOCTA), vol. 16, no. 3, p. 888, 2026.",
      index: "Scopus · ISI (WoS-ESCI)",
      publisher: "AccScience",
      doi: "10.36922/ijocta026020008",
      landing: "https://accscience.com/journal/IJOCTA/16/3/10.36922/IJOCTA026020008",
      pdf: "https://accscience.com/journal/IJOCTA/16/3/10.36922/IJOCTA026020008",
      bibtex: "@article{Tuan_2026, title={Optimizing predictive accuracy in general medical exams using hybrid machine learning and metaheuristic optimization methods}, volume={16}, ISSN={2146-5703}, url={http://dx.doi.org/10.36922/ijocta026020008}, DOI={10.36922/ijocta026020008}, number={3}, journal={An International Journal of Optimization and Control: Theories &amp; Applications (IJOCTA)}, publisher={AccScience Publishing}, author={Tuan, Nguyen Minh and Duy, Tran Trung and Meesad, Phayung and Son, Nguyen Hong and Hien, Nguyen Trong and Thua, Huynh Trong and Tinh, Vo Van and Van, Chau Van and Trang, Nguyen Le Nha}, year={2026}, month=Apr, pages={888} }",
      link: "https://doi.org/10.36922/ijocta026020008",
    },
    {
      id: "C08",
      year: 2025,
      type: "Conference",
      authors: "Nguyen Minh Tuan; Chau Van Van; Nguyen Hong Son",
      authorLinks: [{"name": "Nguyen Minh Tuan", "url": "https://dl.acm.org/profile/99661816337"}, {"name": "Chau Van Van", "url": "https://dl.acm.org/profile/99661816132"}, {"name": "Nguyen Hong Son", "url": "https://dl.acm.org/profile/99661816486"}],
      title: "A Practical Evaluation of Paging Algorithm Smoothness: Trade-offs Between Competitiveness and Stability",
      venue: "Proceedings of the 2025 10th International Conference on Cloud Computing and Internet of Things, pp. 53-60, 2025.",
      index: "Scopus (ACM ICPS)",
      publisher: "ACM",
      doi: "10.1145/3785520.3785528",
      landing: "https://dl.acm.org/doi/10.1145/3785520.3785528",
      pdf: "https://dl.acm.org/doi/pdf/10.1145/3785520.3785528",
      bibtex: "@inproceedings{Tuan_2025, series={CCIOT 2025}, title={A Practical Evaluation of Paging Algorithm Smoothness: Trade-offs Between Competitiveness and Stability}, url={http://dx.doi.org/10.1145/3785520.3785528}, DOI={10.1145/3785520.3785528}, booktitle={Proceedings of the 2025 10th International Conference on Cloud Computing and Internet of Things}, publisher={ACM}, author={Tuan, Nguyen Minh and Van, Chau Van and Son, Nguyen Hong}, year={2025}, month=Nov, pages={53–60}, collection={CCIOT 2025} }",
      link: "https://doi.org/10.1145/3785520.3785528",
    },
    {
      id: "C07",
      year: 2025,
      type: "Conference",
      authors: "Chau Van Van; Nguyen Minh Tuan; Nguyen Hong Son; Nguyen Trung Hieu",
      authorLinks: [{"name": "Chau Van Van", "url": "https://orcid.org/0009-0008-0325-6809"}, {"name": "Nguyen Minh Tuan", "url": "https://scholar.google.com/scholar?q=author%3A%22Nguyen%20Minh%20Tuan%22"}, {"name": "Nguyen Hong Son", "url": "https://scholar.google.com/scholar?q=author%3A%22Nguyen%20Hong%20Son%22"}, {"name": "Nguyen Trung Hieu", "url": "https://scholar.google.com/scholar?q=author%3A%22Nguyen%20Trung%20Hieu%22"}],
      title: "D-ViT: Bộ biến đổi thị giác hiệu quả dữ liệu cho tác vụ tóm tắt ảnh X-quang ngực sang văn bản",
      venue: "REV-ECIT 2025 (National Conference on Electronics, Communications and Information Technology), pp. 426-430, 2025.",
      index: "National",
      publisher: null,
      doi: null,
      landing: "https://rev-ecit.vn/vi/content/ky-yeu-hoi-nghi-0",
      pdf: "https://rev-ecit.vn/vi/content/ky-yeu-hoi-nghi-0",
      bibtex: "@inproceedings{Chau2025DViT,\n  author = {Chau Van Van and Nguyen Minh Tuan and Nguyen Hong Son and Nguyen Trung Hieu},\n  title = {D-ViT: Bộ biến đổi thị giác hiệu quả dữ liệu cho tác vụ tóm tắt ảnh X-quang ngực sang văn bản},\n  booktitle = {REV-ECIT 2025 (National Conference on Electronics, Communications and Information Technology), pp. 426-430},\n  year = {2025}\n}",
      link: "https://rev-ecit.vn/vi/content/ky-yeu-hoi-nghi-0",
    },
    {
      id: "C06",
      year: 2025,
      type: "Conference",
      authors: "Nguyen Minh Tuan; Chau Van Van",
      authorLinks: [{"name": "Nguyen Minh Tuan", "url": "https://ieeexplore.ieee.org/author/37089033460"}, {"name": "Chau Van Van", "url": "https://ieeexplore.ieee.org/author/935688334431775"}],
      title: "Data-Intensive Finance: Leveraging AI for Market Insights and Risk Forecasting",
      venue: "2025 International Conference on Intelligent Computing and Next Generation Networks (ICNGN), pp. 1-6, 2025.",
      index: "Scopus (IEEE Xplore)",
      publisher: "IEEE",
      doi: "10.1109/icngn67480.2025.11413748",
      landing: "https://ieeexplore.ieee.org/document/11413748/",
      pdf: "https://ieeexplore.ieee.org/stamp/stamp.jsp?arnumber=11413748",
      bibtex: "@inproceedings{Tuan_2025, title={Data-Intensive Finance: Leveraging AI for Market Insights and Risk Forecasting}, url={http://dx.doi.org/10.1109/icngn67480.2025.11413748}, DOI={10.1109/icngn67480.2025.11413748}, booktitle={2025 International Conference on Intelligent Computing and Next Generation Networks (ICNGN)}, publisher={IEEE}, author={Tuan, Nguyen Minh and Van, Chau Van}, year={2025}, month=Dec, pages={1–6} }",
      link: "https://doi.org/10.1109/icngn67480.2025.11413748",
    },
    {
      id: "C05",
      year: 2025,
      type: "Conference",
      authors: "Chau Van Van; Nguyen Minh Tuan; Luong Trong Khoa; Nguyen Trong Hien; Erwin Halim; Anderes Gui",
      authorLinks: [{"name": "Chau Van Van", "url": "https://ieeexplore.ieee.org/author/935688334431775"}, {"name": "Nguyen Minh Tuan", "url": "https://ieeexplore.ieee.org/author/37089033460"}, {"name": "Luong Trong Khoa", "url": "https://ieeexplore.ieee.org/author/471567487740610"}, {"name": "Nguyen Trong Hien", "url": "https://ieeexplore.ieee.org/author/38181312900"}, {"name": "Erwin Halim", "url": "https://ieeexplore.ieee.org/author/37086101606"}, {"name": "Anderes Gui", "url": "https://ieeexplore.ieee.org/author/37995856600"}],
      title: "Deep Herbal Vision: A Computer Vision Approach for Genuine versus Counterfeit Identification of Ngoc Linh Ginseng (Panax vietnamensis Ha et Grushv.)",
      venue: "2025 International Conference on Intelligent Computing and Next Generation Networks (ICNGN), pp. 1-5, 2025.",
      index: "Scopus (IEEE Xplore)",
      publisher: "IEEE",
      doi: "10.1109/icngn67480.2025.11413697",
      landing: "https://ieeexplore.ieee.org/document/11413697/",
      pdf: "https://ieeexplore.ieee.org/stamp/stamp.jsp?arnumber=11413697",
      bibtex: "@inproceedings{Van_2025, title={Deep Herbal Vision: A Computer Vision Approach for Genuine versus Counterfeit Identification of Ngoc Linh Ginseng (Panax vietnamensis Ha et Grushv.)}, url={http://dx.doi.org/10.1109/icngn67480.2025.11413697}, DOI={10.1109/icngn67480.2025.11413697}, booktitle={2025 International Conference on Intelligent Computing and Next Generation Networks (ICNGN)}, publisher={IEEE}, author={Van, Chau Van and Tuan, Nguyen Minh and Khoa, Luong Trong and Hien, Nguyen Trong and Halim, Erwin and Gui, Anderes}, year={2025}, month=Dec, pages={1–5} }",
      link: "https://doi.org/10.1109/icngn67480.2025.11413697",
    },
    {
      id: "C04",
      year: 2025,
      type: "Conference",
      authors: "Chau Van Van; Nguyen Minh Tuan; Huynh Trung Tru; Nguyen Trong Hien; Erwin Halim; Anderes Gui",
      authorLinks: [{"name": "Chau Van Van", "url": "https://ieeexplore.ieee.org/author/935688334431775"}, {"name": "Nguyen Minh Tuan", "url": "https://ieeexplore.ieee.org/author/37089033460"}, {"name": "Huynh Trung Tru", "url": "https://ieeexplore.ieee.org/author/137629564389688"}, {"name": "Nguyen Trong Hien", "url": "https://ieeexplore.ieee.org/author/38181312900"}, {"name": "Erwin Halim", "url": "https://ieeexplore.ieee.org/author/37086101606"}, {"name": "Anderes Gui", "url": "https://ieeexplore.ieee.org/author/37995856600"}],
      title: "Hybrid Neural Network Models for Time-Series Biomedical Signal Forecasting",
      venue: "2025 International Conference on Intelligent Computing and Next Generation Networks (ICNGN), pp. 1-5, 2025.",
      index: "Scopus (IEEE Xplore)",
      publisher: "IEEE",
      doi: "10.1109/icngn67480.2025.11413781",
      landing: "https://ieeexplore.ieee.org/document/11413781/",
      pdf: "https://ieeexplore.ieee.org/stamp/stamp.jsp?arnumber=11413781",
      bibtex: "@inproceedings{Van_2025, title={Hybrid Neural Network Models for Time-Series Biomedical Signal Forecasting}, url={http://dx.doi.org/10.1109/icngn67480.2025.11413781}, DOI={10.1109/icngn67480.2025.11413781}, booktitle={2025 International Conference on Intelligent Computing and Next Generation Networks (ICNGN)}, publisher={IEEE}, author={Van, Chau Van and Tuan, Nguyen Minh and Tru, Huynh Trung and Hien, Nguyen Trong and Halim, Erwin and Gui, Anderes}, year={2025}, month=Dec, pages={1–5} }",
      link: "https://doi.org/10.1109/icngn67480.2025.11413781",
    },
    {
      id: "C03",
      year: 2025,
      type: "Conference",
      authors: "Chau Van Van; Nguyen Minh Tuan",
      authorLinks: [{"name": "Chau Van Van", "url": "https://dl.acm.org/profile/99661816132"}, {"name": "Nguyen Minh Tuan", "url": "https://dl.acm.org/profile/99661816337"}],
      title: "Optimizing Detection Tasks with PySwarms: Applications of Paging Algorithms",
      venue: "Proceedings of the 2025 10th International Conference on Cloud Computing and Internet of Things, pp. 70-74, 2025.",
      index: "Scopus (ACM ICPS)",
      publisher: "ACM",
      doi: "10.1145/3785520.3785530",
      landing: "https://dl.acm.org/doi/10.1145/3785520.3785530",
      pdf: "https://dl.acm.org/doi/pdf/10.1145/3785520.3785530",
      bibtex: "@inproceedings{Van_2025, series={CCIOT 2025}, title={Optimizing Detection Tasks with PySwarms: Applications of Paging Algorithms}, url={http://dx.doi.org/10.1145/3785520.3785530}, DOI={10.1145/3785520.3785530}, booktitle={Proceedings of the 2025 10th International Conference on Cloud Computing and Internet of Things}, publisher={ACM}, author={Van, Chau Van and Tuan, Nguyen Minh}, year={2025}, month=Nov, pages={70–74}, collection={CCIOT 2025} }",
      link: "https://doi.org/10.1145/3785520.3785530",
    },
    {
      id: "C02",
      year: 2024,
      type: "Conference",
      authors: "Chau Van Van",
      authorLinks: [{"name": "Chau Van Van", "url": "https://orcid.org/0009-0008-0325-6809"}],
      title: "Thuật toán Piecemeal-DFS Cho Việc Tìm Kiếm Duyệt Sâu Với Mức Năng Lượng Ràng Buộc Trên Bài Toán Hợp Hai Cây Cho Trước",
      venue: "National conference paper (Vietnamese), 2024.",
      index: "National",
      publisher: null,
      doi: null,
      landing: "https://www.researchgate.net/publication/392512584_Thuat_toan_Piecemeal-DFS_Cho_Viec_Tim_Kiem_Duyet_Sau_Voi_Muc_Nang_Luong_Rang_Buoc_Tren_Bai_Toan_Hop_Hai_Cay_Cho_Truoc",
      pdf: "https://www.researchgate.net/publication/392512584_Thuat_toan_Piecemeal-DFS_Cho_Viec_Tim_Kiem_Duyet_Sau_Voi_Muc_Nang_Luong_Rang_Buoc_Tren_Bai_Toan_Hop_Hai_Cay_Cho_Truoc",
      bibtex: "@inproceedings{Van2024Thut,\n  author = {Van Van Chau},\n  title = {Thuật toán Piecemeal-DFS Cho Việc Tìm Kiếm Duyệt Sâu Với Mức Năng Lượng Ràng Buộc Trên Bài Toán Hợp Hai Cây Cho Trước},\n  booktitle = {National conference paper (Vietnamese)},\n  year = {2024}\n}",
      link: "https://www.researchgate.net/publication/392512584_Thuat_toan_Piecemeal-DFS_Cho_Viec_Tim_Kiem_Duyet_Sau_Voi_Muc_Nang_Luong_Rang_Buoc_Tren_Bai_Toan_Hop_Hai_Cay_Cho_Truoc",
    },
    {
      id: "C01",
      year: 2022,
      type: "Conference",
      authors: "Lam Duc Vu Nguyen; Chau Van Van; Sinh Van Nguyen",
      authorLinks: [{"name": "Lam Duc Vu Nguyen", "url": "https://link.springer.com/search?dc.creator=Lam%20Duc%20Vu%20Nguyen"}, {"name": "Chau Van Van", "url": "https://link.springer.com/search?dc.creator=Van%20Van%20Chau"}, {"name": "Sinh Van Nguyen", "url": "https://link.springer.com/search?dc.creator=Sinh%20Van%20Nguyen"}],
      title: "Face Recognition Based on Deep Learning and Data Augmentation",
      venue: "Future Data and Security Engineering. Big Data, Security and Privacy, Smart City and Industry 4.0 Applications, Communications in Computer and Information Science, pp. 560-573, 2022.",
      index: "Scopus (Springer)",
      publisher: "Springer",
      doi: "10.1007/978-981-19-8069-5_38",
      landing: "https://link.springer.com/10.1007/978-981-19-8069-5_38",
      pdf: "https://link.springer.com/content/pdf/10.1007/978-981-19-8069-5_38.pdf",
      bibtex: "@inbook{Nguyen_2022, title={Face Recognition Based on Deep Learning and Data Augmentation}, ISBN={9789811980695}, ISSN={1865-0937}, url={http://dx.doi.org/10.1007/978-981-19-8069-5_38}, DOI={10.1007/978-981-19-8069-5_38}, booktitle={Future Data and Security Engineering. Big Data, Security and Privacy, Smart City and Industry 4.0 Applications}, publisher={Springer Nature Singapore}, author={Nguyen, Lam Duc Vu and Van Chau, Van and Van Nguyen, Sinh}, year={2022}, pages={560–573} }",
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

function PubLinks({ item }) {
  const [showCite, setShowCite] = useState(false);
  const [copied, setCopied] = useState(false);
  const bibtex = item.bibtex.replace(/^(@\w+\{[^,]+,)\s*/, '$1\n  ').replace(/,\s+(?=[\w-]+\s*=)/g, ',\n  ').replace(/,?\s*\}\s*$/, '\n}');
  const copy = () => {
    navigator.clipboard?.writeText(bibtex).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <div className="pub-meta">
      {item.publisher && (
        <span className={`pub-badge pub-${item.publisher.toLowerCase()}`}>{item.publisher}</span>
      )}
      {item.index && (
        <span className={item.index.startsWith('Scopus') ? 'index-badge' : 'index-badge muted'}>{item.index}</span>
      )}
      {item.pdf && (
        <a className="pub-btn pdf" href={item.pdf} target="_blank" rel="noopener noreferrer" title="Download PDF from the publisher">
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <path fill="currentColor" d="M6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm7 1.5V9h5.5L13 3.5zM7.5 13v5h1.2v-1.6h.8a1.7 1.7 0 0 0 0-3.4h-2zm1.2 1h.8a.7.7 0 0 1 0 1.4h-.8V14zm3.3-1v5h1.6a2.5 2.5 0 0 0 0-5H12zm1.2 1h.4a1.5 1.5 0 0 1 0 3h-.4v-3zm3.3-1v5h1.2v-2h1.8v-1h-1.8v-1h2v-1h-3.2z"/>
          </svg>
          PDF
        </a>
      )}
      {item.doi && (
        <a className="pub-btn" href={`https://doi.org/${item.doi}`} target="_blank" rel="noopener noreferrer" title="Open the original publisher page">
          DOI
        </a>
      )}
      <button type="button" className="pub-btn" onClick={() => setShowCite(!showCite)}>
        {showCite ? 'Hide' : 'Cite'}
      </button>
      {showCite && (
        <div className="cite-box">
          <pre>{bibtex}</pre>
          <button type="button" className="pub-btn" onClick={copy}>{copied ? 'Copied' : 'Copy BibTeX'}</button>
        </div>
      )}
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
                            {item.authorLinks
                              ? item.authorLinks.map((au, i) => (
                                  <span key={au.url + i}>
                                    {i > 0 && '; '}
                                    <a className={au.name === 'Chau Van Van' ? 'author-link me' : 'author-link'} href={au.url} target="_blank" rel="noopener noreferrer">
                                      {au.name}
                                    </a>
                                  </span>
                                ))
                              : item.authors}
                            . <a href={item.landing || item.link} target="_blank" rel="noopener noreferrer">“{item.title}”</a>. <i>{item.venue}</i>
                            <PubLinks item={item} />
                          </div>
                        </div>
                      ))}
                  </div>
                ))}
              <p className="index-note">
                Indexing labels refer to the publication venue or proceedings series (Scopus; ISI = Web of Science).
                Recently published papers may take several weeks to appear in the databases.
              </p>
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
                            <span className="highlight">{item.link ? <a href={item.landing || item.link} target="_blank" rel="noopener noreferrer">“{item.title}”</a> : <>“{item.title}”</>}</span>, {item.funding}, {item.period}, ({item.role})
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