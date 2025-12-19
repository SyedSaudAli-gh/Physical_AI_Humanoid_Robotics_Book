import React, { useState } from 'react';

const VLAExercise = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  // Sample questions about VLA components
  const questions = [
    {
      id: 1,
      question: "Which component of a VLA system processes visual information from cameras and sensors?",
      options: [
        "Language Processor",
        "Vision System",
        "Action Generator",
        "Context Manager"
      ],
      correct: 1,
      explanation: "The Vision System is responsible for processing visual information from cameras and sensors, including object detection, scene understanding, and depth estimation."
    },
    {
      id: 2,
      question: "What is the primary function of the Language Processing module in a VLA system?",
      options: [
        "Executing physical movements",
        "Processing and understanding natural language commands",
        "Detecting objects in the environment",
        "Planning motion sequences"
      ],
      correct: 1,
      explanation: "The Language Processing module is responsible for parsing and understanding natural language commands, extracting intent, and identifying entities."
    },
    {
      id: 3,
      question: "Which component translates high-level goals into executable robot actions?",
      options: [
        "Perception Engine",
        "Language Processor",
        "Action Planner",
        "Vision System"
      ],
      correct: 2,
      explanation: "The Action Planner translates high-level goals into executable robot actions by planning motion and manipulation sequences."
    },
    {
      id: 4,
      question: "What does the 'A' in VLA stand for?",
      options: [
        "Autonomous",
        "Adaptive",
        "Action",
        "Assistive"
      ],
      correct: 2,
      explanation: "In Vision-Language-Action (VLA) systems, the 'A' stands for Action, representing the robot's ability to execute physical movements and tasks."
    },
    {
      id: 5,
      question: "Which of these is NOT a typical component of a VLA system?",
      options: [
        "Sensor Integration Layer",
        "Perception Engine",
        "Blockchain Verifier",
        "Action Planning Module"
      ],
      correct: 2,
      explanation: "While VLA systems include sensor integration, perception, and action planning, blockchain verification is not a typical component of VLA systems."
    }
  ];

  const handleAnswerSelect = (index) => {
    if (!submitted) {
      setSelectedAnswer(index);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;

    setSubmitted(true);
    setShowResult(true);

    if (selectedAnswer === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setSubmitted(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setSubmitted(false);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setSubmitted(false);
  };

  const currentQ = questions[currentQuestion];

  return (
    <div className="vla-exercise">
      <div className="vla-exercise__header">
        <h3>VLA Component Identification Exercise</h3>
        <p>Question {currentQuestion + 1} of {questions.length} | Score: {score}/{questions.length}</p>
      </div>

      <div className="vla-exercise__question">
        <h4>{currentQ.question}</h4>

        <div className="vla-exercise__options">
          {currentQ.options.map((option, index) => (
            <div
              key={index}
              className={`vla-exercise__option ${
                selectedAnswer === index ? 'vla-exercise__option--selected' : ''
              } ${
                showResult && index === currentQ.correct ? 'vla-exercise__option--correct' : ''
              } ${
                showResult && selectedAnswer === index && index !== currentQ.correct ? 'vla-exercise__option--incorrect' : ''
              }`}
              onClick={() => handleAnswerSelect(index)}
            >
              <div className="vla-exercise__option-radio">
                {selectedAnswer === index && <span className="vla-exercise__radio-check">✓</span>}
              </div>
              <div className="vla-exercise__option-text">{option}</div>
            </div>
          ))}
        </div>

        {showResult && (
          <div className="vla-exercise__explanation">
            <p><strong>Explanation:</strong> {currentQ.explanation}</p>
          </div>
        )}

        <div className="vla-exercise__controls">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="vla-exercise__button vla-exercise__button--secondary"
          >
            Previous
          </button>

          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
              className="vla-exercise__button vla-exercise__button--primary"
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={currentQuestion === questions.length - 1}
              className="vla-exercise__button vla-exercise__button--primary"
            >
              {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
            </button>
          )}

          {currentQuestion === questions.length - 1 && submitted && (
            <button
              onClick={handleRestart}
              className="vla-exercise__button vla-exercise__button--secondary"
            >
              Restart Exercise
            </button>
          )}
        </div>
      </div>

      {currentQuestion === questions.length - 1 && submitted && (
        <div className="vla-exercise__results">
          <h4>Exercise Complete!</h4>
          <p>Your final score: {score} out of {questions.length}</p>
          <p className="vla-exercise__results-message">
            {score === questions.length ? 'Excellent! You have a strong understanding of VLA components.' :
             score >= questions.length * 0.7 ? 'Good job! You understand the key VLA components well.' :
             'Keep studying! Review the VLA system architecture to improve your understanding.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default VLAExercise;