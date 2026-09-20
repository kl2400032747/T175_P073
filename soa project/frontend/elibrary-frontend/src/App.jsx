import { BrowserRouter, Routes, Route, Navigate, NavLink, useNavigate, useLocation, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import "./App.css";

const demoBooks = [
  { id: 1, title: "Clean Code", author: "Robert C. Martin", category: "Programming", quantity: 4, available: 3, isbn: "978-0132350884", description: "A handbook for writing readable, maintainable software.", publisher: "Prentice Hall", edition: "1st Edition", pages: 464, language: "English", year: "2008", rating: "4.7", ratingsCount: 238, subjects: ["Programming", "Software Design", "Java"] },
  { id: 2, title: "The Pragmatic Programmer", author: "Andrew Hunt", category: "Engineering", quantity: 3, available: 2, isbn: "978-0201616224", description: "A practical guide to becoming a more effective developer.", publisher: "Addison-Wesley", edition: "2nd Edition", pages: 352, language: "English", year: "1999", rating: "4.8", ratingsCount: 194, subjects: ["Engineering", "Programming", "Best Practices"] },
  { id: 3, title: "Atomic Habits", author: "James Clear", category: "Self Improvement", quantity: 5, available: 5, isbn: "978-0735211292", description: "An easy and proven way to build good habits and break bad ones.", publisher: "Avery", edition: "1st Edition", pages: 320, language: "English", year: "2018", rating: "4.8", ratingsCount: 312, subjects: ["Habits", "Productivity", "Self Improvement"] },
  { id: 4, title: "Deep Work", author: "Cal Newport", category: "Productivity", quantity: 2, available: 1, isbn: "978-1455586691", description: "Rules for focused success in a distracted world.", publisher: "Grand Central Publishing", edition: "1st Edition", pages: 304, language: "English", year: "2016", rating: "4.6", ratingsCount: 176, subjects: ["Productivity", "Focus", "Work"] },
];

const borrowedBooks = [
  { id: 101, title: "Clean Code", dueDate: "2026-09-27", status: "Due soon" },
  { id: 102, title: "Atomic Habits", dueDate: "2026-10-02", status: "On track" },
];

const fines = [
  { id: 401, reason: "Late return", amount: 25, status: "Pending" },
  { id: 402, reason: "Damage fee", amount: 40, status: "Paid" },
];

const adminUsers = [
  { id: 1, name: "Aisha Khan", email: "aisha@email.com", role: "Student" },
  { id: 2, name: "Daniel Mensah", email: "daniel@email.com", role: "Admin" },
  { id: 3, name: "Priya James", email: "priya@email.com", role: "Student" },
];

const borrowRecords = [
  { id: 201, member: "Aisha Khan", book: "Clean Code", date: "2026-09-12", status: "Active" },
  { id: 202, member: "Priya James", book: "Deep Work", date: "2026-09-08", status: "Returned" },
];

const adminStats = [
  { label: "Books", value: 245 },
  { label: "Members", value: 1842 },
  { label: "Borrowings", value: 96 },
  { label: "Outstanding Fines", value: "$1,240" },
];

const userProfile = {
  name: "Jane Doe",
  studentId: "ST-2048",
  email: "jane.doe@library.edu",
  department: "Computer Science",
  memberSince: "2025-01-18",
};

function getBookPrice(book) {
  return book.category === "Programming" ? 12.99 : book.category === "Engineering" ? 14.99 : book.category === "Self Improvement" ? 9.99 : 11.99;
}

function addBookToCart(book) {
  const cart = JSON.parse(localStorage.getItem("library-cart") || "[]");
  localStorage.setItem("library-cart", JSON.stringify([...cart.filter((item) => item.id !== book.id), book]));
  window.dispatchEvent(new Event("library-cart-updated"));
}

function PurchaseDialog({ book, onClose, onComplete }) {
  if (!book) return null;

  return (
    <div className="dialog-backdrop" role="presentation" onClick={onClose}>
      <section className="purchase-dialog" role="dialog" aria-modal="true" aria-labelledby="purchase-title" onClick={(event) => event.stopPropagation()}>
        <button className="dialog-close" type="button" onClick={onClose} aria-label="Close">×</button>
        <p className="eyebrow">Library access</p>
        <h2 id="purchase-title">Borrow this book</h2>
        <p className="purchase-book-title">{book.title}</p>
        <p className="purchase-author">by {book.author}</p>
        <div className="purchase-price"><span>Digital access</span><strong>${getBookPrice(book).toFixed(2)}</strong></div>
        <p className="purchase-note">Your purchase gives you access to read this resource in your library.</p>
        <div className="purchase-actions">
          <button type="button" className="cart-button" onClick={() => onComplete(`${book.title} was added to your cart.`, "cart")}>Add to Cart</button>
          <button type="button" className="buy-button" onClick={() => onComplete(`Purchase started for ${book.title}.`, "buy")}>Buy Now</button>
        </div>
      </section>
    </div>
  );
}

const homeStats = [
  { value: "10K+", label: "e-Books" },
  { value: "5K+", label: "Research Papers" },
  { value: "100+", label: "Journals" },
  { value: "∞", label: "Learning Opportunities" },
];

const featuredBooks = [
  { title: "Artificial Intelligence", author: "Stuart Russell", tag: "AI", cover: "https://covers.openlibrary.org/isbn/9780134610993-M.jpg" },
  { title: "Data Structures", author: "Mark Allen Weiss", tag: "CS", cover: "https://covers.openlibrary.org/isbn/9780132576277-M.jpg" },
  { title: "Operating Systems", author: "Abraham Silberschatz", tag: "Tech", cover: "https://covers.openlibrary.org/isbn/9781119456339-M.jpg" },
  { title: "Database System Concepts", author: "Silberschatz, Korth", tag: "Data", cover: "https://covers.openlibrary.org/isbn/9780073523323-M.jpg" },
];

const searchResults = [
  { title: "Machine Learning: A Practical Perspective", author: "Amit Sharma", type: "AI" },
  { title: "Deep Learning with Python", author: "Maria Silva", type: "AI" },
  { title: "Hands-On Machine Learning", author: "Andrew Ng", type: "ML" },
  { title: "Python for Data Science", author: "Sophie Lee", type: "CS" },
];

const researchPapers = [
  { title: "A Practical Review of Machine Learning in Education", author: "Amit Sharma", journal: "Journal of Educational Technology", year: "2024" },
  { title: "Neural Networks for Accessible Learning Systems", author: "Maria Silva", journal: "International AI Research Review", year: "2023" },
  { title: "Data-Driven Libraries and Student Success", author: "Rina Patel", journal: "Digital Libraries Quarterly", year: "2024" },
];

const authorResults = [
  { name: "Amit Sharma", field: "Artificial Intelligence", resources: "42 resources" },
  { name: "Maria Silva", field: "Machine Learning", resources: "36 resources" },
  { name: "Robert C. Martin", field: "Software Engineering", resources: "28 resources" },
];

const journals = [
  { title: "Journal of Digital Learning", publisher: "Academic Press", issue: "Vol. 18, Issue 2", year: "2024" },
  { title: "International Journal of Computer Science", publisher: "TechWorld Publishing", issue: "Vol. 31, Issue 4", year: "2024" },
  { title: "Library and Information Review", publisher: "Knowledge Network", issue: "Vol. 12, Issue 1", year: "2023" },
];

const studentMenu = [
  { to: "/student/dashboard", label: "Dashboard" },
  { to: "/student/books", label: "Search Resources" },
  { to: "/student/books", label: "My Library" },
  { to: "/student/borrowed", label: "Borrowed Books" },
  { to: "/student/notifications", label: "Notifications" },
  { to: "/student/profile", label: "Profile" },
  { to: "/student/profile", label: "Settings" },
];

const adminMenu = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/books", label: "Manage Books" },
  { to: "/admin/users", label: "Manage Users" },
  { to: "/admin/borrowings", label: "Manage Borrowings" },
  { to: "/admin/fines", label: "Manage Fines" },
  { to: "/admin/reports", label: "Reports" },
  { to: "/admin/profile", label: "Settings" },
];

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("library-user") || "null");
  } catch {
    return null;
  }
}

function saveStoredUser(user) {
  localStorage.setItem("library-user", JSON.stringify(user));
}

function clearStoredUser() {
  localStorage.removeItem("library-user");
}

function isValidUser(email, password) {
  const users = JSON.parse(localStorage.getItem("library-users") || "[]");
  return users.find((user) => user.email === email && user.password === password) || null;
}

function saveUserToStore(user) {
  const users = JSON.parse(localStorage.getItem("library-users") || "[]");
  const filtered = users.filter((item) => item.email !== user.email);
  filtered.push(user);
  localStorage.setItem("library-users", JSON.stringify(filtered));
}

function AppLayout({ title, menu, children }) {
  const navigate = useNavigate();
  const user = getStoredUser();
  const role = user?.role === "admin" ? "admin" : "student";
  const navIcons = ["⌂", "⌕", "▣", "◷", "♧", "⚙"];

  return (
    <div className={`app-shell ${role === "admin" ? "admin-portal" : ""}`}>
      <aside className="sidebar">
        <div className="portal-brand"><span className="brand-mark small">L</span><strong>{role === "admin" ? "E-Library" : "LibroSphere"}</strong></div>
        <nav className="nav-list">
          {menu.map((item, index) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              <span className="nav-icon">{navIcons[index] || "•"}</span>{item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button
            className="logout-button"
            onClick={() => {
              clearStoredUser();
              navigate("/login");
            }}
          >
            Logout
          </button>
          <span className="user-role-tag">{role}</span>
        </div>
      </aside>

      <main className="main-panel">
        <header className="page-header">
          <div className="dashboard-search"><span>⌕</span><input placeholder="Search books, authors..." /></div>
          <div className="profile-chip"><span className="notification">♧</span><span className="avatar">{user?.name?.charAt(0) || "S"}</span><span><strong>{user?.name || (role === "admin" ? "Admin" : "Student")}</strong><small>{role === "admin" ? "Administrator" : "Student"}</small></span></div>
        </header>
        {title === "Student Dashboard" && <div className="dashboard-welcome"><h1>Welcome Back, {user?.name || "Student"}!</h1><p>Explore, learn, and grow with LibroSphere</p></div>}
        {title === "Admin Dashboard" && <div className="dashboard-welcome"><h1>Welcome Back, {user?.name || "Admin"}!</h1><p>Manage your academic library from one place.</p></div>}
        {title !== "Student Dashboard" && title !== "Admin Dashboard" && title !== "My Profile" && <div className="subpage-heading"><h1>{title}</h1><p>Explore, manage, and keep track of your library resources.</p></div>}
        {children}
      </main>
    </div>
  );
}

function ProtectedRoute({ children, allowedRole }) {
  const user = getStoredUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === "admin" ? "/admin/dashboard" : "/student/dashboard"} replace />;
  }

  return children;
}

function LandingPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleSearch = (event) => {
    event.preventDefault();
    navigate(`/login${search.trim() ? `?search=${encodeURIComponent(search.trim())}` : ""}`);
  };

  return (
    <div className="landing-shell">
      <header className="landing-header">
        <div className="brand-row">
          <div className="brand-mark">L</div>
          <span>LibroSphere</span>
        </div>

        <nav className="top-nav">
          <a href="#home">Home</a>
          <a href="#resources">Resources</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="header-actions">
          <button className="btn btn-light" onClick={() => navigate("/login")}>Login</button>
          <button className="btn btn-primary" onClick={() => navigate("/register")}>Sign Up</button>
        </div>
      </header>

      <main id="home" className="hero-panel">
        <section className="hero-copy">
          <h1>Knowledge Beyond Boundaries</h1>
          <p>Access a modern academic e-library for students, faculty, and researchers. Discover millions of resources, anytime, anywhere.</p>

          <form className="hero-search" onSubmit={handleSearch}>
            <input
              type="search"
              placeholder="Search books, journals, authors..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search the library"
            />
            <button type="submit" aria-label="Search">⌕</button>
          </form>

          <div className="hero-stats">
            {homeStats.map((item) => (
              <div key={item.label} className="mini-stat">
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="hero-visual">
          <div className="plant">
            <span className="leaf leaf-one"></span>
            <span className="leaf leaf-two"></span>
            <span className="leaf leaf-three"></span>
            <span className="leaf leaf-four"></span>
            <span className="stem"></span>
            <span className="pot"></span>
          </div>
          <div className="book-stack" aria-hidden="true">
            <div className="book book-one"><span>GROW</span></div>
            <div className="book book-two"><span>DISCOVER</span></div>
            <div className="book book-three"><span>EXPLORE</span></div>
            <div className="book book-four"><span>LEARN</span></div>
          </div>
          <div className="quote-badge">“A Brighter Tomorrow Through Knowledge”</div>
        </section>
      </main>

      <section id="resources" className="landing-section resources-section">
        <div>
          <p className="eyebrow">Explore the collection</p>
          <h2>Resources for every curious mind.</h2>
        </div>
        <div className="resource-list">
          <article><strong>e-Books</strong><span>10,000+ titles across every subject</span></article>
          <article><strong>Research Papers</strong><span>Trusted material for deeper study</span></article>
          <article><strong>Academic Journals</strong><span>Current ideas from leading publishers</span></article>
        </div>
      </section>

      <section id="about" className="landing-section about-section">
        <div>
          <p className="eyebrow">About LibroSphere</p>
          <h2>A quieter way to find your next great idea.</h2>
        </div>
        <p>LibroSphere brings books, journals, and research together in one welcoming digital library for students, faculty, and lifelong learners.</p>
      </section>

      <section id="contact" className="landing-section contact-section">
        <div>
          <p className="eyebrow">Contact</p>
          <h2>Need help finding something?</h2>
        </div>
        <a className="contact-link" href="mailto:hello@librosphere.edu">hello@librosphere.edu</a>
      </section>
    </div>
  );
}

function AuthPage({ mode }) {
  const navigate = useNavigate();
  const isLogin = mode === "login";
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isLogin) {
      const user = isValidUser(form.email, form.password);
      if (!user) {
        setMessage("Invalid email or password");
        return;
      }

      saveStoredUser({ ...user, password: undefined });
      navigate(user.role === "admin" ? "/admin/dashboard" : "/student/dashboard");
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem("library-users") || "[]");
    const exists = existingUsers.some((user) => user.email === form.email);

    if (exists) {
      setMessage("This email is already registered.");
      return;
    }

    const newUser = {
      id: Date.now(),
      name: form.name || "Library User",
      email: form.email,
      password: form.password,
      role: form.role,
    };

    saveUserToStore(newUser);
    saveStoredUser({ ...newUser, password: undefined });
    setMessage("Registration successful. Redirecting...");
    setTimeout(() => navigate(form.role === "admin" ? "/admin/dashboard" : "/student/dashboard"), 500);
  };

  return (
    <div className="auth-layout">
      <div className="auth-backdrop">
        <div className="auth-shelf shelf-one"></div>
        <div className="auth-shelf shelf-two"></div>
        <div className="auth-window"></div>
        <div className="auth-plant"><span></span><i></i></div>
        <p className="auth-quote">“Good Books<br />Build<br />Great Minds”</p>
      </div>
      <div className="auth-card">
        <div className="auth-brand">
          <div className="brand-mark small">L</div>
          <span>LibroSphere</span>
        </div>

        <h2>{isLogin ? "Welcome Back" : "Create an account"}</h2>
        <p className="auth-subtitle">{isLogin ? "Login to access your account" : "Sign up to start exploring"}</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input type="text" name="name" placeholder="Full name" value={form.name} onChange={handleChange} required />
              <select name="role" value={form.role} onChange={handleChange}>
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </>
          )}

          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />

          <button type="submit" className="btn btn-primary auth-submit">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        {message && <p className="status-message">{message}</p>}

        <p className="switch-text">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button type="button" className="text-button" onClick={() => navigate(isLogin ? "/register" : "/login")}>
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
        <button type="button" className="auth-home" onClick={() => navigate("/")}>Back to home</button>
      </div>
    </div>
  );
}

function StudentDashboard() {
  const [query, setQuery] = useState("");
  const filteredBooks = useMemo(
    () => demoBooks.filter((book) => `${book.title} ${book.author} ${book.category}`.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  return (
    <AppLayout title="Student Dashboard" menu={studentMenu}>
      <section className="stats-grid">
        <div className="stats-card stat-teal"><span className="stat-icon">▣</span><div><small>Available Books</small><strong>12,450</strong></div></div>
        <div className="stats-card stat-blue"><span className="stat-icon">▤</span><div><small>My Borrowed</small><strong>5</strong></div></div>
        <div className="stats-card stat-red"><span className="stat-icon">!</span><div><small>Due Soon</small><strong>2</strong></div></div>
        <div className="stats-card stat-sky"><span className="stat-icon">▤</span><div><small>Research Papers</small><strong>3,200</strong></div></div>
      </section>

      <section className="recommended-panel">
        <div className="section-header">
          <h2>Recommended for You</h2>
          <NavLink to="/student/books">View All</NavLink>
        </div>
        <div className="recommended-books">
          {featuredBooks.concat({ title: "Machine Learning", author: "Andrew Ng", tag: "AI", cover: "https://covers.openlibrary.org/isbn/9780262033848-M.jpg" }).map((book, index) => (
            <NavLink key={`${book.title}-${index}`} to="/student/books" className={`recommended-book cover-${(index % 5) + 1}`}>
              <div className="cover-art" style={{ backgroundImage: `url(${book.cover})` }}><span>{book.title}</span></div>
              <strong>{book.title}</strong>
              <small>{book.author}</small>
            </NavLink>
          ))}
        </div>
      </section>

      <section className="dashboard-lower">
        <div className="card-panel">
          <div className="section-header"><h2>My Borrowed Books</h2><NavLink to="/student/borrowed">View All</NavLink></div>
          <div className="book-list">
            {borrowedBooks.map((book) => (
              <div key={book.id} className="loan-item"><div><strong>{book.title}</strong><p>Due {book.dueDate}</p></div><span className="status-pill">{book.status}</span></div>
            ))}
          </div>
        </div>
        <div className="card-panel">
          <div className="section-header"><h2>Recent Activity</h2><NavLink to="/student/books">View All</NavLink></div>
          <p className="muted">You recently explored new books and research materials.</p>
        </div>
      </section>

      <section className="search-panel mt-20">
        <div className="panel-header">
          <h3>Search Results</h3>
          <button className="link-btn">Filter</button>
        </div>
        <div className="toolbar">
          <input className="search-box" type="text" placeholder="Search books, authors, category" value={query} onChange={(event) => setQuery(event.target.value)} />
        </div>
        <div className="search-list">
          {filteredBooks.map((book) => (
            <div key={book.id} className="search-item">
              <div>
                <h4>{book.title}</h4>
                <p>{book.author}</p>
              </div>
              <span className="result-tag">{book.category}</span>
            </div>
          ))}
        </div>
      </section>
    </AppLayout>
  );
}

function BookList() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [notice, setNotice] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const filteredBooks = useMemo(
    () => demoBooks.filter((book) => {
      const matchesSearch = `${book.title} ${book.author} ${book.category}`.toLowerCase().includes(query.toLowerCase());
      const matchesTab = activeTab === "All" || (activeTab === "Authors" ? book.author.toLowerCase().includes(query.toLowerCase()) : activeTab === "E-Books" ? true : activeTab === "Journals" ? book.category === "Research" : activeTab === "Research Papers" ? book.category === "Research" : true);
      return matchesSearch && matchesTab;
    }),
    [activeTab, query],
  );
  const filteredPapers = researchPapers.filter((paper) => `${paper.title} ${paper.author} ${paper.journal}`.toLowerCase().includes(query.toLowerCase()));
  const filteredAuthors = authorResults.filter((author) => `${author.name} ${author.field}`.toLowerCase().includes(query.toLowerCase()));
  const filteredJournals = journals.filter((journal) => `${journal.title} ${journal.publisher}`.toLowerCase().includes(query.toLowerCase()));
  const resultCount = activeTab === "Research Papers" ? filteredPapers.length : activeTab === "Authors" ? filteredAuthors.length : activeTab === "Journals" ? filteredJournals.length : filteredBooks.length;

  return (
    <AppLayout title="Books" menu={studentMenu}>
      <div className="resource-toolbar">
        <div className="resource-search"><span>⌕</span><input type="text" placeholder="Search books by title, author, or category" value={query} onChange={(event) => setQuery(event.target.value)} /></div>
        <button className="filter-button" type="button" onClick={() => setNotice("Use the categories below to filter resources.")}>☷ Filters</button>
      </div>
      <div className="resource-tabs">{["All", "E-Books", "Journals", "Research Papers", "Authors"].map((tab) => <button key={tab} className={activeTab === tab ? "selected" : ""} type="button" onClick={() => { setActiveTab(tab); setNotice(""); }}>{tab}</button>)}</div>
      {notice && <div className="action-notice">{notice}</div>}
      <div className="resource-results-heading"><strong>{activeTab === "Research Papers" ? "Research Papers" : activeTab === "Authors" ? "Authors" : activeTab === "Journals" ? "Academic Journals" : activeTab === "E-Books" ? "E-Books" : `Search Results for “${query || "all resources"}”`}</strong><small>About {resultCount} resources</small></div>
      <div className="resource-results">
        {activeTab === "Research Papers" && filteredPapers.map((paper) => (
          <div key={paper.title} className="paper-result"><div className="paper-icon">▤</div><div><h3>{paper.title}</h3><p>by {paper.author}</p><small>{paper.journal} · {paper.year}</small><div className="result-meta"><span>Research Paper</span><span>Open Access</span></div></div><button type="button" onClick={() => setNotice(`${paper.title} is ready to read.`)}>Read</button></div>
        ))}
        {activeTab === "Authors" && filteredAuthors.map((author) => (
          <div key={author.name} className="author-result"><div className="author-result-avatar">{author.name.split(" ").map((part) => part[0]).join("")}</div><div><h3>{author.name}</h3><p>{author.field}</p><small>{author.resources}</small></div><button type="button" onClick={() => setNotice(`Showing all resources by ${author.name}.`)}>View Author</button></div>
        ))}
        {activeTab === "Journals" && filteredJournals.map((journal) => (
          <div key={journal.title} className="paper-result"><div className="paper-icon">J</div><div><h3>{journal.title}</h3><p>{journal.publisher}</p><small>{journal.issue} · {journal.year}</small><div className="result-meta"><span>Journal</span><span>Full Text</span></div></div><button type="button" onClick={() => setNotice(`${journal.title} is ready to open.`)}>Read</button></div>
        ))}
        {activeTab !== "Research Papers" && activeTab !== "Authors" && activeTab !== "Journals" && filteredBooks.map((book) => (
          <div key={book.id} className="resource-result">
            <div className={`result-cover result-cover-${book.id}`}><span>{book.title}</span></div>
            <div className="result-copy"><h3>{book.title}</h3><p>by {book.author}</p><small>{book.description}</small><div className="result-meta"><span>{book.category}</span><span>2024</span></div></div>
            <div className="result-actions"><NavLink to={`/student/books/${book.id}`}>View</NavLink><button type="button" onClick={() => setSelectedBook(book)}>Borrow</button></div>
          </div>
        ))}
      </div>
      <PurchaseDialog book={selectedBook} onClose={() => setSelectedBook(null)} onComplete={(message, action) => { if (action === "cart") addBookToCart(selectedBook); setSelectedBook(null); setNotice(message); }} />
    </AppLayout>
  );
}

function BookDetails() {
  const { id } = useParams();
  const [notice, setNotice] = useState("");
  const [showPurchase, setShowPurchase] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState("Overview");
  const book = demoBooks.find((item) => item.id === Number(id));

  if (!book) {
    return (
      <AppLayout title="Book Details" menu={studentMenu}>
        <div className="empty-state">Book not found.</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Book Details" menu={studentMenu}>
      <div className="book-detail-layout">
        <div className="large-cover"><span>{book.title}</span><small>{book.author.toUpperCase()}</small></div>
        <div className="book-detail-content">
          <div className="detail-title-row"><div><h2>{book.title}</h2><p>{book.author}</p></div><div className="detail-tags"><span className="availability">E-Book</span><span>{book.category}</span><span>{book.year}</span></div></div>
          <div className="rating">★★★★★ <small>{book.rating} ({book.ratingsCount} ratings)</small></div>
          <p>{book.description}</p>
          <div className="book-actions large"><button type="button" onClick={() => setShowPurchase(true)}>Borrow</button><button type="button" className="secondary-button" onClick={() => setNotice("Online reading will open when the digital copy is available.")}>Read Online</button></div>
          {notice && <div className="action-notice">{notice}</div>}
        </div>
        <aside className="details-sidebar"><h3>Details</h3><div><small>Author</small><strong>{book.author}</strong></div><div><small>Publisher</small><strong>{book.publisher}</strong></div><div><small>Edition</small><strong>{book.edition}</strong></div><div><small>Pages</small><strong>{book.pages}</strong></div><div><small>Language</small><strong>{book.language}</strong></div><div><small>ISBN</small><strong>{book.isbn}</strong></div></aside>
      </div>
      <div className="subject-panel"><h3>Subjects</h3>{book.subjects.map((subject) => <span key={subject}>{subject}</span>)}</div>
      <div className="detail-tabs">{["Overview", "Chapters", "Reviews", "Similar Books"].map((tab) => <button key={tab} className={activeDetailTab === tab ? "selected" : ""} type="button" onClick={() => setActiveDetailTab(tab)}>{tab}</button>)}</div>
      <div className="detail-overview">
        {activeDetailTab === "Overview" && <><h3>About this book</h3><p>{book.description} This resource combines clear explanations with practical examples and is suitable for students, researchers, and independent learners.</p><div className="overview-facts"><span><strong>{book.pages}</strong> pages</span><span><strong>{book.available}</strong> available copies</span><span><strong>{book.year}</strong> published</span></div></>}
        {activeDetailTab === "Chapters" && <><h3>Table of contents</h3><div className="chapter-list"><div><strong>1. Introduction</strong><span>Foundations and key ideas</span></div><div><strong>2. Core Concepts</strong><span>Essential principles and methods</span></div><div><strong>3. Practical Applications</strong><span>Examples, exercises, and case studies</span></div><div><strong>4. Further Reading</strong><span>Resources for continued learning</span></div></div></>}
        {activeDetailTab === "Reviews" && <><div className="reviews-heading"><h3>Reader reviews</h3><strong>★ {book.rating} / 5</strong></div><div className="review-item"><div className="review-avatar">AS</div><div><strong>Aisha Sharma</strong><span>★★★★★</span><p>Clear, useful, and easy to follow. A great resource for learning.</p></div></div><div className="review-item"><div className="review-avatar">DM</div><div><strong>Daniel Mensah</strong><span>★★★★☆</span><p>The practical examples made the subject much easier to understand.</p></div></div></>}
        {activeDetailTab === "Similar Books" && <><h3>You may also like</h3><div className="similar-books">{demoBooks.filter((item) => item.id !== book.id).slice(0, 3).map((similarBook) => <NavLink key={similarBook.id} to={`/student/books/${similarBook.id}`}><div className="similar-cover">{similarBook.title}</div><strong>{similarBook.title}</strong><small>{similarBook.author}</small></NavLink>)}</div></>}
      </div>
      <PurchaseDialog book={showPurchase ? book : null} onClose={() => setShowPurchase(false)} onComplete={(message, action) => { if (action === "cart") addBookToCart(book); setShowPurchase(false); setNotice(message); }} />
    </AppLayout>
  );
}

function BorrowedBooks() {
  const [activeTab, setActiveTab] = useState("Active");
  const [showCart, setShowCart] = useState(false);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("library-cart") || "[]"));
  useEffect(() => {
    const refreshCart = () => setCart(JSON.parse(localStorage.getItem("library-cart") || "[]"));
    window.addEventListener("library-cart-updated", refreshCart);
    return () => window.removeEventListener("library-cart-updated", refreshCart);
  }, []);
  const returnedBooks = [
    { id: 301, title: "The Pragmatic Programmer", dueDate: "Returned Sep 02, 2026", status: "Returned" },
  ];
  const visibleBooks = activeTab === "Active" ? borrowedBooks : returnedBooks;

  return (
    <AppLayout title="My Borrowed Books" menu={studentMenu}>
      <div className="borrow-toolbar"><div className="borrow-tabs"><button className={activeTab === "Active" ? "selected" : ""} type="button" onClick={() => setActiveTab("Active")}>Active (2)</button><button className={activeTab === "Returned" ? "selected" : ""} type="button" onClick={() => setActiveTab("Returned")}>Returned (1)</button></div><button className={`cart-toggle ${showCart ? "selected" : ""}`} type="button" onClick={() => setShowCart(!showCart)}>Cart ({cart.length})</button></div>
      {showCart && <div className="cart-panel"><strong>Your Cart</strong>{cart.length === 0 ? <p>Your cart is empty.</p> : cart.map((book) => <div key={book.id}><span>{book.title}</span><strong>${getBookPrice(book).toFixed(2)}</strong></div>)}</div>}
      <div className="borrowed-list">{visibleBooks.map((book, index) => <div key={book.id} className="borrowed-row"><div className={`borrow-cover borrow-cover-${index + 1}`}>{book.title}</div><div><strong>{book.title}</strong><p>{activeTab === "Active" ? `Borrowed on Sep ${12 - index}, 2026` : "Returned successfully"}</p><small>{activeTab === "Active" ? `Due date: ${book.dueDate}` : book.dueDate}</small></div><span className="status-pill">{book.status}</span>{activeTab === "Active" ? <button type="button">Return</button> : <span className="returned-label">Completed</span>}</div>)}</div>
    </AppLayout>
  );
}

function FinesPage() {
  return (
    <AppLayout title="Fines" menu={studentMenu}>
      <div className="table-card">
        <table>
          <thead>
            <tr><th>Reason</th><th>Amount</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {fines.map((fine) => (
              <tr key={fine.id}>
                <td>{fine.reason}</td>
                <td>${fine.amount}</td>
                <td><span className="status-pill">{fine.status}</span></td>
                <td>{fine.status === "Pending" ? <button type="button">Settle</button> : <span>Paid</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}

function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    { id: 1, type: "due", title: "Book due soon", text: "Clean Code is due on September 27, 2026.", time: "Today", unread: true },
    { id: 2, type: "cart", title: "Item added to cart", text: "Your selected book is waiting in your cart.", time: "Yesterday", unread: true },
    { id: 3, type: "fine", title: "Pending fine reminder", text: "You have an outstanding fine of $25.00.", time: "Sep 18", unread: false },
    { id: 4, type: "info", title: "New research resources", text: "Explore the latest journals and research papers.", time: "Sep 15", unread: false },
  ]);

  const markAllRead = () => setNotifications((items) => items.map((item) => ({ ...item, unread: false })));
  const removeNotification = (id) => setNotifications((items) => items.filter((item) => item.id !== id));

  return (
    <AppLayout title="Notifications" menu={studentMenu}>
      <div className="notifications-toolbar"><div><strong>{notifications.filter((item) => item.unread).length} unread notifications</strong><p>Stay updated with your library activity.</p></div><button type="button" onClick={markAllRead}>Mark all as read</button></div>
      <div className="notification-list">
        {notifications.length === 0 ? <div className="empty-notifications">You are all caught up.</div> : notifications.map((notification) => (
          <article key={notification.id} className={`notification-card ${notification.unread ? "unread" : ""}`}>
            <div className={`notification-icon ${notification.type}`}>{notification.type === "due" ? "!" : notification.type === "cart" ? "▣" : notification.type === "fine" ? "$" : "i"}</div>
            <div className="notification-copy"><h3>{notification.title}</h3><p>{notification.text}</p><small>{notification.time}</small></div>
            <button className="notification-dismiss" type="button" onClick={() => removeNotification(notification.id)} aria-label={`Dismiss ${notification.title}`}>×</button>
          </article>
        ))}
      </div>
    </AppLayout>
  );
}

function Profile() {
  const storedUser = getStoredUser();
  const isAdmin = storedUser?.role === "admin";
  const profile = { ...userProfile, name: storedUser?.name || (isAdmin ? "Admin" : userProfile.name), email: storedUser?.email || (isAdmin ? "admin@elibrary.com" : userProfile.email), role: storedUser?.role || "student", department: isAdmin ? "Library Administration" : userProfile.department, memberSince: isAdmin ? "2024-08-01" : userProfile.memberSince };

  return (
    <AppLayout title="My Profile" menu={isAdmin ? adminMenu : studentMenu}>
      <div className="profile-heading"><div><h2>My Profile</h2><p>Manage your account details.</p></div><button type="button">Edit Profile</button></div>
      <div className="profile-reference-card">
        <div className="profile-identity"><div className="profile-avatar">{profile.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}</div><button type="button" className="change-photo">Change Photo</button></div>
        <div className="profile-fields"><div><small>Full Name</small><strong>{profile.name}</strong></div><div><small>Email</small><strong>{profile.email}</strong></div><div><small>Role</small><strong>{profile.role.toUpperCase()}</strong></div><div><small>Department</small><strong>{profile.department}</strong></div><div><small>Member Since</small><strong>{profile.memberSince}</strong></div></div>
      </div>
    </AppLayout>
  );
}

function AdminDashboard() {
  return (
    <AppLayout title="Admin Dashboard" menu={adminMenu}>
      <section className="stats-grid">
        <div className="stats-card admin-stat-books"><span className="stat-icon">▣</span><div><small>Total Books</small><strong>12,450</strong><em>+12% from last month</em></div></div>
        <div className="stats-card admin-stat-users"><span className="stat-icon">♟</span><div><small>Total Users</small><strong>1,230</strong><em>+8% from last month</em></div></div>
        <div className="stats-card admin-stat-borrow"><span className="stat-icon">▤</span><div><small>Active Borrowings</small><strong>320</strong><em>+5% from last month</em></div></div>
        <div className="stats-card admin-stat-fines"><span className="stat-icon">$</span><div><small>Pending Fines</small><strong>42</strong><em>-3% from last month</em></div></div>
      </section>

      <section className="admin-content-grid">
        <div className="admin-chart-panel">
          <div className="section-header"><h2>Books Overview</h2></div>
          <div className="bar-chart"><div className="chart-y"><span>600</span><span>400</span><span>200</span><span>0</span></div><div className="bars">{[[30, 13], [45, 20], [58, 25], [43, 22], [57, 27], [75, 34]].map(([books, borrowed], index) => <div className="bar-group" key={index}><div className="bar-pair"><i style={{ height: `${books}%` }}></i><b style={{ height: `${borrowed}%` }}></b></div><small>{["Jan", "Feb", "Mar", "Apr", "May", "Jun"][index]}</small></div>)}</div></div>
          <div className="chart-legend"><span><i></i>Total Books</span><span><i></i>Borrowed</span></div>
        </div>

        <div className="admin-activity-panel">
          <div className="section-header"><h2>Recent Activity</h2><NavLink to="/admin/reports">View All</NavLink></div>
          <div className="admin-activity-list">
            <div><span className="activity-icon book-activity">▣</span><p><strong>New book added - Data Structures</strong><small>2 hours ago</small></p></div>
            <div><span className="activity-icon user-activity">♟</span><p><strong>User registered - siri@example.com</strong><small>3 hours ago</small></p></div>
            <div><span className="activity-icon book-activity">▣</span><p><strong>Book borrowed - Machine Learning</strong><small>5 hours ago</small></p></div>
            <div><span className="activity-icon fine-activity">$</span><p><strong>Fine settled - Borrow ID #1023</strong><small>1 day ago</small></p></div>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}

function ManageBooks() {
  const [bookList, setBookList] = useState(demoBooks);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [status, setStatus] = useState("All Status");
  const [notice, setNotice] = useState("");
  const [showAddBook, setShowAddBook] = useState(false);
  const [newBook, setNewBook] = useState({ title: "", author: "", isbn: "", category: "Computer Science", available: "1" });
  const categories = ["All Categories", ...new Set(bookList.map((book) => book.category))];
  const books = bookList.filter((book) => {
    const matchesQuery = `${book.title} ${book.author} ${book.isbn}`.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === "All Categories" || book.category === category;
    const matchesStatus = status === "All Status" || (status === "Available" ? book.available > 0 : book.available === 0);
    return matchesQuery && matchesCategory && matchesStatus;
  });

  return (
    <AppLayout title="Manage Books" menu={adminMenu}>
      <div className="manage-heading"><div><h2>Manage Books</h2><p>Add, update and manage library books.</p></div><button type="button" onClick={() => { setShowAddBook(true); setNotice(""); }}>＋ Add New Book</button></div>
      <div className="manage-notice">{notice && <span>{notice}</span>}</div>
      <div className="book-filters"><div className="admin-table-search">⌕<input placeholder="Search by title, author or ISBN..." value={query} onChange={(event) => setQuery(event.target.value)} /></div><select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select><select value={status} onChange={(event) => setStatus(event.target.value)}><option>All Status</option><option>Available</option><option>Unavailable</option></select></div>
      <div className="admin-table-card"><table>
          <thead>
            <tr><th>#</th><th>Title</th><th>Author</th><th>ISBN</th><th>Category</th><th>Available</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {books.map((book, index) => (
              <tr key={book.id}>
                <td>{index + 1}</td><td><strong>{book.title}</strong></td>
                <td>{book.author}</td>
                <td>{book.isbn}</td>
                <td>{book.category}</td>
                <td>{book.available}</td><td><span className={`book-status ${book.available > 0 ? "available" : "unavailable"}`}>{book.available > 0 ? "Available" : "Unavailable"}</span></td>
                <td><div className="book-row-actions"><button type="button" onClick={() => setNotice(`Viewing ${book.title}.`)} aria-label={`View ${book.title}`}>◉</button><button type="button" onClick={() => setNotice(`Editing ${book.title}.`)} aria-label={`Edit ${book.title}`}>✎</button><button type="button" className="delete-action" onClick={() => setNotice(`${book.title} is ready to be deleted.`)} aria-label={`Delete ${book.title}`}>♧</button></div></td>
              </tr>
            ))}
          </tbody>
        </table><div className="pagination"><button type="button">‹</button><button className="current" type="button">1</button><button type="button">2</button><button type="button">3</button><span>...</span><button type="button">10</button><button type="button">›</button></div></div>
      {showAddBook && <div className="dialog-backdrop" role="presentation" onClick={() => setShowAddBook(false)}><form className="add-book-dialog" onSubmit={(event) => { event.preventDefault(); const book = { id: Date.now(), title: newBook.title, author: newBook.author, isbn: newBook.isbn, category: newBook.category, available: Number(newBook.available), quantity: Number(newBook.available), description: `A new ${newBook.category.toLowerCase()} resource.`, publisher: "Library Press", edition: "1st Edition", pages: 300, language: "English", year: "2026", rating: "4.5", ratingsCount: 0, subjects: [newBook.category] }; setBookList((items) => [...items, book]); setNewBook({ title: "", author: "", isbn: "", category: "Computer Science", available: "1" }); setShowAddBook(false); setNotice(`${book.title} was added successfully.`); }} onClick={(event) => event.stopPropagation()}><button className="dialog-close" type="button" onClick={() => setShowAddBook(false)} aria-label="Close">×</button><p className="eyebrow">Library catalogue</p><h2>Add New Book</h2><label>Title<input required value={newBook.title} onChange={(event) => setNewBook({ ...newBook, title: event.target.value })} /></label><label>Author<input required value={newBook.author} onChange={(event) => setNewBook({ ...newBook, author: event.target.value })} /></label><label>ISBN<input required value={newBook.isbn} onChange={(event) => setNewBook({ ...newBook, isbn: event.target.value })} /></label><div className="add-book-fields"><label>Category<select value={newBook.category} onChange={(event) => setNewBook({ ...newBook, category: event.target.value })}><option>Computer Science</option><option>Programming</option><option>Engineering</option><option>Research</option><option>Self Improvement</option></select></label><label>Available<input type="number" min="0" required value={newBook.available} onChange={(event) => setNewBook({ ...newBook, available: event.target.value })} /></label></div><button className="add-submit" type="submit">Add Book</button></form></div>}
    </AppLayout>
  );
}

function ManageUsers() {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [notice, setNotice] = useState("");
  const users = adminUsers.filter((user) => {
    const matchesQuery = `${user.name} ${user.email}`.toLowerCase().includes(query.toLowerCase());
    const matchesRole = roleFilter === "All" || user.role.toLowerCase() === roleFilter.toLowerCase();
    return matchesQuery && matchesRole;
  });

  return (
    <AppLayout title="Manage Users" menu={adminMenu}>
      <div className="manage-heading"><div><h2>Manage Users</h2><p>View and manage students and administrators.</p></div><div className="total-users"><small>Total Users</small><strong>1,230</strong></div></div>
      {notice && <div className="manage-notice"><span>{notice}</span></div>}
      <div className="user-filters"><div className="admin-table-search">⌕<input placeholder="Search by name or email..." value={query} onChange={(event) => setQuery(event.target.value)} /></div><div className="user-filter-tabs">{["All", "Students", "Admins"].map((filter) => <button key={filter} className={roleFilter === filter || (filter === "Students" && roleFilter === "Student") || (filter === "Admins" && roleFilter === "Admin") ? "selected" : ""} type="button" onClick={() => setRoleFilter(filter === "Students" ? "Student" : filter === "Admins" ? "Admin" : "All")}>{filter}</button>)}</div></div>
      <div className="admin-table-card"><table>
          <thead>
            <tr><th>#</th><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td><td><strong>{user.name}</strong></td>
                <td>{user.email}</td>
                <td><span className={`role-badge ${user.role.toLowerCase()}`}>{user.role.toUpperCase()}</span></td>
                <td><span className="user-status active">Active</span></td>
                <td><div className="book-row-actions"><button type="button" onClick={() => setNotice(`Viewing ${user.name}.`)} aria-label={`View ${user.name}`}>◉</button><button type="button" onClick={() => setNotice(`Editing ${user.name}.`)} aria-label={`Edit ${user.name}`}>✎</button><button type="button" className="delete-action" onClick={() => setNotice(`${user.name} is ready to be removed.`)} aria-label={`Delete ${user.name}`}>♧</button></div></td>
              </tr>
            ))}
          </tbody>
        </table><div className="pagination"><button type="button">‹</button><button className="current" type="button">1</button><button type="button">2</button><button type="button">3</button><span>...</span><button type="button">10</button><button type="button">›</button></div></div>
    </AppLayout>
  );
}

function ManageBorrowings() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [notice, setNotice] = useState("");
  const records = [
    { id: "B001", user: "U001", book: "Machine Learning", borrowDate: "01 Sep 2026", returnDate: "15 Sep 2026", status: "Returned" },
    { id: "B002", user: "U003", book: "Data Structures", borrowDate: "05 Sep 2026", returnDate: "-", status: "Borrowed" },
    { id: "B003", user: "U005", book: "Database Concepts", borrowDate: "10 Sep 2026", returnDate: "-", status: "Overdue" },
    { id: "B004", user: "U008", book: "Operating Systems", borrowDate: "12 Sep 2026", returnDate: "20 Sep 2026", status: "Returned" },
    { id: "B005", user: "U010", book: "Computer Networks", borrowDate: "14 Sep 2026", returnDate: "-", status: "Borrowed" },
  ];
  const visibleRecords = records.filter((record) => {
    const matchesSearch = `${record.id} ${record.user} ${record.book}`.toLowerCase().includes(query.toLowerCase());
    return matchesSearch && (filter === "All" || record.status === filter);
  });

  return (
    <AppLayout title="Manage Borrowings" menu={adminMenu}>
      <div className="manage-heading borrowing-heading"><div><h2>Manage Borrowings</h2><p>Monitor all book borrowing and return activities.</p></div></div>
      {notice && <div className="manage-notice"><span>{notice}</span></div>}
      <div className="borrowing-filters"><div className="admin-table-search">⌕<input placeholder="Search by user ID or book title..." value={query} onChange={(event) => setQuery(event.target.value)} /></div><div className="user-filter-tabs">{["All", "Borrowed", "Returned", "Overdue"].map((item) => <button key={item} className={filter === item ? "selected" : ""} type="button" onClick={() => setFilter(item)}>{item}</button>)}</div></div>
      <div className="admin-table-card"><table>
          <thead>
            <tr><th>Borrow ID</th><th>User ID</th><th>Book Title</th><th>Borrow Date</th><th>Return Date</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {visibleRecords.map((record) => (
              <tr key={record.id}>
                <td><strong>{record.id}</strong></td><td>{record.user}</td><td>{record.book}</td><td>{record.borrowDate}</td><td>{record.returnDate}</td>
                <td><span className={`borrow-status ${record.status.toLowerCase()}`}>{record.status.toUpperCase()}</span></td>
                <td><div className="book-row-actions"><button type="button" onClick={() => setNotice(`Viewing borrowing ${record.id}.`)} aria-label={`View ${record.id}`}>◉</button><button type="button" onClick={() => setNotice(record.status === "Borrowed" ? `${record.book} marked as returned.` : `Details for ${record.id} opened.`)} aria-label={`Update ${record.id}`}>▣</button></div></td>
              </tr>
            ))}
          </tbody>
        </table><div className="pagination"><button type="button">‹</button><button className="current" type="button">1</button><button type="button">2</button><button type="button">3</button><span>...</span><button type="button">10</button><button type="button">›</button></div></div>
    </AppLayout>
  );
}

function ManageFines() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [notice, setNotice] = useState("");
  const fineRecords = [
    { id: "F001", user: "U003", borrow: "B002", amount: "$30", reason: "Overdue", date: "20 Sep 2026", status: "Pending" },
    { id: "F002", user: "U005", borrow: "B003", amount: "$10", reason: "Book Damage", date: "19 Sep 2026", status: "Pending" },
    { id: "F003", user: "U008", borrow: "B004", amount: "$0", reason: "-", date: "15 Sep 2026", status: "Paid" },
    { id: "F004", user: "U010", borrow: "B005", amount: "$50", reason: "Overdue", date: "10 Sep 2026", status: "Pending" },
    { id: "F005", user: "U012", borrow: "B007", amount: "$75", reason: "Late Return", date: "05 Sep 2026", status: "Paid" },
  ];
  const visibleFines = fineRecords.filter((fine) => {
    const matchesSearch = `${fine.id} ${fine.user} ${fine.borrow} ${fine.reason}`.toLowerCase().includes(query.toLowerCase());
    return matchesSearch && (filter === "All" || fine.status === filter);
  });

  return (
    <AppLayout title="Manage Fines" menu={adminMenu}>
      <div className="manage-heading borrowing-heading"><div><h2>Manage Fines</h2><p>Track, update and settle library fines.</p></div></div>
      {notice && <div className="manage-notice"><span>{notice}</span></div>}
      <div className="borrowing-filters"><div className="admin-table-search">⌕<input placeholder="Search by user ID or borrow ID..." value={query} onChange={(event) => setQuery(event.target.value)} /></div><div className="user-filter-tabs">{["All", "Pending", "Paid"].map((item) => <button key={item} className={filter === item ? "selected" : ""} type="button" onClick={() => setFilter(item)}>{item}</button>)}</div></div>
      <div className="admin-table-card"><table>
          <thead>
            <tr><th>Fine ID</th><th>User ID</th><th>Borrow ID</th><th>Amount</th><th>Reason</th><th>Fine Date</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {visibleFines.map((fine) => (
              <tr key={fine.id}>
                <td><strong>{fine.id}</strong></td><td>{fine.user}</td><td>{fine.borrow}</td><td>{fine.amount}</td><td>{fine.reason}</td><td>{fine.date}</td>
                <td><span className={`fine-status ${fine.status.toLowerCase()}`}>{fine.status}</span></td>
                <td><div className="book-row-actions"><button type="button" onClick={() => setNotice(`Viewing ${fine.id}.`)} aria-label={`View ${fine.id}`}>◉</button><button type="button" onClick={() => setNotice(fine.status === "Pending" ? `${fine.id} marked as paid.` : `Editing ${fine.id}.`)} aria-label={`Update ${fine.id}`}>✎</button><button type="button" className="delete-action" onClick={() => setNotice(`${fine.id} is ready to be deleted.`)} aria-label={`Delete ${fine.id}`}>♧</button></div></td>
              </tr>
            ))}
          </tbody>
        </table><div className="pagination"><button type="button">‹</button><button className="current" type="button">1</button><button type="button">2</button><button type="button">3</button><span>...</span><button type="button">10</button><button type="button">›</button></div></div>
    </AppLayout>
  );
}

function Reports() {
  return (
    <AppLayout title="Reports" menu={adminMenu}>
      <div className="manage-heading reports-heading"><div><h2>Library Reports</h2><p>View analytics and insights about your library.</p></div></div>
      <section className="report-stats"><div><span>▣</span><small>Total Books</small><strong>12,450</strong></div><div><span>♟</span><small>Total Users</small><strong>1,230</strong></div><div><span>▤</span><small>Total Borrowings</small><strong>3,450</strong></div><div><span>$</span><small>Total Fines</small><strong>₹12,500</strong></div></section>
      <section className="report-grid">
        <div className="report-card"><h3>Books Statistics</h3><div className="donut-row"><div className="donut books-donut"><strong>12,450<small>Books</small></strong></div><div className="report-legend"><span><i className="legend-green"></i>Available <b>8,240</b></span><span><i className="legend-blue"></i>Borrowed <b>3,450</b></span><span><i className="legend-grey"></i>Other <b>760</b></span></div></div></div>
        <div className="report-card"><h3>User Distribution</h3><div className="donut-row"><div className="donut users-donut"><strong>1,230<small>Users</small></strong></div><div className="report-legend"><span><i className="legend-green"></i>Students <b>1,000</b></span><span><i className="legend-teal"></i>Admins <b>230</b></span></div></div></div>
        <div className="report-card trend-card"><h3>Borrowings Trend</h3><div className="trend-bars">{[35, 48, 54, 57, 62, 70].map((height, index) => <div key={index}><i style={{ height: `${height}%` }}></i><small>{["Jan", "Feb", "Mar", "Apr", "May", "Jun"][index]}</small></div>)}</div></div>
        <div className="report-card trend-card"><h3>Fines Trend</h3><div className="trend-bars fines-bars">{[25, 38, 48, 43, 55, 72].map((height, index) => <div key={index}><i style={{ height: `${height}%` }}></i><small>{["Jan", "Feb", "Mar", "Apr", "May", "Jun"][index]}</small></div>)}</div></div>
      </section>
    </AppLayout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />

        <Route path="/student/dashboard" element={<ProtectedRoute allowedRole="student"><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student/books" element={<ProtectedRoute allowedRole="student"><BookList /></ProtectedRoute>} />
        <Route path="/student/books/:id" element={<ProtectedRoute allowedRole="student"><BookDetails /></ProtectedRoute>} />
        <Route path="/student/borrowed" element={<ProtectedRoute allowedRole="student"><BorrowedBooks /></ProtectedRoute>} />
        <Route path="/student/fines" element={<ProtectedRoute allowedRole="student"><FinesPage /></ProtectedRoute>} />
        <Route path="/student/notifications" element={<ProtectedRoute allowedRole="student"><NotificationsPage /></ProtectedRoute>} />
        <Route path="/student/profile" element={<ProtectedRoute allowedRole="student"><Profile /></ProtectedRoute>} />

        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/books" element={<ProtectedRoute allowedRole="admin"><ManageBooks /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute allowedRole="admin"><ManageUsers /></ProtectedRoute>} />
        <Route path="/admin/borrowings" element={<ProtectedRoute allowedRole="admin"><ManageBorrowings /></ProtectedRoute>} />
        <Route path="/admin/fines" element={<ProtectedRoute allowedRole="admin"><ManageFines /></ProtectedRoute>} />
        <Route path="/admin/reports" element={<ProtectedRoute allowedRole="admin"><Reports /></ProtectedRoute>} />
        <Route path="/admin/profile" element={<ProtectedRoute allowedRole="admin"><Profile /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;