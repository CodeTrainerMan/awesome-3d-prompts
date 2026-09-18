import { Gallery } from '@/components/Gallery';
import { catalog } from '@/lib/catalog';

export default function Home() {
  return <Gallery catalog={catalog} />;
}
