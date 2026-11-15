import Image from "next/image";

export function Photo({ image, alt, className, priority, sizes = "(max-width: 700px) 100vw, 50vw" }: {
  image: string; alt: string; className?: string; priority?: boolean; sizes?: string;
}) {
  return <Image src={"/images/" + image + ".webp"} alt={alt} fill sizes={sizes} className={className} preload={priority} />;
}
