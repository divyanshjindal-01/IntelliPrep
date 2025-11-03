import React, { useState, useEffect } from 'react';

// Questions data
const questions = {
  beginner: [
    {
      emoji: "📝",
      question: "How do you display 'Hello World' in the browser console?",
      code: null,
      answers: ["console.log('Hello World')", "print('Hello World')", "echo('Hello World')", "display('Hello World')"],
      correct: 0
    },
    {
      emoji: "🔢",
      question: "What will this code output?",
      code: "let x = 5;\nlet y = 3;\nconsole.log(x + y);",
      answers: ["8", "53", "5 + 3", "undefined"],
      correct: 0
    },
    {
      emoji: "📦",
      question: "Which keyword is used to declare a variable in modern JavaScript?",
      code: null,
      answers: ["let", "var", "variable", "declare"],
      correct: 0
    },
    {
      emoji: "🔤",
      question: "What data type is 'Hello World'?",
      code: null,
      answers: ["string", "number", "boolean", "object"],
      correct: 0
    },
    {
      emoji: "❓",
      question: "What will this condition evaluate to?",
      code: "if (5 > 3) {\n  console.log('True!');\n}",
      answers: ["True!", "False", "5", "3"],
      correct: 0
    }
  ],
  intermediate: [
    {
      emoji: "🔄",
      question: "What will this loop output?",
      code: "for (let i = 0; i < 3; i++) {\n  console.log(i);\n}",
      answers: ["0, 1, 2", "1, 2, 3", "0, 1, 2, 3", "1, 2"],
      correct: 0
    },
    {
      emoji: "📋",
      question: "How do you add an item to the end of an array?",
      code: "let fruits = ['apple', 'banana'];",
      answers: ["fruits.push('orange')", "fruits.add('orange')", "fruits.append('orange')", "fruits.insert('orange')"],
      correct: 0
    },
    {
      emoji: "⚡",
      question: "What is the result of this function call?",
      code: "function multiply(a, b) {\n  return a * b;\n}\nconsole.log(multiply(4, 5));",
      answers: ["20", "9", "45", "undefined"],
      correct: 0
    },
    {
      emoji: "🎯",
      question: "What will this code log?",
      code: "let obj = { name: 'John', age: 25 };\nconsole.log(obj.name);",
      answers: ["John", "25", "name", "undefined"],
      correct: 0
    },
    {
      emoji: "🔍",
      question: "What does the === operator check for?",
      code: null,
      answers: ["Strict equality (value and type)", "Only value", "Only type", "Assignment"],
      correct: 0
    },
    {
      emoji: "🎪",
      question: "What will this ternary operator return?",
      code: "let result = (10 > 5) ? 'Yes' : 'No';\nconsole.log(result);",
      answers: ["Yes", "No", "true", "false"],
      correct: 0
    }
  ],
  advanced: [
    {
      emoji: "🏹",
      question: "What will this arrow function return?",
      code: "const add = (a, b) => a + b;\nconsole.log(add(3, 7));",
      answers: ["10", "37", "undefined", "function"],
      correct: 0
    },
    {
      emoji: "🔄",
      question: "What will this code output?",
      code: "console.log(typeof null);",
      answers: ["object", "null", "undefined", "boolean"],
      correct: 0
    },
    {
      emoji: "⏰",
      question: "What happens with this setTimeout?",
      code: "console.log('1');\nsetTimeout(() => console.log('2'), 0);\nconsole.log('3');",
      answers: ["1, 3, 2", "1, 2, 3", "2, 1, 3", "3, 2, 1"],
      correct: 0
    },
    {
      emoji: "📦",
      question: "What will destructuring assignment do here?",
      code: "const [a, b] = [1, 2, 3];\nconsole.log(a, b);",
      answers: ["1 2", "1 2 3", "[1, 2]", "undefined"],
      correct: 0
    },
    {
      emoji: "🎭",
      question: "What will this closure return?",
      code: "function outer() {\n  let x = 10;\n  return function() { return x; };\n}\nconst inner = outer();\nconsole.log(inner());",
      answers: ["10", "undefined", "function", "error"],
      correct: 0
    },
    {
      emoji: "🌟",
      question: "What will the spread operator do here?",
      code: "const arr1 = [1, 2];\nconst arr2 = [...arr1, 3, 4];\nconsole.log(arr2);",
      answers: ["[1, 2, 3, 4]", "[1, 2, [3, 4]]", "[[1, 2], 3, 4]", "error"],
      correct: 0
    },
    {
      emoji: "🔮",
      question: "What will this Promise resolve to?",
      code: "Promise.resolve(42)\n  .then(x => x * 2)\n  .then(console.log);",
      answers: ["84", "42", "Promise", "undefined"],
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
    font-family: 'Courier New', monospace;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    min-height: 100vh;
    color: #e0e6ed;
    overflow-x: hidden;
    position: relative;
  }

  .floating-code {
    position: absolute;
    font-size: 18px;
    opacity: 0.2;
    animation: codeFloat 10s infinite linear;
    pointer-events: none;
    color: #64ffda;
    font-weight: bold;
  }

  @keyframes codeFloat {
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
      transform: translateY(-100px) rotate(15deg);
      opacity: 0;
    }
  }

  .badge-pulse {
    animation: badgePulse 2s infinite;
  }

  @keyframes badgePulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.08); }
  }

  .floating-pixel {
    position: absolute;
    font-size: 1.5rem;
    animation: pixelFloat 4s infinite ease-in-out;
    pointer-events: none;
  }

  @keyframes pixelFloat {
    0%, 100% { 
      transform: translateY(0) rotate(0deg); 
      opacity: 1; 
    }
    25% { 
      transform: translateY(-30px) rotate(90deg); 
      opacity: 0.8; 
    }
    50% { 
      transform: translateY(-15px) rotate(180deg); 
      opacity: 0.6; 
    }
    75% { 
      transform: translateY(-25px) rotate(270deg); 
      opacity: 0.8; 
    }
  }
`;

// Floating Code Elements Component
const FloatingCode = () => {
  useEffect(() => {
    // const codeElements = [
    //   '{ }', '[ ]', '=>', 'function()', 'const', 'let', 'if()', 'for()', 
    //   '===', '!==', '&&', '||', 'return', 'console.log()', '.map()', '.filter()',
    //   'async', 'await', 'Promise', 'setTimeout()', 'JSON.parse()', 'typeof'
    // ];
    
    const interval = setInterval(() => {
      const code = document.createElement('div');
      code.className = 'floating-code';
      code.textContent = codeElements[Math.floor(Math.random() * codeElements.length)];
      code.style.left = Math.random() * 100 + '%';
      code.style.animationDuration = (Math.random() * 6 + 8) + 's';
      code.style.fontSize = (Math.random() * 10 + 14) + 'px';
      document.body.appendChild(code);
      
      setTimeout(() => {
        code.remove();
      }, 12000);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return null;
};

// Laptop Progress Component
const LaptopProgress = ({ score, totalQuestions }) => {
  const progress = score / totalQuestions;

  useEffect(() => {
    const laptopElement = document.getElementById('laptopProgress');
    if (laptopElement) {
      if (progress < 0.25) {
        laptopElement.textContent = '💻';
      } else if (progress < 0.5) {
        laptopElement.textContent = '💻✨';
      } else if (progress < 0.75) {
        laptopElement.textContent = '🖥️⚡';
      } else {
        laptopElement.textContent = '🖥️⚡🔥';
      }
    }
  }, [progress]);

  return <div id="laptopProgress" className="text-7xl transition-all duration-600 drop-shadow-2xl">💻</div>;
};

// Code Block Component
const CodeBlock = ({ code }) => {
  if (!code) return null;

  return (
    <div 
      className="bg-gray-900 border border-gray-600 rounded-lg p-4 my-4 font-mono text-teal-400 overflow-x-auto" 
    >
      <pre>{code}</pre>
    </div>
  );
};

// Question Component
const QuestionComp = ({ question, onAnswer, answered, selectedAnswer }) => {
  return (
    <div className="bg-black/40 text-gray-200 p-9 rounded-3xl mb-6 shadow-2xl border border-teal-500/20 transition-all duration-300">
      <div className="flex items-center gap-5 mb-6">
        <span className="text-6xl drop-shadow-2xl filter drop-shadow-[0_0_10px_rgba(255,193,7,0.5)]">{question.emoji}</span>
        <span className="text-2xl font-bold flex-1 text-teal-400">{question.question}</span>
      </div>
      
      <CodeBlock code={question.code} />
      
      <div className="grid gap-4 mb-6">
        {question.answers.map((answer, index) => {
          let className = 'p-4.5 px-6 border-2 border-gray-600 rounded-2xl bg-black/30 text-gray-200 text-left text-lg cursor-pointer transition-all duration-300 hover:border-teal-400 hover:bg-teal-500/10 hover:translate-x-2 hover:shadow-lg font-mono';
          if (answered) {
            if (index === question.correct) {
              className += ' bg-green-600 text-white border-green-600 shadow-lg shadow-green-500/40';
            } else if (index === selectedAnswer && index !== question.correct) {
              className += ' bg-red-600 text-white border-red-600 shadow-lg shadow-red-500/40';
            }
          }
          
          return (
            <button
              key={index}
              className={className}
              onClick={() => !answered && onAnswer(index)}
              disabled={answered}
            >
              {answer}
            </button>
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
    const pixels = ['🎉', '✨', '⭐', '🌟', '💫', '🎊', '🔥', '⚡'];
    const container = document.querySelector('.completion-screen');
    
    if (container) {
      for (let i = 0; i < 12; i++) {
        setTimeout(() => {
          const pixel = document.createElement('div');
          pixel.className = 'floating-pixel';
          pixel.textContent = pixels[Math.floor(Math.random() * pixels.length)];
          pixel.style.left = Math.random() * 80 + 10 + '%';
          pixel.style.top = Math.random() * 60 + 20 + '%';
          pixel.style.animationDelay = Math.random() * 2 + 's';
          pixel.style.color = `hsl(${Math.random() * 360}, 70%, 60%)`;
          container.appendChild(pixel);
        }, i * 150);
      }

      return () => {
        const floatingPixels = container.querySelectorAll('.floating-pixel');
        floatingPixels.forEach(el => el.remove());
      };
    }
  }, []);

  return (
    <div className="completion-screen text-center bg-black/40 text-gray-200 p-12 rounded-3xl relative overflow-hidden border border-teal-500/30">
      <h2 className="text-3xl mb-6">🎉 Congratulations, Coder! 🎉</h2>
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-300 text-gray-900 p-6 rounded-full text-6xl mx-auto w-36 h-36 flex items-center justify-center shadow-2xl shadow-yellow-400/40 badge-pulse mb-6">
        💻⚡🚀
      </div>
      <h3 className="text-2xl mb-4">Junior JavaScript Developer Badge Earned!</h3>
      <p className="text-xl mb-4">You coded your way to {score}/{totalQuestions} correct answers ({percentage}%)!</p>
      <p className="text-lg mb-6">You've mastered the fundamentals of JavaScript! Keep coding! 🌟</p>
      <button 
        className="bg-gradient-to-r from-green-600 to-green-700 text-white border-none p-4.5 px-10 rounded-3xl text-xl font-bold cursor-pointer mt-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg shadow-green-500/30 font-mono" 
        onClick={onRestart}
      >
        Code Again 🔄
      </button>
    </div>
  );
};

// Main Quiz App Component
const JSQuizApp = () => {
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
      <FloatingCode />
      <div className="max-w-6xl mx-auto p-5 relative z-10 mt-24 max-h-[85vh] overflow-y-auto ">
        <div className="text-center mb-8 bg-teal-400/10 p-6 rounded-3xl backdrop-blur-lg border border-teal-500/20 ">
          <h1 className="text-6xl mb-2.5 text-teal-400 drop-shadow-2xl" style={{ textShadow: '0 0 20px rgba(100, 255, 218, 0.5)' }}>💻 JavaScript Quiz Challenge ⚡</h1>
          <p className="text-2xl text-gray-400 opacity-90">Master the language of the web, one question at a time!</p>
        </div>

        {currentScreen === 'difficulty' && (
          <div className="bg-black/40 text-gray-200 p-9 rounded-3xl shadow-2xl border border-teal-500/20">
            <div className="flex items-center justify-center gap-5 mb-6">
              <span className="text-6xl drop-shadow-lg">🚀</span>
              <span className="text-2xl font-bold text-gray-200">Choose Your Coding Level</span>
            </div>
            <div className="flex gap-4 justify-center mb-8 flex-wrap">
              <button 
                className="p-4 px-8 border-2 border-teal-400 rounded-3xl text-lg font-bold cursor-pointer transition-all duration-300 bg-teal-400/10 text-teal-400 hover:bg-teal-400/20 hover:-translate-y-1 hover:shadow-lg font-mono" 
                onClick={() => startQuiz('beginner')}
              >
                💻 Beginner (Hello World!)
              </button>
              <button 
                className="p-4 px-8 border-2 border-teal-400 rounded-3xl text-lg font-bold cursor-pointer transition-all duration-300 bg-teal-400/10 text-teal-400 hover:bg-teal-400/20 hover:-translate-y-1 hover:shadow-lg font-mono" 
                onClick={() => startQuiz('intermediate')}
              >
                ⚡ Intermediate (Code Warrior)
              </button>
              <button 
                className="p-4 px-8 border-2 border-teal-400 rounded-3xl text-lg font-bold cursor-pointer transition-all duration-300 bg-teal-400/10 text-teal-400 hover:bg-teal-400/20 hover:-translate-y-1 hover:shadow-lg font-mono" 
                onClick={() => startQuiz('advanced')}
              >
                🔥 Advanced (JS Ninja)
              </button>
            </div>
          </div>
        )}

        {currentScreen === 'quiz' && (
          <>
            <div className="flex justify-between items-center bg-black/30 p-5 rounded-3xl mb-6 shadow-xl border border-teal-500/30 ">
              <LaptopProgress score={score} totalQuestions={currentQuestions.length} />
              <div className="text-xl font-bold text-teal-400" style={{ textShadow: '0 0 10px rgba(100, 255, 218, 0.3)' }}>
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
                className="bg-gradient-to-r from-teal-400 to-teal-300 text-gray-900 border-none p-4 px-9 rounded-3xl text-lg font-bold cursor-pointer float-right transition-all duration-300 hover:-translate-y-1 hover:shadow-xl shadow-teal-400/30 font-mono" 
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

export default JSQuizApp;