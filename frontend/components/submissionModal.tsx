"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Card, CardContent } from "./ui/card"
import { CheckCircle2, Lightbulb, BookOpen, Sparkles } from "lucide-react"

interface SubmissionModalProps {
  feedbackData: {
    analysis: string
    improvements: string
  } | null
  openFeedback: boolean
  setOpenFeedback: (open: boolean) => void
}

export default function SubmissionModal({ feedbackData, openFeedback, setOpenFeedback }: SubmissionModalProps) {
  return (
    <Dialog open={openFeedback} onOpenChange={setOpenFeedback}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden bg-white dark:bg-gray-900">
        <DialogHeader className="border-b border-gray-200 dark:border-gray-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">Tutor Feedback</DialogTitle>
              <DialogDescription className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Personalized insights to help you improve
              </DialogDescription>
            </div>
          </div>
          <Badge
            variant="secondary"
            className="absolute top-0 right-0 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
          >
            <Sparkles className="w-3 h-3 mr-1" />
            AI-Powered
          </Badge>
        </DialogHeader>

        {feedbackData && (
          <div className="space-y-4 overflow-y-auto max-h-[60vh] py-4">
            <Card className="border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Solution Analysis</h3>
                </div>
                <div className="pl-11">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-sm">
                    {feedbackData.analysis}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Suggested Improvements</h3>
                </div>
                <div className="pl-11">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-sm">
                    {feedbackData.improvements}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {!feedbackData && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">No feedback available</p>
          </div>
        )}

        <DialogFooter className="pt-4 border-t border-gray-200 dark:border-gray-800">
          <Button
            onClick={() => setOpenFeedback(false)}
            className="bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900"
          >
            Got it, thanks!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
