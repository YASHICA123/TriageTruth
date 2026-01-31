"use client"

import { useState } from "react"
import {
  User,
  Activity,
  AlertTriangle,
  MessageSquare,
  ThermometerSun,
  Heart,
  Gauge,
  Clock,
  FileText,
  Mic,
  ChevronRight,
  Shield,
  Brain,
  Stethoscope,
  Video,
  Building2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Sample patient data
const patientData = {
  name: "Sarah Mitchell",
  age: 34,
  visitType: "OPD",
  visitDate: "January 31, 2026",
  chiefComplaint: "Persistent abdominal pain for 2 weeks",
  vitals: {
    bloodPressure: "128/82",
    temperature: "98.6°F",
    heartRate: 78,
    oxygenSat: "98%",
  },
  symptomResponses: [
    {
      question: "How would you describe the pain?",
      answer: "It comes and goes, mostly in the evening after dinner.",
      hesitationScore: 0.2,
    },
    {
      question: "Have you experienced this before?",
      answer: "No, never. This is completely new.",
      hesitationScore: 0.65,
    },
    {
      question: "Are you currently taking any medications?",
      answer: "Just some vitamins, nothing prescription.",
      hesitationScore: 0.45,
    },
    {
      question: "How much alcohol do you consume weekly?",
      answer: "Maybe a glass of wine occasionally.",
      hesitationScore: 0.78,
    },
  ],
  pastVisitNotes:
    "Previous visit (Aug 2025): Patient reported similar symptoms but attributed to stress. Prescribed antacids. Follow-up recommended but patient did not return.",
}

// Risk factors with explanations
const riskFactors = [
  {
    id: 1,
    title: "Response Inconsistency",
    severity: "high",
    score: 78,
    shortDescription: "Contradicts previous medical records",
    fullExplanation:
      "Patient stated this is a 'completely new' symptom, but medical records from August 2025 show a similar complaint. This inconsistency suggests the patient may be minimizing symptom duration or recurrence patterns.",
    recommendation:
      "Gently reference previous visit without being accusatory. Focus on understanding what has changed since then.",
  },
  {
    id: 2,
    title: "Voice Hesitation Pattern",
    severity: "medium",
    score: 62,
    shortDescription: "Elevated hesitation on lifestyle questions",
    fullExplanation:
      "AI voice analysis detected significant hesitation (0.78 confidence) when asked about alcohol consumption. Response latency increased by 340% compared to baseline, and vocal stress markers were present.",
    recommendation:
      "Consider exploring lifestyle factors in a non-judgmental way. Frame questions around general wellness rather than specific consumption levels.",
  },
  {
    id: 3,
    title: "Medication Disclosure Gap",
    severity: "medium",
    score: 45,
    shortDescription: "Possible undisclosed medications",
    fullExplanation:
      "Patient mentioned 'just vitamins' but pharmacy records indicate a prescription for omeprazole was filled 3 months ago. This may indicate embarrassment about medication use or genuine forgetfulness.",
    recommendation:
      "Ask about any over-the-counter medications or supplements, including those purchased online or recommended by friends/family.",
  },
]

// Suggested clarification questions
const clarificationQuestions = [
  {
    id: 1,
    category: "Symptom History",
    question:
      "I see from your records you experienced something similar last year. Can you help me understand how this episode compares to that one?",
    purpose: "Addresses inconsistency without confrontation",
  },
  {
    id: 2,
    category: "Lifestyle",
    question:
      "Sometimes our eating and drinking habits change when we're stressed. Have there been any changes to your routine lately?",
    purpose: "Opens conversation about lifestyle factors",
  },
  {
    id: 3,
    category: "Medications",
    question:
      "Besides the vitamins you mentioned, are you taking anything else - even things like antacids or sleep aids?",
    purpose: "Probes for undisclosed medications",
  },
  {
    id: 4,
    category: "Pain Patterns",
    question:
      "You mentioned the pain comes after dinner. Can you walk me through what a typical dinner looks like for you?",
    purpose: "Indirectly explores dietary triggers",
  },
]

function ReliabilityGauge({ score }: { score: number }) {
  const getColor = () => {
    if (score >= 80) return "text-emerald-500"
    if (score >= 60) return "text-amber-500"
    return "text-rose-500"
  }

  const getLabel = () => {
    if (score >= 80) return "High Reliability"
    if (score >= 60) return "Moderate Reliability"
    return "Low Reliability"
  }

  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted/30"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            className={`${getColor()} transition-all duration-1000 ease-out`}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: strokeDashoffset,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-bold ${getColor()}`}>{score}</span>
          <span className="text-xs text-muted-foreground">/100</span>
        </div>
      </div>
      <span className={`mt-2 text-sm font-medium ${getColor()}`}>{getLabel()}</span>
    </div>
  )
}

function RiskFactorCard({
  factor,
  isExpanded,
  onToggle,
}: {
  factor: (typeof riskFactors)[0]
  isExpanded: boolean
  onToggle: () => void
}) {
  const severityColors = {
    high: "bg-rose-500/10 text-rose-600 border-rose-500/20",
    medium: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    low: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  }

  const severityBadgeColors = {
    high: "bg-rose-500 text-white",
    medium: "bg-amber-500 text-white",
    low: "bg-emerald-500 text-white",
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={onToggle}
            className={`w-full text-left p-4 rounded-xl border transition-all duration-300 hover:shadow-md ${
              severityColors[factor.severity as keyof typeof severityColors]
            } ${isExpanded ? "ring-2 ring-primary/20" : ""}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span className="font-semibold truncate">{factor.title}</span>
                </div>
                <p className="text-sm opacity-80">{factor.shortDescription}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge
                  className={`text-xs ${severityBadgeColors[factor.severity as keyof typeof severityBadgeColors]}`}
                >
                  {factor.severity}
                </Badge>
                <span className="text-xs font-mono">{factor.score}%</span>
              </div>
            </div>

            {isExpanded && (
              <div className="mt-4 pt-4 border-t border-current/10 space-y-3">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide mb-1 opacity-70">
                    Analysis
                  </h4>
                  <p className="text-sm">{factor.fullExplanation}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide mb-1 opacity-70">
                    Recommendation
                  </h4>
                  <p className="text-sm">{factor.recommendation}</p>
                </div>
              </div>
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side="left" className="max-w-xs">
          <p>Click to {isExpanded ? "collapse" : "expand"} details</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

function ClarificationQuestion({
  item,
  isExpanded,
  onToggle,
}: {
  item: (typeof clarificationQuestions)[0]
  isExpanded: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`w-full text-left p-4 rounded-xl border border-primary/20 bg-primary/5 transition-all duration-300 hover:bg-primary/10 hover:shadow-md ${
        isExpanded ? "ring-2 ring-primary/30" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <MessageSquare className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <Badge variant="outline" className="mb-2 text-xs">
            {item.category}
          </Badge>
          <p className="text-sm font-medium text-foreground">{item.question}</p>
          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-primary/10">
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold">Purpose:</span> {item.purpose}
              </p>
            </div>
          )}
        </div>
        <ChevronRight
          className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${
            isExpanded ? "rotate-90" : ""
          }`}
        />
      </div>
    </button>
  )
}

export function TriageTruthDashboard() {
  const [expandedRisk, setExpandedRisk] = useState<number | null>(1)
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null)
  const reliabilityScore = 54

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">TriageTruth</h1>
                <p className="text-xs text-muted-foreground">Medical Reliability Assessment</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="hidden sm:flex gap-1">
                <Brain className="w-3 h-3" />
                AI Analysis Active
              </Badge>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Stethoscope className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium hidden sm:inline">Dr. Johnson</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Patient Info Bar */}
        <Card className="border-l-4 border-l-primary">
          <CardContent className="py-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <User className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">{patientData.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {patientData.age} years old • {patientData.chiefComplaint}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant="outline"
                  className="gap-1 bg-primary/5 border-primary/20 text-primary"
                >
                  {patientData.visitType === "OPD" ? (
                    <Building2 className="w-3 h-3" />
                  ) : (
                    <Video className="w-3 h-3" />
                  )}
                  {patientData.visitType}
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Clock className="w-3 h-3" />
                  {patientData.visitDate}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Score & Vitals */}
          <div className="lg:col-span-4 space-y-6">
            {/* Reliability Score */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-primary" />
                  Data Reliability Score
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center py-6">
                <ReliabilityGauge score={reliabilityScore} />
                <p className="mt-4 text-center text-sm text-muted-foreground max-w-[200px]">
                  Based on response consistency, voice analysis, and record comparison
                </p>
              </CardContent>
            </Card>

            {/* Vitals */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" />
                  Current Vitals
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Heart className="w-4 h-4" />
                    <span className="text-xs">Blood Pressure</span>
                  </div>
                  <p className="text-lg font-bold text-foreground">
                    {patientData.vitals.bloodPressure}
                  </p>
                  <p className="text-xs text-muted-foreground">mmHg</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <ThermometerSun className="w-4 h-4" />
                    <span className="text-xs">Temperature</span>
                  </div>
                  <p className="text-lg font-bold text-foreground">
                    {patientData.vitals.temperature}
                  </p>
                  <p className="text-xs text-muted-foreground">Normal</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Activity className="w-4 h-4" />
                    <span className="text-xs">Heart Rate</span>
                  </div>
                  <p className="text-lg font-bold text-foreground">
                    {patientData.vitals.heartRate}
                  </p>
                  <p className="text-xs text-muted-foreground">BPM</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Gauge className="w-4 h-4" />
                    <span className="text-xs">SpO2</span>
                  </div>
                  <p className="text-lg font-bold text-foreground">
                    {patientData.vitals.oxygenSat}
                  </p>
                  <p className="text-xs text-muted-foreground">Oxygen</p>
                </div>
              </CardContent>
            </Card>

            {/* Past Visit Notes */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Previous Visit Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {patientData.pastVisitNotes}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Symptom Responses & Risk Factors */}
          <div className="lg:col-span-4 space-y-6">
            {/* Symptom Responses */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Mic className="w-4 h-4 text-primary" />
                  Symptom Responses
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {patientData.symptomResponses.map((response, index) => (
                  <div key={index} className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">
                      {response.question}
                    </p>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-sm text-foreground">{`"${response.answer}"`}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Hesitation:</span>
                      <Progress
                        value={response.hesitationScore * 100}
                        className="h-1.5 flex-1"
                      />
                      <span
                        className={`text-xs font-mono ${
                          response.hesitationScore > 0.5
                            ? "text-amber-500"
                            : "text-emerald-500"
                        }`}
                      >
                        {Math.round(response.hesitationScore * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Risk Factors */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-primary" />
                  Reliability Risk Factors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {riskFactors.map((factor) => (
                  <RiskFactorCard
                    key={factor.id}
                    factor={factor}
                    isExpanded={expandedRisk === factor.id}
                    onToggle={() =>
                      setExpandedRisk(expandedRisk === factor.id ? null : factor.id)
                    }
                  />
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Clarification Questions */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="h-fit">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  Suggested Clarification Questions
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  AI-generated neutral questions to help clarify potential inconsistencies
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {clarificationQuestions.map((item) => (
                  <ClarificationQuestion
                    key={item.id}
                    item={item}
                    isExpanded={expandedQuestion === item.id}
                    onToggle={() =>
                      setExpandedQuestion(expandedQuestion === item.id ? null : item.id)
                    }
                  />
                ))}
              </CardContent>
            </Card>

            {/* AI Analysis Summary */}
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Brain className="w-4 h-4 text-primary" />
                  AI Analysis Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-foreground leading-relaxed">
                  The patient&apos;s responses show moderate reliability concerns. Primary
                  issues include inconsistency with past medical records regarding symptom
                  history, and elevated voice hesitation markers on lifestyle-related
                  questions.
                </p>
                <div className="pt-3 border-t border-border">
                  <h4 className="text-xs font-semibold text-muted-foreground mb-2">
                    Confidence Breakdown
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Record Comparison</span>
                      <span className="font-medium text-rose-500">42%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Voice Analysis</span>
                      <span className="font-medium text-amber-500">58%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Response Consistency</span>
                      <span className="font-medium text-amber-500">62%</span>
                    </div>
                  </div>
                </div>
                <Button className="w-full gap-2">
                  <FileText className="w-4 h-4" />
                  Generate Full Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
