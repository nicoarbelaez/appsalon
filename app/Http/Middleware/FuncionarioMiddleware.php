<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class FuncionarioMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if (! $request->user()?->isFuncionario()) {
            abort(403, 'Acceso denegado.');
        }

        return $next($request);
    }
}
