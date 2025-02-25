import Image from 'next/image';
import styles from './page.module.css';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className={styles.page}>
      <h1 className="text-9xl text-amber-300 font-bold underline">VESPAIO!</h1>
      <Button variant="outline">Hello ShadCN!</Button>
    </div>
  );
}
