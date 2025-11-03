import React, { useState, useEffect } from 'react';

// Questions data
const questions = {
  beginner: [
    {
      emoji: "🌈",
      question: "How do you change the text color to red in CSS?",
      code: null,
      answers: ["color: red;", "text-color: red;", "font-color: red;", "red: color;"],
      correct: 0
    },
    {
      emoji: "📝",
      question: "What will this CSS rule do?",
      code: "p {\n  font-size: 20px;\n}",
      answers: ["Make all paragraphs 20 pixels tall", "Make all paragraphs 20 pixels wide", "Make paragraph text 20 pixels in size", "Add 20 pixels of space around paragraphs"],
      correct: 2
    },
    {
      emoji: "🎯",
      question: "Which property controls the background color?",
      code: null,
      answers: ["background-color", "bg-color", "color-background", "back-color"],
      correct: 0
    },
    {
      emoji: "📏",
      question: "What does 'margin' control in CSS?",
      code: null,
      answers: ["Space outside an element", "Space inside an element", "The element's width", "The element's height"],
      correct: 0
    },
    {
      emoji: "🔤",
      question: "How do you make text bold?",
      code: null,
      answers: ["font-weight: bold;", "text-style: bold;", "font-bold: true;", "bold: yes;"],
      correct: 0
    }
  ],
  intermediate: [
    {
      emoji: "📦",
      question: "What does this CSS create?",
      code: ".container {\n  display: flex;\n  justify-content: center;\n}",
      answers: ["Centers items horizontally in a flex container", "Centers items vertically", "Makes items flexible", "Creates a container"],
      correct: 0
    },
    {
      emoji: "🎭",
      question: "What is the difference between margin and padding?",
      code: ".box {\n  margin: 10px;\n  padding: 20px;\n}",
      answers: ["Margin is outside space, padding is inside space", "Margin is inside space, padding is outside space", "They are the same thing", "Margin affects width, padding affects height"],
      correct: 0
    },
    {
      emoji: "🎨",
      question: "What will this hover effect do?",
      code: ".button:hover {\n  background-color: blue;\n  transform: scale(1.1);\n}",
      answers: ["Change color to blue and make 10% larger on hover", "Change color to blue and move 1.1 pixels", "Only change the color", "Only make it larger"],
      correct: 0
    },
    {
      emoji: "📱",
      question: "What does this media query target?",
      code: "@media (max-width: 768px) {\n  .text { font-size: 14px; }\n}",
      answers: ["Screens 768px wide or smaller", "Screens exactly 768px wide", "Screens larger than 768px", "All screens"],
      correct: 0
    },
    {
      emoji: "🏗️",
      question: "What layout system does this use?",
      code: ".grid {\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n}",
      answers: ["CSS Grid with 3 equal columns", "Flexbox with 3 columns", "Table layout", "Block layout"],
      correct: 0
    },
    {
      emoji: "🎪",
      question: "What does 'position: absolute' do?",
      code: ".popup {\n  position: absolute;\n  top: 50px;\n  left: 100px;\n}",
      answers: ["Positions element relative to nearest positioned parent", "Positions element relative to viewport", "Makes element stick to scroll", "Removes element from layout"],
      correct: 0
    }
  ],
  advanced: [
    {
      emoji: "✨",
      question: "What animation will this create?",
      code: "@keyframes slideIn {\n  from { transform: translateX(-100%); }\n  to { transform: translateX(0); }\n}",
      answers: ["Slides element in from the left", "Slides element in from the right", "Slides element up", "Slides element down"],
      correct: 0
    },
    {
      emoji: "🌟",
      question: "What does this CSS variable syntax do?",
      code: ":root {\n  --main-color: #3498db;\n}\n.text {\n  color: var(--main-color);\n}",
      answers: ["Defines and uses a reusable color variable", "Creates a color animation", "Sets a default color", "Makes color responsive"],
      correct: 0
    },
    {
      emoji: "🎭",
      question: "What will this transition create?",
      code: ".card {\n  transition: all 0.3s ease-in-out;\n}\n.card:hover {\n  transform: rotateY(180deg);\n}",
      answers: ["Smooth 3D flip animation on hover", "2D rotation", "Scale animation", "Color transition"],
      correct: 0
    },
    {
      emoji: "🔮",
      question: "What does this gradient create?",
      code: "background: linear-gradient(45deg, #ff6b6b, #4ecdc4);",
      answers: ["Diagonal gradient from red to teal", "Horizontal gradient", "Vertical gradient", "Radial gradient"],
      correct: 0
    },
    {
      emoji: "🎪",
      question: "What layout behavior does this create?",
      code: ".container {\n  display: grid;\n  grid-template-areas:\n    'header header'\n    'sidebar main';\n}",
      answers: ["Named grid areas for complex layouts", "Simple 2x2 grid", "Flexbox layout", "Table layout"],
      correct: 0
    },
    {
      emoji: "🌈",
      question: "What does this CSS filter do?",
      code: ".image {\n  filter: blur(5px) brightness(1.2) saturate(1.5);\n}",
      answers: ["Applies blur, brightness, and saturation effects", "Only blurs the image", "Only changes brightness", "Creates a rainbow effect"],
      correct: 0
    },
    {
      emoji: "⚡",
      question: "What performance optimization does this provide?",
      code: ".animated {\n  will-change: transform;\n  transform: translateZ(0);\n}",
      answers: ["Forces GPU acceleration for smoother animations", "Prevents animations", "Slows down animations", "Changes animation direction"],
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
    background: linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 25%, #45b7d1 50%, #96ceb4 75%, #ffeaa7 100%);
    background-size: 400% 400%;
    animation: gradientShift 8s ease infinite;
    min-height: 100vh;
    color: #2d3436;
    overflow-x: hidden;
    position: relative;
  }

  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .floating-property {
    position: absolute;
    font-size: 14px;
    opacity: 0.3;
    animation: propertyFloat 15s infinite linear;
    pointer-events: none;
    color: #2d3436;
    font-weight: bold;
    font-family: 'Courier New', monospace;
    background: rgba(255, 255, 255, 0.8);
    padding: 4px 8px;
    border-radius: 4px;
    border: 1px solid rgba(0,0,0,0.1);
  }

  @keyframes propertyFloat {
    0% {
      transform: translateY(100vh) rotate(0deg);
      opacity: 0;
    }
    10% {
      opacity: 0.4;
    }
    90% {
      opacity: 0.4;
    }
    100% {
      transform: translateY(-100px) rotate(25deg);
      opacity: 0;
    }
  }

  .badge-sparkle {
    animation: badgeSparkle 2s infinite;
  }

  @keyframes badgeSparkle {
    0%, 100% { 
      transform: scale(1) rotate(0deg); 
      box-shadow: 0 15px 40px rgba(255, 215, 0, 0.4); 
    }
    50% { 
      transform: scale(1.05) rotate(5deg); 
      box-shadow: 0 20px 50px rgba(255, 215, 0, 0.6); 
    }
  }

  .floating-sparkle {
    position: absolute;
    font-size: 1.5rem;
    animation: sparkleFloat 5s infinite ease-in-out;
    pointer-events: none;
  }

  @keyframes sparkleFloat {
    0%, 100% { 
      transform: translateY(0) rotate(0deg) scale(1); 
      opacity: 1; 
    }
    25% { 
      transform: translateY(-30px) rotate(90deg) scale(1.2); 
      opacity: 0.8; 
    }
    50% { 
      transform: translateY(-15px) rotate(180deg) scale(0.8); 
      opacity: 0.6; 
    }
    75% { 
      transform: translateY(-25px) rotate(270deg) scale(1.1); 
      opacity: 0.9; 
    }
  }
`;

// Floating CSS Properties Component
const FloatingProperties = () => {
  useEffect(() => {
    // const cssProperties = [
    //   'color:', 'background:', 'margin:', 'padding:', 'display:', 'position:', 
    //   'width:', 'height:', 'font-size:', 'border:', 'flex:', 'grid:', 
    //   'transform:', 'animation:', 'transition:', 'opacity:', 'z-index:', 'overflow:',
    //   'box-shadow:', 'border-radius:', 'text-align:', 'justify-content:', 'align-items:', 'gap:'
    // ];
    
    const interval = setInterval(() => {
      const property = document.createElement('div');
      property.className = 'floating-property';
      property.textContent = cssProperties[Math.floor(Math.random() * cssProperties.length)];
      property.style.left = Math.random() * 100 + '%';
      property.style.animationDuration = (Math.random() * 8 + 12) + 's';
      property.style.fontSize = (Math.random() * 6 + 12) + 'px';
      document.body.appendChild(property);
      
      setTimeout(() => {
        property.remove();
      }, 16000);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return null;
};

// Canvas Progress Component
const CanvasProgress = ({ score, totalQuestions }) => {
  const progress = score / totalQuestions;

  useEffect(() => {
    const canvasElement = document.getElementById('canvasProgress');
    if (canvasElement) {
      if (progress < 0.15) {
        canvasElement.textContent = '🟥';
        canvasElement.style.background = '#ddd';
        canvasElement.style.border = '2px solid #999';
      } else if (progress < 0.3) {
        canvasElement.textContent = '🌈';
        canvasElement.style.background = 'linear-gradient(45deg, #ff6b6b, #4ecdc4)';
        canvasElement.style.border = '3px solid #e17055';
      } else if (progress < 0.5) {
        canvasElement.textContent = '🎨';
        canvasElement.style.background = 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1)';
        canvasElement.style.border = '3px solid #e17055';
        canvasElement.style.borderRadius = '15px';
      } else if (progress < 0.7) {
        canvasElement.textContent = '✨';
        canvasElement.style.background = 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4)';
        canvasElement.style.border = '4px dashed #e17055';
        canvasElement.style.borderRadius = '20px';
        canvasElement.style.boxShadow = '0 5px 15px rgba(225, 112, 85, 0.3)';
      } else {
        canvasElement.textContent = '🎭';
        canvasElement.style.background = 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7)';
        canvasElement.style.border = '4px solid #e17055';
        canvasElement.style.borderRadius = '25px';
        canvasElement.style.boxShadow = '0 10px 25px rgba(225, 112, 85, 0.4)';
        canvasElement.style.animation = 'badgeSparkle 2s infinite';
      }
    }
  }, [progress]);

  return <div id="canvasProgress" className="w-30 h-20 transition-all duration-800 rounded-lg flex items-center justify-center text-xl font-bold relative overflow-hidden" style={{ width: '120px', height: '80px' }}>🟥</div>;
};

// Code Block Component
const CodeBlock = ({ code }) => {
  if (!code) return null;

  const formatCode = (codeStr) => {
    return codeStr
      .replace(/([\w-]+):/g, '<span class="text-blue-400">$1</span>:')
      .replace(/:\s*([^;]+);/g, ': <span class="text-pink-400">$1</span>;')
      .replace(/^(\.[a-zA-Z-]+|\w+)/gm, '<span class="text-yellow-400">$1</span>');
  };

  return (
    <div 
      className="bg-gray-800 border-2 border-gray-600 rounded-xl p-5 my-5 font-mono text-gray-300 overflow-x-auto text-base" 
      dangerouslySetInnerHTML={{ __html: formatCode(code) }}
    />
  );
};

// Question Component
const QuestionComp = ({ question, onAnswer, answered, selectedAnswer }) => {
  return (
    <div className="bg-white/95 text-gray-800 p-9 rounded-3xl mb-6 shadow-2xl border-2 border-pink-300 transition-all duration-300">
      <div className="flex items-center gap-5 mb-6">
        <span className="text-6xl drop-shadow-lg">{question.emoji}</span>
        <span className="text-2xl font-bold flex-1 text-pink-500">{question.question}</span>
      </div>
      
      <CodeBlock code={question.code} />
      
      <div className="grid gap-4 mb-6">
        {question.answers.map((answer, index) => {
          let className = 'p-4.5 px-6 border-2 border-gray-300 rounded-2xl bg-white text-gray-800 text-left text-lg cursor-pointer transition-all duration-300 hover:border-pink-500 hover:bg-yellow-100 hover:translate-x-2 hover:shadow-lg';
          if (answered) {
            if (index === question.correct) {
              className += ' bg-teal-500 text-white border-teal-600 shadow-lg shadow-teal-400/40';
            } else if (index === selectedAnswer && index !== question.correct) {
              className += ' bg-pink-500 text-white border-pink-600 shadow-lg shadow-pink-400/40';
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
    const sparkles = ['✨', '🌟', '⭐', '💫', '🎨', '🌈', '🎭', '🎪', '🎉', '🎊'];
    const container = document.querySelector('.completion-screen');
    
    if (container) {
      for (let i = 0; i < 18; i++) {
        setTimeout(() => {
          const sparkle = document.createElement('div');
          sparkle.className = 'floating-sparkle';
          sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
          sparkle.style.left = Math.random() * 80 + 10 + '%';
          sparkle.style.top = Math.random() * 60 + 20 + '%';
          sparkle.style.animationDelay = Math.random() * 3 + 's';
          sparkle.style.color = `hsl(${Math.random() * 360}, 80%, 60%)`;
          container.appendChild(sparkle);
        }, i * 100);
      }

      return () => {
        const floatingSparkles = container.querySelectorAll('.floating-sparkle');
        floatingSparkles.forEach(el => el.remove());
      };
    }
  }, []);

  return (
    <div className="completion-screen text-center bg-white/95 text-gray-800 p-12 rounded-3xl relative overflow-hidden border-3 border-pink-500">
      <h2 className="text-3xl mb-6">🎉 Congratulations, Designer! 🎉</h2>
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-300 text-gray-800 p-6 rounded-full text-6xl mx-auto w-36 h-36 flex items-center justify-center shadow-2xl shadow-yellow-400/40 badge-sparkle mb-6">
        🎨🌈✨
      </div>
      <h3 className="text-2xl mb-4">Junior CSS Designer Badge Earned!</h3>
      <p className="text-xl mb-4">You styled your way to {score}/{totalQuestions} correct answers ({percentage}%)!</p>
      <p className="text-lg mb-6">You've mastered the art of web styling! Keep designing! 🌟</p>
      <button 
        className="bg-gradient-to-r from-teal-500 to-teal-600 text-white border-none p-4.5 px-10 rounded-3xl text-xl font-bold cursor-pointer mt-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg shadow-teal-300/30" 
        onClick={onRestart}
      >
        Style Again 🔄
      </button>
    </div>
  );
};

// Main Quiz App Component
const CSSQuizApp = () => {
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
      <FloatingProperties />
      <div className="max-w-6xl mx-auto p-5 relative z-10 mt-14">
        <div className="text-center mb-8 bg-white/95 p-6 rounded-3xl shadow-2xl border-3 border-pink-500">
          <h1 className="text-6xl mb-2.5 text-pink-500 drop-shadow-lg">🎨 CSS Learning Quiz 🌈</h1>
          <p className="text-2xl text-gray-600 opacity-90">Style the web with colors, layouts, and animations!</p>
        </div>

        {currentScreen === 'difficulty' && (
          <div className="bg-white/95 text-gray-800 p-9 rounded-3xl shadow-2xl border-2 border-pink-300">
            <div className="flex items-center justify-center gap-5 mb-6">
              <span className="text-6xl drop-shadow-lg">🚀</span>
              <span className="text-2xl font-bold text-gray-800">Choose Your Design Level</span>
            </div>
            <div className="flex gap-4 justify-center mb-8 flex-wrap">
              <button 
                className="p-4 px-8 border-3 border-pink-500 rounded-3xl text-lg font-bold cursor-pointer transition-all duration-300 bg-white/90 text-pink-500 hover:bg-pink-500 hover:text-white hover:-translate-y-1 hover:shadow-lg shadow-pink-300/30"
                onClick={() => startQuiz('beginner')}
              >
                🌈 Beginner (Color & Text)
              </button>
              <button 
                className="p-4 px-8 border-3 border-pink-500 rounded-3xl text-lg font-bold cursor-pointer transition-all duration-300 bg-white/90 text-pink-500 hover:bg-pink-500 hover:text-white hover:-translate-y-1 hover:shadow-lg shadow-pink-300/30"
                onClick={() => startQuiz('intermediate')}
              >
                🎭 Intermediate (Layout Master)
              </button>
              <button 
                className="p-4 px-8 border-3 border-pink-500 rounded-3xl text-lg font-bold cursor-pointer transition-all duration-300 bg-white/90 text-pink-500 hover:bg-pink-500 hover:text-white hover:-translate-y-1 hover:shadow-lg shadow-pink-300/30"
                onClick={() => startQuiz('advanced')}
              >
                ✨ Advanced (Animation Wizard)
              </button>
            </div>
          </div>
        )}

        {currentScreen === 'quiz' && (
          <>
            <div className="flex justify-between items-center bg-white/90 p-5 rounded-3xl mb-6 shadow-xl border-2 border-pink-300">
              <CanvasProgress score={score} totalQuestions={currentQuestions.length} />
              <div className="text-5xl drop-shadow-2xl">🖌️</div>
              <div className="text-xl font-bold text-pink-500">
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
                className="bg-gradient-to-r from-pink-500 to-red-600 text-white border-none p-4 px-9 rounded-3xl text-lg font-bold cursor-pointer float-right transition-all duration-300 hover:-translate-y-1 hover:shadow-xl shadow-pink-300/30" 
                onClick={nextQuestion}
              >
                Next Style →
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

export default CSSQuizApp;