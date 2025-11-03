import React, { useEffect, useMemo, useState } from "react";

export default function ReactjsQuiz() {
  // --- state
  const [screen, setScreen] = useState("difficulty"); // difficulty | quiz | complete
  const [currentDifficulty, setCurrentDifficulty] = useState("");
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

  // Floating background elements state
  const [floatingItems, setFloatingItems] = useState([]); // for react elements
  const [confettiItems, setConfettiItems] = useState([]); // for completion

  // --- inject component CSS once
  useEffect(() => {
    const css = `
    /* --- START ReactQuiz styles (injected) --- */
    *{margin:0;padding:0;box-sizing:border-box}
    :root{--accent:#61dafb;--bg1:#21232a;--bg2:#282c34;--card-bg:rgba(255,255,255,0.95);--text:#20232a}
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
    .rq-container{  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  padding-top: 120px; /* navbar height ke hisaab se adjust karo */
  position: relative;
  z-index: 10;
}
    .rq-body-bg{
      position:fixed;left:0;top:0;right:0;bottom:0;
      background:linear-gradient(135deg,var(--accent) 0%, #21232a 25%, #282c34 50%, var(--accent) 75%, #20232a 100%);
      background-size:400% 400%;animation:rq-reactGradient 10s ease infinite;z-index:-1;
    }
    @keyframes rq-reactGradient{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
    .rq-header{text-align:center;margin-bottom:30px;background:var(--card-bg);padding:25px;border-radius:20px;box-shadow:0 15px 35px rgba(0,0,0,0.1);border:3px solid var(--accent)}
    .rq-title{font-size:2.4rem;color:var(--text);margin-bottom:6px}
    .rq-sub{font-size:1.05rem;color:var(--accent);opacity:0.95;font-weight:600}
    .rq-progress{display:flex;justify-content:space-between;align-items:center;background:var(--card-bg);padding:20px;border-radius:15px;margin-bottom:20px;box-shadow:0 8px 25px rgba(0,0,0,0.1);border:2px solid var(--accent)}
    .rq-tree{font-size:1.05rem;font-family:'Courier New',monospace;color:var(--text);background:#f8f9fa;padding:12px;border-radius:10px;border:2px solid var(--accent);min-width:200px;transition:all .35s}
    .rq-react-emoji{font-size:2.2rem;margin-left:12px;filter:drop-shadow(0 3px 6px rgba(0,0,0,0.2));animation:rq-reactSpin 3s linear infinite}
    @keyframes rq-reactSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
    .rq-score{font-weight:700;color:var(--text)}
    .rq-difficulty{display:flex;gap:12px;justify-content:center;margin-bottom:18px;flex-wrap:wrap}
    .rq-diff-btn{padding:12px 22px;border:3px solid var(--accent);border-radius:22px;font-weight:700;background:var(--card-bg);cursor:pointer;transition:all .25s}
    .rq-diff-btn:hover{transform:translateY(-3px);box-shadow:0 8px 20px rgba(97,218,251,0.18)}
    .rq-card{background:var(--card-bg);color:var(--text);padding:28px;border-radius:20px;margin-bottom:18px;box-shadow:0 15px 35px rgba(0,0,0,0.08);border:2px solid var(--accent)}
    .rq-question-head{display:flex;align-items:center;gap:18px;margin-bottom:20px}
    .rq-q-emoji{font-size:2.6rem}
    .rq-q-text{font-size:1.2rem;font-weight:700;color:var(--text)}
    .rq-code{background:#282c34;border:2px solid var(--accent);border-radius:10px;padding:16px;margin:18px 0;font-family:'Courier New',monospace;color:#abb2bf;overflow:auto;font-size:0.95rem}
    .rq-answers{display:grid;gap:12px;margin-bottom:12px}
    .rq-btn{padding:14px 18px;border-radius:12px;border:2px solid #ddd;background:white;text-align:left;cursor:pointer;transition:all .2s}
    .rq-btn:hover{transform:translateX(8px);box-shadow:0 6px 18px rgba(97,218,251,0.12);border-color:var(--accent)}
    .rq-btn.correct{background:#10b981;color:white;border-color:#059669;box-shadow:0 0 20px rgba(16,185,129,0.28)}
    .rq-btn.incorrect{background:#ef4444;color:white;border-color:#dc2626;box-shadow:0 0 20px rgba(239,68,68,0.28)}
    .rq-next{background:linear-gradient(45deg,var(--accent),#21232a);color:white;border:none;padding:12px 26px;border-radius:20px;cursor:pointer;float:right;font-weight:700}
    .rq-complete{ text-align:center;background:var(--card-bg);padding:38px;border-radius:18px;border:3px solid var(--accent) }
    .rq-badge{background:linear-gradient(45deg,var(--accent),#21232a);color:white;padding:22px;border-radius:50%;font-size:2.6rem;margin:12px auto;width:120px;height:120px;display:flex;align-items:center;justify-content:center;box-shadow:0 15px 40px rgba(97,218,251,0.35);animation:rq-badgeSpin 3s infinite}
    @keyframes rq-badgeSpin{0%,100%{transform:scale(1) rotate(0deg)}50%{transform:scale(1.05) rotate(180deg)}}
    .rq-restart{background:linear-gradient(45deg,#10b981,#059669);color:white;border:none;padding:12px 24px;border-radius:20px;cursor:pointer}
    .rq-hidden{display:none}
    /* floating items */
    .rq-floating{position:absolute;font-family:'Courier New',monospace;padding:6px 10px;border-radius:6px;background:rgba(32,35,42,0.8);color:var(--accent);border:1px solid rgba(97,218,251,0.3);pointer-events:none;z-index:2;animation:rq-float linear forwards}
    @keyframes rq-float{0%{transform:translateY(100vh) rotate(0deg);opacity:0}10%{opacity:.4}90%{opacity:.4}100%{transform:translateY(-120px) rotate(30deg);opacity:0}}
    .rq-confetti{position:absolute;font-size:1.6rem;pointer-events:none;z-index:3;animation:rq-conf 5s ease-in-out forwards}
    @keyframes rq-conf{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(-150px) rotate(720deg);opacity:0}}
    /* responsive */
    @media (max-width:768px){.rq-title{font-size:1.6rem}.rq-diff-btn{padding:10px 14px}.rq-card{padding:18px}.rq-q-text{text-align:center}}
    /* --- END ReactQuiz styles --- */
    `;
    const styleTag = document.createElement("style");
    styleTag.setAttribute("data-rq-styles", "true");
    styleTag.innerHTML = css;
    document.head.appendChild(styleTag);

    return () => {
      document.head.querySelectorAll('style[data-rq-styles="true"]').forEach(el => el.remove());
    };
  }, []);

  // --- questions object (copied from your original HTML)
  const questions = useMemo(() => ({
    beginner: [
      {
        emoji: "⚛️",
        question: "What does JSX stand for?",
        code: null,
        answers: ["JavaScript XML", "Java Syntax Extension", "JavaScript Extension", "Just Syntax XML"],
        correct: 0
      },
      {
        emoji: "🏗️",
        question: "What will this JSX render?",
        code: "const element = <h1>Hello, React!</h1>;",
        answers: ["An h1 heading with 'Hello, React!'", "A paragraph", "Nothing", "An error"],
        correct: 0
      },
      {
        emoji: "📦",
        question: "How do you create a functional component?",
        code: null,
        answers: [
          "function MyComponent() { return <div>Hello</div>; }",
          "class MyComponent extends Component",
          "const MyComponent = new Component()",
          "MyComponent() => <div>Hello</div>"
        ],
        correct: 0
      },
      {
        emoji: "🎯",
        question: "What is the correct way to render this component?",
        code: "function Welcome() {\\n  return <h1>Welcome!</h1>;\\n}",
        answers: ["<Welcome />", "<Welcome></Welcome>", "Welcome()", "{Welcome}"],
        correct: 0
      },
      {
        emoji: "🔧",
        question: "Which method is used to render React elements to the DOM?",
        code: null,
        answers: ["ReactDOM.render()", "React.render()", "document.render()", "DOM.render()"],
        correct: 0
      }
    ],
    intermediate: [
      {
        emoji: "📊",
        question: "What will this component display initially?",
        code: "function Counter() {\\n  const [count, setCount] = useState(0);\\n  return <p>Count: {count}</p>;\\n}",
        answers: ["Count: 0", "Count: undefined", "Count: null", "An error"],
        correct: 0
      },
      {
        emoji: "🎁",
        question: "How do you pass data to a child component?",
        code: "<ChildComponent name=\\\"John\\\" age={25} />",
        answers: ["Through props", "Through state", "Through context", "Through refs"],
        correct: 0
      },
      {
        emoji: "🔄",
        question: "What does this button do when clicked?",
        code: "const [count, setCount] = useState(0);\\nreturn (\\n  <button onClick={() => setCount(count + 1)}>\\n    {count}\\n  </button>\\n);",
        answers: ["Increases count by 1", "Decreases count by 1", "Resets count to 0", "Does nothing"],
        correct: 0
      },
      {
        emoji: "📝",
        question: "How do you handle form input in React?",
        code: "const [value, setValue] = useState('');\\nreturn (\\n  <input \\n    value={value} \\n    onChange={(e) => setValue(e.target.value)} \\n  />\\n);",
        answers: ["Controlled component with state", "Uncontrolled component", "Direct DOM manipulation", "Form validation"],
        correct: 0
      },
      {
        emoji: "🎨",
        question: "What is the correct way to conditionally render?",
        code: null,
        answers: ["{isVisible && <div>Content</div>}", "if(isVisible) <div>Content</div>", "<div if={isVisible}>Content</div>", "{isVisible ? true : <div>Content</div>}"],
        correct: 0
      },
      {
        emoji: "📋",
        question: "How do you render a list of items?",
        code: "const items = ['apple', 'banana', 'orange'];\\nreturn (\\n  <ul>\\n    {items.map(item => <li key={item}>{item}</li>)}\\n  </ul>\\n);",
        answers: ["Using map() with unique keys", "Using forEach()", "Using for loop", "Using filter()"],
        correct: 0
      }
    ],
    advanced: [
      {
        emoji: "🎣",
        question: "What does useEffect with an empty dependency array do?",
        code: "useEffect(() => {\\n  console.log('Effect runs');\\n}, []);",
        answers: ["Runs once after initial render", "Runs on every render", "Runs on component unmount", "Never runs"],
        correct: 0
      },
      {
        emoji: "🧠",
        question: "What will useMemo do in this example?",
        code: "const expensiveValue = useMemo(() => {\\n  return heavyCalculation(data);\\n}, [data]);",
        answers: ["Memoizes the calculation result until data changes", "Runs calculation on every render", "Prevents component re-render", "Caches the component"],
        correct: 0
      },
      {
        emoji: "🔗",
        question: "What is the purpose of useCallback?",
        code: "const handleClick = useCallback(() => {\\n  doSomething(id);\\n}, [id]);",
        answers: ["Memoizes the function to prevent unnecessary re-renders", "Creates a new function on every render", "Handles component callbacks", "Manages component lifecycle"],
        correct: 0
      },
      {
        emoji: "🌐",
        question: "What does useContext provide?",
        code: "const theme = useContext(ThemeContext);",
        answers: ["Access to context value without prop drilling", "Component state management", "Side effect handling", "Component memoization"],
        correct: 0
      },
      {
        emoji: "🎭",
        question: "What pattern does this implement?",
        code: "function withAuth(Component) {\\n  return function AuthComponent(props) {\\n    if (!isAuthenticated) return <Login />;\\n    return <Component {...props} />;\\n  };\\n}",
        answers: ["Higher-Order Component (HOC)", "Render Props", "Custom Hook", "Context Provider"],
        correct: 0
      },
      {
        emoji: "🔄",
        question: "What does useReducer help with?",
        code: "const [state, dispatch] = useReducer(reducer, initialState);",
        answers: ["Managing complex state logic", "Handling side effects", "Memoizing values", "Creating context"],
        correct: 0
      },
      {
        emoji: "⚡",
        question: "What optimization does React.memo provide?",
        code: "const MyComponent = React.memo(function MyComponent({ name }) {\\n  return <div>{name}</div>;\\n});",
        answers: ["Prevents re-render if props haven't changed", "Memoizes component state", "Optimizes event handlers", "Caches component methods"],
        correct: 0
      }
    ]
  }), []);

  // --- start quiz
  function startQuiz(level) {
    setCurrentDifficulty(level);
    setCurrentQuestions(questions[level].slice());
    setQIndex(0);
    setScore(0);
    setAnswered(false);
    setSelectedIndex(null);
    setScreen("quiz");
  }

  // --- select answer
  function handleSelect(i) {
    if (answered) return;
    setAnswered(true);
    setSelectedIndex(i);

    const correct = currentQuestions[qIndex].correct;
    if (i === correct) {
      setScore(s => s + 1);
    }
  }

  // --- navigate next
  function handleNext() {
    if (qIndex + 1 < currentQuestions.length) {
      setQIndex(idx => idx + 1);
      setAnswered(false);
      setSelectedIndex(null);
    } else {
      // show completion
      setScreen("complete");
      createConfetti();
    }
  }

  // --- create floating react elements (background)
  useEffect(() => {
    // const reactElements = [
    //   "<Component />", "useState()", "useEffect()", "props", "state", "JSX",
    //   "onClick={}", "className=\"\"", "key={}", "map()", "filter()", "reduce()",
    //   "useContext()", "useMemo()", "useCallback()", "useReducer()", "React.memo()",
    //   "componentDidMount", "render()", "return", "const", "function", "export default"
    // ];

    const interval = setInterval(() => {
      const id = Math.random().toString(36).slice(2);
      const left = Math.random() * 100;
      const size = Math.random() * 8 + 12;
      const dur = Math.random() * 10 + 15;
      const text = reactElements[Math.floor(Math.random() * reactElements.length)];
      const item = { id, left, size, dur, text };
      setFloatingItems(prev => [...prev, item]);
      // remove after life (dur + small buffer)
      setTimeout(() => {
        setFloatingItems(prev => prev.filter(x => x.id !== id));
      }, (dur + 2) * 1000);
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  // --- component tree rendering based on progress
  const componentTreeHTML = useMemo(() => {
    const total = currentQuestions.length || 1;
    const progress = score / total;
    if (progress < 0.15) return "⚛️ App";
    if (progress < 0.3) return "⚛️ App<br>&nbsp;&nbsp;├─ 📦 Header";
    if (progress < 0.5) return "⚛️ App<br>&nbsp;&nbsp;├─ 📦 Header<br>&nbsp;&nbsp;└─ 📝 Content";
    if (progress < 0.7) return "⚛️ App<br>&nbsp;&nbsp;├─ 📦 Header<br>&nbsp;&nbsp;├─ 📝 Content<br>&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;└─ 🎯 Button";
    if (progress < 0.85) return "⚛️ App<br>&nbsp;&nbsp;├─ 📦 Header<br>&nbsp;&nbsp;├─ 📝 Content<br>&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;├─ 🎯 Button<br>&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;└─ 📋 List";
    return "⚛️ App<br>&nbsp;&nbsp;├─ 📦 Header<br>&nbsp;&nbsp;├─ 📝 Content<br>&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;├─ 🎯 Button<br>&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;├─ 📋 List<br>&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;└─ 🎨 Modal<br>&nbsp;&nbsp;└─ 🦶 Footer";
  }, [score, currentQuestions.length]);

  // --- create completion confetti
  function createConfetti() {
    const emojis = ['⚛️','🚀','✨','💫','🌟','⭐','🎉','🎊','📦','🔧','🎯','🎨'];
    for (let i = 0; i < 20; i++) {
      const id = Math.random().toString(36).slice(2);
      const left = Math.random() * 80 + 10;
      const top = Math.random() * 60 + 20;
      const color = `hsl(${Math.random()*60+180},80%,60%)`;
      const delay = Math.random() * 3;
      const text = emojis[Math.floor(Math.random() * emojis.length)];
      const item = { id, left, top, color, delay, text };
      setConfettiItems(prev => [...prev, item]);
      // auto remove after 6s
      setTimeout(() => {
        setConfettiItems(prev => prev.filter(x => x.id !== id));
      }, 7000);
    }
  }

  // --- syntax highlight function (very small, safe, for static snippets)
  function highlight(code) {
    if (!code) return null;
    // simple replacements (escape)
    let html = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    // keywords
    html = html
      .replace(/\b(function|const|return|useState|useEffect|useMemo|useCallback|useReducer|export|default|class|new)\b/g, '<span class="keyword">$1</span>')
      .replace(/(&lt;[^\s&]+&gt;|&lt;\/[^\s&]+&gt;)/g, '<span class="jsx">$1</span>')
      .replace(/(['"][^'"]*['"])/g, '<span class="string">$1</span>')
      .replace(/\b(useState|useEffect|useMemo|useCallback|useReducer|React\.memo)\b/g, '<span class="function">$1</span>');
    return html;
  }

  // --- helper for button class
  function btnClass(i) {
    if (!answered) return "rq-btn";
    const correct = currentQuestions[qIndex].correct;
    if (i === correct) return "rq-btn correct";
    if (i === selectedIndex && i !== correct) return "rq-btn incorrect";
    return "rq-btn";
  }

  // --- restart quiz
  function restart() {
    setScreen("difficulty");
    setCurrentDifficulty("");
    setCurrentQuestions([]);
    setQIndex(0);
    setScore(0);
    setAnswered(false);
    setSelectedIndex(null);
    setConfettiItems([]);
  }

  // --- render
  const currentQ = currentQuestions[qIndex];

  return (
    <>
      <div className="rq-body-bg" aria-hidden="true" />
      <div className="rq-container" role="main">
        <div className="rq-header">
          <h1 className="rq-title">⚛️ ReactJS Learning Quiz 🚀</h1>
          <p className="rq-sub">Build modern web apps with components and hooks!</p>
        </div>

        {screen === "difficulty" && (
          <>
            <div className="rq-card">
              <div className="rq-question-head">
                <span className="rq-q-emoji">🚀</span>
                <div className="rq-q-text">Choose Your React Level</div>
              </div>
              <div className="rq-difficulty">
                <button className="rq-diff-btn" onClick={() => startQuiz("beginner")}>🌱 Beginner (JSX & Components)</button>
                <button className="rq-diff-btn" onClick={() => startQuiz("intermediate")}>🏗️ Intermediate (State & Props)</button>
                <button className="rq-diff-btn" onClick={() => startQuiz("advanced")}>⚡ Advanced (Hooks & Patterns)</button>
              </div>
            </div>
          </>
        )}

        {screen === "quiz" && (
          <>
            <div className="rq-progress">
              <div className="rq-tree" dangerouslySetInnerHTML={{ __html: componentTreeHTML }} />
              <div className="rq-react-emoji">⚛️</div>
              <div className="rq-score">Progress: <strong>{score}</strong>/<span>{currentQuestions.length}</span></div>
            </div>

            <div className="rq-card">
              <div className="rq-question-head">
                <span className="rq-q-emoji" id="questionEmoji">{currentQ?.emoji}</span>
                <div className="rq-q-text" id="questionText">{currentQ?.question}</div>
              </div>

              {currentQ?.code && (
                <pre className="rq-code" dangerouslySetInnerHTML={{ __html: highlight(currentQ.code) }} />
              )}

              <div className="rq-answers" id="answersContainer">
                {currentQ?.answers.map((a, i) => (
                  <button key={i} className={btnClass(i)} onClick={() => handleSelect(i)} disabled={answered}>
                    {a}
                  </button>
                ))}
              </div>

              {answered ? (
                <button className="rq-next" onClick={handleNext}>Next Component →</button>
              ) : (
                <div style={{ height: 40 }} /> // placeholder to avoid layout jump
              )}
            </div>
          </>
        )}

        {screen === "complete" && (
          <div className="rq-complete">
            <h2>🎉 Congratulations, React Developer! 🎉</h2>
            <div className="rq-badge">⚛️🚀</div>
            <h3>Junior React Developer Badge Earned!</h3>
            <p>You coded your way to {score}/{currentQuestions.length} correct answers ({Math.round((score/currentQuestions.length)*100)}%)!</p>
            <p>You've mastered the fundamentals of React! Keep building! 🌟</p>
            <button className="rq-restart" onClick={restart}>Code Again 🔄</button>
          </div>
        )}

        {/* floating background elements (rendered by React) */}
        {floatingItems.map(item => (
          <div
            key={item.id}
            className="rq-floating"
            style={{
              left: `${item.left}%`,
              fontSize: `${item.size}px`,
              animationDuration: `${item.dur}s`,
            }}
            aria-hidden
          >
            {item.text}
          </div>
        ))}

        {/* confetti / jsx floating on completion */}
        {confettiItems.map(c => (
          <div
            key={c.id}
            className="rq-confetti"
            style={{
              left: `${c.left}%`,
              top: `${c.top}%`,
              color: c.color,
              animationDelay: `${c.delay}s`,
            }}
            aria-hidden
          >
            {c.text}
          </div>
        ))}
      </div>
    </>
  );
}
