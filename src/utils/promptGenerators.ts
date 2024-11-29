import { VerificationData } from '../types/verification'

export const generateQuestionPromptContent = (data: VerificationData): string => {
  return `You are an intelligent system with access to a vast amount of information. I will provide you with a knowledge graph in the form of triples (subject, predicate, object). 

Your task is to generate ten questions based on the knowledge graph. The questions should assess understanding and insight into the information presented in the graph. Provide the output in JSON format, with each question having a unique identifier.

Instructions:
    1. Analyze the provided knowledge graph.
    2. Generate ten questions that are relevant to the information in the knowledge graph.
    3. Provide the questions in JSON format, each with a unique identifier.

Examples:
Albert Einstein bornIn Ulm
Expected Response:
    {
        "questions": [
          {"id": 1, "question": "Where was Albert Einstein born?"},
          {"id": 2, "question": "What is Albert Einstein known for?"},
          {"id": 3, "question": "In what year was the Theory of Relativity published?"},
          {"id": 4, "question": "Where did Albert Einstein work?"},
          {"id": 5, "question": "What prestigious award did Albert Einstein win?"},
          {"id": 6, "question": "Which theory is associated with Albert Einstein?"},
          {"id": 7, "question": "Which university did Albert Einstein work at?"},
          {"id": 8, "question": "What did Albert Einstein receive the Nobel Prize in?"},
          {"id": 9, "question": "In what field did Albert Einstein win a Nobel Prize?"},
          {"id": 10, "question": "Name the city where Albert Einstein was born."}
        ]
    }

Current Input:
Subject: ${data.subject}
Predicate: ${data.predicate}
Object: ${data.object}

Human Readable: ${data.human_readable}

The output should be provided in JSON format with the following structure:
{
    "questions": [
        {"id": number, "question": string}
    ]
}`
}

export const generateHumanReadablePrompt = (data: VerificationData): string => {
  return `Task Description: Convert a knowledge graph triple into a meaningful human-readable sentence.

Instructions: Given a subject, predicate, and object from a knowledge graph, form a grammatically correct and meaningful sentence that conveys the relationship between them.

Examples:
Input:
Subject: Alexander_III_of_Russia
Predicate: isMarriedTo
Object: Maria_Feodorovna__Dagmar_of_Denmark_
Output: {"output": "Alexander III of Russia is married to Maria Feodorovna, also known as Dagmar of Denmark."}

Subject: Quentin_Tarantino
Predicate: produced
Object: From_Dusk_till_Dawn
Output: {"output": "Quentin Tarantino produced the film From Dusk till Dawn."}

Do the following:
Input:
Subject: ${data.subject}
Predicate: ${data.predicate}
Object: ${data.object}

The output should be a JSON object with the key "output" and the value as the sentence. The sentence should be human-readable and grammatically correct.
    `

}