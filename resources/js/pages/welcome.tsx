import { Head, Link, usePage } from '@inertiajs/react';
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
    const { auth } = usePage().props;

    return (
        <>
            <Head title="AppSalon — Salón de Belleza" />

            <div className="min-h-screen bg-white dark:bg-gray-950">
                {/* Navbar */}
                <header className="border-b border-gray-100 dark:border-gray-800">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-rose-600">✂ AppSalon</span>
                        </div>
                        <nav className="flex items-center gap-3">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="rounded-md bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                    >
                                        Iniciar sesión
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="rounded-md bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
                                        >
                                            Registrarse
                                        </Link>
                                    )}
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Hero */}
                <section className="bg-gradient-to-br from-rose-50 to-pink-50 py-20 dark:from-gray-900 dark:to-gray-800">
                    <div className="mx-auto max-w-6xl px-6 text-center">
                        <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white lg:text-5xl">
                            Tu belleza, nuestra pasión
                        </h1>
                        <p className="mx-auto mb-8 max-w-xl text-lg text-gray-600 dark:text-gray-300">
                            Reserva tu cita en AppSalon y disfruta de los mejores servicios de belleza.
                        </p>
                        {canRegister && !auth.user && (
                            <Link
                                href={register()}
                                className="inline-block rounded-lg bg-rose-600 px-8 py-3 text-base font-semibold text-white shadow hover:bg-rose-700"
                            >
                                Reservar cita
                            </Link>
                        )}
                    </div>
                </section>

                {/* Services */}
                <section className="py-16">
                    <div className="mx-auto max-w-6xl px-6">
                        <div className="mb-10 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Nuestros servicios
                            </h2>
                            <span className="rounded-full bg-rose-100 px-3 py-1 text-sm font-medium text-rose-700 dark:bg-rose-900/30 dark:text-rose-400">
                                {servicios.length} disponibles
                            </span>
                        </div>

                        {servicios.length === 0 ? (
                            <p className="text-center text-gray-500 dark:text-gray-400">
                                No hay servicios disponibles por el momento.
                            </p>
                        ) : (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {servicios.map((servicio) => (
                                    <div
                                        key={servicio.id}
                                        className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                                    >
                                        <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                                            {servicio.nombre}
                                        </h3>
                                        {servicio.descripcion && (
                                            <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
                                                {servicio.descripcion}
                                            </p>
                                        )}
                                        <div className="flex items-center justify-between">
                                            <span className="text-xl font-bold text-rose-600">
                                                ${servicio.precio}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                {servicio.duracion} min
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                <footer className="border-t border-gray-100 py-6 text-center text-sm text-gray-400 dark:border-gray-800">
                    © {new Date().getFullYear()} AppSalon. Todos los derechos reservados.
                </footer>
            </div>
        </>
    );
}
