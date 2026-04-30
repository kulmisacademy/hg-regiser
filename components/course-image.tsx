import Image from "next/image";
import { cn } from "@/lib/utils";

export function CourseImage({
  src,
  alt,
  priority = false,
  className
}: {
  src?: string | null;
  alt: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("relative w-full overflow-hidden rounded-2xl bg-white", className)}>
      <div className="relative aspect-[4/3] w-full sm:aspect-[16/10]">
        <Image
          src={src || "/logo.jpg"}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 672px"
          className="object-contain p-1"
        />
      </div>
    </div>
  );
}
