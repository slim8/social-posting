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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->enum('type',['SESSION_EXPIRE_SOON','SESSION_EXPIRED','POST_SUCCEED','POST_FAILED','POST_WATING']);
            $table->enum('priority',['high','medium','low','urgent']);
            $table->boolean('seen');
            $table->string('url');
            $table->dateTime('seen_date');
            $table->foreignId('target_user')->references('id')->on('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('notifications');
    }
};
