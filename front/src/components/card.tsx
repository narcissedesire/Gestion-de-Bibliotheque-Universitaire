import * as React from "react";
import { FaRegHeart } from "react-icons/fa6";
import { GoClock } from "react-icons/go";
import { LuCalendarDays } from "react-icons/lu";
import { MdClose, MdSettingsBackupRestore } from "react-icons/md";

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

// AlertNotification.jsx
export function AlertNotification({
  titre,
  icon,
  valeur,
  desc,
  couleur,
  onClick,
  className = "",
  styleIcon,
}) {
  return (
    <div
      className={`p-4 border border-gray-300 rounded-xl bg-white shadow-sm flex flex-col justify-between ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-sm font-medium truncate">{titre}</h1>
        <span className={`text-gray-500 ${styleIcon}`}>{icon}</span>
      </div>
      <div>
        <div
          className={`text-xl font-bold ${
            couleur ? "text-[#d4183d]" : "text-gray-900"
          }`}
        >
          {valeur}
        </div>
        <p className="text-xs text-gray-500">{desc}</p>
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

export function CardProfilEmprunt({
  dateEmprunt,
  dateRetour,
  status,
  dateRetourReel,
  returnLivre,
  titreLivre,
  auteurLivre,
}) {
  // Fonction pour la couleur du bouton
  const getButtonClasses = () => {
    if (status === "En cours") return "text-white bg-black hover:bg-black/80";
    if (status === "Retourné") return "text-black bg-white hover:bg-gray-100";
    if (status === "En retard") return "text-white bg-red-500 hover:bg-red-600";
    return "text-black bg-gray-200";
  };

  return (
    <div className="w-full flex flex-col items-start gap-4">
      {/* Header */}
      <div className="flex items-start justify-between w-full">
        <span>
          <h1 className="text-sm font-semibold">{titreLivre}</h1>
          <span className="text-xs font-light text-gray-500">
            par {auteurLivre}
          </span>
        </span>
        <span className="px-2 py-1 bg-gray-300 rounded-lg text-[10px]">
          {status}
        </span>
      </div>

      {/* Dates */}
      <div className="flex flex-col items-start gap-1">
        <div className="flex items-center gap-2 text-xs">
          <LuCalendarDays />
          <span>Emprunté le: {dateEmprunt}</span>
        </div>
        {status === "Retourné" ? (
          <div className="flex items-center gap-2 text-xs">
            <GoClock />
            <span>Retourné le: {dateRetourReel}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs">
            <GoClock />
            <span>Retour prévu: {dateRetour}</span>
          </div>
        )}
      </div>

      {/* Bouton */}
      {(status === "En cours" || status === "En retard") && (
        <button
          onClick={returnLivre}
          className={`flex items-center gap-2 text-xs px-2 py-1 border border-gray-300 rounded-md cursor-pointer ${getButtonClasses()}`}
        >
          {/* Icône */}
          {(status === "En cours" || status === "En retard") && (
            <MdSettingsBackupRestore />
          )}

          {/* Texte */}
          {(status === "En cours" || status === "En retard") && (
            <span>Retourner le livre</span>
          )}
        </button>
      )}
    </div>
  );
}

export function CardProfilReserve({
  dateRecuperationPrevu,
  dateReserve,
  status,
  durePrevu,
  titreLivre,
  auteurLivre,
  annuleResevation,
  position,
  reserverLivre,
}) {
  return (
    <div className="w-full flex flex-col items-start gap-4">
      <div className="flex items-start justify-between w-full">
        <span>
          <h1 className="text-sm font-semibold">{titreLivre}</h1>
          <span className="text-xs font-light text-gray-500">
            par {auteurLivre}
          </span>
        </span>
        <span className="px-2 py-1 border border-gray-400 rounded-md text-[10px]">
          Position {position}
        </span>
      </div>
      <div className="flex flex-col items-star gap-1">
        <div className="flex items-center gap-2 text-xs ">
          <span>
            <LuCalendarDays />
          </span>
          <span>Réservé le: {dateReserve}</span>
        </div>
        <div className="flex items-center gap-2 text-xs ">
          <span>
            <LuCalendarDays />
          </span>
          <span>Duree prevue: {durePrevu} jours</span>
        </div>
        <div className="flex items-center gap-2 text-xs ">
          <span>
            <LuCalendarDays />
          </span>
          <span>Recuperation prevue: {dateRecuperationPrevu}</span>
        </div>
        <div className="flex items-center gap-2 text-xs ">
          <span>
            <FaRegHeart />
          </span>
          <span>Status: {status}</span>
        </div>
      </div>
      {status === "En attente" || status === "Active" ? (
        <button
          onClick={annuleResevation}
          className="flex items-center gap-2 text-xs px-2 py-1 bg-red-500 text-white border border-gray-400 rounded-md cursor-pointer hover:bg-red-400 "
        >
          <span>
            <MdClose />
          </span>
          <span>Annuler reservation</span>
        </button>
      ) : (
        <button
          onClick={reserverLivre}
          className="flex items-center gap-2 text-xs px-2 py-1 bg-white text-black border border-gray-400 rounded-md cursor-pointer hover:bg-gray-200 "
        >
          <span>
            <FaRegHeart />
          </span>
          <span>Rereserver</span>
        </button>
      )}
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
