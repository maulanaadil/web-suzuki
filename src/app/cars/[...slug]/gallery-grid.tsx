import Image from "next/image";

export type GalleryImage = {
  url: string;
  title: string | null;
  content: string | null;
};

export default function GalleryGrid({ images }: { images: GalleryImage[] }) {
  if (images.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {images.map((img, idx) => (
        <div key={`${img.url}-${idx}`} className="flex flex-col gap-2">
          <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
            <Image
              src={img.url}
              alt={img.title ?? `Image ${idx + 1}`}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          {img.title && (
            <p className="font-sans text-sm font-semibold text-foreground">
              {img.title}
            </p>
          )}
          {img.content && (
            <p className="font-sans text-xs leading-relaxed text-gray-500">
              {img.content}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
