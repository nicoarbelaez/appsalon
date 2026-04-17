<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPasswordChange
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (auth()->check() && auth()->user()->requiere_cambio_password && !$request->routeIs('security.edit') && !$request->routeIs('user-password.update')) {
            return redirect()->route('security.edit')->with('warning', 'Por favor, cambia tu contraseña antes de continuar.');
        }

        return $next($request);
    }
}
