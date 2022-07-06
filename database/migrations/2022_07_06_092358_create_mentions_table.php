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
        Schema::create('mentions', function (Blueprint $table) {
            $table->id();
            $table->string('username')->nullable();
            $table->timestamps();
            $table->foreignId('post_id')->constrained();
            $table->foreignId('post_media_id')->constrained();
            $table->string('pos_x')->nullable();
            $table->string('pos_y')->nullable();
            $table->enum('provider', ['facebook', 'instagram', 'tiktok' , 'twitter']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('mentions');
    }
};
