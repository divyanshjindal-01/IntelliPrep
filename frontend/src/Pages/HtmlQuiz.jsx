import React, { useState, useEffect } from 'react';

// Questions data
const questions = {
  beginner: [
    {
      emoji: "📝",
      question: "What does HTML stand for?",
      code: null,
      answers: ["HyperText Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language", "High Tech Modern Language"],
      correct: 0
    },
    {
      emoji: "🏷️",
      question: "Which tag is used to create the largest heading?",
      code: null,
      answers: ["<h1>", "<h6>", "<header>", "<big>"],
      correct: 0
    },
    {
      emoji: "📄",
      question: "What will this HTML display?",
      code: '<p>Hello World!</p>',
      answers: ["Hello World! as a paragraph", "Hello World! as a heading", "Nothing", "An error"],
      correct: 0
    },
    {
      emoji: "🔗",
      question: "Which tag creates a link to another webpage?",
      code: null,
      answers: ["<a>", "<link>", "<url>", "<href>"],
      correct: 0
    },
    {
      emoji: "🖼️",
      question: "What tag is used to display an image?",
      code: null,
      answers: ["<img>", "<image>", "<picture>", "<photo>"],
      correct: 0
    }
  ],
  intermediate: [
    {
      emoji: "📋",
      question: "Which tag creates an unordered list?",
      code: '<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>',
      answers: ["<ul>", "<ol>", "<list>", "<items>"],
      correct: 0
    },
    {
      emoji: "📊",
      question: "What does this HTML create?",
      code: '<table>\n  <tr>\n    <td>Cell 1</td>\n    <td>Cell 2</td>\n  </tr>\n</table>',
      answers: ["A table with one row and two cells", "A list with two items", "Two paragraphs", "A form with two inputs"],
      correct: 0
    },
    {
      emoji: "📝",
      question: "Which tag creates a text input field?",
      code: '<form>\n  <input type="text" name="username">\n</form>',
      answers: ["<input>", "<textbox>", "<field>", "<text>"],
      correct: 0
    },
    {
      emoji: "🎨",
      question: "What attribute is used to add CSS styles directly to an element?",
      code: '<p style="color: blue;">Blue text</p>',
      answers: ["style", "css", "class", "design"],
      correct: 0
    },
    {
      emoji: "🏗️",
      question: "Which tag is used to group elements together?",
      code: '<div>\n  <p>Paragraph 1</p>\n  <p>Paragraph 2</p>\n</div>',
      answers: ["<div>", "<group>", "<section>", "<container>"],
      correct: 0
    },
    {
      emoji: "🔘",
      question: "What type of input creates radio buttons?",
      code: '<input type="radio" name="choice" value="A"> Option A\n<input type="radio" name="choice" value="B"> Option B',
      answers: ["radio", "button", "choice", "select"],
      correct: 0
    }
  ],
  advanced: [
    {
      emoji: "🎯",
      question: "What is the purpose of the 'alt' attribute in img tags?",
      code: '<img src="photo.jpg" alt="A beautiful sunset">',
      answers: ["Provides alternative text for accessibility", "Sets the image alignment", "Changes image size", "Adds a border"],
      correct: 0
    },
    {
      emoji: "📱",
      question: "Which meta tag makes a page mobile-responsive?",
      code: '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
      answers: ["viewport", "mobile", "responsive", "device"],
      correct: 0
    },
    {
      emoji: "🎪",
      question: "What does the 'semantic' in semantic HTML mean?",
      code: '<article>\n  <header><h1>Title</h1></header>\n  <section><p>Content</p></section>\n</article>',
      answers: ["Tags that describe the meaning of content", "Tags that style content", "Tags that add functionality", "Tags that are newer"],
      correct: 0
    },
    {
      emoji: "🔍",
      question: "Which attribute makes form fields required?",
      code: '<input type="email" name="email" required>',
      answers: ["required", "mandatory", "needed", "must"],
      correct: 0
    },
    {
      emoji: "🎬",
      question: "What does this HTML5 element do?",
      code: '<video controls>\n  <source src="movie.mp4" type="video/mp4">\n</video>',
      answers: ["Embeds a video with playback controls", "Creates a video link", "Downloads a video", "Streams live video"],
      correct: 0
    },
    {
      emoji: "🏷️",
      question: "What is the purpose of the 'data-*' attributes?",
      code: '<div data-user-id="123" data-role="admin">User Info</div>',
      answers: ["Store custom data in HTML elements", "Style elements with CSS", "Add JavaScript functionality", "Create database connections"],
      correct: 0
    },
    {
      emoji: "🎨",
      question: "Which HTML5 element is best for standalone content?",
      code: '<article>\n  <h2>Blog Post Title</h2>\n  <p>This is a complete blog post...</p>\n</article>',
      answers: ["<article>", "<section>", "<div>", "<content>"],
      correct: 0
    }
  ]
};

// Custom CSS for animations (Tailwind doesn't cover complex gradients/animations fully)
const globalStyles = `
  @import 'tailwindcss/base';
  @import 'tailwindcss/components';
  @import 'tailwindcss/utilities';

  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
    min-height: 100vh;
    color: #2d3748;
    overflow-x: hidden;
    position: relative;
  }

  .floating-tag {
    position: absolute;
    font-size: 16px;
    opacity: 0.25;
    animation: tagFloat 12s infinite linear;
    pointer-events: none;
    color: #4299e1;
    font-weight: bold;
    font-family: 'Courier New', monospace;
  }

  @keyframes tagFloat {
    0% {
      transform: translateY(100vh) rotate(0deg);
      opacity: 0;
    }
    10% {
      opacity: 0.3;
    }
    90% {
      opacity: 0.3;
    }
    100% {
      transform: translateY(-100px) rotate(20deg);
      opacity: 0;
    }
  }

  .badge-glow {
    animation: badgeGlow 2s infinite;
  }

  @keyframes badgeGlow {
    0%, 100% { transform: scale(1); box-shadow: 0 15px 40px rgba(255, 215, 0, 0.4); }
    50% { transform: scale(1.05); box-shadow: 0 20px 50px rgba(255, 215, 0, 0.6); }
  }

  .floating-confetti {
    position: absolute;
    font-size: 2rem;
    animation: confettiFloat 4s infinite ease-in-out;
    pointer-events: none;
  }

  @keyframes confettiFloat {
    0%, 100% { 
      transform: translateY(0) rotate(0deg); 
      opacity: 1; 
    }
    25% { 
      transform: translateY(-40px) rotate(90deg); 
      opacity: 0.8; 
    }
    50% { 
      transform: translateY(-20px) rotate(180deg); 
      opacity: 0.6; 
    }
    75% { 
      transform: translateY(-35px) rotate(270deg); 
      opacity: 0.8; 
    }
  }
`;

// Floating HTML Tags Component
const FloatingTags = () => {
  useEffect(() => {
    // const htmlTags = [
    //   '&lt;html&gt;', '&lt;head&gt;', '&lt;body&gt;', '&lt;div&gt;', '&lt;p&gt;', '&lt;h1&gt;', 
    //   '&lt;a&gt;', '&lt;img&gt;', '&lt;ul&gt;', '&lt;li&gt;', '&lt;form&gt;', '&lt;input&gt;',
    //   '&lt;table&gt;', '&lt;tr&gt;', '&lt;td&gt;', '&lt;span&gt;', '&lt;section&gt;', '&lt;article&gt;',
    //   '&lt;header&gt;', '&lt;footer&gt;', '&lt;nav&gt;', '&lt;main&gt;', '&lt;aside&gt;', '&lt;button&gt;'
    // ];
    
    const interval = setInterval(() => {
      const tag = document.createElement('div');
      tag.className = 'floating-tag';
      tag.innerHTML = htmlTags[Math.floor(Math.random() * htmlTags.length)];
      tag.style.left = Math.random() * 100 + '%';
      tag.style.animationDuration = (Math.random() * 6 + 10) + 's';
      tag.style.fontSize = (Math.random() * 8 + 14) + 'px';
      document.body.appendChild(tag);
      
      setTimeout(() => {
        tag.remove();
      }, 14000);
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  return null;
};

// Browser Progress Component
const BrowserProgress = ({ score, totalQuestions }) => {
  const progress = score / totalQuestions;

  useEffect(() => {
    const browserElement = document.getElementById('browserProgress');
    if (browserElement) {
      if (progress < 0.2) {
        browserElement.textContent = '🌐';
      } else if (progress < 0.4) {
        browserElement.textContent = '🌐📝';
      } else if (progress < 0.6) {
        browserElement.textContent = '🌐📝🖼️';
      } else if (progress < 0.8) {
        browserElement.textContent = '🌐📝🖼️🔗';
      } else {
        browserElement.textContent = '🌐📝🖼️🔗🎨';
      }
    }
  }, [progress]);

  return <div id="browserProgress" className="text-7xl transition-all duration-600 drop-shadow-xl">🌐</div>;
};

// Code Block Component
const CodeBlock = ({ code }) => {
  if (!code) return null;

  const formatCode = (codeStr) => {
    return codeStr
      .replace(/</g, '<span class="text-blue-400">&lt;')
      .replace(/>/g, '&gt;</span>')
      .replace(/="([^"]*)"/g, '=<span class="text-orange-400">"$1"</span>');
  };

  return (
    <div 
      className="bg-gray-900 border-2 border-gray-600 rounded-xl p-5 my-5 font-mono text-green-400 overflow-x-auto text-base" 
      dangerouslySetInnerHTML={{ __html: formatCode(code) }}
    />
  );
};

// Question Component
const QuestionComp = ({ question, onAnswer, answered, selectedAnswer }) => {
  return (
    <div className="bg-white/95 text-gray-800 p-9 rounded-3xl mb-6 shadow-2xl border-2 border-gray-300 transition-all duration-300">
      <div className="flex items-center gap-5 mb-6">
        <span className="text-6xl drop-shadow-lg">{question.emoji}</span>
        <span className="text-2xl font-bold flex-1 text-blue-600">{question.question}</span>
      </div>
      
      <CodeBlock code={question.code} />
      
      <div className="grid gap-4 mb-6">
        {question.answers.map((answer, index) => {
          let className = 'p-4.5 px-6 border-2 border-gray-300 rounded-2xl bg-white text-gray-800 text-left text-lg cursor-pointer transition-all duration-300 hover:border-blue-500 hover:bg-blue-50 hover:translate-x-2 hover:shadow-lg';
          if (answered) {
            if (index === question.correct) {
              className += ' bg-green-500 text-white border-green-600 shadow-lg shadow-green-400/40';
            } else if (index === selectedAnswer && index !== question.correct) {
              className += ' bg-red-500 text-white border-red-600 shadow-lg shadow-red-400/40';
            }
          }
          
          return (
            <button
              key={index}
              className={className}
              onClick={() => !answered && onAnswer(index)}
              disabled={answered}
              dangerouslySetInnerHTML={{ __html: answer }}
            />
          );
        })}
      </div>
    </div>
  );
};

// Completion Screen Component
const CompletionScreen = ({ score, totalQuestions, onRestart }) => {
  const percentage = Math.round((score / totalQuestions) * 100);

  useEffect(() => {
    const confetti = ['🎉', '🎊', '✨', '⭐', '🌟', '💫', '🎈', '🎁', '🏆', '🥇'];
    const container = document.querySelector('.completion-screen');
    
    if (container) {
      for (let i = 0; i < 15; i++) {
        setTimeout(() => {
          const piece = document.createElement('div');
          piece.className = 'floating-confetti';
          piece.textContent = confetti[Math.floor(Math.random() * confetti.length)];
          piece.style.left = Math.random() * 80 + 10 + '%';
          piece.style.top = Math.random() * 60 + 20 + '%';
          piece.style.animationDelay = Math.random() * 2 + 's';
          piece.style.color = `hsl(${Math.random() * 360}, 70%, 60%)`;
          container.appendChild(piece);
        }, i * 120);
      }

      return () => {
        const floatingConfetti = container.querySelectorAll('.floating-confetti');
        floatingConfetti.forEach(el => el.remove());
      };
    }
  }, []);

  return (
    <div className="completion-screen text-center bg-white/95 text-gray-800 p-12 rounded-3xl relative overflow-hidden border-3 border-blue-500">
      <h2 className="text-3xl mb-6">🎉 Congratulations, Web Builder! 🎉</h2>
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-300 text-gray-800 p-6 rounded-full text-6xl mx-auto w-36 h-36 flex items-center justify-center shadow-2xl shadow-yellow-400/40 badge-glow mb-6">
        🌐📝🎨
      </div>
      <h3 className="text-2xl mb-4">Junior Web Builder Badge Earned!</h3>
      <p className="text-xl mb-4">You built your way to {score}/{totalQuestions} correct answers ({percentage}%)!</p>
      <p className="text-lg mb-6">You've mastered the fundamentals of HTML! Keep building! 🌟</p>
      <button 
        className="bg-gradient-to-r from-green-500 to-green-600 text-white border-none p-4.5 px-10 rounded-3xl text-xl font-bold cursor-pointer mt-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg shadow-green-300/30" 
        onClick={onRestart}
      >
        Build Again 🔄
      </button>
    </div>
  );
};

// Main Quiz App Component
const HTMLQuizApp = () => {
  const [currentScreen, setCurrentScreen] = useState('difficulty'); // 'difficulty', 'quiz', 'completion'
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const startQuiz = (difficulty) => {
    setCurrentQuestions([...questions[difficulty]]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
    setCurrentScreen('quiz');
  };

  const handleAnswer = (answerIndex) => {
    if (answered) return;
    
    setAnswered(true);
    setSelectedAnswer(answerIndex);
    
    if (answerIndex === currentQuestions[currentQuestionIndex].correct) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex + 1 >= currentQuestions.length) {
      setCurrentScreen('completion');
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setAnswered(false);
      setSelectedAnswer(null);
    }
  };

  const restartQuiz = () => {
    setCurrentScreen('difficulty');
    setCurrentQuestions([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
  };

  return (
    <>
      <style>{globalStyles}</style>
      <FloatingTags />
      <div className="max-w-6xl mx-auto p-5 relative z-10 mt-20">
        <div className="text-center mb-8 bg-white/95 p-6 rounded-3xl shadow-xl border-3 border-blue-500">
          <h1 className="text-6xl mb-2.5 text-blue-600 drop-shadow-lg">🌐 HTML Learning Quiz 📝</h1>
          <p className="text-2xl text-gray-600 opacity-90">Build your web development skills, one tag at a time!</p>
        </div>

        {currentScreen === 'difficulty' && (
          <div className="bg-white/95 text-gray-800 p-9 rounded-3xl shadow-2xl border-2 border-gray-300">
            <div className="flex items-center justify-center gap-5 mb-6">
              <span className="text-6xl drop-shadow-lg">🚀</span>
              <span className="text-2xl font-bold text-gray-800">Choose Your Learning Level</span>
            </div>
            <div className="flex gap-4 justify-center mb-8 flex-wrap">
              <button 
                className="p-4 px-8 border-3 border-blue-500 rounded-3xl text-lg font-bold cursor-pointer transition-all duration-300 bg-white/90 text-blue-600 hover:bg-blue-500 hover:text-white hover:-translate-y-1 hover:shadow-lg shadow-blue-300/30"
                onClick={() => startQuiz('beginner')}
              >
                🌱 Beginner (First Tags)
              </button>
              <button 
                className="p-4 px-8 border-3 border-blue-500 rounded-3xl text-lg font-bold cursor-pointer transition-all duration-300 bg-white/90 text-blue-600 hover:bg-blue-500 hover:text-white hover:-translate-y-1 hover:shadow-lg shadow-blue-300/30"
                onClick={() => startQuiz('intermediate')}
              >
                🏗️ Intermediate (Page Builder)
              </button>
              <button 
                className="p-4 px-8 border-3 border-blue-500 rounded-3xl text-lg font-bold cursor-pointer transition-all duration-300 bg-white/90 text-blue-600 hover:bg-blue-500 hover:text-white hover:-translate-y-1 hover:shadow-lg shadow-blue-300/30"
                onClick={() => startQuiz('advanced')}
              >
                🎨 Advanced (Web Designer)
              </button>
            </div>
          </div>
        )}

        {currentScreen === 'quiz' && (
          <>
            <div className="flex justify-between items-center bg-white/90 p-5 rounded-3xl mb-6 shadow-lg border-2 border-gray-300">
              <BrowserProgress score={score} totalQuestions={currentQuestions.length} />
              <div className="text-xl font-bold text-blue-600">
                Progress: {score}/{currentQuestions.length}
              </div>
            </div>

            <QuestionComp
              question={currentQuestions[currentQuestionIndex]}
              onAnswer={handleAnswer}
              answered={answered}
              selectedAnswer={selectedAnswer}
            />

            {answered && (
              <button 
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none p-4 px-9 rounded-3xl text-lg font-bold cursor-pointer float-right transition-all duration-300 hover:-translate-y-1 hover:shadow-xl shadow-blue-300/30" 
                onClick={nextQuestion}
              >
                Next Challenge →
              </button>
            )}
          </>
        )}

        {currentScreen === 'completion' && (
          <CompletionScreen
            score={score}
            totalQuestions={currentQuestions.length}
            onRestart={restartQuiz}
          />
        )}
      </div>
    </>
  );
};

export default HTMLQuizApp;