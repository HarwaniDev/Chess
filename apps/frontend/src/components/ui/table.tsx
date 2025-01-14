import * as React from "react"
import { cn } from "@/lib/utils"

type TableProps = React.HTMLAttributes<HTMLTableElement> & {
  ref?: React.Ref<HTMLTableElement>
}

type TableSectionProps = React.HTMLAttributes<HTMLTableSectionElement> & {
  ref?: React.Ref<HTMLTableSectionElement>
}

type TableRowProps = React.HTMLAttributes<HTMLTableRowElement> & {
  ref?: React.Ref<HTMLTableRowElement>
}

type TableCellProps = React.TdHTMLAttributes<HTMLTableCellElement> & {
  ref?: React.Ref<HTMLTableCellElement>
}

type TableHeadProps = React.ThHTMLAttributes<HTMLTableCellElement> & {
  ref?: React.Ref<HTMLTableCellElement>
}

type TableCaptionProps = React.HTMLAttributes<HTMLTableCaptionElement> & {
  ref?: React.Ref<HTMLTableCaptionElement>
}

const Table = ({ className, ...props }: TableProps) => (
  <div className="relative w-full overflow-auto">
    <table
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
)

const TableHeader = ({ className, ...props }: TableSectionProps) => (
  <thead ref={props.ref} className={cn("[&_tr]:border-b", className)} {...props} />
)

const TableBody = ({ className, ...props }: TableSectionProps) => (
  <tbody
    ref={props.ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
)

const TableFooter = ({ className, ...props }: TableSectionProps) => (
  <tfoot
    ref={props.ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
)

const TableRow = ({ className, ...props }: TableRowProps) => (
  <tr
    ref={props.ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
)

const TableHead = ({ className, ...props }: TableHeadProps) => (
  <th
    ref={props.ref}
    className={cn(
      "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props}
  />
)

const TableCell = ({ className, ...props }: TableCellProps) => (
  <td
    ref={props.ref}
    className={cn(
      "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props}
  />
)

const TableCaption = ({ className, ...props }: TableCaptionProps) => (
  <caption
    ref={props.ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
)

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
