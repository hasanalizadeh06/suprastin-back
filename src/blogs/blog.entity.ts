import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Blog {
  @PrimaryGeneratedColumn('uuid')
  id: string;



  @Column('simple-json')
  title: { ru: string; az: string };


  @Column('simple-json')
  content: { ru: string; az: string };

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column('simple-array')
  images: string[]; // S3 URL'leri
}
