import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface RoleTileProps {
  title: string;
  icon: string;
  onClick: () => void;
}

export const RoleTile = ({ title, icon, onClick }: RoleTileProps) => {
  return (
    <Card 
      className="group relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 border-border hover:border-primary bg-card"
      onClick={onClick}
    >
      <div className="aspect-square p-8 flex flex-col items-center justify-center gap-6">
        <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-110">
          <img src={icon} alt={title} className="w-full h-full object-cover" />
        </div>
        <h3 className="text-2xl font-bold text-foreground text-center group-hover:text-primary transition-colors">
          {title}
        </h3>
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-secondary/0 group-hover:from-primary/5 group-hover:to-secondary/5 transition-all duration-300 pointer-events-none" />
    </Card>
  );
};
