

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MetaverseCountdown from '@/components/metaverse-countdown';
import { ArrowRight } from 'lucide-react';
import NftTryOnDialog from '@/components/nft-try-on-dialog';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';

export default function MetaversePage() {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30);

    const nftItems = PlaceHolderImages.filter(img => img.id.startsWith("nft-"));

    return (
        <div className="bg-black text-white">
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center text-center">
                <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="absolute inset-0 w-full h-full object-cover opacity-50"
                    poster="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=3432&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                >
                    <source src="https://storage.googleapis.com/studio-hosting-assets/DLS_ALL_06_18_24.mp4" type="video/mp4" />
                </video>
                 <div className="absolute inset-0 bg-black/50" />
                 <div className="relative z-10 p-4 flex flex-col items-center">
                    <h1 className="text-sm md:text-7xl font-headline font-extrabold tracking-tight">
                        Syntha: The Metaverse
                    </h1>
                    <p className="mt-4 max-w-2xl text-sm md:text-base text-gray-300">
                        Где мода становится иммерсивной. Присоединяйтесь к запуску нашего цифрового пространства.
                    </p>
                    <div className="mt-12">
                        <MetaverseCountdown targetDate={targetDate} />
                    </div>
                    <form className="mt-12 flex w-full max-w-md items-center space-x-2">
                        <Input type="email" placeholder="Введите ваш email" className="bg-white/10 border-white/20 placeholder:text-gray-400 h-12 text-base" />
                        <Button type="submit" size="lg" variant="secondary" className="h-12">Получить ранний доступ</Button>
                    </form>
                </div>
            </section>
            
            {/* Featured NFTs Section */}
            <section className="container mx-auto px-4 py-10 text-center">
                <h2 className="text-base md:text-sm font-headline font-bold mb-4">Цифровые активы</h2>
                <p className="max-w-2xl mx-auto text-sm text-gray-400 mb-12">
                   Эксклюзивные цифровые коллекционные предметы, которые можно использовать в метавселенной и AR.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                   {nftItems.map(item => (
                     <div key={item.id} className="group relative rounded-lg overflow-hidden border border-white/10 bg-white/5">
                        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden">
                            <Image 
                                src={item.imageUrl} 
                                alt={item.description} 
                                fill
                                className="object-cover"
                                data-ai-hint={item.imageHint}
                            />
                        </div>
                        <div className="p-4">
                            <h3 className="font-semibold text-sm">{item.description}</h3>
                            <p className="text-sm text-gray-400">Лимитированная серия</p>
                        </div>
                     </div>
                   ))}
                </div>
                 <Button asChild size="lg" className="mt-12">
                    <Link href="/shop">Посмотреть всю коллекцию <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
            </section>

        </div>
    )
}
