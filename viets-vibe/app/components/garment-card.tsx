import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import type { Garment } from "../lib/heritage";
export function GarmentCard({ garment }: { garment: Garment }) {
  return (
    <article className="heritage-tile">
      <Link href={`/heritage/${garment.id}`} className="garment-card">
        <div className={`garment-photo photo-${garment.id}`}>
          <Image
            src={garment.image}
            alt={`${garment.name} — ảnh tham khảo đương đại`}
            fill
            sizes="(max-width: 700px) 90vw, 30vw"
            style={{ objectPosition: garment.objectPosition }}
          />
          <span className="image-tag">{garment.tag}</span>
          <span className="card-arrow">
            <ArrowUpRight size={23} />
          </span>
        </div>
        <div className="garment-title">
          <h3>{garment.name}</h3>
          <span>{garment.region}</span>
        </div>
        <p>{garment.description}</p>
      </Link>
      <div className="heritage-tile-footer">
        <span>{garment.regionGroup}</span>
        <Link href={`/mix-match?garment=${garment.id}`}>
          Thử phối <Plus size={13} />
        </Link>
      </div>
    </article>
  );
}
