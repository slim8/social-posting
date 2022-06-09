<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('provider_tokens', function (Blueprint $table) {
            $table->id();
            $table->datetime('expiry_date');
            $table->text('long_life_token');
            $table->foreignId('created_by')->references('id')->on('users')->onDelete('cascade');
            $table->timestamps();
            $table->enum('provider', ['facebook', 'instagram', 'tiktok' , 'twitter']);
            $table->text('profile_picture');
            $table->text('profile_name');
            $table->text('user_name');
            $table->string('account_user_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('provider_tokens');
    }
};
