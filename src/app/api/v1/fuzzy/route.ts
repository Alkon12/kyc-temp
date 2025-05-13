import { NextRequest, NextResponse } from 'next/server'
import { apiKeyAuth } from '@/middleware/apiKeyAuth'
import { fuzzy } from 'fast-fuzzy'

interface FuzzyCandidate {
  id: number | string
  text: string
}

interface FuzzyRequest {
  base: string
  candidates: FuzzyCandidate[]
}

interface FuzzyResponse extends FuzzyCandidate {
  score: number
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as FuzzyRequest
    
    if (!body.base || !body.candidates || !Array.isArray(body.candidates)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid request format. Expected {base: string, candidates: Array<{id: number|string, text: string}>}'
      }, { status: 400 })
    }
    
    const { base, candidates } = body
    
    // Calcular similitud usando fast-fuzzy
    const results: FuzzyResponse[] = candidates.map(candidate => {
      const score = fuzzy(base, candidate.text)
      return {
        id: candidate.id,
        text: candidate.text,
        score
      }
    })
    
    // Ordenar resultados por puntuación descendente
    results.sort((a, b) => b.score - a.score)
    
    return NextResponse.json(results)
    
  } catch (error) {
    console.error('Error in fuzzy matching API route:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal Server Error' 
    }, { status: 500 })
  }
} 