require('dotenv').config();

const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeText = async (text) => {
    const prompt = `Analizza il seguente testo ed estrai i task. Per ogni task identifica:
    - text: descrizione breve e chiara del task
    - priority: "oggi", "domani", o "dopo" in base all'urgenza
    - category: "lavoro", "università", "personale", o "altro"
    - deadline: scadenza se presente nel testo (es. "entro 3 giorni"), altrimenti null
    
    Rispondi SOLO con un array JSON valido, senza testo aggiuntivo e senza backtick.
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