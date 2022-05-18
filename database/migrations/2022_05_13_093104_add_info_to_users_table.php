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
        Schema::table('users', function (Blueprint $table) {
            //
            $table->string('firstName');
            $table->string('lastName');
            $table->string('status');
            $table->boolean('isSubscriber');
            $table->boolean('autoRefresh');
            $table->foreignId('company_id')->references('id')->on('companies')->onDelete('cascade');;
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            //
            $table->dropColumn('firstName');
            $table->dropColumn('lastName');
            $table->dropColumn('status');
            $table->dropColumn('isSubscriber');
            $table->dropForeign(['company_id']);
        });
    }
};
