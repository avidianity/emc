<?php

namespace App\Providers;

use App\Models\Year;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Schema::defaultStringLength(191);
        if (Year::whereCurrent(true)->count() === 0) {
            optional(Year::latest()->first())->update(['current' => true]);
        }
    }
}
