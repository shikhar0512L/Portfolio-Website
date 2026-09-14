import { useState, useEffect, useRef } from "react";
import {
  motion,
  useInView,
  AnimatePresence,
  type Variants,
} from "framer-motion";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase.ts";

// ─── Types ────────────────────────────────────────────────────────────────────
type Theme = "dark" | "light";

// ─── Constants ────────────────────────────────────────────────────────────────
const GITHUB_USER = "shikhar0512L";
const GITHUB_URL = `https://github.com/${GITHUB_USER}`;
const LINKEDIN_URL = "https://www.linkedin.com/in/shikharsingh-tech";
const EMAIL = "shikhar.intelligence123@gmail.com";

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return { ref, isInView };
}

function useCountUp(target: number, started: boolean, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, started, duration]);
  return count;
}

// ─── Animation variants ───────────────────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08 },
  }),
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({
  id,
  className = "",
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const { ref, isInView } = useFadeIn();
  return (
    <motion.section
      id={id}
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={stagger}
      className={`py-24 px-6 max-w-[1200px] mx-auto ${className}`}
    >
      {children}
    </motion.section>
  );
}

function SectionTitle({
  label,
  title,
  subtitle,
}: {
  label: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <motion.div variants={fadeUp} className="mb-16 text-center">
      <span
        className="badge mb-4"
        style={{
          background: "rgba(139,92,246,0.12)",
          color: "var(--primary)",
          border: "1px solid rgba(139,92,246,0.25)",
        }}
      >
        {label}
      </span>
      <h2
        className="text-4xl font-bold mt-2 mb-3"
        style={{ color: "var(--foreground)" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className="text-base max-w-xl mx-auto"
          style={{ color: "var(--muted-foreground)" }}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({
  theme,
  toggleTheme,
}: {
  theme: Theme;
  toggleTheme: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Home", href: "#hero" },
    { label: "Journey", href: "#journey" },
    { label: "Projects", href: "#projects" },
    { label: "Research", href: "#research" },
    { label: "Contact", href: "#contact" },
  ];

  const navStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    transition: "all 0.3s ease",
    background: scrolled ? undefined : "transparent",
  };

  return (
    <nav className={scrolled ? "navbar-scrolled" : ""} style={navStyle}>
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        <a
          href="#hero"
          className="flex items-center gap-2 font-bold text-lg no-underline"
          style={{ color: "var(--foreground)" }}
        >
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
            style={{ background: "linear-gradient(135deg, #8B5CF6, #22D3EE)" }}
          >
            SS
          </span>
          <span className="hidden sm:block">Shikhar Singh</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm font-medium transition-colors duration-150 hover:text-purple-400 no-underline"
              style={{ color: "var(--muted-foreground)" }}
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg transition-colors"
            style={{
              color: "var(--muted-foreground)",
              background: "var(--card)",
            }}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-lg transition-colors hidden sm:flex"
            style={{
              color: "var(--muted-foreground)",
              background: "var(--card)",
            }}
          >
            <GitHubIcon />
          </a>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-lg transition-colors hidden sm:flex"
            style={{
              color: "var(--muted-foreground)",
              background: "var(--card)",
            }}
          >
            <LinkedInIcon />
          </a>
          <button
            className="md:hidden p-2 rounded-lg"
            style={{ color: "var(--foreground)", background: "var(--card)" }}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
          >
            {menuOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mobile-menu border-t"
            style={{ borderColor: "var(--border)", background: "var(--card)" }}
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-medium py-2 no-underline"
                  style={{ color: "var(--foreground)" }}
                >
                  {l.label}
                </a>
              ))}
              <div className="flex gap-3 pt-2">
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  <GitHubIcon />
                </a>
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  <LinkedInIcon />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      id="hero"
      className="hero-gradient min-h-screen flex items-center justify-center pt-16"
    >
      <div className="max-w-[1200px] mx-auto px-6 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span
            className="badge mb-6 inline-flex"
            style={{
              background: "rgba(139,92,246,0.12)",
              color: "var(--purple-soft)",
              border: "1px solid rgba(139,92,246,0.25)",
            }}
          >
            B.Tech CSE (AI/ML) · KIIT
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-bold mb-4"
          style={{
            fontSize: "clamp(40px, 8vw, 72px)",
            lineHeight: 1.1,
            color: "var(--foreground)",
          }}
        >
          Shikhar Singh
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl md:text-2xl font-medium mb-4 gradient-text"
        >
          Developer. Researcher. Lifelong Learner.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-base mb-12 font-mono"
          style={{ color: "var(--muted-foreground)" }}
        >
          "Small steps today. Compounding impact tomorrow."
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap gap-3 justify-center"
        >
          <a href="#projects">
            <Btn variant="primary">View Projects</Btn>
          </a>
          <a href="#contact">
            <Btn variant="ghost">Contact</Btn>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function Btn({
  children,
  variant = "primary",
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
}) {
  const base =
    "px-6 py-3 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 inline-flex items-center gap-2 no-underline";
  if (variant === "primary")
    return (
      <button
        className={base}
        style={{ background: "var(--primary)", color: "#fff", border: "none" }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.boxShadow = "0 0 20px rgba(139,92,246,0.5)")
        }
        onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
      >
        {children}
      </button>
    );
  if (variant === "secondary")
    return (
      <button
        className={base}
        style={{
          background: "transparent",
          color: "var(--foreground)",
          border: "1px solid var(--border)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--primary)";
          e.currentTarget.style.color = "var(--primary)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--border)";
          e.currentTarget.style.color = "var(--foreground)";
        }}
      >
        {children}
      </button>
    );
  return (
    <button
      className={base}
      style={{
        background: "transparent",
        color: "var(--muted-foreground)",
        border: "1px solid transparent",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "var(--foreground)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "var(--muted-foreground)";
      }}
    >
      {children}
    </button>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────
function About() {
  const { ref, isInView } = useFadeIn();
  const stats = [
    { value: 6, suffix: "+", label: "Years Coding" },
    { value: 227, suffix: "", label: "Repositories" },
    { value: 5, suffix: "", label: "Certifications" },
    { value: 1, suffix: "", label: "Research Interest" },
  ];

  return (
    <section
      id="about"
      className="py-24 px-6"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <div className="max-w-[1200px] mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center md:justify-start"
          >
            <div className="relative">
              <div
                className="w-56 h-56 rounded-full overflow-hidden"
                style={{
                  border: "3px solid var(--primary)",
                  boxShadow: "0 0 40px rgba(139,92,246,0.3)",
                }}
              >
                <img
                  src="/shikhar.png"
                  alt="Shikhar Singh"
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className="absolute bottom-4 right-2 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  color: "var(--muted-foreground)",
                }}
              >
                <span
                  className="w-2 h-2 rounded-full bg-green-400 inline-block"
                  style={{ boxShadow: "0 0 6px #4ade80" }}
                />
                Open to collab
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span
              className="badge mb-4 inline-flex"
              style={{
                background: "rgba(139,92,246,0.12)",
                color: "var(--primary)",
                border: "1px solid rgba(139,92,246,0.25)",
              }}
            >
              About Me
            </span>
            <h2
              className="text-4xl font-bold mb-6"
              style={{ color: "var(--foreground)" }}
            >
              The person behind the code
            </h2>
            <p
              className="mb-4 leading-relaxed"
              style={{ color: "var(--muted-foreground)" }}
            >
              I'm a first-year B.Tech CSE (AI/ML) student at KIIT University,
              but my journey in tech started long before university. I began
              coding at age 11, building games and apps that actually shipped to
              real users.
            </p>
            <p
              className="mb-4 leading-relaxed"
              style={{ color: "var(--muted-foreground)" }}
            >
              I'm drawn to the intersection of intelligence and systems —
              whether that's building full-stack applications, exploring
              brain-computer interfaces, or developing quantitative models for
              markets. I believe in learning in public, shipping fast, and
              compounding knowledge over time.
            </p>
            <p
              className="leading-relaxed"
              style={{ color: "var(--muted-foreground)" }}
            >
              Currently exploring deep learning, algorithmic trading, and
              quantitative research — three fields that, to me, all share a
              common thread: extracting signal from noise.
            </p>
          </motion.div>
        </div>

        <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          {stats.map((s, i) => {
            const count = useCountUp(s.value, isInView);
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-[12px] card-hover"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                }}
              >
                <div className="text-4xl font-bold gradient-text font-mono mb-1">
                  {count}
                  {s.suffix}
                </div>
                <div
                  className="text-sm"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {s.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Journey Timeline ─────────────────────────────────────────────────────────
const timelineData = [
  {
    year: "2020",
    title: "Game Developer",
    org: "WhiteHat Jr",
    desc: "Built interactive games using block-based and JavaScript programming. Shipped multiple projects to real users. First taste of creating something from nothing.",
    color: "#8B5CF6",
  },
  {
    year: "2021",
    title: "Android & iOS App Developer",
    org: "WhiteHat Jr",
    desc: "Developed native mobile applications, learning the fundamentals of UI design, user flows, and cross-platform development. Earned certification.",
    color: "#22D3EE",
  },
  {
    year: "2023",
    title: "Full Stack + AI App Developer",
    org: "WhiteHat Jr",
    desc: "Mastered full-stack development with React, Node.js, and integrated AI capabilities into web applications. 227+ GitHub repos and counting.",
    color: "#A78BFA",
  },
  {
    year: "2026",
    title: "B.Tech CSE (AI/ML)",
    org: "KIIT University",
    desc: "Enrolled in a specialized AI/ML program at KIIT. Exploring the intersection of AI, quantitative finance, and algorithmic trading — building toward independent trading in the long run.",
    color: "#8B5CF6",
  },
];

function Journey() {
  return (
    <Section id="journey">
      <SectionTitle
        label="// career.log"
        title="The Journey"
        subtitle="A timeline of learning, building, and compounding."
      />
      <div className="relative">
        <div
          className="absolute left-1/2 top-0 bottom-0 w-px hidden md:block"
          style={{
            background:
              "linear-gradient(to bottom, var(--primary), var(--accent))",
            transform: "translateX(-50%)",
          }}
        />

        <div className="flex flex-col gap-12">
          {timelineData.map((item, i) => (
            <motion.div
              key={item.year}
              variants={fadeUp}
              custom={i}
              className={`flex flex-col md:flex-row items-start md:items-center gap-6 ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}
            >
              <div
                className={`flex-1 ${i % 2 === 1 ? "md:pl-12" : "md:pr-12"}`}
              >
                <div
                  className="p-6 rounded-[12px] card-hover"
                  style={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="badge font-mono text-xs"
                      style={{
                        background: `${item.color}20`,
                        color: item.color,
                        border: `1px solid ${item.color}40`,
                      }}
                    >
                      {item.year}
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      {item.org}
                    </span>
                  </div>
                  <h3
                    className="text-lg font-semibold mb-2"
                    style={{ color: "var(--foreground)" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>

              <div
                className="hidden md:flex w-4 h-4 rounded-full flex-shrink-0 z-10"
                style={{
                  background: item.color,
                  boxShadow: `0 0 12px ${item.color}80`,
                }}
              />

              <div className="hidden md:block flex-1" />
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ─── Skills ───────────────────────────────────────────────────────────────────
const skillsData = {
  Languages: [
    { name: "C", icon: "🔵" },
    { name: "Python", icon: "🐍" },
    { name: "JavaScript", icon: "🟡" },
    { name: "HTML", icon: "🟠" },
    { name: "CSS", icon: "💙" },
  ],
  Frameworks: [
    { name: "React", icon: "⚛️" },
    { name: "Next.js", icon: "▲" },
    { name: "Vue", icon: "💚" },
    { name: "Node.js", icon: "🟢" },
    { name: "FastAPI", icon: "⚡" },
    { name: "Tailwind", icon: "🎨" },
  ],
  Tools: [
    { name: "Git", icon: "🔀" },
    { name: "GitHub", icon: "🐙" },
    { name: "Linux", icon: "🐧" },
    { name: "VS Code", icon: "💻" },
  ],
  "Python / CV": [
    { name: "NumPy", icon: "🔢" },
    { name: "OpenCV", icon: "👁️" },
    { name: "Pandas", icon: "🐼", soon: true },
    { name: "Matplotlib", icon: "📊", soon: true },
  ],
};

function Skills() {
  const [active, setActive] = useState("Languages");
  const categories = Object.keys(skillsData);

  return (
    <Section id="skills">
      <SectionTitle
        label="// skills.json"
        title="Tech Stack"
        subtitle="Tools and technologies I work with — and what's coming next."
      />

      <motion.div
        variants={fadeUp}
        className="flex flex-wrap gap-3 justify-center mb-12"
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className="px-4 py-2 rounded-[999px] text-sm font-medium transition-all duration-200"
            style={{
              background: active === cat ? "var(--primary)" : "var(--card)",
              color: active === cat ? "#fff" : "var(--muted-foreground)",
              border: `1px solid ${active === cat ? "var(--primary)" : "var(--border)"}`,
            }}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          {(
            skillsData as Record<
              string,
              { name: string; icon: string; soon?: boolean }[]
            >
          )[active].map((skill) => (
            <div
              key={skill.name}
              className="skill-item flex flex-col items-center gap-2 p-5 rounded-[12px] relative"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
              }}
            >
              <span className="text-3xl">{skill.icon}</span>
              <span
                className="text-sm font-medium text-center"
                style={{ color: "var(--foreground)" }}
              >
                {skill.name}
              </span>
              {skill.soon && (
                <span
                  className="absolute top-2 right-2 text-xs px-1.5 py-0.5 rounded-full font-mono"
                  style={{
                    background: "rgba(34,211,238,0.12)",
                    color: "var(--accent)",
                    fontSize: "10px",
                  }}
                >
                  soon
                </span>
              )}
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </Section>
  );
}

// ─── Projects ─────────────────────────────────────────────────────────────────
const projectsData = [
  {
    title: "Complete Python for AI/ML",
    desc: "Structured learning repository covering Python fundamentals through advanced AI/ML concepts. Clean, documented notebooks with exercises.",
    tags: ["Python", "NumPy", "Jupyter"],
    github: `${GITHUB_URL}/Complete_Python_for_AI-ML`,
    live: null,
    featured: true,
    gradient:
      "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(34,211,238,0.05))",
  },
  {
    title: "NumPy Mastery",
    desc: "Capstone project demonstrating advanced NumPy usage — vectorized operations, broadcasting, linear algebra, and custom implementations.",
    tags: ["Python", "NumPy", "Data Science"],
    github: `${GITHUB_URL}/numpy-mastery`,
    live: null,
    featured: false,
    gradient:
      "linear-gradient(135deg, rgba(34,211,238,0.12), rgba(139,92,246,0.05))",
  },
  {
    title: "my-tailwind-journey",
    desc: "Progressive Tailwind CSS practice project — from utilities to custom components, responsive layouts, and animation techniques.",
    tags: ["Tailwind CSS", "HTML", "JavaScript"],
    github: `${GITHUB_URL}/my-tailwind-journey`,
    live: null,
    featured: false,
    gradient:
      "linear-gradient(135deg, rgba(167,139,250,0.12), rgba(34,211,238,0.05))",
  },
  {
    title: "cws-website-v2",
    desc: "Second iteration of the Coding With Shikhar website — redesigned with improved UX, performance, and a cleaner content architecture.",
    tags: ["React", "Tailwind", "Vite"],
    github: `${GITHUB_URL}/cws-website-v2`,
    live: null,
    featured: false,
    gradient:
      "linear-gradient(135deg, rgba(139,92,246,0.12), rgba(167,139,250,0.05))",
  },
  {
    title: "Portfolio Website",
    desc: "This site — built with React, Tailwind CSS v4, and Framer Motion. Dark/light theme, animated sections, and component-driven architecture.",
    tags: ["React", "Tailwind", "Framer Motion"],
    github: `${GITHUB_URL}/Portfolio-Website`,
    live: "#",
    featured: false,
    gradient:
      "linear-gradient(135deg, rgba(167,139,250,0.12), rgba(34,211,238,0.08))",
  },
];

function Projects() {
  return (
    <Section id="projects">
      <SectionTitle
        label="// projects.ts"
        title="Featured Projects"
        subtitle="Things I've built, researched, or am actively developing."
      />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projectsData.map((p, i) => (
          <motion.div
            key={p.title}
            variants={fadeUp}
            custom={i}
            className="card-hover rounded-[12px] flex flex-col"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              overflow: "hidden",
            }}
          >
            <div
              className="h-2"
              style={{
                background: p.featured
                  ? "linear-gradient(90deg, var(--primary), var(--accent))"
                  : "var(--border)",
              }}
            />
            <div
              className="p-6 flex flex-col flex-1"
              style={{ background: p.gradient }}
            >
              <div className="flex items-start justify-between mb-3">
                <h3
                  className="font-semibold text-base"
                  style={{ color: "var(--foreground)" }}
                >
                  {p.title}
                </h3>
                {p.featured && (
                  <span
                    className="badge ml-2 flex-shrink-0 text-xs"
                    style={{
                      background: "rgba(139,92,246,0.15)",
                      color: "var(--primary)",
                      border: "1px solid rgba(139,92,246,0.3)",
                    }}
                  >
                    Featured
                  </span>
                )}
              </div>
              <p
                className="text-sm leading-relaxed mb-4 flex-1"
                style={{ color: "var(--muted-foreground)" }}
              >
                {p.desc}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2 py-1 rounded-full font-mono"
                    style={{
                      background: "var(--secondary)",
                      color: "var(--muted-foreground)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex gap-3">
                <a
                  href={p.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs font-medium no-underline transition-colors"
                  style={{ color: "var(--muted-foreground)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--primary)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--muted-foreground)")
                  }
                >
                  <GitHubIcon size={14} /> GitHub
                </a>
                {p.live && (
                  <a
                    href={p.live}
                    className="flex items-center gap-1.5 text-xs font-medium no-underline transition-colors"
                    style={{ color: "var(--accent)" }}
                  >
                    ↗ Live
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

// ─── Research ─────────────────────────────────────────────────────────────────
const interests = [
  {
    title: "AI / ML",
    icon: "🤖",
    desc: "Deep learning, transformers, computer vision",
  },
  {
    title: "Neuroscience",
    icon: "🧠",
    desc: "Neural computation, cognitive models",
  },
  { title: "BCI", icon: "⚡", desc: "Brain-computer interfaces, EEG" },
  { title: "Quantum", icon: "🔬", desc: "Quantum computing fundamentals" },
  { title: "Software", icon: "💻", desc: "Systems design, open source" },
  {
    title: "Finance",
    icon: "📈",
    desc: "Quant trading, market microstructure",
  },
];

function Research() {
  return (
    <Section id="research">
      <SectionTitle
        label="// research.md"
        title="Research & Interests"
        subtitle="Where I'm pushing beyond coursework."
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {interests.map((item, i) => (
          <motion.div
            key={item.title}
            variants={fadeUp}
            custom={i}
            className="card-hover p-6 rounded-[12px]"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="text-3xl mb-3">{item.icon}</div>
            <div
              className="text-base font-semibold mb-2"
              style={{ color: "var(--foreground)" }}
            >
              {item.title}
            </div>
            <div
              className="text-sm leading-relaxed"
              style={{ color: "var(--muted-foreground)" }}
            >
              {item.desc}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        variants={fadeUp}
        className="mt-8 text-center text-xs font-mono p-3 rounded-lg max-w-xl mx-auto"
        style={{
          background: "rgba(139,92,246,0.06)",
          color: "var(--muted-foreground)",
        }}
      >
        * Finance: exploring markets &amp; quantitative thinking
      </motion.div>
    </Section>
  );
}

// ─── GitHub Stats ─────────────────────────────────────────────────────────────
const GH_THEME_DARK = "github_dark";
const GH_THEME_LIGHT = "default";

function GitHubStats({ theme }: { theme: Theme }) {
  const t = theme === "dark" ? GH_THEME_DARK : GH_THEME_LIGHT;
  const bg = theme === "dark" ? "0A0A0F" : "FAFAFA";

  return (
    <Section id="github">
      <SectionTitle
        label="// git log"
        title="GitHub Activity"
        subtitle="227 repositories and counting."
      />
      <motion.div variants={fadeUp} className="max-w-2xl mx-auto mb-8">
        <img
          src={`https://github-readme-streak-stats.herokuapp.com/?user=${GITHUB_USER}&theme=${t}&background=${bg}&hide_border=true`}
          alt="GitHub streak"
          className="gh-img w-full"
        />
      </motion.div>
      <motion.div variants={fadeUp} custom={1} className="text-center">
        <a href={GITHUB_URL} target="_blank" rel="noreferrer">
          <Btn variant="primary">View GitHub Profile ↗</Btn>
        </a>
      </motion.div>
    </Section>
  );
}

// ─── Certifications ───────────────────────────────────────────────────────────
const certs = [
  {
    title: "Game Developer",
    issuer: "WhiteHat Jr",
    year: "2020",
    icon: "🎮",
    color: "#8B5CF6",
    link: "/game_dev.png",
  },
  {
    title: "Android & iOS App Developer",
    issuer: "WhiteHat Jr",
    year: "2021",
    icon: "📱",
    color: "#22D3EE",
    link: "/app_dev.png",
  },
  {
    title: "Full Stack + AI App Developer",
    issuer: "WhiteHat Jr",
    year: "2023",
    icon: "🌐",
    color: "#A78BFA",
    link: "/full_stack.png",
  },
  {
    title: "Software Engineering Job Simulation",
    issuer: "JPMorgan Chase (Forage)",
    year: "2026",
    icon: "🏦",
    color: "#8B5CF6",
    link: "/jpm.png",
  },
  {
    title: "Operations Job Simulation",
    issuer: "Goldman Sachs (Forage)",
    year: "2026",
    icon: "📊",
    color: "#22D3EE",
    link: "/goldman.png",
  },
];

function Certifications() {
  return (
    <Section id="certifications">
      <SectionTitle
        label="// resume.certs"
        title="Certifications"
        subtitle="Verified learning — from online programs and industry partnerships."
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {certs.map((c, i) => (
          <motion.div
            key={c.title}
            variants={fadeUp}
            custom={i}
            className="card-hover p-6 rounded-[12px] flex flex-col gap-3"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-[10px] flex items-center justify-center text-2xl flex-shrink-0"
                style={{
                  background: `${c.color}15`,
                  border: `1px solid ${c.color}30`,
                }}
              >
                {c.icon}
              </div>
              <div>
                <div
                  className="font-semibold text-sm leading-tight"
                  style={{ color: "var(--foreground)" }}
                >
                  {c.title}
                </div>
                <div
                  className="text-xs mt-0.5"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {c.issuer}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span
                className="font-mono text-xs"
                style={{ color: "var(--muted-foreground)" }}
              >
                {c.year}
              </span>
              <a
                href={c.link}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-medium px-3 py-1 rounded-full transition-colors no-underline"
                style={{
                  background: `${c.color}15`,
                  color: c.color,
                  border: `1px solid ${c.color}25`,
                }}
              >
                View ↗
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

// ─── Now / Current Focus ──────────────────────────────────────────────────────
const nowItems = [
  {
    text: "Learning Pandas + Matplotlib for data analysis",
    status: "🟡 In progress",
  },
  {
    text: "Building a trading backtesting engine in Python",
    status: "🟡 In progress",
  },
  {
    text: "Exploring BCI signal processing",
    status: "🔵 Exploring",
  },
  { text: "Exploring quantitative trading strategies", status: "🔵 Exploring" },
];

function NowSection() {
  return (
    <Section id="now">
      <div className="max-w-2xl mx-auto">
        <SectionTitle
          label="// now.txt"
          title="What I'm Working On"
          subtitle="Updated regularly — a public commitment to learning."
        />
        <motion.div
          variants={fadeUp}
          className="p-8 rounded-[12px]"
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
          }}
        >
          <div className="flex flex-col gap-4">
            {nowItems.map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                className="flex items-start gap-4 p-4 rounded-[8px]"
                style={{
                  background: "var(--secondary)",
                  border: "1px solid var(--border)",
                }}
              >
                <span
                  className="text-sm font-mono flex-shrink-0 pt-0.5"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {item.status}
                </span>
                <span
                  className="text-sm"
                  style={{ color: "var(--foreground)" }}
                >
                  {item.text}
                </span>
              </motion.div>
            ))}
          </div>
          <p
            className="text-xs mt-6 font-mono"
            style={{ color: "var(--muted-foreground)" }}
          >
            Last updated: September 2026
          </p>
        </motion.div>
      </div>
    </Section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────
function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      e.email = "Valid email required";
    if (form.message.trim().length < 10)
      e.message = "Message must be at least 10 characters";
    return e;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setErrors({});
    setSending(true);

    try {
      await addDoc(collection(db, "contacts"), {
        name: form.name,
        email: form.email,
        message: form.message,
        createdAt: serverTimestamp(),
      });
      setSent(true);
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "8px",
    background: "var(--secondary)",
    border: "1px solid var(--border)",
    color: "var(--foreground)",
    fontSize: "14px",
    fontFamily: "inherit",
    outline: "none",
    transition: "border-color 0.2s",
  };

  return (
    <Section id="contact">
      <SectionTitle
        label="// contact.ts"
        title="Let's Connect"
        subtitle="Open to collaborations, research projects, and interesting conversations."
      />
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <motion.div variants={fadeUp}>
          {sent ? (
            <div
              className="p-8 rounded-[12px] text-center"
              style={{
                background: "var(--card)",
                border: "1px solid var(--primary)",
              }}
            >
              <div className="text-4xl mb-4">✅</div>
              <h3
                className="text-xl font-semibold mb-2"
                style={{ color: "var(--foreground)" }}
              >
                Message sent!
              </h3>
              <p
                className="text-sm"
                style={{ color: "var(--muted-foreground)" }}
              >
                I'll get back to you within 48 hours.
              </p>
              <button
                onClick={() => {
                  setSent(false);
                  setForm({ name: "", email: "", message: "" });
                }}
                className="mt-6 text-sm"
                style={{ color: "var(--primary)" }}
              >
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {(["name", "email"] as const).map((field) => (
                <div key={field}>
                  <label
                    className="text-sm font-medium mb-1.5 block capitalize"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {field}
                  </label>
                  <input
                    type={field === "email" ? "email" : "text"}
                    value={form[field]}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [field]: e.target.value }))
                    }
                    style={inputStyle}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "var(--primary)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = errors[field]
                        ? "#ef4444"
                        : "var(--border)")
                    }
                    placeholder={
                      field === "name" ? "Your name" : "your@email.com"
                    }
                  />
                  {errors[field] && (
                    <p className="text-xs mt-1 text-red-400">{errors[field]}</p>
                  )}
                </div>
              ))}
              <div>
                <label
                  className="text-sm font-medium mb-1.5 block"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Message
                </label>
                <textarea
                  value={form.message}
                  rows={5}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, message: e.target.value }))
                  }
                  style={{ ...inputStyle, resize: "vertical" }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "var(--primary)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = errors.message
                      ? "#ef4444"
                      : "var(--border)")
                  }
                  placeholder="Tell me what you're working on..."
                />
                {errors.message && (
                  <p className="text-xs mt-1 text-red-400">{errors.message}</p>
                )}
              </div>
              <Btn variant="primary">
                {sending ? "Sending..." : "Send Message →"}
              </Btn>
            </form>
          )}
        </motion.div>

        <motion.div
          variants={fadeUp}
          custom={1}
          className="flex flex-col gap-6"
        >
          <div
            className="p-4 rounded-[12px] flex items-center gap-3"
            style={{
              background: "rgba(139,92,246,0.08)",
              border: "1px solid rgba(139,92,246,0.2)",
            }}
          >
            <span className="text-xl">🤝</span>
            <div>
              <div
                className="text-sm font-semibold"
                style={{ color: "var(--foreground)" }}
              >
                Open to collaborations
              </div>
              <div
                className="text-xs"
                style={{ color: "var(--muted-foreground)" }}
              >
                Research, open source, side projects
              </div>
            </div>
          </div>

          {[
            {
              label: "LinkedIn",
              href: LINKEDIN_URL,
              icon: "💼",
              color: "#0A66C2",
            },
            { label: "GitHub", href: GITHUB_URL, icon: "🐙", color: "#8B5CF6" },
            {
              label: "Email",
              href: `mailto:${EMAIL}`,
              icon: "📧",
              color: "#22D3EE",
            },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 p-5 rounded-[12px] no-underline card-hover"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
              }}
            >
              <span className="text-2xl">{link.icon}</span>
              <div>
                <div
                  className="font-semibold text-sm"
                  style={{ color: "var(--foreground)" }}
                >
                  {link.label}
                </div>
                <div
                  className="text-xs font-mono"
                  style={{ color: link.color }}
                >
                  Connect ↗
                </div>
              </div>
            </a>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}

// ─── Shiva Shlok / Blessing ───────────────────────────────────────────────────
function ShlokSection() {
  return (
    <Section id="shlok">
      <motion.div
        variants={fadeUp}
        className="max-w-3xl mx-auto text-center p-10 rounded-[16px]"
        style={{
          background:
            "linear-gradient(135deg, rgba(139,92,246,0.08), rgba(34,211,238,0.04))",
          border: "1px solid rgba(139,92,246,0.2)",
        }}
      >
        <div className="text-4xl mb-6" style={{ color: "var(--primary)" }}>
          🕉️
        </div>

        <motion.div variants={fadeUp} custom={1} className="mb-6">
          <p
            className="text-lg md:text-xl font-medium leading-relaxed mb-2"
            style={{
              color: "var(--foreground)",
              fontFamily: "'Noto Serif Devanagari', serif",
              lineHeight: 1.8,
            }}
          >
            ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्।
          </p>
          <p
            className="text-lg md:text-xl font-medium leading-relaxed"
            style={{
              color: "var(--foreground)",
              fontFamily: "'Noto Serif Devanagari', serif",
              lineHeight: 1.8,
            }}
          >
            उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात्॥
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          custom={2}
          className="w-16 h-px mx-auto mb-6"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--primary), transparent)",
          }}
        />

        <motion.p
          variants={fadeUp}
          custom={3}
          className="text-sm md:text-base italic leading-relaxed mb-8 max-w-xl mx-auto"
          style={{ color: "var(--muted-foreground)" }}
        >
          "We worship the three-eyed One (Shiva), who is fragrant and nourishes
          all beings. May He liberate us from death, for the sake of immortality
          — just as the cucumber is severed from its bondage to the vine."
        </motion.p>

        <motion.div
          variants={fadeUp}
          custom={4}
          className="pt-6"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <p
            className="text-base md:text-lg font-semibold mb-2"
            style={{
              color: "var(--primary)",
              fontFamily: "'Noto Serif Devanagari', serif",
            }}
          >
            ॐ नमः शिवाय
          </p>
          <p
            className="text-sm md:text-base font-medium"
            style={{ color: "var(--muted-foreground)" }}
          >
            नमः पार्वती पतये, हर हर महादेव 🕉️
          </p>
        </motion.div>
      </motion.div>
    </Section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const links = [
    { label: "Home", href: "#hero" },
    { label: "Projects", href: "#projects" },
    { label: "Research", href: "#research" },
    { label: "Contact", href: "#contact" },
  ];
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        background: "var(--card)",
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          <div>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              © 2026 Shikhar Singh. All rights reserved.
            </p>
            <p
              className="text-xs mt-1 font-mono"
              style={{ color: "var(--muted-foreground)", opacity: 0.6 }}
            >
              Built with React + Tailwind. Hosted on Firebase.
            </p>
          </div>
          <div className="flex gap-6 justify-center flex-wrap">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-sm no-underline transition-colors"
                style={{ color: "var(--muted-foreground)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--primary)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--muted-foreground)")
                }
              >
                {l.label}
              </a>
            ))}
          </div>
          <div className="flex gap-4 justify-center md:justify-end">
            {[
              { href: GITHUB_URL, icon: <GitHubIcon /> },
              { href: LINKEDIN_URL, icon: <LinkedInIcon /> },
            ].map((s, i) => (
              <a
                key={i}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg transition-colors"
                style={{
                  color: "var(--muted-foreground)",
                  background: "var(--secondary)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--primary)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--muted-foreground)")
                }
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────
function GitHubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <div
      style={{
        background: "var(--background)",
        minHeight: "100vh",
        transition: "background 0.3s, color 0.3s",
      }}
    >
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main>
        <Hero />
        <About />
        <Journey />
        <Skills />
        <Projects />
        <Research />
        <GitHubStats theme={theme} />
        <Certifications />
        <NowSection />
        <Contact />
        <ShlokSection />
      </main>
      <Footer />
    </div>
  );
}