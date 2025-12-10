<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;
use Illuminate\Auth\Notifications\ResetPassword;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Schema::defaultStringLength(191);
        ResetPassword::createUrlUsing(function (object $notifiable, string $token) {
            // Đây là đường dẫn trang React mà người dùng sẽ bấm vào từ email
            // Ví dụ: http://localhost:3000/reset-password?token=...&email=...
            return "http://localhost:3000/reset-password?token={$token}&email={$notifiable->getEmailForPasswordReset()}";
        });
    }
}
