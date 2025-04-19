import React from "react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

type CategoryCardProps = {
  title: string;
  description: string;
  url: string;
  icon: LucideIcon;
  accentColor: string;
};

const CategoryCard = ({ title, description, url, icon: Icon, accentColor }: CategoryCardProps) => {
  return (
    <Link href={url} className="group flex flex-col items-center bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow duration-300">
      {/* Wrap children in a single parent container */}
      <div>
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br ${accentColor} to-transparent mb-4 group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="w-8 h-8 text-gray-800" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600 text-center">{description}</p>
      </div>
    </Link>
  );
};

export default CategoryCard;