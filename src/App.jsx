import { useEffect, useRef, useState } from 'react';

const skills = [
  { name: 'HTML5', category: 'Frontend', level: 'intermediate' },
  { name: 'CSS3', category: 'Frontend', level: 'intermediate' },
  { name: 'JavaScript ES6+', category: 'Frontend', level: 'intermediate' },
  { name: 'C Programming', category: 'Core', level: 'intermediate' },
  { name: 'React.js', category: 'Framework', level: 'learning' },
  { name: 'Node.js', category: 'Backend', level: 'learning' },
  { name: 'Java', category: 'Core', level: 'foundational' },
  { name: 'Python', category: 'Core', level: 'foundational' },
];

const projects = {
  'uncle-factz': {
    title: 'Uncle-Factz Platform',
    body: 'An AI-powered fact-checking network designed during Learnathon 5.0. Utilizes GenAI consensus models to evaluate information integrity.',
    contribution: 'Personal Contribution: Designed user interfaces, layout structure, and managed project concept presentation.',
    accent: 'magenta',
    repo: 'https://github.com/Prasanjit-ratha/Uncle-factz',
  },
  hospital: {
    title: 'Hospital Management System',
    body: 'A centralized concept streamlining health workflows and administrative tasks across hospital management modules.',
    contribution: 'Personal Contribution: Developed system design architecture, project structure, and feature layouts.',
    accent: 'cyan',
    repo: 'https://github.com/55HuNTeR55/Unified-hospital-mangment-system',
  },
};

function playAudioEffect(type) {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const context = new AudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.frequency.setValueAtTime(type === 'click' ? 800 : 400, context.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(type === 'click' ? 200 : 250, context.currentTime + 0.05);
  gain.gain.setValueAtTime(type === 'click' ? 0.08 : 0.02, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.05);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.05);
}

function TiltCard({ children, className = '', style }) {
  const handleMove = (event) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const rotateX = (event.clientY - rect.top - rect.height / 2) / 10;
    const rotateY = (rect.width / 2 - (event.clientX - rect.left)) / 10;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
  };

  return (
    <div className={`glass-card tilt-card ${className}`} style={style} onMouseMove={handleMove} onMouseLeave={(event) => { event.currentTarget.style.transform = ''; }}>
      {children}
    </div>
  );
}

function MatrixCanvas({ pointer }) {
  const canvasRef = useRef(null);
  const pointerRef = useRef(pointer);
  pointerRef.current = pointer;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    let animationFrame;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = Array.from({ length: 70 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 1.5 + 0.5,
      }));
    };

    const animate = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.x < 0 || particle.x > canvas.width || particle.y < 0 || particle.y > canvas.height) {
          particle.x = Math.random() * canvas.width;
          particle.y = Math.random() * canvas.height;
        }
        context.fillStyle = '#00f0ff';
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();
        for (let next = index + 1; next < particles.length; next += 1) {
          const other = particles[next];
          const distance = Math.hypot(particle.x - other.x, particle.y - other.y);
          if (distance < 100) {
            context.strokeStyle = `rgba(0, 240, 255, ${0.15 * (1 - distance / 100)})`;
            context.beginPath();
            context.moveTo(particle.x, particle.y);
            context.lineTo(other.x, other.y);
            context.stroke();
          }
        }
        const pointerDistance = Math.hypot(particle.x - pointerRef.current.x, particle.y - pointerRef.current.y);
        if (pointerDistance < 120) {
          context.strokeStyle = `rgba(255, 0, 127, ${0.4 * (1 - pointerDistance / 120)})`;
          context.beginPath();
          context.moveTo(particle.x, particle.y);
          context.lineTo(pointerRef.current.x, pointerRef.current.y);
          context.stroke();
        }
      });
      animationFrame = requestAnimationFrame(animate);
    };

    resize();
    animate();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas id="matrix-canvas" ref={canvasRef} aria-hidden="true" />;
}

function App() {
  const [skillFilter, setSkillFilter] = useState('all');
  const [activeProject, setActiveProject] = useState(null);
  const [cliOpen, setCliOpen] = useState(false);
  const [command, setCommand] = useState('');
  const [cliOutput, setCliOutput] = useState([<>Welcome to Prasanjit&apos;s Interactive Terminal. Type <span className="cyan">help</span> to list commands.</>]);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onPointerMove = (event) => setPointer({ x: event.clientX, y: event.clientY });
    const onKeyDown = (event) => {
      if (event.key === '`' || event.key === '~') {
        event.preventDefault();
        setCliOpen((isOpen) => !isOpen);
      }
    };
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const submitCommand = (event) => {
    event.preventDefault();
    const typed = command.trim();
    if (!typed) return;
    playAudioEffect('click');
    if (typed.toLowerCase() === 'clear') {
      setCliOutput([]);
    } else {
      const responses = {
        help: <>Available commands: <span className="cyan">skills</span>, <span className="cyan">projects</span>, <span className="cyan">clear</span>, <span className="cyan">contact</span></>,
        skills: 'Stack: HTML, CSS, JavaScript, C, React, Node.js, Java, Python',
        projects: 'Projects: Uncle-Factz (Learnathon 5.0), Unified Hospital Management System',
        contact: 'Email: akashratha237@gmail.com | GitHub: Prasanjit-ratha',
      };
      setCliOutput((output) => [...output, <span className="magenta" key={`${typed}-${output.length}`}>&gt; {typed}</span>, responses[typed.toLowerCase()] || <>Command not recognized. Type <span className="cyan">help</span>.</>]);
    }
    setCommand('');
  };

  const filteredSkills = skillFilter === 'all' ? skills : skills.filter((skill) => skill.level === skillFilter);
  const openProject = (key) => { playAudioEffect('click'); setActiveProject(key); };

  return (
    <>
      <MatrixCanvas pointer={pointer} />
      <div id="cyber-cursor" style={{ left: pointer.x, top: pointer.y }} />
      <nav>
        <div className="container nav-container">
          <a href="#about" className="logo">&lt;PRASANJIT_RATHA/&gt;</a>
          <ul className="nav-links">
            {['about', 'skills', 'projects', 'hackathon', 'education', 'contact'].map((item) => <li key={item}><a href={`#${item}`}>// {item}</a></li>)}
          </ul>
        </div>
      </nav>

      <main>
        <section id="about" className="hero">
          <div className="container">
            <div className="hero-badge"><i className="fa-solid fa-terminal" /> Full-Stack System Architecture</div>
            <h1 className="hero-title">Architecting <span>Digital Platforms</span> &amp; GenAI Systems.</h1>
            <p className="hero-lede">Computer Science &amp; Engineering student specializing in full-stack web platforms, decentralized logic, and AI integrations.</p>
            <TiltCard className="objective-card"><h4><i className="fa-solid fa-crosshairs" /> Core Objective</h4><p>“I want to become a skilled full-stack developer capable of building complete web applications and creating technology that solves real-world problems.”</p></TiltCard>
            <div className="btn-group"><a href="#projects" className="btn btn-primary" onClick={() => playAudioEffect('click')}>Deploy Projects <i className="fa-solid fa-arrow-right" /></a><a href="https://github.com/Prasanjit-ratha" target="_blank" rel="noreferrer" className="btn btn-secondary"><i className="fa-brands fa-github" /> GitHub Matrix</a></div>
          </div>
        </section>

        <section id="skills"><div className="container"><h2 className="section-title"><i className="fa-solid fa-microchip" /> Tech Stack</h2><p className="section-subtitle">// Interactive breakdown of engineering tools and languages.</p><div className="skill-tabs">{[['all', 'All Skills'], ['intermediate', 'Intermediate'], ['learning', 'Actively Learning'], ['foundational', 'Foundational']].map(([value, label]) => <button key={value} className={`tab-btn ${skillFilter === value ? 'active' : ''}`} onClick={() => { playAudioEffect('click'); setSkillFilter(value); }}>{label}</button>)}</div><div className="skills-grid">{filteredSkills.map((skill) => <div className="skill-card" key={skill.name}><span className={skill.level === 'learning' ? 'cyan' : ''}>{skill.name}</span><span className="skill-category">{skill.category}</span></div>)}</div></div></section>

        <section id="projects"><div className="container"><h2 className="section-title"><i className="fa-solid fa-cubes" /> Built Systems</h2><p className="section-subtitle">// Hackathon applications engineered under timed constraints.</p><div className="project-grid">{[['uncle-factz', 'LEARNATHON 5.0', 'Uncle-Factz', 'AI-powered fact verification engine using decentralized GenAI consensus mechanisms.'], ['hospital', 'LEARNATHON 5.0', 'Hospital Platform', 'Unified health services infrastructure simplifying patient registration and workflow handling.']].map(([key, tag, title, description]) => <TiltCard key={key} className="project-card"><div><span className={`project-tag ${projects[key].accent}`}>[{tag}]</span><h3>{title}</h3><p>{description}</p></div><div><button className="btn btn-secondary full-width" onClick={() => openProject(key)}>View Architecture</button><a href={projects[key].repo} target="_blank" rel="noreferrer" className="btn btn-primary full-width">Source Code</a></div></TiltCard>)}</div></div></section>

        <section id="hackathon"><div className="container"><TiltCard className="milestone"><span className="project-tag magenta">KEY COMPETITION MILESTONE</span><h2>Learnathon 5.0 — Round 2 Qualifier</h2><p>Engineered a decentralized solution over a 72-hour sprint with a team of 3 developers, qualifying for Round 2.</p></TiltCard></div></section>
        <section id="education"><div className="container"><h2 className="section-title"><i className="fa-solid fa-graduation-cap" /> Academic History</h2><p className="section-subtitle">// Educational journey and technical credentials.</p><div className="education-grid"><TiltCard><span className="cyan code">2025 – 2029</span><h3>B.Tech — Computer Science</h3><p>GIET University, Gunupur</p></TiltCard><TiltCard><span className="code muted">2023 – 2025</span><h3>Higher Secondary (PCM + IT)</h3><p>Odisha Adarsh Vidyalaya</p></TiltCard></div></div></section>
      </main>

      <button id="cli-toggle-btn" onClick={() => { playAudioEffect('click'); setCliOpen((isOpen) => !isOpen); }} title="Toggle HUD Terminal"><i className="fa-solid fa-terminal" /></button>
      <div id="cli-terminal" className={cliOpen ? 'active' : ''}><div className="cli-header"><span><i className="fa-solid fa-terminal" /> PRASANJIT_CLI_v2.0</span><button onClick={() => setCliOpen(false)}>× CLOSE</button></div><div className="cli-output">{cliOutput.map((line, index) => <div key={index}>{line}</div>)}</div><form className="cli-input-container" onSubmit={submitCommand}><span className="cyan code">&gt;</span><input value={command} onChange={(event) => setCommand(event.target.value)} className="cli-input" placeholder="Type a command..." /></form></div>

      {activeProject && <div className="modal-overlay active" onClick={() => setActiveProject(null)}><div className="modal-content" onClick={(event) => event.stopPropagation()}><button className="close-modal" onClick={() => setActiveProject(null)}>×</button><h3>{projects[activeProject].title}</h3><p>{projects[activeProject].body}</p><div className="contribution">{projects[activeProject].contribution}</div></div></div>}

      <footer id="contact"><div className="container"><h2>Initialize Connection</h2><p>Ready for open collaboration and engineering inquiries.</p><div className="contact-links"><a href="mailto:akashratha237@gmail.com" className="contact-btn"><i className="fa-solid fa-envelope" /> Email</a><a href="https://www.linkedin.com/in/prasanjitratha" target="_blank" rel="noreferrer" className="contact-btn"><i className="fa-brands fa-linkedin" /> LinkedIn</a><a href="https://github.com/Prasanjit-ratha" target="_blank" rel="noreferrer" className="contact-btn"><i className="fa-brands fa-github" /> GitHub</a></div><div className="copyright">© Prasanjit Ratha. Interactive Cybernetic Systems Architecture.</div></div></footer>
    </>
  );
}

export default App;
