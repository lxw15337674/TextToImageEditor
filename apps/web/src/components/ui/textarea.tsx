import * as React from "react"
import ReactTextareaAutosize from "react-textarea-autosize"

import { cn } from "@/lib/utils"

const textareaClassName =
  "flex min-h-[80px] w-full rounded-md border border-input bg-muted px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(textareaClassName, className)}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

const TextareaAutosize = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<typeof ReactTextareaAutosize>
>(({ className, ...props }, ref) => {
  return (
    <ReactTextareaAutosize
      className={cn(textareaClassName, className)}
      ref={ref}
      {...props}
    />
  )
})
TextareaAutosize.displayName = "TextareaAutosize"

export { Textarea, TextareaAutosize, textareaClassName }
