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
        Schema::table('post_media', function (Blueprint $table) {
            $table->string('thumbnail_ressource')->nullable();
            $table->string('thumbnail_seconde')->nullable();
            $table->string('thumbnail_link')->nullable();
        });

        Schema::table('account_posts', function (Blueprint $table) {
            $table->dropColumn('thumbnail_seconde');
            $table->dropColumn('thumbnail_link');
            $table->dropColumn('thumbnail_ressource');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('post_media', function (Blueprint $table) {
            $table->dropColumn('thumbnail_seconde');
            $table->dropColumn('thumbnail_link');
            $table->dropColumn('thumbnail_ressource');
        });

        Schema::table('account_posts', function (Blueprint $table) {
            $table->string('thumbnail_ressource')->nullable();
            $table->string('thumbnail_seconde')->nullable();
            $table->string('thumbnail_link')->nullable();
        });
    }
};
