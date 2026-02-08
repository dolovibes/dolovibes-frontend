import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSiteTextsContext } from '../contexts/SiteTextsContext';
import { X, Mountain, ChevronRight, RotateCcw } from 'lucide-react';
import useFocusTrap from '../hooks/useFocusTrap';

const HikingLevelModal = ({ isOpen, onClose }) => {
    const { t } = useTranslation('hikingLevel');
    const { texts: siteTexts } = useSiteTextsContext();
    // fix #12 + #27: Focus trap, Escape handler, ARIA
    const focusTrapRef = useFocusTrap(isOpen, onClose);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showResult, setShowResult] = useState(false);
    // fix #26: useRef to store timeout IDs for cleanup
    const timeoutRef = useRef(null);

    // fix #11: optional chaining para evitar crash si siteTexts no tiene la estructura esperada
    const questions = [
        {
            id: 1,
            question: siteTexts?.questions?.q1,
            options: [
                { value: 'A', text: siteTexts?.answers?.q1a },
                { value: 'B', text: siteTexts?.answers?.q1b },
                { value: 'C', text: siteTexts?.answers?.q1c }
            ]
        },
        {
            id: 2,
            question: siteTexts?.questions?.q2,
            options: [
                { value: 'A', text: siteTexts?.answers?.q2a },
                { value: 'B', text: siteTexts?.answers?.q2b },
                { value: 'C', text: siteTexts?.answers?.q2c }
            ]
        },
        {
            id: 3,
            question: siteTexts?.questions?.q3,
            options: [
                { value: 'A', text: siteTexts?.answers?.q3a },
                { value: 'B', text: siteTexts?.answers?.q3b },
                { value: 'C', text: siteTexts?.answers?.q3c }
            ]
        },
        {
            id: 4,
            question: siteTexts?.questions?.q4,
            options: [
                { value: 'A', text: siteTexts?.answers?.q4a },
                { value: 'B', text: siteTexts?.answers?.q4b },
                { value: 'C', text: siteTexts?.answers?.q4c }
            ]
        },
        {
            id: 5,
            question: siteTexts?.questions?.q5,
            options: [
                { value: 'A', text: siteTexts?.answers?.q5a },
                { value: 'B', text: siteTexts?.answers?.q5b },
                { value: 'C', text: siteTexts?.answers?.q5c }
            ]
        }
    ];

    const levels = {
        principiante: {
            emoji: "🟢",
            title: t('levels.beginner.title'),
            color: "bg-green-500",
            description: t('levels.beginner.description'),
            note: t('levels.beginner.note')
        },
        intermedio: {
            emoji: "🟡",
            title: t('levels.intermediate.title'),
            color: "bg-amber-500",
            description: t('levels.intermediate.description'),
            note: t('levels.intermediate.note')
        },
        avanzado: {
            emoji: "🔴",
            title: t('levels.advanced.title'),
            color: "bg-red-500",
            description: t('levels.advanced.description'),
            note: t('levels.advanced.note')
        }
    };

    // fix #26: cleanup timeout on unmount
    React.useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };
    }, []);

    if (!isOpen) return null;

    const handleAnswer = (questionId, answer) => {
        const newAnswers = { ...answers, [questionId]: answer };
        setAnswers(newAnswers);

        // fix #26: Clear any existing timeout and store new one
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        if (currentQuestion < questions.length - 1) {
            // Timeout más largo para evitar problemas en mobile con scroll táctil
            timeoutRef.current = setTimeout(() => {
                setCurrentQuestion(currentQuestion + 1);
                timeoutRef.current = null;
            }, 500);
        } else {
            timeoutRef.current = setTimeout(() => {
                setShowResult(true);
                timeoutRef.current = null;
            }, 500);
        }
    };

    const calculateResult = () => {
        const counts = { A: 0, B: 0, C: 0 };
        Object.values(answers).forEach(answer => {
            counts[answer]++;
        });

        if (counts.A >= counts.B && counts.A >= counts.C) return 'principiante';
        if (counts.B >= counts.A && counts.B >= counts.C) return 'intermedio';
        return 'avanzado';
    };

    const resetQuiz = () => {
        setCurrentQuestion(0);
        setAnswers({});
        setShowResult(false);
    };

    const handleClose = () => {
        resetQuiz();
        onClose();
    };

    const result = showResult ? levels[calculateResult()] : null;
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
        <div ref={focusTrapRef} className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="hiking-level-title">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-pizarra/80 backdrop-blur-sm" onClick={handleClose} aria-hidden="true"></div>

            {/* Modal */}
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden animate-fade-in-up">
                {/* Header */}
                <div className="bg-gradient-to-r from-pizarra to-pizarra p-6 text-white">
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-3 mb-2">
                        <Mountain className="w-8 h-8" />
                        <h3 className="text-xl font-bold">{t('title')}</h3>
                    </div>
                    <p className="text-white/80 text-sm">
                        {showResult ? t('resultTitle') : t('questionOf', { current: currentQuestion + 1, total: questions.length })}
                    </p>
                    {!showResult && (
                        <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-white transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    {!showResult ? (
                        <div key={`question-${currentQuestion}`} className="space-y-4">
                            <h4 className="text-lg font-semibold text-grafito mb-6">
                                {questions[currentQuestion].question}
                            </h4>
                            {questions[currentQuestion].options.map((option) => {
                                // Verificar si esta opción específica está seleccionada para ESTA pregunta
                                const isSelected = answers[questions[currentQuestion].id] === option.value;
                                return (
                                    <button
                                        key={option.value}
                                        onClick={() => handleAnswer(questions[currentQuestion].id, option.value)}
                                        className={`w-full p-4 text-left rounded-xl border-2 transition-all hover:border-pizarra hover:bg-nieve group ${isSelected
                                            ? 'border-pizarra bg-nieve'
                                            : 'border-niebla'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isSelected
                                                ? 'bg-pizarra text-white'
                                                : 'bg-nieve text-pizarra group-hover:bg-pizarra group-hover:text-white'
                                                }`}>
                                                {option.value}
                                            </span>
                                            <span className="text-pizarra">{option.text}</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center">
                            <div className={`w-20 h-20 ${result.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                                <span className="text-4xl">{result.emoji}</span>
                            </div>
                            <h4 className="text-2xl font-bold text-grafito mb-2">{result.title}</h4>
                            <p className="text-pizarra mb-4">{result.description}</p>
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                                <p className="text-amber-800 text-sm">{result.note}</p>
                            </div>

                            <div className="bg-nieve rounded-xl p-4 mb-6 text-left">
                                <p className="text-pizarra text-sm font-medium mb-2">{t('importantNote').split(':')[0]}:</p>
                                <p className="text-niebla text-sm">
                                    {t('importantNote')}
                                </p>
                            </div>

                            <div className="bg-gradient-to-r from-pizarra/5 to-pizarra/10 rounded-xl p-4 text-left">
                                <p className="text-pizarra text-sm">
                                    {t('encouragement')}
                                </p>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={resetQuiz}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-pizarra text-pizarra font-semibold hover:bg-nieve transition-colors"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    {t('buttons.repeat')}
                                </button>
                                <button
                                    onClick={handleClose}
                                    className="flex-1 flex items-center justify-center gap-2 bg-pizarra text-white py-3 rounded-xl font-semibold hover:bg-pizarra/90 transition-colors"
                                >
                                    {t('buttons.viewPackages')}
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HikingLevelModal;
