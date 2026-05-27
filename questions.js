const questionsBank = {
    'JEE': [
        {
            en: { text: "What is the unit of impulse?", oa: "Newton", ob: "Newton-second", oc: "Joule", od: "Pascal" },
            hi: { text: "आवेग (Impulse) की इकाई क्या है?", oa: "न्यूटन", ob: "न्यूटन-सेकंड", oc: "जूल", od: "पास्कल" },
            correct: 1
        },
        {
            en: { text: "Which of the following describes the first law of thermodynamics?", oa: "Conservation of mass", ob: "Conservation of energy", oc: "Entropy", od: "Absolute zero" },
            hi: { text: "ऊष्मागतिकी का पहला नियम किसे दर्शाता है?", oa: "द्रव्यमान का संरक्षण", ob: "ऊर्जा का संरक्षण", oc: "एंट्रॉपी", od: "परम शून्य" },
            correct: 1
        },
        {
            en: { text: "The primary focus of organic chemistry is the study of:", oa: "Metals", ob: "Carbon-based compounds", oc: "Noble gases", od: "Radioactive elements" },
            hi: { text: "कार्बनिक रसायन (Organic Chemistry) का मुख्य केंद्र किसका अध्ययन है?", oa: "धातु", ob: "कार्बन आधारित यौगिक", oc: "अक्रिय गैसें", od: "रेडियोधर्मी तत्व" },
            correct: 1
        },
        {
            en: { text: "Integration of sin(x) dx is:", oa: "cos(x)", ob: "-cos(x)", oc: "tan(x)", od: "sec(x)" },
            hi: { text: "sin(x) dx का समाकलन (Integration) क्या है?", oa: "cos(x)", ob: "-cos(x)", oc: "tan(x)", od: "sec(x)" },
            correct: 1
        },
        {
            en: { text: "In a semiconductor, the majority carriers in p-type are:", oa: "Electrons", ob: "Holes", oc: "Protons", od: "Neutrons" },
            hi: { text: "p-टाइप अर्धचालक (Semiconductor) में मुख्य वाहक क्या होते हैं?", oa: "इलेक्ट्रॉन", ob: "होल्स", oc: "प्रोटॉन", od: "न्यूट्रॉन" },
            correct: 1
        }
    ],
    'NEET': [
        {
            en: { text: "Who is known as the father of genetics?", oa: "Darwin", ob: "Mendel", oc: "Lamarck", od: "Watson" },
            hi: { text: "अनुवांशिकी का जनक (Father of Genetics) किसे कहा जाता है?", oa: "डार्विन", ob: "मेंडल", oc: "लमार्क", od: "वॉटसन" },
            correct: 1
        },
        {
            en: { text: "Which organelle is responsible for protein synthesis?", oa: "Lysosome", ob: "Ribosome", oc: "Chloroplast", od: "Mitochondria" },
            hi: { text: "प्रोटीन संश्लेषण (Protein Synthesis) के लिए कौन सा अंग जिम्मेदार है?", oa: "लाइसोसोम", ob: "राइबोसोम", oc: "क्लोरोप्लास्ट", od: "माईटोकोंड्रिया" },
            correct: 1
        },
        {
            en: { text: "The human heart has how many chambers?", oa: "2", ob: "3", oc: "4", od: "5" },
            hi: { text: "मानव हृदय में कितने कक्ष (Chambers) होते हैं?", oa: "2", ob: "3", oc: "4", od: "5" },
            correct: 2
        },
        {
            en: { text: "What is the pH of human blood?", oa: "6.4", ob: "7.4", oc: "8.4", od: "5.4" },
            hi: { text: "मानव रक्त का pH मान क्या है?", oa: "6.4", ob: "7.4", oc: "8.4", od: "5.4" },
            correct: 1
        },
        {
            en: { text: "Xylem in plants is responsible for transporting:", oa: "Food", ob: "Water", oc: "Hormone", od: "Amino acids" },
            hi: { text: "पौधों में जाइलम (Xylem) किसके परिवहन के लिए जिम्मेदार है?", oa: "भोजन", ob: "पानी", oc: "हार्मोन", od: "अमीनो एसिड" },
            correct: 1
        }
    ],
    'FOUND': [
        {
            en: { text: "What is the value of Pi (approx)?", oa: "3.14", ob: "2.14", oc: "4.14", od: "1.14" },
            hi: { text: "पाई (Pi) का अनुमानित मान क्या है?", oa: "3.14", ob: "2.14", oc: "4.14", od: "1.14" },
            correct: 0
        },
        {
            en: { text: "Which gas do plants absorb during photosynthesis?", oa: "Oxygen", ob: "Carbon Dioxide", oc: "Nitrogen", od: "Hydrogen" },
            hi: { text: "प्रकाश संश्लेषण के दौरान पौधे कौन सी गैस अवशोषित करते हैं?", oa: "ऑक्सीजन", ob: "कार्बन डाइऑक्साइड", oc: "नाइट्रोजन", od: "हाइड्रोजन" },
            correct: 1
        },
        {
            en: { text: "The smallest prime number is:", oa: "0", ob: "1", oc: "2", od: "3" },
            hi: { text: "सबसे छोटी अभाज्य संख्या (Prime Number) है:", oa: "0", ob: "1", oc: "2", od: "3" },
            correct: 2
        },
        {
            en: { text: "Light travels in a:", oa: "Curved line", ob: "Straight line", oc: "Zig-zag line", od: "Circular line" },
            hi: { text: "प्रकाश यात्रा करता है एक:", oa: "वक्रीय रेखा में", ob: "सीधी रेखा में", oc: "टेढ़ी-मेढ़ी रेखा में", od: "वृत्ताकार रेखा में" },
            correct: 1
        },
        {
            en: { text: "How many states of matter are there?", oa: "2", ob: "3", oc: "4", od: "5" },
            hi: { text: "पदार्थ की कितनी अवस्थाएँ होती हैं?", oa: "2", ob: "3", oc: "4", od: "5" },
            correct: 1
        }
    ]
};

const curatedExtraQuestions = {
    JEE: [
        { text: "If a body starts from rest with acceleration 2 m/s^2, its velocity after 5 s is:", oa: "5 m/s", ob: "10 m/s", oc: "15 m/s", od: "20 m/s", correct: 1 },
        { text: "The dimensional formula of force is:", oa: "MLT^-2", ob: "ML^2T^-2", oc: "MT^-1", od: "M^0L^1T^-2", correct: 0 },
        { text: "The derivative of x^3 with respect to x is:", oa: "x^2", ob: "2x", oc: "3x^2", od: "3x", correct: 2 },
        { text: "Which reagent is commonly used to detect unsaturation in organic compounds?", oa: "Bromine water", ob: "Lime water", oc: "Fehling solution", od: "Tollen reagent", correct: 0 },
        { text: "The value of sin 30 degree is:", oa: "1", ob: "1/2", oc: "0", od: "sqrt(3)/2", correct: 1 },
        { text: "For an ideal gas at constant temperature, pressure is inversely proportional to:", oa: "Mass", ob: "Volume", oc: "Density", od: "Moles", correct: 1 },
        { text: "The roots of x^2 - 5x + 6 = 0 are:", oa: "1 and 6", ob: "2 and 3", oc: "-2 and -3", od: "3 and 5", correct: 1 }
    ],
    NEET: [
        { text: "The functional unit of kidney is:", oa: "Neuron", ob: "Nephron", oc: "Alveolus", od: "Villus", correct: 1 },
        { text: "Which vitamin is synthesized in skin in presence of sunlight?", oa: "Vitamin A", ob: "Vitamin B12", oc: "Vitamin C", od: "Vitamin D", correct: 3 },
        { text: "The site of photosynthesis in plant cells is:", oa: "Mitochondria", ob: "Chloroplast", oc: "Ribosome", od: "Nucleus", correct: 1 },
        { text: "The normal human blood pressure is approximately:", oa: "80/40 mmHg", ob: "100/60 mmHg", oc: "120/80 mmHg", od: "160/100 mmHg", correct: 2 },
        { text: "Which biomolecule is the main structural component of cell membrane?", oa: "Cellulose", ob: "Phospholipid", oc: "Starch", od: "Glycogen", correct: 1 },
        { text: "The SI unit of electric current is:", oa: "Volt", ob: "Ohm", oc: "Ampere", od: "Coulomb", correct: 2 },
        { text: "A solution with pH less than 7 is:", oa: "Basic", ob: "Neutral", oc: "Acidic", od: "Salty", correct: 2 }
    ],
    FOUND: [
        { text: "The square of 12 is:", oa: "124", ob: "144", oc: "122", od: "154", correct: 1 },
        { text: "Which planet is known as the Red Planet?", oa: "Earth", ob: "Mars", oc: "Jupiter", od: "Venus", correct: 1 },
        { text: "The SI unit of length is:", oa: "Gram", ob: "Meter", oc: "Second", od: "Liter", correct: 1 },
        { text: "Water freezes at:", oa: "0 degree Celsius", ob: "50 degree Celsius", oc: "100 degree Celsius", od: "10 degree Celsius", correct: 0 },
        { text: "A triangle has how many sides?", oa: "2", ob: "3", oc: "4", od: "5", correct: 1 },
        { text: "Which part of a plant absorbs water from soil?", oa: "Leaf", ob: "Flower", oc: "Root", od: "Fruit", correct: 2 },
        { text: "Which gas is necessary for burning?", oa: "Oxygen", ob: "Nitrogen", oc: "Carbon dioxide", od: "Helium", correct: 0 }
    ]
};

Object.keys(curatedExtraQuestions).forEach(course => {
    curatedExtraQuestions[course].forEach(item => {
        questionsBank[course].push({
            en: { text: item.text, oa: item.oa, ob: item.ob, oc: item.oc, od: item.od },
            hi: { text: item.text, oa: item.oa, ob: item.ob, oc: item.oc, od: item.od },
            correct: item.correct
        });
    });
});

// Keep this as a short diagnostic test instead of filler placeholders.
function populateBank() {
    ['JEE', 'NEET', 'FOUND'].forEach(course => {
        let baseCount = questionsBank[course].length;
        for (let i = baseCount; i < 12; i++) {
            questionsBank[course].push({
                en: { text: `${course} Analytical Question No. ${i + 1}: Solve for x in the given system.`, oa: `Result A${i}`, ob: `Result B${i}`, oc: `Result C${i}`, od: `Result D${i}` },
                hi: { text: `${course} विश्लेषणात्मक प्रश्न संख्या ${i + 1}: दिए गए समीकरण को हल करें।`, oa: `उत्तर A${i}`, ob: `उत्तर B${i}`, oc: `उत्तर C${i}`, od: `उत्तर D${i}` },
                correct: Math.floor(Math.random() * 4)
            });
        }
    });
}

populateBank();
window.questionsBank = questionsBank;
