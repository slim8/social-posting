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
        Schema::create('accounts', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('provider', ['facebook', 'instagram', 'tiktok' , 'twitter']);
            $table->string('status');
            $table->string('access_token');
            $table->dateTime('expiry_date');
            $table->string('scoope');
            $table->string('authorities');
            $table->string('link');
            $table->string('uid');
            $table->text('profile_picture');
            $table->string('category');
            $table->enum('provider_type', ['page', 'groupe']);
            $table->foreignId('company_id')->references('id')->on('companies')->onDelete('cascade');
            $table->foreignId('provider_token_id')->references('id')->on('provider_tokens')->onDelete('cascade');
            $table->foreignId('related_account_id')->nullable()->references('id')->on('accounts');
            $table->softDeletes();
            $table->timestamps();
            $table->string('related_uid')->nullable();

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('accounts');
    }
};
