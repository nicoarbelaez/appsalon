import { Head, Link, usePage } from '@inertiajs/react';
import { CalendarDays, Clock, Scissors, Sparkles, Star, Phone, ArrowRight, MapPin, Instagram, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { dashboard, login, register } from '@/routes';

interface Servicio {
    id: number;
    nombre: string;
    precio: string;
    descripcion: string | null;
    duracion: number;
}

export default function Welcome({
    canRegister = true,
    servicios = [],
}: {
    canRegister?: boolean;
    servicios?: Servicio[];
}) {
    const { auth } = usePage().props as unknown as { auth: { user: null | { nombre: string } } };

    return (
        <>
            <Head title="AppSalon — Salón de Belleza Premium" />

            <div className="min-h-screen bg-[#faf9f6] text-[#2c2724] selection:bg-[#c5a880]/30 dark:bg-[#121110] dark:text-[#f3efea]">
                
                {/* Navbar */}
                <header className="sticky top-0 z-50 border-b border-[#e6e2da] bg-[#faf9f6]/90 backdrop-blur-md dark:border-[#252321] dark:bg-[#121110]/90">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#352018] text-[#c5a880] dark:bg-[#c5a880] dark:text-[#121110]">
                                <Scissors className="h-4.5 w-4.5" />
                            </div>
                            <span className="font-serif text-2xl font-bold tracking-wide text-[#352018] dark:text-white">
                                App<span className="font-light italic text-[#c5a880]">Salon</span>
                            </span>
                        </div>

                        <nav className="hidden items-center gap-8 md:flex">
                            <a href="#servicios" className="font-sans text-sm font-medium tracking-wider uppercase text-[#5a524e] transition-colors hover:text-[#c5a880] dark:text-[#c7bfb9]">
                                Servicios
                            </a>
                            <a href="#contacto" className="font-sans text-sm font-medium tracking-wider uppercase text-[#5a524e] transition-colors hover:text-[#c5a880] dark:text-[#c7bfb9]">
                                Contacto
                            </a>
                        </nav>

                        <div className="flex items-center gap-4">
                            {auth.user ? (
                                <Button asChild className="rounded-full bg-[#352018] font-sans tracking-wide text-white hover:bg-[#4d3228] dark:bg-[#c5a880] dark:text-[#121110] dark:hover:bg-[#d6bda0]">
                                    <Link href={dashboard()}>Mi Panel</Link>
                                </Button>
                            ) : (
                                <>
                                    <Button variant="ghost" asChild className="rounded-full text-[#352018] hover:bg-[#352018]/5 dark:text-[#f3efea] dark:hover:bg-[#f3efea]/5">
                                        <Link href={login()}>Iniciar Sesión</Link>
                                    </Button>
                                    {canRegister && (
                                        <Button asChild className="rounded-full bg-[#352018] font-sans tracking-wide text-white hover:bg-[#4d3228] dark:bg-[#c5a880] dark:text-[#121110] dark:hover:bg-[#d6bda0]">
                                            <Link href={register()}>Registrarse</Link>
                                        </Button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="relative overflow-hidden py-28 md:py-36">
                    {/* Layered decorative background mesh */}
                    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                        <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#c5a880]/10 blur-[100px] dark:bg-[#c5a880]/5" />
                        <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-[#352018]/5 blur-[80px] dark:bg-[#c5a880]/5" />
                        {/* Subtle noise texture or sand overlay simulated in CSS */}
                        <div className="absolute inset-0 opacity-[0.015] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] dark:opacity-[0.03]" />
                    </div>

                    <div className="relative mx-auto max-w-5xl px-6 text-center">
                        <Badge className="mb-8 border border-[#c5a880]/30 bg-[#faf9f6] px-4 py-1.5 font-sans text-xs font-semibold tracking-widest uppercase text-[#352018] shadow-sm hover:bg-[#faf9f6] dark:bg-[#1c1a19] dark:text-[#c5a880]">
                            <Sparkles className="mr-2 h-3.5 w-3.5 text-[#c5a880]" />
                            Salón de Belleza & Spa Premium
                        </Badge>

                        <h1 className="mb-8 font-serif text-5xl font-normal leading-[1.1] tracking-tight text-[#352018] dark:text-white md:text-7xl lg:text-8xl">
                            Realza tu belleza,<br />
                            <span className="font-light italic text-[#c5a880]">inspira confianza</span>
                        </h1>

                        <p className="mx-auto mb-12 max-w-2xl font-sans text-lg md:text-xl leading-relaxed text-[#5a524e] dark:text-[#c7bfb9]">
                            Descubre una experiencia de cuidado y sofisticación diseñada a tu medida. 
                            Reserva una cita con nuestros expertos estilistas y disfruta de un servicio de cinco estrellas.
                        </p>

                        <div className="flex flex-col items-center justify-center gap-5 sm:flex-row">
                            {auth.user ? (
                                <Button size="lg" className="h-14 rounded-full bg-[#352018] px-8 text-base font-medium tracking-wide text-white hover:bg-[#4d3228] dark:bg-[#c5a880] dark:text-[#121110] dark:hover:bg-[#d6bda0]" asChild>
                                    <Link href="/citas/create">
                                        <CalendarDays className="mr-2.5 h-5 w-5" />
                                        Reservar Cita Online
                                    </Link>
                                </Button>
                            ) : (
                                <>
                                    {canRegister && (
                                        <Button size="lg" className="h-14 rounded-full bg-[#352018] px-8 text-base font-medium tracking-wide text-white hover:bg-[#4d3228] dark:bg-[#c5a880] dark:text-[#121110] dark:hover:bg-[#d6bda0]" asChild>
                                            <Link href="/reservar">
                                                <CalendarDays className="mr-2.5 h-5 w-5" />
                                                Reservar Cita Online
                                            </Link>
                                        </Button>
                                    )}
                                    <Button size="lg" variant="outline" className="h-14 rounded-full border-[#c5a880]/50 bg-transparent px-8 text-base font-medium text-[#352018] hover:bg-[#352018]/5 dark:border-[#c5a880]/40 dark:text-[#f3efea] dark:hover:bg-white/5" asChild>
                                        <a href="#servicios">Explorar Servicios</a>
                                    </Button>
                                </>
                            )}
                        </div>

                        {/* Social proof with improved premium details */}
                        <div className="mt-16 flex flex-col items-center gap-3">
                            <div className="flex items-center gap-1.5">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-5 w-5 fill-[#c5a880] text-[#c5a880]" />
                                ))}
                            </div>
                            <p className="font-sans text-xs font-semibold tracking-widest uppercase text-[#5a524e] dark:text-[#c7bfb9]">
                                Elegido por más de 500 clientes sofisticadas
                            </p>
                        </div>
                    </div>
                </section>

                {/* Features (Editorial Cards Layout) */}
                <section className="border-t border-[#e6e2da] bg-white py-24 dark:border-[#252321] dark:bg-[#181615]">
                    <div className="mx-auto max-w-6xl px-6">
                        <div className="grid gap-10 sm:grid-cols-3">
                            {[
                                {
                                    icon: CalendarDays,
                                    title: 'Reserva Simple & Rápida',
                                    desc: 'Organiza tu agenda con total comodidad desde tu móvil en menos de 2 minutos.',
                                },
                                {
                                    icon: Clock,
                                    title: 'Respeto por tu Tiempo',
                                    desc: 'Garantizamos puntualidad absoluta. Tu tiempo es tan valioso como tu belleza.',
                                },
                                {
                                    icon: Sparkles,
                                    title: 'Estilistas Certificados',
                                    desc: 'Un equipo experto, especializado en coloración de vanguardia y diseño capilar.',
                                },
                            ].map(({ icon: Icon, title, desc }) => (
                                <div key={title} className="group relative flex flex-col items-center text-center p-4">
                                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#faf9f6] text-[#352018] shadow-sm border border-[#e6e2da] transition-transform duration-300 group-hover:scale-110 dark:bg-[#252321] dark:text-[#c5a880] dark:border-[#352018]">
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="mb-3 font-serif text-2xl font-medium tracking-wide text-[#352018] dark:text-white">
                                        {title}
                                    </h3>
                                    <p className="font-sans text-base leading-relaxed text-[#5a524e] dark:text-[#c7bfb9]">
                                        {desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Services Section */}
                <section id="servicios" className="relative py-28">
                    <div className="mx-auto max-w-6xl px-6">
                        <div className="mb-16 text-center">
                            <span className="font-sans text-xs font-bold tracking-widest uppercase text-[#c5a880]">
                                Nuestra Carta
                            </span>
                            <h2 className="mt-2 font-serif text-4xl font-normal tracking-wide text-[#352018] dark:text-white md:text-5xl">
                                Servicios de Salon & Estética
                            </h2>
                            <div className="mx-auto mt-4 h-0.5 w-16 bg-[#c5a880]/60" />
                        </div>

                        {servicios.length === 0 ? (
                            <p className="text-center font-serif text-xl italic text-[#5a524e] dark:text-[#c7bfb9]">
                                No hay servicios disponibles en este momento.
                            </p>
                        ) : (
                            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                {servicios.map((servicio) => (
                                    <Card
                                        key={servicio.id}
                                        className="group overflow-hidden border border-[#e6e2da] bg-white transition-all duration-300 hover:-translate-y-1.5 hover:border-[#c5a880]/50 hover:shadow-lg dark:border-[#252321] dark:bg-[#181615]"
                                    >
                                        <CardContent className="p-8">
                                            <div className="mb-6 flex items-start justify-between">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#faf9f6] text-[#c5a880] border border-[#e6e2da] dark:bg-[#252321] dark:border-[#352018]">
                                                    <Scissors className="h-5 w-5" />
                                                </div>
                                                <Badge variant="secondary" className="border border-[#c5a880]/20 bg-[#faf9f6] px-3 py-1 font-sans text-xs font-medium text-[#352018] dark:bg-[#252321] dark:text-[#c5a880]">
                                                    <Clock className="mr-1.5 h-3.5 w-3.5 text-[#c5a880]" />
                                                    {servicio.duracion} min
                                                </Badge>
                                            </div>

                                            <h3 className="mb-3 font-serif text-2xl font-medium tracking-wide text-[#352018] dark:text-white transition-colors group-hover:text-[#c5a880]">
                                                {servicio.nombre}
                                            </h3>

                                            {servicio.descripcion && (
                                                <p className="mb-6 min-h-[50px] font-sans text-base leading-relaxed text-[#5a524e] dark:text-[#c7bfb9]">
                                                    {servicio.descripcion}
                                                </p>
                                            )}

                                            <div className="mt-8 flex items-center justify-between border-t border-[#e6e2da]/60 pt-6 dark:border-[#252321]/60">
                                                <span className="font-serif text-3xl font-light text-[#352018] dark:text-white">
                                                    <span className="text-xl font-normal text-[#c5a880] mr-0.5">$</span>
                                                    {servicio.precio}
                                                </span>
                                                <Button size="sm" variant="outline" className="rounded-full border-[#c5a880] text-[#352018] hover:bg-[#352018] hover:text-white dark:border-[#c5a880] dark:text-[#c5a880] dark:hover:bg-[#c5a880] dark:hover:text-[#121110]" asChild>
                                                    <Link href={auth.user ? "/citas/create" : "/reservar"}>
                                                        Reservar <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* Call To Action (Visual Splendor) */}
                {!auth.user && canRegister && (
                    <section className="relative overflow-hidden bg-[#352018] py-24 text-center text-white">
                        <div className="pointer-events-none absolute inset-0 -z-10">
                            <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-[#c5a880]/10 blur-[120px]" />
                            <div className="absolute left-0 bottom-0 h-96 w-96 rounded-full bg-black/20 blur-[100px]" />
                        </div>
                        
                        <div className="mx-auto max-w-4xl px-6">
                            <span className="font-sans text-xs font-bold tracking-widest uppercase text-[#c5a880]">
                                Reserva Tu Experiencia
                            </span>
                            <h2 className="mt-3 font-serif text-4xl font-normal leading-tight tracking-wide md:text-5xl lg:text-6xl">
                                ¿Lista para lucir y sentirte espectacular?
                            </h2>
                            <p className="mx-auto mt-6 max-w-xl font-sans text-lg text-[#c7bfb9] leading-relaxed">
                                Regístrate hoy mismo de forma gratuita y asegura tu espacio con nuestros estilistas estrella en minutos.
                            </p>
                            <Button size="lg" className="mt-10 h-14 rounded-full bg-[#c5a880] px-10 text-base font-semibold text-[#121110] hover:bg-[#d6bda0]" asChild>
                                <Link href="/reservar">Comenzar Reserva</Link>
                            </Button>
                        </div>
                    </section>
                )}

                {/* Contact and Map Details */}
                <section id="contacto" className="border-t border-[#e6e2da] bg-white py-24 dark:border-[#252321] dark:bg-[#181615]">
                    <div className="mx-auto max-w-4xl px-6 text-center">
                        <span className="font-sans text-xs font-bold tracking-widest uppercase text-[#c5a880]">
                            Dónde Encontrarnos
                        </span>
                        <h2 className="mt-2 font-serif text-4xl font-normal tracking-wide text-[#352018] dark:text-white">
                            Visita Nuestro Salón
                        </h2>
                        <div className="mx-auto mt-4 h-0.5 w-16 bg-[#c5a880]/60" />

                        <div className="mt-12 grid gap-10 sm:grid-cols-3 text-center">
                            <div className="flex flex-col items-center">
                                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#faf9f6] text-[#c5a880] border border-[#e6e2da] dark:bg-[#252321] dark:border-[#352018]">
                                    <Phone className="h-5 w-5" />
                                </div>
                                <h4 className="font-serif text-xl font-semibold text-[#352018] dark:text-white">Llámanos</h4>
                                <p className="mt-2 font-sans text-sm text-[#5a524e] dark:text-[#c7bfb9]">+57 300 123 4567</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#faf9f6] text-[#c5a880] border border-[#e6e2da] dark:bg-[#252321] dark:border-[#352018]">
                                    <Clock className="h-5 w-5" />
                                </div>
                                <h4 className="font-serif text-xl font-semibold text-[#352018] dark:text-white">Horarios</h4>
                                <p className="mt-2 font-sans text-sm text-[#5a524e] dark:text-[#c7bfb9]">Lunes a Sábado: 9:00 AM - 6:00 PM</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#faf9f6] text-[#c5a880] border border-[#e6e2da] dark:bg-[#252321] dark:border-[#352018]">
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <h4 className="font-serif text-xl font-semibold text-[#352018] dark:text-white">Ubicación</h4>
                                <p className="mt-2 font-sans text-sm text-[#5a524e] dark:text-[#c7bfb9]">Calle de la Belleza #12-34, Cali</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer with social media icons */}
                <footer className="border-t border-[#e6e2da] bg-[#faf9f6] py-12 dark:border-[#252321] dark:bg-[#121110]">
                    <div className="mx-auto max-w-6xl px-6 flex flex-col items-center justify-between gap-6 md:flex-row">
                        <div className="flex items-center gap-2">
                            <span className="font-serif text-xl font-bold tracking-wide text-[#352018] dark:text-white">
                                App<span className="font-light italic text-[#c5a880]">Salon</span>
                            </span>
                        </div>
                        
                        <p className="font-sans text-sm text-[#8a807a] dark:text-[#88817a]">
                            © {new Date().getFullYear()} AppSalon. Todos los derechos reservados.
                        </p>

                        <div className="flex gap-4">
                            <a href="#" className="h-9 w-9 flex items-center justify-center rounded-full bg-white border border-[#e6e2da] text-[#5a524e] hover:text-[#c5a880] dark:bg-[#181615] dark:border-[#252321] dark:text-[#c7bfb9]">
                                <Instagram className="h-4 w-4" />
                            </a>
                            <a href="#" className="h-9 w-9 flex items-center justify-center rounded-full bg-white border border-[#e6e2da] text-[#5a524e] hover:text-[#c5a880] dark:bg-[#181615] dark:border-[#252321] dark:text-[#c7bfb9]">
                                <Facebook className="h-4 w-4" />
                            </a>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
