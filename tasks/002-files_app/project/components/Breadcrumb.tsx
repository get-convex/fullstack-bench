"use client";

import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

export default function Breadcrumb({
  pathSegments,
  projectId,
  children,
}: {
  pathSegments: string[];
  projectId: string;
  children?: React.ReactNode;
}) {
  const segments = ["Root", ...pathSegments];
  const breadcrumbPath = segments.map((segment, index) => ({
    name: segment,
    path: segments.slice(0, index + 1).join("/"),
    isLast: index === segments.length - 1,
    href:
      index === 0
        ? `/projects/${projectId}/files`
        : `/projects/${projectId}/files/${segments
            .slice(1, index + 1)
            .join("/")}`,
  }));
  return (
    <div className="px-4 py-3 flex space-x-1 text-sm text-gray-400 border-b border-gray-800 justify-between">
      <div className="flex items-center">
        {breadcrumbPath.map((segment, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRightIcon className="w-4 h-4 mx-1 text-gray-400" />
            )}
            {segment.isLast ? (
              <span className="text-white font-medium">
                {segment.name}
              </span>
            ) : (
              <Link
                href={segment.href}
                className="hover:text-white transition-colors"
              >
                {segment.name}
              </Link>
            )}
          </div>
        ))}
      </div>
      <div>
      {children}
      </div>
    </div>
  );
}
