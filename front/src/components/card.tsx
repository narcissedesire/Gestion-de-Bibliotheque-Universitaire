import * as React from "react";

export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(" ");
}

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border",
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <h4
      data-slot="card-title"
      className={cn("leading-none", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6 [&:last-child]:pb-6", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 pb-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
}

export function AlertNotification({
  titre,
  icon,
  valeur,
  desc,
  couleur,
  onClick,
  className = "",
}) {
  return (
    <div
      className={`p-5 border border-gray-400 rounded-xl ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between pb-7">
        <h1 className="text-sm font-medium">{titre}</h1>
        {icon}
      </div>
      <div>
        <div
          className={`text-lg font-bold ${
            couleur ? "text-[#d4183d]" : "text-black"
          }`}
        >
          {valeur}
        </div>
        <p className="text-xs text-[#717182] whitespace-nowrap">{desc}</p>
      </div>
    </div>
  );
}

export function CardStat({ titre, desc, children }) {
  return (
    <div className="border border-gray-300 rounded-xl p-6 flex flex-col gap-4">
      <div className="flex flex-col items-start gap-1">
        <h2>{titre}</h2>
        <p className="text-xs text-[#717182]">{desc}</p>
      </div>
      <div className="min-h-10">{children}</div>
    </div>
  );
}

export function HeaderDash({ titre, desc, children }) {
  return (
    <div className="mb-7 flex flex-col py-2 gap-2 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">{titre}</h1>
        <div>{children}</div>
      </div>
      <span className="text-sm font-normal">{desc}</span>
    </div>
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
