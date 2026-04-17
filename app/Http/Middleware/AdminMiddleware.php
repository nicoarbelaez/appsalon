<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if (! $request->user()?->admin) {
            abort(403, 'Acceso denegado. Solo administradores.');
        }

        return $next($request);
    }
}
