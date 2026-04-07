
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface TimelineProps extends React.HTMLAttributes<HTMLOListElement> {
  children: React.ReactNode
}

const Timeline = React.forwardRef<HTMLOListElement, TimelineProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <ol
        ref={ref}
        className={cn("flex flex-col", className)}
        {...props}
      >
        {children}
      </ol>
    )
  }
)
Timeline.displayName = "Timeline"

interface TimelineItemProps extends React.HTMLAttributes<HTMLLIElement> {
  children: React.ReactNode
}

const TimelineItem = React.forwardRef<HTMLLIElement, TimelineItemProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <li
        ref={ref}
        className={cn("relative flex flex-row gap-3 pt-4 first:pt-0", className)}
        {...props}
      >
        {children}
      </li>
    )
  }
)
TimelineItem.displayName = "TimelineItem"

interface TimelineConnectorProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const TimelineConnector = React.forwardRef<
  HTMLDivElement,
  TimelineConnectorProps
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "absolute left-4 top-4 -z-10 h-full w-px bg-border",
        className
      )}
      {...props}
    />
  )
})
TimelineConnector.displayName = "TimelineConnector"

interface TimelineHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const TimelineHeader = React.forwardRef<HTMLDivElement, TimelineHeaderProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col items-start gap-3", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
TimelineHeader.displayName = "TimelineHeader"

interface TimelineIconProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const TimelineIcon = React.forwardRef<HTMLDivElement, TimelineIconProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex size-8 items-center justify-center rounded-full border border-border bg-background",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
TimelineIcon.displayName = "TimelineIcon"

const TimelineTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ children, className, ...props }, ref) => {
  return (
    <h3
      ref={ref}
      className={cn("font-semibold text-foreground", className)}
      {...props}
    >
      {children}
    </h3>
  )
})
TimelineTitle.displayName = "TimelineTitle"

const TimelineBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex w-full flex-col gap-2 rounded-md border border-border bg-background p-4",
        className
      )}
      {...props}
    />
  )
})
TimelineBody.displayName = "TimelineBody"

const TimelineDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-xs text-muted-foreground", className)}
      {...props}
    />
  )
})
TimelineDescription.displayName = "TimelineDescription"

export {
  Timeline,
  TimelineBody,
  TimelineConnector,
  TimelineDescription,
  TimelineHeader,
  TimelineIcon,
  TimelineItem,
  TimelineTitle,
}
