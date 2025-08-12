import { HfInference } from '@huggingface/inference';
import { NextResponse } from 'next/server';

const hf = new HfInference(process.env.HF_TOKEN);

export async function POST(req: Request) {
  try {
    if (!process.env.HF_TOKEN) {
      console.error('HF_TOKEN is missing in .env');
      return NextResponse.json({ error: 'Hugging Face API token is missing' }, { status: 500 });
    }

    const { nlQuery } = await req.json();
    if (!nlQuery) {
      return NextResponse.json({ error: 'Missing nlQuery in request body' }, { status: 400 });
    }

    const dbSchema = `
      CREATE TABLE Employee (
        id INTEGER PRIMARY KEY,
        name TEXT,
        department TEXT,
        salary REAL
      );
    `;

    const prompt = `
    ### Task
    Generate a SQL query for PostgreSQL based on the given schema and natural language question.

    ### Schema
    ${dbSchema}

    ### Question
    ${nlQuery}

    ### Instructions
    - Generate a valid PostgreSQL query to answer the question.
    - Use only the tables and columns provided in the schema.
    - Output only the SQL query, no explanations or extra text.
    `;

    const response = await hf.textGeneration({
      model: 'defog/sqlcoder-7b-2',
      inputs: prompt,
      parameters: { max_new_tokens: 512, temperature: 0.2, top_p: 0.9 },
    });

    const sql = response.generated_text.trim();
    return NextResponse.json({ sql });
  } catch (error: any) {
    console.error('Error in /api/generate-sql:', {
      message: error.message,
      status: error.status,
      stack: error.stack,
    });
    if (error.message.includes('401')) {
      return NextResponse.json({ error: 'Invalid Hugging Face API token' }, { status: 401 });
    }
    if (error.message.includes('429')) {
      return NextResponse.json({ error: 'Hugging Face API rate limit exceeded' }, { status: 429 });
    }
    return NextResponse.json({ error: error.message || 'Failed to generate SQL' }, { status: 500 });
  }
}