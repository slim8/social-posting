<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class() extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('account_posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_id')->constrained();
            $table->foreignId('account_id')->constrained();
            $table->string('post_id_provider');
            $table->string('url');
            $table->timestamps();
            $table->string('message')->nullable();
            $table->string('video_title')->nullable();
            $table->string('source')->nullable();
            $table->string('thumbnail_ressource')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('account_posts');
    }
};
