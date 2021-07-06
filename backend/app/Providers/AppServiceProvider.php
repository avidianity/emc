<?php

namespace App\Providers;

use App\Models\Year;
use Illuminate\Database\Eloquent\Collection;
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
        /**
         * Delete all models in the collection.
         *
         * @return static
         */
        Collection::macro('delete', function () {
            return $this->each(function ($model) {
                $model->delete();
            });
        });
        if (Schema::hasTable((new Year())->getTable())) {
            if (Year::whereCurrent(true)->count() === 0) {
                optional(Year::latest()->first())->update(['current' => true]);
            }
        }
    }

    protected function isUsingOldDatabase()
    {
        Schema::defaultStringLength(191);
    }
}
