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
            $table->string('accessToken');
            $table->dateTime('expiryDate');
            $table->string('scoope');
            $table->string('authorities');
            $table->string('link');
            $table->string('uid');
            $table->text('profilePicture');
            $table->string('category');
            $table->enum('providerType', ['page', 'groupe']);
            $table->foreignId('company_id')->references('id')->on('companies')->onDelete('cascade');
            $table->foreignId('provider_token_id')->references('id')->on('provider_tokens')->onDelete('cascade');
            $table->foreignId('related_account_id')->nullable()->references('id')->on('accounts');
            $table->softDeletes();
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
        Schema::dropIfExists('accounts');
    }
};
