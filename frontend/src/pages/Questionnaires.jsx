// // src/pages/Questionnaire.jsx

// import React, { useState } from 'react';
// import './Questionnaires.css';
// import Select from 'react-select';
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { auth } from '../firebase/firebaseConfig';
// import { useNavigate } from 'react-router-dom';

// const countryOptions = [
//   { value: 'United States', label: '🇺🇸 United States' },
//   { value: 'United Kingdom', label: '🇬🇧 United Kingdom' },
//   { value: 'Canada', label: '🇨🇦 Canada' },
//   { value: 'Germany', label: '🇩🇪 Germany' },
//   { value: 'France', label: '🇫🇷 France' },
//   { value: 'Italy', label: '🇮🇹 Italy' },
//   { value: 'Spain', label: '🇪🇸 Spain' },
//   { value: 'Israel', label: '🇮🇱 Israel' },
//   { value: 'India', label: '🇮🇳 India' },
//   { value: 'Japan', label: '🇯🇵 Japan' },
//   { value: 'China', label: '🇨🇳 China' },
//   { value: 'Australia', label: '🇦🇺 Australia' },
//   { value: 'Brazil', label: '🇧🇷 Brazil' },
//   { value: 'Mexico', label: '🇲🇽 Mexico' },
//   { value: 'South Korea', label: '🇰🇷 South Korea' }
// ];

// const Questionnaire = () => {
//   const navigate = useNavigate();
//   const [answers, setAnswers] = useState({});
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [isLoading, setIsLoading] = useState(false);

//   const questions = [
//     // { id: 'name', text: "What's your name?", type: 'text' },
//     // { id: 'age', text: 'How old are you?', type: 'number' },
//     // { id: 'gender', text: 'What is your gender?', type: 'select', options: ['Male', 'Female', 'Other'] },
//     // { id: 'email', text: 'What is your email?', type: 'text' },
//     // { id: 'password', text: 'Create a password', type: 'text' },
//     {
//       id: 'q1',
//       text: 'After washing your face and leaving it for 30 to 60 minutes, your face feels:',
//       options: ['Tight or dry, either matte', 'Generally normal, no discomfort', 'Slightly oily on T-zone', 'Quite oily and greasy']
//     },
//     {
//       id: 'q2',
//       text: 'What bothers your skin during the day?',
//       options: ['Needs constant moisture', 'Nothing', 'T-zone oiliness, visible pores', 'Shiny, oily face']
//     },
//     {
//       id: 'q3',
//       text: 'How often does your skin feel dry or flaky?',
//       options: ['Frequently', 'Sometimes', 'Rarely', 'Never']
//     },
//     {
//       id: 'q4',
//       text: 'Do you often feel stressed and tense?',
//       options: ['Yes, everyday', 'Often', 'Rarely', 'I don’t feel stress'],
//       description: 'Stress increases oil and may cause acne or eczema.'
//     },
//     {
//       id: 'q5',
//       text: 'Do you experience breakouts or inflamed acne?',
//       options: ['Rarely', 'Sometimes', 'Often (not many)', 'Often (a lot)'],
//       description: 'It might hurt to touch.'
//     },
//     {
//       id: 'q6',
//       text: 'Do you experience any scarring afterwards?',
//       options: ['No', 'Rarely', 'Sometimes', 'Often'],
//       description: 'Scars form when healing is uneven.'
//     },
//     {
//       id: 'q7',
//       text: 'Is your skin prone to redness?',
//       options: ['After spicy food', 'After touch', 'After exercise', 'Emotions', 'Temperature changes', 'Screen use'],
//       multi: true,
//       description: 'Select all that apply.'
//     },
//     {
//       id: 'q8',
//       text: 'What is your daily water intake?',
//       options: ['Only coffee/tea', '2 glasses', '2–6 glasses', 'More than 6 glasses']
//     },
//     {
//       id: 'q9',
//       text: 'Any additional concerns?',
//       options: ['Pimples', 'Enlarged pores', 'Redness', 'Dullness', 'Texture', 'Uneven tone', 'Dark circles', 'None'],
//       multi: true
//     },
//     {
//       id: 'q10',
//       text: 'Do you have any allergies or sensitivities?',
//       options: ['Yes, I know them', 'Yes, unsure', 'No']
//     }
//   ];

//   const currentQuestion = questions[currentQuestionIndex];

//   const handleSelect = (questionId, answer) => {
//     const question = questions.find(q => q.id === questionId);
//     setAnswers(prev => {
//       const current = prev[questionId] || (question.multi ? [] : '');
//       if (question.multi) {
//         const exists = current.includes(answer);
//         return {
//           ...prev,
//           [questionId]: exists
//             ? current.filter(a => a !== answer)
//             : [...current, answer]
//         };
//       }
//       return { ...prev, [questionId]: answer };
//     });
//   };

//   const handleNext = async () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(prev => prev + 1);
//     } else {
//       setIsLoading(true);
//       try {
//         const { email, password, ...rest } = answers;
//         const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//         const uid = userCredential.user.uid;
//         const res = await fetch('/api/create-profile', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ uid, email, ...rest })
//         });
//         const data = await res.json();
//         const skinType = data.skinType;
//         setTimeout(() => navigate('/profile', { state: { skinType } }), 2000);
//       } catch (err) {
//         console.error('Error:', err);
//         setIsLoading(false);
//       }
//     }
//   };

//   const handleBack = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(prev => prev - 1);
//     }
//   };

//   const isAnswered = answers[currentQuestion.id] && (currentQuestion.multi ? answers[currentQuestion.id].length > 0 : true);

//   return (
//     <div className="questionnaire">
//       <div className="questionnaire-inner">
//         <h2 className="questionnaire-title">About Your Skin . .</h2>
//         <div className="question-block">
//           <p>{currentQuestion.text}</p>
//           {currentQuestion.description && (
//             <p className="question-description">{currentQuestion.description}</p>
//           )}

//           {['text', 'number'].includes(currentQuestion.type) ? (
//             <input
//               type={currentQuestion.type}
//               className="input-field"
//               value={answers[currentQuestion.id] || ''}
//               onChange={(e) => setAnswers({ ...answers, [currentQuestion.id]: e.target.value })}
//             />
//           ) : currentQuestion.type === 'select' ? (
//             <select
//               className="input-field"
//               value={answers[currentQuestion.id] || ''}
//               onChange={(e) => setAnswers({ ...answers, [currentQuestion.id]: e.target.value })}
//             >
//               <option value="">Select...</option>
//               {currentQuestion.options.map(opt => (
//                 <option key={opt} value={opt}>{opt}</option>
//               ))}
//             </select>
//           ) : currentQuestion.type === 'country' ? (
//             <Select
//               options={countryOptions}
//               placeholder="Select your country"
//               value={countryOptions.find(c => c.value === answers[currentQuestion.id])}
//               onChange={(selected) => setAnswers({ ...answers, [currentQuestion.id]: selected.value })}
//             />
//           ) : (
//             currentQuestion.options.map(opt => (
//               <div
//                 key={opt}
//                 className={`option ${
//                   currentQuestion.multi
//                     ? answers[currentQuestion.id]?.includes(opt)
//                       ? 'selected'
//                       : ''
//                     : answers[currentQuestion.id] === opt
//                     ? 'selected'
//                     : ''
//                 }`}
//                 onClick={() => handleSelect(currentQuestion.id, opt)}
//               >
//                 {opt}
//               </div>
//             ))
//           )}
//         </div>

//         <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//           {currentQuestionIndex > 0 && <button onClick={handleBack}>Back</button>}
//           <button onClick={handleNext} disabled={!isAnswered}>
//             {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
//           </button>
//         </div>
//         {isLoading && <p>Creating your profile...</p>}
//       </div>
//     </div>
//   );
// };

// export default Questionnaire;
// src/pages/Questionnaire.jsx

//=======================================================================================
 
// import React, { useState } from 'react';
// import './Questionnaires.css';
// import Select from 'react-select';
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { auth } from '../firebase/firebaseConfig';
// import { useNavigate } from 'react-router-dom';
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { auth } from '../firebase/firebase';
// import { useNavigate } from 'react-router-dom';


// const countryOptions = [
//   { value: 'United States', label: '🇺🇸 United States' },
//   { value: 'United Kingdom', label: '🇬🇧 United Kingdom' },
//   { value: 'Canada', label: '🇨🇦 Canada' },
//   { value: 'Germany', label: '🇩🇪 Germany' },
//   { value: 'France', label: '🇫🇷 France' },
//   { value: 'Italy', label: '🇮🇹 Italy' },
//   { value: 'Spain', label: '🇪🇸 Spain' },
//   { value: 'Israel', label: '🇮🇱 Israel' },
//   { value: 'India', label: '🇮🇳 India' },
//   { value: 'Japan', label: '🇯🇵 Japan' },
//   { value: 'China', label: '🇨🇳 China' },
//   { value: 'Australia', label: '🇦🇺 Australia' },
//   { value: 'Brazil', label: '🇧🇷 Brazil' },
//   { value: 'Mexico', label: '🇲🇽 Mexico' },
//   { value: 'South Korea', label: '🇰🇷 South Korea' }
// ];

// const Questionnaire = () => {
//   const navigate = useNavigate();
//   const [answers, setAnswers] = useState({});
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [skinType, setSkinType] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const questions = [
//     // { id: 'name', text: "What's your name?", type: 'text' },
//     // { id: 'age', text: 'How old are you?', type: 'number' },
//     // { id: 'gender', text: 'What is your gender?', type: 'select', options: ['Male', 'Female', 'Other'] },
//     // { id: 'email', text: 'What is your email?', type: 'text' },
//     // { id: 'password', text: 'Create a password', type: 'text' },
//     {
//       id: 'q1',
//       text: 'After washing your face and leaving it for 30 to 60 minutes, your face feels:',
//       options: ['Tight or dry, either matte', 'Generally normal, no discomfort', 'Slightly oily on T-zone', 'Quite oily and greasy']
//     },
//     {
//       id: 'q2',
//       text: 'What bothers your skin during the day?',
//       options: ['Needs constant moisture', 'Nothing', 'T-zone oiliness, visible pores', 'Shiny, oily face']
//     },
//     {
//       id: 'q3',
//       text: 'How often does your skin feel dry or flaky?',
//       options: ['Frequently', 'Sometimes', 'Rarely', 'Never']
//     },
//     {
//       id: 'q4',
//       text: 'Do you often feel stressed and tense?',
//       options: ['Yes, everyday', 'Often', 'Rarely', 'I don’t feel stress'],
//       description: 'Stress increases oil and may cause acne or eczema.'
//     },
//     {
//       id: 'q5',
//       text: 'Do you experience breakouts or inflamed acne?',
//       options: ['Rarely', 'Sometimes', 'Often (not many)', 'Often (a lot)'],
//       description: 'It might hurt to touch.'
//     },
//     {
//       id: 'q6',
//       text: 'Do you experience any scarring afterwards?',
//       options: ['No', 'Rarely', 'Sometimes', 'Often'],
//       description: 'Scars form when healing is uneven.'
//     },
//     {
//       id: 'q7',
//       text: 'Is your skin prone to redness?',
//       options: ['After spicy food', 'After touch', 'After exercise', 'Emotions', 'Temperature changes', 'Screen use'],
//       multi: true,
//       description: 'Select all that apply.'
//     },
//     {
//       id: 'q8',
//       text: 'What is your daily water intake?',
//       options: ['Only coffee/tea', '2 glasses', '2–6 glasses', 'More than 6 glasses']
//     },
//     {
//       id: 'q9',
//       text: 'Any additional concerns?',
//       options: ['Pimples', 'Enlarged pores', 'Redness', 'Dullness', 'Texture', 'Uneven tone', 'Dark circles', 'None'],
//       multi: true
//     },
//     {
//       id: 'q10',
//       text: 'Do you have any allergies or sensitivities?',
//       options: ['Yes, I know them', 'Yes, unsure', 'No']
//     }
//   ];

//   const currentQuestion = questions[currentQuestionIndex];
//   // const currentQuestion = questions[currentQuestionIndex] || {};


//   const handleSelect = (questionId, answer) => {
//     const question = questions.find(q => q.id === questionId);
//     setAnswers(prev => {
//       const current = prev[questionId] || (question.multi ? [] : '');
//       if (question.multi) {
//         const exists = current.includes(answer);
//         return {
//           ...prev,
//           [questionId]: exists
//             ? current.filter(a => a !== answer)
//             : [...current, answer]
//         };
//       }
//       return { ...prev, [questionId]: answer };
//     });
//   };

//   const calculateSkinType = () => {
//     const typeMap = ['dry', 'normal', 'combo', 'oily'];
//     const counts = { dry: 0, normal: 0, combo: 0, oily: 0 };

//     for (let i = 1; i <= 6; i++) {
//       const q = `q${i}`;
//       const index = questions.find(qn => qn.id === q)?.options?.indexOf(answers[q]);
//       if (index !== -1 && index < 4) {
//         counts[typeMap[index]]++;
//       }
//     }

//     const countArr = Object.entries(counts);
//     const maxCount = Math.max(...countArr.map(([_, c]) => c));
//     const mainTypes = countArr.filter(([_, c]) => c === maxCount).map(([t]) => t);

//     if (mainTypes.length === 1) return mainTypes[0];

//     const comboRules = {
//       'dry,normal': 'dry',
//       'normal,combo': 'combo',
//       'combo,oily': 'oily',
//       'dry,combo': 'combo-to-dry',
//       'normal,oily': 'combo-to-oily',
//       'dry,oily': 'combo-to-normal',
//     };

//     const key = mainTypes.sort().join(',');
//     return comboRules[key] || mainTypes[0];
//   };

//   const handleNext = async () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(prev => prev + 1);
//     } else {
//       const detectedType = calculateSkinType();
//       setSkinType(detectedType);
//       setIsLoading(false);
//     }
//   };

//   const handleBack = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(prev => prev - 1);
//     }
//   };

//   const isAnswered =
//     answers[currentQuestion.id] &&
//     (currentQuestion.multi ? answers[currentQuestion.id].length > 0 : true);

//   return (
//     <div className="questionnaire">
//       <div className="questionnaire-inner">
//         <h2 className="questionnaire-title">About Your Skin . .</h2>

//         <div className="question-block">
//           <p>{currentQuestion.text}</p>
//           {currentQuestion.description && (
//             <p className="question-description">{currentQuestion.description}</p>
//           )}

//           {['text', 'number'].includes(currentQuestion.type) ? (
//             <input
//               type={currentQuestion.type}
//               className="input-field"
//               value={answers[currentQuestion.id] || ''}
//               onChange={(e) =>
//                 setAnswers({ ...answers, [currentQuestion.id]: e.target.value })
//               }
//             />
//           ) : currentQuestion.type === 'select' ? (
//             <select
//               className="input-field"
//               value={answers[currentQuestion.id] || ''}
//               onChange={(e) =>
//                 setAnswers({ ...answers, [currentQuestion.id]: e.target.value })
//               }
//             >
//               <option value="">Select...</option>
//               {currentQuestion.options.map(opt => (
//                 <option key={opt} value={opt}>{opt}</option>
//               ))}
//             </select>
//           ) : currentQuestion.type === 'country' ? (
//             <Select
//               options={countryOptions}
//               placeholder="Select your country"
//               value={countryOptions.find(c => c.value === answers[currentQuestion.id])}
//               onChange={(selected) =>
//                 setAnswers({ ...answers, [currentQuestion.id]: selected.value })
//               }
//             />
//           ) : (
//             currentQuestion.options.map((opt) => (
//               <div
//                 key={opt}
//                 className={`option ${
//                   currentQuestion.multi
//                     ? answers[currentQuestion.id]?.includes(opt)
//                       ? 'selected'
//                       : ''
//                     : answers[currentQuestion.id] === opt
//                     ? 'selected'
//                     : ''
//                 }`}
//                 onClick={() => handleSelect(currentQuestion.id, opt)}
//               >
//                 {opt}
//               </div>
//             ))
//           )}
//         </div>

//         <div className="nav-buttons">
//           {currentQuestionIndex > 0 && (
//             <button onClick={handleBack}>Back</button>
//           )}
//           <button onClick={handleNext} disabled={!isAnswered}>
//             {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
//           </button>
//         </div>

//         {isLoading && <p>Creating your profile...</p>}

//         {skinType && (
//           <div className="summary-box">
//             <h3> Based on your answers, your skin type is:</h3>
//             <h2 className="skin-type-result">{skinType}</h2>
//             <p className="skin-type-description">
//               (Description for this skin type will be shown here.)
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Questionnaire;
import React, { useState } from 'react';
import './Questionnaires.css';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase';

// const countryOptions = [
//   { value: 'United States', label: '🇺🇸 United States' },
//   { value: 'United Kingdom', label: '🇬🇧 United Kingdom' },
//   { value: 'Canada', label: '🇨🇦 Canada' },
//   { value: 'Germany', label: '🇩🇪 Germany' },
//   { value: 'France', label: '🇫🇷 France' },
//   { value: 'Italy', label: '🇮🇹 Italy' },
//   { value: 'Spain', label: '🇪🇸 Spain' },
//   { value: 'Israel', label: '🇮🇱 Israel' },
//   { value: 'India', label: '🇮🇳 India' },
//   { value: 'Japan', label: '🇯🇵 Japan' },
//   { value: 'China', label: '🇨🇳 China' },
//   { value: 'Australia', label: '🇦🇺 Australia' },
//   { value: 'Brazil', label: '🇧🇷 Brazil' },
//   { value: 'Mexico', label: '🇲🇽 Mexico' },
//   { value: 'South Korea', label: '🇰🇷 South Korea' }
// ];

const Questionnaire = () => {
  const navigate = useNavigate();

  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [skinType, setSkinType] = useState(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [registrationError, setRegistrationError] = useState('');
  const [userInfo, setUserInfo] = useState({
    name: '',
    age: '',
    gender: '',
    email: '',
    password: '',
  });

  const questions = [
    {
      id: 'q1',
      text: 'After washing your face and leaving it for 30 to 60 minutes, your face feels:',
      options: ['Tight or dry, either matte', 'Generally normal, no discomfort', 'Slightly oily on T-zone', 'Quite oily and greasy']
    },
    {
      id: 'q2',
      text: 'What bothers your skin during the day?',
      options: ['Needs constant moisture', 'Nothing', 'T-zone oiliness, visible pores', 'Shiny, oily face']
    },
    {
      id: 'q3',
      text: 'How often does your skin feel dry or flaky?',
      options: ['Frequently', 'Sometimes', 'Rarely', 'Never']
    },
    {
      id: 'q4',
      text: 'Do you often feel stressed and tense?',
      options: ['Yes, everyday', 'Often', 'Rarely', 'I don’t feel stress'],
      description: 'Stress increases oil and may cause acne or eczema.'
    },
    {
      id: 'q5',
      text: 'Do you experience breakouts or inflamed acne?',
      options: ['Rarely', 'Sometimes', 'Often (not many)', 'Often (a lot)'],
      description: 'It might hurt to touch.'
    },
    {
      id: 'q6',
      text: 'Do you experience any scarring afterwards?',
      options: ['No', 'Rarely', 'Sometimes', 'Often'],
      description: 'Scars form when healing is uneven.'
    }
  ];

  const currentQuestion = questions[currentQuestionIndex];

  const handleSelect = (questionId, answer) => {
    const question = questions.find(q => q.id === questionId);
    setAnswers(prev => {
      const current = prev[questionId] || (question.multi ? [] : '');
      if (question.multi) {
        const exists = current.includes(answer);
        return {
          ...prev,
          [questionId]: exists
            ? current.filter(a => a !== answer)
            : [...current, answer]
        };
      }
      return { ...prev, [questionId]: answer };
    });
  };

  const calculateSkinType = () => {
    const typeMap = ['dry', 'normal', 'combo', 'oily'];
    const counts = { dry: 0, normal: 0, combo: 0, oily: 0 };

    for (let i = 1; i <= 6; i++) {
      const q = `q${i}`;
      const index = questions.find(qn => qn.id === q)?.options?.indexOf(answers[q]);
      if (index !== -1 && index < 4) {
        counts[typeMap[index]]++;
      }
    }

    const countArr = Object.entries(counts);
    const maxCount = Math.max(...countArr.map(([_, c]) => c));
    const mainTypes = countArr.filter(([_, c]) => c === maxCount).map(([t]) => t);

    if (mainTypes.length === 1) return mainTypes[0];

    const comboRules = {
      'dry,normal': 'dry',
      'normal,combo': 'combo',
      'combo,oily': 'oily',
      'dry,combo': 'combo-to-dry',
      'normal,oily': 'combo-to-oily',
      'dry,oily': 'combo-to-normal',
    };

    const key = mainTypes.sort().join(',');
    return comboRules[key] || mainTypes[0];
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      const detectedType = calculateSkinType();
      setSkinType(detectedType);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const isAnswered =
    answers[currentQuestion?.id] &&
    (currentQuestion?.multi ? answers[currentQuestion?.id].length > 0 : true);

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    setRegistrationError('');
    try {
      const { email, password, name, age, gender } = userInfo;
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      await fetch('/api/create-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, email, name, age, gender, skinType })
      });

      navigate('/profile');
    } catch (error) {
      setRegistrationError('❌ Failed to register. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="questionnaire">
      <div className="questionnaire-inner">
        <h2 className="questionnaire-title">About Your Skin . .</h2>

        {skinType && !showRegistrationForm && (
          <div className="summary-box">
            <h3>Based on your answers, your skin type is:</h3>
            <h2 className="skin-type-result">{skinType}</h2>
            <p className="skin-type-description">
              (Description for this skin type will be shown here.)
            </p>
            <button onClick={() => setShowRegistrationForm(true)}>Continue</button>
          </div>
        )}

        {!skinType && currentQuestion && (
          <>
            <div className="question-block">
              <p>{currentQuestion.text}</p>
              {currentQuestion.description && (
                <p className="question-description">{currentQuestion.description}</p>
              )}
              {currentQuestion.options.map((opt) => (
                <div
                  key={opt}
                  className={`option ${
                    currentQuestion.multi
                      ? answers[currentQuestion.id]?.includes(opt)
                        ? 'selected'
                        : ''
                      : answers[currentQuestion.id] === opt
                      ? 'selected'
                      : ''
                  }`}
                  onClick={() => handleSelect(currentQuestion.id, opt)}
                >
                  {opt}
                </div>
              ))}
            </div>

            <div className="nav-buttons">
              {currentQuestionIndex > 0 && (
                <button onClick={handleBack}>Back</button>
              )}
              <button onClick={handleNext} disabled={!isAnswered}>
                {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
              </button>
            </div>
          </>
        )}

        {showRegistrationForm && (
          <form className="register-form" onSubmit={handleRegistrationSubmit}>
            <h3>📝 Finish Creating Your Account</h3>

            <input
              type="text"
              placeholder="Full Name"
              required
              value={userInfo.name}
              onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
            />
            <input
              type="number"
              placeholder="Age"
              required
              value={userInfo.age}
              onChange={(e) => setUserInfo({ ...userInfo, age: e.target.value })}
            />
            <select
              value={userInfo.gender}
              required
              onChange={(e) => setUserInfo({ ...userInfo, gender: e.target.value })}
            >
              <option value="">Select Gender</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              {/* <option value="Other">Other</option> */}
            </select>
            <input
              type="email"
              placeholder="Email"
              required
              value={userInfo.email}
              onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={userInfo.password}
              onChange={(e) => setUserInfo({ ...userInfo, password: e.target.value })}
            />
            {registrationError && <p style={{ color: 'red' }}>{registrationError}</p>}
            <button type="submit">Create Account</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Questionnaire;
