// export default Questionnaire;
import React, { useState } from 'react';
import './Questionnaires.css';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
// import { auth } from '../firebase/firebase';
import { auth, db } from '../firebase/firebase';
import { doc, setDoc } from 'firebase/firestore';



// // const countryOptions = [
// //   { value: 'United States', label: '🇺🇸 United States' },
// //   { value: 'United Kingdom', label: '🇬🇧 United Kingdom' },
// //   { value: 'Canada', label: '🇨🇦 Canada' },
// //   { value: 'Germany', label: '🇩🇪 Germany' },
// //   { value: 'France', label: '🇫🇷 France' },
// //   { value: 'Italy', label: '🇮🇹 Italy' },
// //   { value: 'Spain', label: '🇪🇸 Spain' },
// //   { value: 'Israel', label: '🇮🇱 Israel' },
// //   { value: 'India', label: '🇮🇳 India' },
// //   { value: 'Japan', label: '🇯🇵 Japan' },
// //   { value: 'China', label: '🇨🇳 China' },
// //   { value: 'Australia', label: '🇦🇺 Australia' },
// //   { value: 'Brazil', label: '🇧🇷 Brazil' },
// //   { value: 'Mexico', label: '🇲🇽 Mexico' },
// //   { value: 'South Korea', label: '🇰🇷 South Korea' }
// // ];


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
      options: ['I don’t feel stress', 'Rarely', 'Often', 'Yes, everyday'],
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
    },
    {
      id: 'q7',
      text: 'Is your skin prone to redness?',
      options: ['After spicy food', 'After touch', 'After exercise', 'Emotions', 'Temperature changes', 'Screen use'],
      multi: true,
      description: 'Select all that apply.'
    },
    {
      id: 'q8',
      text: 'What is your daily water intake?',
      options: ['Only coffee/tea', '2 glasses', '2–6 glasses', 'More than 6 glasses']
    },
    {
      id: 'q9',
      text: 'Any additional concerns?',
      options: ['Pimples', 'Enlarged pores', 'Redness', 'Dullness', 'Texture', 'Uneven tone', 'Dark circles', 'None'],
      multi: true
    },
    {
      id: 'q10',
      text: 'Do you have any allergies or sensitivities?',
      options: ['Yes, I know them', 'Yes, unsure', 'No']
    }
  ];

  const skinTypeDescriptions = {
    dry: "Skin produces less sebum than normal skin. As a result of the lack of sebum, dry skin lacks the lipids that it needs to retain moisture and build a protective shield against external influences. Dry skin can feel tight, brittle, rough and look dull, skin elasticity is also low.",
    normal: "Well-balanced skin, neither too oily nor too dry. The T-zone (forehead, chin and nose) may be a slightly oilier, but overall sebum and moisture are balanced. Normal skin still has pores (pores, peach fuzz, texture, sebaceous filaments - they are all part of ANY skin and are normal<3), good blood circulation, a velvety, soft texture, no blemishes (though pretty much everyone experience comedones from time to time) and is not prone to sensitivity.",
    combo: "As the name suggests, skin that consists of a mix of skin types. Skin types vary between the T-zone and the cheeks on combination skin. Usually, it's an oilier T-zone (forehead, chin and nose) with slightly more visible pores in this area (perhaps with some comedones) and normal or drier cheeks. This is one of the most common skin types.",
    oily: "Oilier skin has heightened sebum production, which can be due to genetics, hormonal changes, medication, stress or improper skincare. Oily skin has a glossy shine and a bit more visible pores - which again, is totally normal and NOT a flaw. Oily skin is more prone to comedones, but that's not a rule, just something to keep in mind when creating a routine."
  };

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
    const { email, password, name, age, gender } = userInfo;
    const concerns = answers['q9'] || [];

    const parsedAge = Number(age);
    if (!parsedAge || parsedAge < 16) {
      setRegistrationError(' You must be at least 16 years old to register.');
      return;
    }

    try {
      // Try to create account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      

      await setDoc(doc(db, 'users', uid), {
        userName: name, 
        userEmail: email,
        age,
        gender,
        skinType,
        concerns,
        profileImageURL: ''
        });
        
        localStorage.setItem('userId', uid);
        localStorage.setItem('userEmail', email);

      navigate('/profile', {
        state: { skinType, concerns }
      });
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        try {
          // Try login instead
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          navigate('/profile', {
            state: { skinType, concerns }
          });
        } catch (loginErr) {
          setRegistrationError('❌ Email exists, but password is incorrect.');
        }
      } else {
        setRegistrationError(' Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div className="questionnaire">
      <div className="questionnaire-inner">
        {skinType && !showRegistrationForm && (
          <div className="summary-box">
            <h3>Based on your answers, your skin type is:</h3>
            <h2 className="skin-type-result">{skinType}</h2>
            <p className="skin-type-description">{skinTypeDescriptions[skinType]}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
              <button onClick={() => { setAnswers({});
              setCurrentQuestionIndex(0);
              setSkinType(null);
        }}
        style={{ flex: 1, backgroundColor: '#f0ede5', color: '#5a273b', border: '1px solid #ccc' }}
        >
          Retake the Quiz
        </button>
        <button onClick={() => setShowRegistrationForm(true)} style={{ flex: 1 }}>
          Continue</button>
          </div>
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
                        ? 'selected' : ''
                      : answers[currentQuestion.id] === opt
                        ? 'selected' : ''
                  }`}
                  onClick={() => handleSelect(currentQuestion.id, opt)}
                >
                  {opt}
                </div>
              ))}
            </div>
            <div className="nav-buttons" style={{
              display: 'flex', justifyContent: 'space-between', marginTop: '2rem'}}>

                {currentQuestionIndex > 0 && (
                  <button onClick={handleBack} style={{ flex: '0 0 auto' }}>
                    Back
                  </button>
                  )}
                  <div style={{ flexGrow: 1 }} />
                  <button onClick={handleNext} disabled={!isAnswered} style={{ flex: '0 0 auto' }}>
                    {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
                  </button>
                  </div>
            {/* <div className="nav-buttons">
            
              {currentQuestionIndex > 0 && <button onClick={handleBack}>Back</button>}
              <button onClick={handleNext} disabled={!isAnswered}>
                {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
              </button>
            </div> */}
          </>
        )}

        {showRegistrationForm && (
          <form className="register-form" onSubmit={handleRegistrationSubmit}>
            <h3>Create Your Account</h3>

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
            <button type="submit">Continue</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Questionnaire;
