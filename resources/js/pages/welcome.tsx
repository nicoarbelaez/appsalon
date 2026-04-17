import { Head, Link, usePage } from '@inertiajs/react';
import { CalendarDays, Clock, Scissors, Sparkles, Star, Phone } from 'lucide-react';
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
    const { auth } = usePage().props as { auth: { user: null | { nombre: string } } };

    return (
        <>
            <Head title="AppSalon — Salón de Belleza" />

            <div className="min-h-screen bg-white dark:bg-gray-950">
                {/* Navbar */}
                <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-2">
                            <Scissors className="h-6 w-6 text-rose-600" />
                            <span className="text-xl font-bold text-gray-900 dark:text-white">
                                App<span className="text-rose-600">Salon</span>
                            </span>
                        </div>

                        <nav className="hidden items-center gap-6 md:flex">
                            <a href="#servicios" className="text-sm text-gray-600 hover:text-rose-600 dark:text-gray-400">
                                Servicios
                            </a>
                            <a href="#contacto" className="text-sm text-gray-600 hover:text-rose-600 dark:text-gray-400">
                                Contacto
                            </a>
                        </nav>

                        <div className="flex items-center gap-3">
                            {auth.user ? (
                                <Button asChild>
                                    <Link href={dashboard()}>Mi panel</Link>
                                </Button>
                            ) : (
                                <>
                                    <Button variant="ghost" asChild>
                                        <Link href={login()}>Iniciar sesión</Link>
                                    </Button>
                                    {canRegister && (
                                        <Button asChild className="bg-rose-600 hover:bg-rose-700">
                                            <Link href={register()}>Registrarse</Link>
                                        </Button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Hero */}
                <section className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 py-24 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-rose-200/30 blur-3xl dark:bg-rose-900/20" />
                        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-pink-200/30 blur-3xl dark:bg-pink-900/20" />
                    </div>

                    <div className="relative mx-auto max-w-6xl px-6 text-center">
                        <Badge className="mb-6 bg-rose-100 text-rose-700 hover:bg-rose-100 dark:bg-rose-900/30 dark:text-rose-400">
                            <Sparkles className="mr-1 h-3 w-3" />
                            Salón de belleza profesional
                        </Badge>

                        <h1 className="mb-6 text-5xl font-bold leading-tight text-gray-900 dark:text-white lg:text-6xl">
                            Tu belleza,
                            <br />
                            <span className="text-rose-600">nuestra pasión</span>
                        </h1>

                        <p className="mx-auto mb-10 max-w-xl text-lg text-gray-600 dark:text-gray-300">
                            Reserva tu cita en AppSalon y disfruta de tratamientos de belleza de la más alta calidad con nuestros expertos.
                        </p>

                        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                            {auth.user ? (
                                <Button size="lg" className="bg-rose-600 hover:bg-rose-700" asChild>
                                    <Link href="/citas/create">
                                        <CalendarDays className="mr-2 h-5 w-5" />
                                        Reservar cita
                                    </Link>
                                </Button>
                            ) : (
                                <>
                                    {canRegister && (
                                        <Button size="lg" className="bg-rose-600 hover:bg-rose-700" asChild>
                                            <Link href="/reservar">
                                                <CalendarDays className="mr-2 h-5 w-5" />
                                                Reservar cita
                                            </Link>
                                        </Button>
                                    )}
                                    <Button size="lg" variant="outline" asChild>
                                        <a href="#servicios">Ver servicios</a>
                                    </Button>
                                </>
                            )}
                        </div>

                        {/* Social proof */}
                        <div className="mt-12 flex flex-col items-center gap-2">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <p className="text-sm text-gray-500">+500 clientes satisfechas</p>
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="py-16">
                    <div className="mx-auto max-w-6xl px-6">
                        <div className="grid gap-6 sm:grid-cols-3">
                            {[
                                {
                                    icon: CalendarDays,
                                    title: 'Reserva online',
                                    desc: 'Agenda tu cita en cualquier momento, desde cualquier dispositivo.',
                                },
                                {
                                    icon: Clock,
                                    title: 'Puntualidad garantizada',
                                    desc: 'Respetamos tu tiempo. Cada cita tiene duración exacta asignada.',
                                },
                                {
                                    icon: Sparkles,
                                    title: 'Expertos certificados',
                                    desc: 'Nuestro equipo está capacitado con las últimas tendencias de belleza.',
                                },
                            ].map(({ icon: Icon, title, desc }) => (
                                <Card key={title} className="border-gray-100 dark:border-gray-800">
                                    <CardContent className="pt-6">
                                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-rose-50 dark:bg-rose-900/20">
                                            <Icon className="h-5 w-5 text-rose-600" />
                                        </div>
                                        <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">{title}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Services */}
                <section id="servicios" className="bg-gray-50 py-16 dark:bg-gray-900/50">
                    <div className="mx-auto max-w-6xl px-6">
                        <div className="mb-10 text-center">
                            <h2 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
                                Nuestros servicios
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400">
                                Tratamientos de belleza para que luzcas increíble
                            </p>
                        </div>

                        {servicios.length === 0 ? (
                            <p className="text-center text-gray-500">
                                No hay servicios disponibles por el momento.
                            </p>
                        ) : (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {servicios.map((servicio) => (
                                    <Card
                                        key={servicio.id}
                                        className="border-gray-100 transition-shadow hover:shadow-md dark:border-gray-800"
                                    >
                                        <CardContent className="pt-6">
                                            <div className="mb-4 flex items-start justify-between">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-50 dark:bg-rose-900/20">
                                                    <Scissors className="h-5 w-5 text-rose-600" />
                                                </div>
                                                <Badge variant="secondary" className="text-xs">
                                                    <Clock className="mr-1 h-3 w-3" />
                                                    {servicio.duracion} min
                                                </Badge>
                                            </div>

                                            <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                                                {servicio.nombre}
                                            </h3>

                                            {servicio.descripcion && (
                                                <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                                                    {servicio.descripcion}
                                                </p>
                                            )}

                                            <div className="flex items-center justify-between">
                                                <span className="text-2xl font-bold text-rose-600">
                                                    ${servicio.precio}
                                                </span>
                                                {!auth.user && (
                                                    <Button size="sm" variant="outline" asChild>
                                                        <Link href="/reservar">Reservar</Link>
                                                    </Button>
                                                )}
                                                {auth.user && (
                                                    <Button size="sm" variant="outline" asChild>
                                                        <Link href="/citas/create">Reservar</Link>
                                                    </Button>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* CTA */}
                {!auth.user && canRegister && (
                    <section className="bg-rose-600 py-16">
                        <div className="mx-auto max-w-6xl px-6 text-center">
                            <h2 className="mb-4 text-3xl font-bold text-white">
                                ¿Lista para lucir espectacular?
                            </h2>
                            <p className="mb-8 text-rose-100">
                                Regístrate gratis y reserva tu primera cita en minutos.
                            </p>
                            <Button size="lg" className="bg-white text-rose-600 hover:bg-rose-50" asChild>
                                <Link href="/reservar">Hacer una reserva</Link>
                            </Button>
                        </div>
                    </section>
                )}

                {/* Contact */}
                <section id="contacto" className="py-16">
                    <div className="mx-auto max-w-6xl px-6 text-center">
                        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Contáctanos</h2>
                        <div className="flex justify-center gap-6">
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <Phone className="h-4 w-4 text-rose-600" />
                                <span className="text-sm">+57 300 123 4567</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <Clock className="h-4 w-4 text-rose-600" />
                                <span className="text-sm">Lun–Sáb: 9am – 6pm</span>
                            </div>
                        </div>
                    </div>
                </section>

                <footer className="border-t border-gray-100 py-6 text-center text-sm text-gray-400 dark:border-gray-800">
                    © {new Date().getFullYear()} AppSalon. Todos los derechos reservados.
                </footer>
            </div>
        </>
    );
}
