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
        Schema::table('account_posts', function (Blueprint $table) {
            $table->dropColumn('source');
            $table->string('thumbnail_seconde')->nullable();
            $table->string('thumbnail_link')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('account_posts', function (Blueprint $table) {
            //
        });
    }
};
