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
        Schema::table('provider_tokens', function (Blueprint $table) {
            $table->enum('provider', ['facebook', 'instagram', 'tiktok' , 'twitter']);
            $table->text('profile_picture');
            $table->text('profile_name');
            $table->text('user_name');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
};
