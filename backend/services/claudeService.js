require('dotenv').config();

const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeText = async (text) => {
    const prompt = `Analizza il seguente testo ed estrai i task.
     Per ogni task identifica: text (descrizione breve), priority ("oggi"/"domani"/"dopo"), category ("lavoro"/"università"/"personale"/"altro"), deadline (scadenza se presente, altrimenti null). 
     Rispondi SOLO con un array JSON valido, senza testo aggiuntivo.
    Esempio: [{"text":"Studia matematica","priority":"oggi","category":"università","deadline":"domani"}]
    Testo da analizzare:
    ${text}`;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const result = await model.generateContent(prompt);
    const raw = result.response.text();

    const clean = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
};

module.exports = { analyzeText };