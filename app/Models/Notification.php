<?php

namespace App\Models;

use App\Http\Extends\ExtendedModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Notification extends ExtendedModel
{
    use HasFactory;

    protected $fillable = [
        'type',
        'date',
        'priority',
        'seen',
        'url',
        'seenDate',
        'targetUser',
    ];

    public function targetUser()
    {
        return $this->belongsTo(User::class, 'targetUser');
    }
}
